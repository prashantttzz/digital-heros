import Link from 'next/link'
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  Trophy, 
  BarChart3, 
  Settings,
  Search,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminItems = [
  { name: 'Analytics', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Charities', href: '/admin/charities', icon: Heart },
  { name: 'Draws', href: '/admin/draws', icon: Trophy },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:bg-slate-900 hidden lg:flex flex-col fixed inset-y-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Admin Center</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            Exit to User Panel
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users, draws, charities..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full max-w-md"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
              <Plus className="w-4 h-4" />
              Quick Action
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
