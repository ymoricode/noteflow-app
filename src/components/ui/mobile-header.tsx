'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface MobileHeaderProps {
  title?: string
  subtitle?: string
  showGreeting?: boolean
}

export function MobileHeader({ title, subtitle, showGreeting = false }: MobileHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  
  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()
    
    // Update time
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      if (hour < 12) {
        setCurrentTime('Pagi')
      } else if (hour < 15) {
        setCurrentTime('Siang')
      } else if (hour < 18) {
        setCurrentTime('Sore')
      } else {
        setCurrentTime('Malam')
      }
    }
    
    updateTime()
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User'

  if (showGreeting) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Selamat {currentTime}, {firstName}!
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle || 'Ringkasan keuangan bulan ini'}
          </p>
        </div>
        
        {/* Avatar */}
        <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center text-white font-semibold text-sm lg:text-base shadow-lg shadow-purple-500/20">
          {firstName.charAt(0).toUpperCase()}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  )
}
