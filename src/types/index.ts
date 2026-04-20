export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  charity_id: string | null
  charity_percentage: number
  stripe_customer_id: string | null
  created_at: string
}

export interface Score {
  id: string
  user_id: string
  value: number
  date: string
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_featured: boolean
  created_at: string
}

export interface Draw {
  id: string
  draw_date: string
  winning_numbers: number[] | null
  status: 'simulated' | 'published'
  jackpot_amount: number
  rollover_amount: number
  created_at: string
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_type: 3 | 4 | 5
  prize_amount: number
  proof_url: string | null
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  created_at: string
  profiles?: { full_name: string }
  draws?: { draw_date: string }
}

export interface Subscription {
  id: string
  user_id: string
  status: string
  plan_type: 'monthly' | 'yearly' | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  stripe_subscription_id: string | null
}
