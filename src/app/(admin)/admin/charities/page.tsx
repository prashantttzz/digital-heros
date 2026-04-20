'use client'

import { useState, useEffect } from 'react'
import { Heart, Plus, Search, Edit2, Trash2, Globe, MoreVertical } from 'lucide-react'
import { getCharities } from '@/app/actions/charity'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCharities().then(setCharities)
  }, [])

  const filtered = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cause Manager</h1>
          <p className="text-sm text-slate-500">Manage charity listings and impact profiles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
          <Plus className="w-4 h-4" />
          Add New Charity
        </button>
      </div>

      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search causes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((charity) => (
            <div key={charity.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-lg">{charity.name}</h4>
                  {charity.is_featured && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {charity.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Global Reach
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
