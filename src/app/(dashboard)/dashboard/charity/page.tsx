'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, ArrowRight, TrendingUp, Search } from 'lucide-react'
import { getCharities, updateCharityPreference } from '@/app/actions/charity'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CharityDashboard() {
  const [charities, setCharities] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [percentage, setPercentage] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCharities().then(setCharities)
    
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from('profiles').select('charity_id, charity_percentage').eq('id', user.id).single()
      if (data) {
        setSelectedId(data.charity_id)
        setPercentage(data.charity_percentage || 10)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!selectedId) {
      toast.error('Please select a charity')
      return
    }
    setIsSubmitting(true)
    const result = await updateCharityPreference(selectedId, percentage)
    if (result.success) {
      toast.success('Charity settings updated!')
    } else {
      toast.error(result.error || 'Failed to update')
    }
    setIsSubmitting(false)
  }

  const filtered = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Charitable Impact</h1>
          <p className="text-muted-foreground">Manage your contributions and supported causes.</p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="text-right">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Active Contribution</p>
            <p className="text-xl font-black">{percentage}%</p>
          </div>
          <Heart className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Selection Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Impact Level
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium text-slate-400">Monthly Contribution</span>
                  <span className="text-sm font-bold text-white">{percentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  step="5"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="w-full accent-primary bg-slate-800 rounded-lg appearance-none cursor-pointer h-2"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span>Min 10%</span>
                  <span>Max 50%</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                "Increasing your percentage directly increases the funding for your chosen cause. This split is applied to your active subscription fee."
              </p>

              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

        {/* Directory Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((charity) => (
              <button
                key={charity.id}
                onClick={() => setSelectedId(charity.id)}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-4 text-left group relative overflow-hidden",
                  selectedId === charity.id 
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/10" 
                    : "bg-card border-transparent hover:border-border shadow-sm"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shrink-0">
                  <Heart className={cn("w-6 h-6", selectedId === charity.id ? "text-primary fill-primary/20" : "")} />
                </div>
                <div>
                  <h4 className="font-bold">{charity.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                    {charity.description}
                  </p>
                </div>

                {selectedId === charity.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
