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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  const data = event.data.object

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = data as Stripe.Checkout.Session
      const subscriptionId = session.subscription as string
      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = session.metadata?.supabase_user_id || subscription.metadata?.supabase_user_id

      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan_type: subscription.items.data[0].plan.interval === 'month' ? 'monthly' : 'yearly',
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = data as Stripe.Invoice
      const subscriptionId = (invoice as any).subscription as string
      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = subscription.metadata?.supabase_user_id

      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan_type: subscription.items.data[0].plan.interval === 'month' ? 'monthly' : 'yearly',
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
      }
      break
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const sub = data as Stripe.Subscription
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
  }

  return new NextResponse(null, { status: 200 })
}
