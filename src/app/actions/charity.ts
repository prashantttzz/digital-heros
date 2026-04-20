'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCharities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('charities')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching charities:', error)
    return []
  }

  return data
}

export async function updateCharityPreference(charityId: string, percentage: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // PRD Rule: Min 10%
  if (percentage < 10) {
    return { error: 'Minimum charity contribution is 10%' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      charity_id: charityId,
      charity_percentage: percentage
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
