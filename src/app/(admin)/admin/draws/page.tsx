'use client'

import { useState } from 'react'
import { Trophy, Calendar, Zap, AlertCircle, CheckCircle2, History } from 'lucide-react'
import { simulateDraw, publishDraw } from '@/app/actions/draws'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminDrawsPage() {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([0, 0, 0, 0, 0])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simResults, setSimResults] = useState<any>(null)
  const [poolAmount, setPoolAmount] = useState(12450.00)

  const handleSimulate = async () => {
    if (winningNumbers.some(n => n === 0)) {
      toast.error('Please enter all 5 numbers (1-45)')
      return
    }
    setIsSimulating(true)
    try {
      const results = await simulateDraw(winningNumbers)
      setSimResults(results)
      toast.success('Simulation complete!')
    } catch (error) {
      toast.error('Simulation failed')
    } finally {
      setIsSimulating(false)
    }
  }

  const handlePublish = async () => {
    if (!simResults) return
    const confirmed = confirm('Are you sure you want to officially publish this draw? Winners will be notified.')
    if (!confirmed) return

    try {
      await publishDraw(new Date().toISOString().split('T')[0], winningNumbers, poolAmount)
      toast.success('Draw results published officially!')
      setSimResults(null)
    } catch (error) {
      toast.error('Failed to publish results')
    }
  }

  const updateNumber = (idx: number, val: string) => {
    const n = parseInt(val)
    if (isNaN(n) || n < 1 || n > 45) return
    const newNums = [...winningNumbers]
    newNums[idx] = n
    setWinningNumbers(newNums)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Monthly Draw Engine</h1>
          <p className="text-sm text-slate-500">Configure parameters, run simulations, and publish results.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pool</p>
            <p className="text-xl font-black">£{poolAmount.toLocaleString()}</p>
          </div>
          <Zap className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Draw Input Area */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Draw Winning Numbers
            </h3>
            
            <div className="grid grid-cols-5 gap-3 mb-10 relative z-10">
              {winningNumbers.map((num, i) => (
                <div key={i} className="space-y-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="45"
                    value={num === 0 ? '' : num}
                    onChange={(e) => updateNumber(i, e.target.value)}
                    className="w-full aspect-square text-center rounded-2xl bg-white/10 border border-white/20 text-2xl font-black focus:border-primary transition-all outline-none"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3 relative z-10">
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSimulating ? 'Processing Simulation...' : 'Run Simulation Preview'}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>

          <div className="p-8 rounded-[2.5rem] border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Recent History
            </h3>
            <div className="space-y-3">
              {[
                { date: 'March 2026', nums: [12, 45, 8, 3, 22], winners: 45 },
                { date: 'Feb 2026', nums: [33, 4, 19, 14, 40], winners: 32 }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-500 text-sm">
                  <span>{h.date}</span>
                  <span className="font-bold text-slate-800">{h.nums.join(' · ')}</span>
                  <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{h.winners} Winners</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Preview Area */}
        <div className="space-y-6">
          {simResults ? (
            <div className="p-8 rounded-[2.5rem] border-2 border-emerald-500 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Simulation Results
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                  Preview Only
                </span>
              </div>

              <div className="space-y-6">
                <MatchRow label="5-Number Match" count={simResults.match5.length} pool="40%" status={simResults.match5.length === 0 ? 'Rollover' : 'Split'} />
                <MatchRow label="4-Number Match" count={simResults.match4.length} pool="35%" />
                <MatchRow label="3-Number Match" count={simResults.match3.length} pool="25%" />

                {simResults.match5.length === 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                      <strong>Jackpot Rollover Detected:</strong> No 5-match winner found. The £{(poolAmount * 0.4).toLocaleString()} jackpot will carry over to the next month's pool.
                    </p>
                  </div>
                )}

                <button 
                  onClick={handlePublish}
                  className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all text-lg mt-4 shadow-2xl"
                >
                  Publish Official Results
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
                <Zap className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-500">Ready for Simulation</h4>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">
                Enter the drawn numbers on the left and run a preview to see match statistics and prize distributions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchRow({ label, count, pool, status }: { label: string, count: number, pool: string, status?: string }) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-3xl bg-slate-50 border border-slate-200 group hover:border-emerald-200 transition-colors">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{pool} Pool</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-black tracking-tight">{count} <span className="text-sm font-bold text-slate-400">Winners</span></p>
        {status && (
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
            status === 'Rollover' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          )}>
            {status}
          </span >
        )}
      </div>
    </div>
  )
}
