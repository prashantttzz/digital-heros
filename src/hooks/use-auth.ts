'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
      toast.success('Signed out successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign out'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { signOut, isLoading }
}
