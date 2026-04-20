'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getScores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching scores:', error)
    return []
  }

  return data
}

export async function addScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const value = parseInt(formData.get('value') as string)
  const date = formData.get('date') as string

  // 1. Validate Score Range
  if (value < 1 || value > 45) {
    return { error: 'Score must be between 1 and 45' }
  }

  // 2. Check for duplicate date (Database constraint will catch this, but we can check early)
  const { data: existing } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', date)
    .single()

  if (existing) {
    return { error: 'A score already exists for this date. Please edit the existing entry.' }
  }

  // 3. Insert Score
  const { error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      value,
      date,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
