'use client'

import { useState, useEffect } from 'react'
import { Heart, Plus, Search, Edit2, Trash2, Globe, X, Loader2 } from 'lucide-react'
import { getCharities, addCharity, deleteCharity } from '@/app/actions/charity'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchCharities = () => {
    getCharities().then(setCharities)
  }

  useEffect(() => {
    fetchCharities()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await addCharity(formData)
    
    if (result.success) {
      toast.success('Charity added successfully')
      setIsModalOpen(false)
      fetchCharities()
    } else {
      toast.error(result.error || 'Failed to add charity')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the directory?`)) return
    
    const result = await deleteCharity(id)
    if (result.success) {
      toast.success('Charity removed')
      fetchCharities()
    } else {
      toast.error('Failed to delete')
    }
  }

  const filtered = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cause Manager</h1>
          <p className="text-sm text-slate-500">Manage charity listings and impact profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
        >
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
          {filtered.length > 0 ? filtered.map((charity) => (
            <div key={charity.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(charity.id, charity.name)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-destructive" />
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
                    Verified NGO
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] italic text-slate-400">
               No charities found. Add your first cause to the directory.
            </div>
          )}
        </div>
      </div>

      {/* Add Charity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold">Register New Cause</h2>
              <p className="text-slate-500 text-sm">Add a verified charity to the player directory.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Charity Name</label>
                <input 
                  name="name" 
                  required 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. World Wildlife Fund"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea 
                  name="description" 
                  required 
                  rows={3}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Mission and impact details..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logo Icon URL</label>
                <input 
                  name="logo_url" 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <input type="checkbox" name="is_featured" id="featured" className="w-4 h-4 accent-primary" />
                 <label htmlFor="featured" className="text-sm font-bold text-slate-600">Feature this cause on the homepage</label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
