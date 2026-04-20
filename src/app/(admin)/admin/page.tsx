import { 
  Users, 
  Heart, 
  Trophy, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Activity,
  ShieldAlert,
  Calendar
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Winner } from '@/types'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: winners } = await supabase
    .from('winners')
    .select('*, profiles(full_name), draws(draw_date)')
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { data: totalWinnings } = await supabase.from('winners').select('prize_amount')
  const { data: activeSubs } = await supabase.from('subscriptions').select('*').eq('status', 'active')
  const { data: latestDraw } = await supabase.from('draws').select('*').order('draw_date', { ascending: false }).limit(1).maybeSingle()

  const impactTotal = (totalWinnings || []).reduce((acc: number, curr: { prize_amount: number }) => acc + curr.prize_amount, 0)

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Command Center</h1>
          <p className="font-medium text-slate-500">System health and participation overview.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              April 20th - April 27th
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AdminStatCard 
          label="Hero Network" 
          value={userCount?.toString() || '0'} 
          trend="Real-time" 
          color="emerald"
          icon={<Users className="w-5 h-5" />} 
        />
        <AdminStatCard 
          label="Impact Funding" 
          value={`£${impactTotal.toLocaleString()}`} 
          trend="Total Won" 
          color="blue"
          icon={<Heart className="w-5 h-5" />} 
        />
        <AdminStatCard 
          label="Live Draw Pool" 
          value={`£${latestDraw?.jackpot_amount?.toLocaleString() || '0'}`} 
          trend={latestDraw ? format(new Date(latestDraw.draw_date), 'MMM dd') : 'TBD'}
          color="amber"
          icon={<Trophy className="w-5 h-5" />} 
        />
        <AdminStatCard 
          label="Active Subs" 
          value={activeSubs?.length.toString() || '0'} 
          trend="Stripe Live" 
          color="indigo"
          icon={<Activity className="w-5 h-5" />} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Verification Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="group p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold">Verification Queue</h3>
                <p className="text-sm text-slate-400 mt-1">Pending reward confirmations.</p>
              </div>
              <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                View ALL
              </button>
            </div>

            <div className="space-y-4">
               {winners && winners.length > 0 ? (winners as unknown as Winner[]).map((winner) => (
                <WinnerRow 
                  key={winner.id}
                  name={winner.profiles?.full_name || 'Anonymous Hero'} 
                  draw={format(new Date(winner.draws?.draw_date), 'MMMM yyyy')}
                  prize={`£${winner.prize_amount.toFixed(2)}`}
                  status={winner.status}
                />
              )) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-slate-200" />
                   </div>
                   <p className="text-slate-400 font-medium">Verification queue is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-500">
                  <ShieldAlert className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">System Controls</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Override active draw sessions or force recalculate monthly pool distributions.
                </p>
                <Link href="/admin/users" className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center uppercase tracking-widest shadow-xl shadow-white/5">
                  Manage Directory
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
           </div>

           <div className="p-8 rounded-[2.5rem] border border-slate-200 bg-white/50 backdrop-blur-sm">
              <h4 className="font-bold flex items-center gap-2 mb-6 text-slate-950">
                <Activity className="w-4 h-4 text-primary" />
                Live Node Feed
              </h4>
              <div className="space-y-6">
                 <LogItem label="Draw Logic Simulation" time="2m ago" />
                 <LogItem label="Stripe Webhook Rcvd" time="15m ago" />
                 <LogItem label="New User Registration" time="1h ago" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({ label, value, trend, icon, color }: { label: string, value: string, trend: string; icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    indigo: "text-indigo-600 bg-indigo-50"
  }

  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white duration-500", colorMap[color])}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
           <ArrowUpRight className="w-3 h-3" />
           {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-3xl font-black tracking-tight text-slate-900">{value}</h4>
      </div>
    </div>
  )
}

function WinnerRow({ name, draw, prize, status }: { name: string, draw: string, prize: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-300">
           {name.charAt(0)}
        </div>
        <div>
          <span className="font-bold text-slate-900 block leading-tight">{name}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{draw} Draw</span>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
        <div className="text-right hidden md:block">
           <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+{prize}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
            status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
          )}>
            {status}
          </div>
          <button className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function LogItem({ label, time }: { label: string, time: string }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
       <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{label}</span>
       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
    </div>
  )
}
