import { ScoreEntryForm } from '@/components/dashboard/score-entry-form'
import { 
  Heart, 
  Trophy, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  History,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getScores } from '@/app/actions/scores'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Score } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', user.id)
    .maybeSingle()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: winnings } = await supabase
    .from('winners')
    .select('prize_amount')
    .eq('user_id', user.id)

  const { data: nextDraw } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  const scores = await getScores()
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="space-y-10">
      {/* Welcome & Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/20">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name?.split(' ')[0] || 'Hero'}!</h1>
            <p className="text-primary-foreground/80 mb-6">
              {profile?.charities ? `Supporting ${profile.charities.name} this month.` : 'Choose a charity to start making an impact.'}
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/charity"
                className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
              >
                Manage Giving
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <Heart className="absolute -bottom-6 -right-6 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="md:w-64 p-8 rounded-3xl bg-accent text-accent-foreground shadow-2xl shadow-accent/20 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">Total Winnings</p>
            <h2 className="text-4xl font-black">
              £{(winnings || []).reduce((acc: number, curr: { prize_amount: number }) => acc + curr.prize_amount, 0).toFixed(2)}
            </h2>
          </div>
          <Link href="/dashboard/winnings" className="text-sm font-bold flex items-center gap-1 group">
            View details
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Score Entry Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative p-8 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            {!isSubscribed && (
              <div className="absolute inset-0 z-20 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-xl font-bold mb-2">Subscription Required</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Subscribe to a Pro plan to start logging scores and participating in draws.
                </p>
                <Link href="/dashboard/billing" className="px-6 py-2 rounded-full bg-primary text-white font-bold text-sm">
                  Upgrade Now
                </Link>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">Log New Round</h3>
                <p className="text-sm text-muted-foreground">Entries drive your monthly draw participation</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="text-primary w-5 h-5" />
              </div>
            </div>
            
            <ScoreEntryForm />
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Latest 5 Scores</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Rolling Series</p>
            </div>
            
            <div className="space-y-4">
              {scores.length > 0 ? (
                scores.map((score: Score, i: number) => (
                  <div key={score.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 group hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold">
                        {scores.length - i}
                      </div>
                      <div>
                        <p className="font-bold">{score.value} Points</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(score.date), 'MMMM do, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground text-sm italic">No scores logged yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Subscription
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{isSubscribed ? 'Pro Plan' : 'No Active Plan'}</p>
                  <p className="text-xs text-muted-foreground">
                    {subscription?.current_period_end ? `Renews on ${format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}` : 'Subscription required'}
                  </p>
                </div>
                <p className="text-xl font-bold">£{subscription?.plan_type === 'yearly' ? '299' : '29'}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className={cn("h-full bg-primary rounded-full", isSubscribed ? "w-full" : "w-0")} />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Active Draw</p>
              <h3 className="text-2xl font-bold mb-1">
                {nextDraw ? format(new Date(nextDraw.draw_date), 'MMMM do') : 'TBD'}
              </h3>
              <p className="text-sm text-slate-400 mb-6">Current Pool: £{nextDraw?.jackpot_amount?.toLocaleString() || '0.00'}</p>
            </div>
            <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
