'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Edit2, Shield, MoreVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Simulate fetching users from Supabase
    setUsers([
      { id: '1', name: 'James Miller', email: 'james@example.com', scores: 5, plan: 'Monthly', status: 'active' },
      { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', scores: 4, plan: 'Yearly', status: 'active' },
      { id: '3', name: 'Marcus Wright', email: 'marcus@example.com', scores: 5, plan: 'None', status: 'churned' },
    ])
  }, [])

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-slate-500">Monitor active subscribers and their score profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-100">
            {users.length} Active Users
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Scores</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{user.name}</span>
                        <span className="text-xs text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full",
                      user.plan === 'Yearly' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-bold text-slate-700">{user.scores}/5</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-slate-300")} />
                      <span className="text-xs font-bold text-slate-600 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
