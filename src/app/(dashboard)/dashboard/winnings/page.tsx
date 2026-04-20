'use client'

import { useState, useEffect } from 'react'
import { Trophy, CheckCircle2, Clock, ShieldCheck } from 'lucide-react'
import { ProofUpload } from '@/components/dashboard/proof-upload'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function WinningsDashboard() {
  const [winnings, setWinnings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchWinnings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('winners')
      .select('*, draws(draw_date)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    setWinnings(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchWinnings()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards Center</h1>
          <p className="text-muted-foreground">Monitor your winnings and verify your performance.</p>
        </div>
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-accent text-accent-foreground shadow-xl shadow-accent/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Won</p>
            <p className="text-3xl font-black">£{winnings.reduce((acc, curr) => acc + curr.prize_amount, 0).toFixed(2)}</p>
          </div>
          <Trophy className="w-10 h-10 opacity-20" />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Draws
        </h3>

        <div className="grid gap-4">
          {winnings.length > 0 ? winnings.map((win) => (
            <div key={win.id} className="p-6 rounded-3xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  win.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{win.match_type}-Match Win</h4>
                    <span className="text-xs font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                      {new Date(win.draws?.draw_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">£{win.prize_amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3">
                <div className="flex items-center gap-2">
                  {win.status === 'paid' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : win.status === 'pending' && win.proof_url ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Review in Progress
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Awaiting Proof
                    </span>
                  )}
                </div>

                {!win.proof_url && win.status !== 'paid' && (
                  <ProofUpload winnerId={win.id} onUploadComplete={fetchWinnings} />
                )}

                {win.proof_url && (
                  <a 
                    href={win.proof_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    View Submitted Proof
                  </a>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-border">
               {!isLoading && <p className="text-muted-foreground">No winnings found yet. Keep playing!</p>}
               {isLoading && <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/20" />}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">Verification Policy</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              To ensure integrity across the Digital Heroes platform, all winning entries must be verified with a screenshot of your official golf platform scores. Admins typically review submissions within 24-48 hours.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>
    </div>
  )
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}
