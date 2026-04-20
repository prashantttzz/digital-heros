'use client'

import Link from 'next/link'
import { Trophy, Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '../actions'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex relative bg-slate-900 overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(5,150,105,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 rotate-3 animate-bounce">
            <Trophy className="text-white w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Enter the Arena of Impact.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            "Your performance on the course fuels life-changing work for your chosen charity. Log in to track your scores and see your impact."
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-20 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">Digital Heroes</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-10 text-sm">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="alex@digitalheroes.io"
                className="w-full px-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input 
                name="password"
                type="password" 
                required
                className="w-full px-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none"
              />
            </div>

            <button 
              disabled={isPending}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isPending ? 'Logging in...' : 'Sign In'}
              {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="bg-background px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button type="button" className="w-full py-4 rounded-2xl border border-border font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2 text-sm">
              Github
            </button>
          </form>

          <p className="mt-12 text-center text-sm text-slate-500">
            Don't have an account? {' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
