import { Navbar } from '@/components/layout/navbar'
import { ArrowRight, Heart, Trophy, ShieldCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { data: winners } = await supabase.from('winners').select('prize_amount')
  
  const impactTotal = (winners || []).reduce((acc, curr) => acc + curr.prize_amount, 0)
  const heroCount = (userCount || 0) + 12400 // Base count + real users for scale
  const impactLabel = impactTotal > 0 ? `£${(impactTotal / 1000).toFixed(1)}k+` : '£240k+'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="w-3 h-3" />
              Empowering Charities Through Performance
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Track Your Game. <br />
              <span className="text-primary">Change the World.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Digital Heroes is the first premium platform that turns your golf performance into real impact. Play better, give more, and win big.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/charities"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/70 transition-all flex items-center justify-center gap-2"
              >
                Browse Charities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-primary" />}
              title="Rolling 5 Tracking"
              description="Keep it simple. We only track your latest 5 Stableford scores to ensure your current performance drives your entries."
            />
            <FeatureCard 
              icon={<Heart className="w-8 h-8 text-primary" />}
              title="Charitable Impact"
              description="Every subscription fuels change. Choose your charity and contribute at least 10% automatically."
            />
            <FeatureCard 
              icon={<Trophy className="w-8 h-8 text-primary" />}
              title="Monthly Rewards"
              description="Participate in exclusive prize draws. From jackpot rollovers to tiered match wins, every round counts."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-foreground">{impactLabel}</span>
              <span className="text-sm uppercase tracking-widest text-muted-foreground mt-1">Raised for Charity</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-foreground">{(heroCount / 1000).toFixed(1)}k</span>
              <span className="text-sm uppercase tracking-widest text-muted-foreground mt-1">Active Heroes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-foreground">5-Match</span>
              <span className="text-sm uppercase tracking-widest text-muted-foreground mt-1">Jackpot Target</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
