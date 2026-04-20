'use client'

import { useState } from 'react'
import { Calendar, Trophy, Send, History } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { addScore } from '@/app/actions/scores'

export function ScoreEntryForm() {
  const [value, setValue] = useState<string>('')
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await addScore(formData)
      
      if (result.error) {
        toast.error(result.error)
        return
      }
      
      toast.success('Score saved successfully! Oldest score removed.')
      setValue('')
    } catch {
      toast.error('Failed to save score')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Stableford Score (1-45)
          </label>
          <input
            name="value"
            type="number"
            min="1"
            max="45"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-bold"
            placeholder="36"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Session
          </label>
          <input
            name="date"
            type="date"
            required
            max={format(new Date(), 'yyyy-MM-dd')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Save Score Entry
          </>
        )}
      </button>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
        <History className="w-5 h-5 text-primary mt-0.5" />
        <p className="text-xs text-primary/80 leading-relaxed">
          <strong>Rolling 5 Logic:</strong> Adding this score will automatically remove your oldest entry. 
          Only one entry per date is permitted.
        </p>
      </div>
    </form>
  )
}
