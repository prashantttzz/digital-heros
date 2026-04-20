'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Edit2, Trash2, Shield, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) setUsers(data || [])
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  const filtered = users.filter(u => 
    (u.full_name?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Registry</h1>
          <p className="text-sm text-slate-500">Monitor active subscribers and their performance profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
            {users.length} Total Accounts
          </div>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="pb-4 pl-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscriber</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identity</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="pb-4 pr-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {!isLoading && filtered.map((user) => (
                <tr key={user.id} className="group transition-all">
                  <td className="py-4 pl-6 rounded-l-3xl bg-slate-50/50 group-hover:bg-slate-100/50 border-y border-l border-slate-50 group-hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400">
                        {user.full_name?.charAt(0) || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{user.full_name || 'Incomplete Profile'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Active Hero</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 bg-slate-50/50 group-hover:bg-slate-100/50 border-y border-slate-50 group-hover:border-slate-100 text-center">
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                      user.role === 'admin' ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 bg-slate-50/50 group-hover:bg-slate-100/50 border-y border-slate-50 group-hover:border-slate-100 italic text-slate-400 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-6 rounded-r-3xl bg-slate-50/50 group-hover:bg-slate-100/50 border-y border-r border-slate-50 group-hover:border-slate-100 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-300 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <div className="py-20 text-center text-slate-400 text-sm font-medium animate-pulse">Scanning Neural Network...</div>}
          {!isLoading && filtered.length === 0 && <div className="py-20 text-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-[2.5rem]">No registered heroes found.</div>}
        </div>
      </div>
    </div>
  )
}
