'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadWinnerProof(winnerId: string, proofUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('winners')
    .update({ 
      proof_url: proofUrl,
      status: 'pending' // Reset to pending for review
    })
    .eq('id', winnerId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/dashboard/winnings')
  return { success: true }
}

export async function verifyWinner(winnerId: string, status: 'approved' | 'rejected' | 'paid') {
  const supabase = await createClient()
  // Check if admin (implement middleware/check)
  
  const { error } = await supabase
    .from('winners')
    .update({ status })
    .eq('id', winnerId)

  if (error) throw error

  revalidatePath('/admin')
  return { success: true }
}
