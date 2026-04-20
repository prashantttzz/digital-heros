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

export async function addCharity(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const logo_url = formData.get('logo_url') as string
  const is_featured = formData.get('is_featured') === 'on'

  const { error } = await supabase
    .from('charities')
    .insert({
      name,
      description,
      logo_url,
      is_featured
    })

  if (error) return { error: error.message }

  revalidatePath('/admin/charities')
  revalidatePath('/dashboard/charity')
  return { success: true }
}

export async function deleteCharity(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/charities')
  revalidatePath('/dashboard/charity')
  return { success: true }
}
