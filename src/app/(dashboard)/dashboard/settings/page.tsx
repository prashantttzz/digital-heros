import { UserCircle, Mail, Shield, Bell, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/(auth)/actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-6">
        <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            Profile Information
          </h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-border bg-card shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h3>
          <button className="px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-secondary transition-colors">
            Change Password
          </button>
        </div>

        <div className="p-8 rounded-3xl border border-destructive/10 bg-destructive/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-destructive flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </h3>
            <p className="text-xs text-destructive/60 mt-1">Exit your current session.</p>
          </div>
          <form action={signOut}>
            <button className="px-6 py-3 rounded-xl bg-destructive text-white font-bold text-sm hover:bg-destructive/90 transition-all">
              Log Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
