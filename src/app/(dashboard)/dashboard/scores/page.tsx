import { ScoreEntryForm } from '@/components/dashboard/score-entry-form'
import { 
  History,
  Lock,
  Calendar,
  Trash2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getScores } from '@/app/actions/scores'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const scores = await getScores()
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Scores</h1>
        <p className="text-muted-foreground">Manage your Stableford rounds and Rolling 5 series.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="relative p-8 rounded-3xl border border-border bg-card shadow-sm overflow-hidden sticky top-24">
            {!isSubscribed && (
              <div className="absolute inset-0 z-20 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <Lock className="w-8 h-8 text-slate-400 mb-4" />
                <h4 className="font-bold mb-2">Pro Feature</h4>
                <p className="text-xs text-muted-foreground mb-4">Subscribe to log new rounds.</p>
              </div>
            )}
            
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Add Round
            </h3>
            <ScoreEntryForm />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Rolling 5 History</h3>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                Latest Entries Only
              </div>
            </div>
            
            <div className="space-y-4">
              {scores.length > 0 ? (
                scores.map((score: any, i: number) => (
                  <div key={score.id} className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30 group hover:bg-secondary/50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center font-black text-lg">
                        {score.value}
                      </div>
                      <div>
                        <p className="font-bold text-lg">Stableford Points</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(score.date), 'MMMM do, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No rounds logged in your active series.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
