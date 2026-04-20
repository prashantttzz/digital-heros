import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Using service role client for webhook updates (bypasses RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as any

  switch (event.type) {
    case 'checkout.session.completed':
    case 'invoice.payment_succeeded':
      const subscriptionId = session.subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
      const userId = session.metadata?.supabase_user_id || subscription.metadata?.supabase_user_id

      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: (subscription as any).id,
            status: (subscription as any).status,
            plan_type: (subscription as any).items.data[0].plan.interval === 'month' ? 'monthly' : 'yearly',
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: (subscription as any).cancel_at_period_end,
          })
      }
      break

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
      const sub = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: sub.status,
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', sub.id)
      break
  }

  return new NextResponse(null, { status: 200 })
}
