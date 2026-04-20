'use client'

import { useState } from 'react'
import { ShieldCheck, Check, ArrowRight, Zap, Trophy, Heart } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Monthly Pro',
    id: 'price_monthly_placeholder', // Should be real Stripe Price ID
    price: '29',
    interval: 'mo',
    description: 'Perfect for regular players who want to impact causes monthly.',
    features: [
      'Entry into 1 Monthly Draw',
      'Min. 10% Charity Contribution',
      'Advanced Score Tracking',
      'Digital Hero Badge'
    ]
  },
  {
    name: 'Yearly Legend',
    id: 'price_yearly_placeholder', 
    price: '299',
    interval: 'yr',
    description: 'Save 15% and support your cause with a long-term commitment.',
    featured: true,
    features: [
      'Entry into 12 Monthly Draws',
      'Min. 10% Charity Contribution',
      'Priority Winner Verification',
      'Exclusive Annual Impact Report',
      'Legacy Hero Status'
    ]
  }
]

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId)
    try {
      await createCheckoutSession(priceId)
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Choice of Impact</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Support your cause and enter the arena. All plans include the mandatory 10% charity split.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={cn(
              "relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col",
              plan.featured 
                ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-105" 
                : "bg-card border-border hover:border-primary/50 shadow-sm"
            )}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest">
                Best Value
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">£{plan.price}</span>
                <span className={cn("text-sm font-medium", plan.featured ? "text-slate-400" : "text-muted-foreground")}>/{plan.interval}</span>
              </div>
              <p className={cn("mt-4 text-sm leading-relaxed", plan.featured ? "text-slate-400" : "text-muted-foreground")}>
                {plan.description}
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", plan.featured ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary")}>
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={!!loading}
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group",
                plan.featured
                  ? "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {loading === plan.id ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Select {plan.name}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-border">
        <Benefit 
          icon={<ShieldCheck className="text-primary w-5 h-5" />}
          title="Safe & Secure"
          desc="PCI-compliant payments via Stripe."
        />
        <Benefit 
          icon={<Heart className="text-primary w-5 h-5" />}
          title="Direct Impact"
          desc="Real-time reporting on your chosen cause."
        />
        <Benefit 
          icon={<Trophy className="text-primary w-5 h-5" />}
          title="Fair Play"
          desc="Verified scores only in the reward draws."
        />
      </div>
    </div>
  )
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-secondary/50">
      <div className="mb-3">{icon}</div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground px-4">{desc}</p>
    </div>
  )
}
