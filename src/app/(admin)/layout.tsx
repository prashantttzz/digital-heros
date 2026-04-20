import Link from 'next/link'
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  Trophy, 
  BarChart3, 
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const adminItems = [
  { name: 'Analytics', href: '/admin', icon: BarChart3 },
  { name: 'User Directory', href: '/admin/users', icon: Users },
  { name: 'Cause Manager', href: '/admin/charities', icon: Heart },
  { name: 'Draw Engine', href: '/admin/draws', icon: Trophy },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col fixed inset-y-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight block leading-tight">HEROES</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none">Command</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition-all group relative overflow-hidden"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 group-hover:text-primary transition-all" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 mt-20">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white group hover:bg-slate-800 transition-all font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs uppercase tracking-widest">Player Panel</span>
            </div>
            <ArrowUpRight className="w-4 h-4 border-2 border-white/20 rounded-full" />
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <header className="h-16 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-10 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Deep Search (Cmd + K)" 
                className="w-full pl-11 pr-6 py-2.5 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                ))}
             </div>
             <Link href="/admin/draws" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all group active:scale-95">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Draw Control
            </Link>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
