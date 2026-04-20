'use client'

import { useState, useEffect } from 'react'
import { Trophy, Upload, CheckCircle2, Clock, Info, ShieldCheck } from 'lucide-react'
import { uploadWinnerProof } from '@/app/actions/verification'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function WinningsDashboard() {
  const [winnings, setWinnings] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState<string | null>(null)

  // Simulation of fetching user winnings
  useEffect(() => {
    // In a real app, fetch from Supabase
    setWinnings([
      { id: '1', date: 'April 2026', type: '4-Match', amount: 450.00, status: 'pending', proof_url: null },
      { id: '2', date: 'March 2026', type: '3-Match', amount: 85.00, status: 'paid', proof_url: '...' }
    ])
  }, [])

  const handleUpload = async (id: string) => {
    setIsUploading(id)
    // Simulate file upload logic
    const mockUrl = 'https://example.com/proof.png'
    try {
      await uploadWinnerProof(id, mockUrl)
      toast.success('Proof submitted for verification!')
      setWinnings(prev => prev.map(w => w.id === id ? { ...w, status: 'pending' } : w))
    } catch (error) {
      toast.error('Failed to upload proof')
    } finally {
      setIsUploading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards Center</h1>
          <p className="text-muted-foreground">Monitor your winnings and verify your performance.</p>
        </div>
        <div className="flex items-center gap-6 p-6 rounded-3xl bg-accent text-accent-foreground shadow-xl shadow-accent/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Lifetime Total</p>
            <p className="text-3xl font-black">£535.00</p>
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
          {winnings.map((win) => (
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
                    <h4 className="font-bold text-lg">{win.type} Win</h4>
                    <span className="text-xs font-bold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                      {win.date}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600">£{win.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3">
                <div className="flex items-center gap-2">
                  {win.status === 'paid' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      Awaiting Verification
                    </span>
                  )}
                </div>

                {!win.proof_url && win.status !== 'paid' && (
                  <button 
                    onClick={() => handleUpload(win.id)}
                    disabled={!!isUploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-md group-hover:scale-105"
                  >
                    {isUploading === win.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Score Proof
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Notice */}
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
