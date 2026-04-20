'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function simulateDraw(winningNumbers: number[]) {
  const supabase = await createClient()

  // 1. Get all active subscribers with exactly 5 scores
  // (In a real app, this would be a complex query or batch processed)
  const { data: scores, error } = await supabase
    .from('scores')
    .select('user_id, value')
  
  if (error) throw error

  // Group scores by user
  const userScores: Record<string, number[]> = {}
  scores.forEach(s => {
    if (!userScores[s.user_id]) userScores[s.user_id] = []
    userScores[s.user_id].push(s.value)
  })

  const winners = {
    match5: [] as string[],
    match4: [] as string[],
    match3: [] as string[]
  }

  // Matches logic
  Object.entries(userScores).forEach(([userId, sValues]) => {
    const matches = sValues.filter(v => winningNumbers.includes(v)).length
    if (matches === 5) winners.match5.push(userId)
    else if (matches === 4) winners.match4.push(userId)
    else if (matches === 3) winners.match3.push(userId)
  })

  return winners
}

export async function publishDraw(drawDate: string, winningNumbers: number[], poolAmount: number) {
  const supabase = await createClient()

  // 1. Calculate Results
  const winnersList = await simulateDraw(winningNumbers)

  // 2. Determine Prize Shares (40/35/25)
  const pool5 = poolAmount * 0.40
  const pool4 = poolAmount * 0.35
  const pool3 = poolAmount * 0.25

  // 3. Insert Draw Record
  const { data: draw, error: drawErr } = await supabase
    .from('draws')
    .insert({
      draw_date: drawDate,
      winning_numbers: winningNumbers,
      jackpot_amount: pool5,
      status: 'published'
    })
    .select()
    .single()

  if (drawErr) throw drawErr

  // 4. Create Winner Records
  const winnersToInsert: { draw_id: string; user_id: string; match_type: number; prize_amount: number }[] = []

  if (winnersList.match5.length > 0) {
    const share = pool5 / winnersList.match5.length
    winnersList.match5.forEach(uid => winnersToInsert.push({ draw_id: draw.id, user_id: uid, match_type: 5, prize_amount: share }))
  } else {
    // Rollover logic: Carry over pool5 to next draw metadata (or separate table)
    // For simplicity, we can store it in a 'rollovers' table or 'draws.rollover_amount'
    await supabase.from('draws').update({ rollover_amount: pool5 }).eq('id', draw.id)
  }

  if (winnersList.match4.length > 0) {
    const share = pool4 / winnersList.match4.length
    winnersList.match4.forEach(uid => winnersToInsert.push({ draw_id: draw.id, user_id: uid, match_type: 4, prize_amount: share }))
  }

  if (winnersList.match3.length > 0) {
    const share = pool3 / winnersList.match3.length
    winnersList.match3.forEach(uid => winnersToInsert.push({ draw_id: draw.id, user_id: uid, match_type: 3, prize_amount: share }))
  }

  if (winnersToInsert.length > 0) {
    await supabase.from('winners').insert(winnersToInsert)
  }

  revalidatePath('/admin/draws')
  revalidatePath('/dashboard')
  return { success: true }
}
