import { 
  Users, 
  Heart, 
  Trophy, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: winners } = await supabase
    .from('winners')
    .select('*, profiles(full_name), draws(draw_date)')
    .order('created_at', { ascending: false })

  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { data: activeSubs } = await supabase.from('subscriptions').select('*').eq('status', 'active')

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-sm text-slate-500">Real-time performance and charity metrics.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          label="Active Users" 
          value={userCount?.toString() || '0'} 
          change="+0%" 
          icon={<Users className="w-5 h-5" />} 
        />
        <AdminStatCard 
          label="Total Prize Pool" 
          value="£0.00" 
          change="+0%" 
          icon={<Trophy className="w-5 h-5" />} 
        />
        <AdminStatCard 
          label="Active Subscriptions" 
          value={activeSubs?.length.toString() || '0'} 
          change="+0%" 
          icon={<TrendingUp className="w-5 h-5" />} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Winner Verification</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Draw Date</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Prize</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {winners && winners.length > 0 ? winners.map((winner: any) => (
                  <WinnerRow 
                    key={winner.id}
                    name={winner.profiles?.full_name || 'Unknown'} 
                    draw={format(new Date(winner.draws?.draw_date), 'MMMM yyyy')}
                    prize={`£${winner.prize_amount.toFixed(2)}`}
                    status={winner.status}
                  />
                )) : (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400">No winners to verify.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl">
            <h3 className="font-bold mb-4">Draw Control</h3>
            <p className="text-sm text-slate-400 mb-6">
              Manage the monthly lottery engine. Runs simulations based on current active user scores.
            </p>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all text-sm">
                Next Draw Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminStatCard({ label, value, change, icon }: { label: string, value: string, change: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
      </div>
    </div>
  )
}

function WinnerRow({ name, draw, prize, status }: { name: string, draw: string, prize: string, status: string }) {
  return (
    <tr className="group">
      <td className="py-4">
        <span className="font-bold text-sm">{name}</span>
      </td>
      <td className="py-4 text-sm font-medium">{draw}</td>
      <td className="py-4 text-sm font-bold text-emerald-600">{prize}</td>
      <td className="py-4 uppercase text-[10px] font-black tracking-widest">
        {status}
      </td>
      <td className="py-4 text-right">
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Eye className="w-4 h-4 text-slate-500" />
        </button>
      </td>
    </tr>
  )
}
