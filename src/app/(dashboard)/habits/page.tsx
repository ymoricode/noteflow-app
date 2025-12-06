'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { HabitForm } from '@/components/habits/HabitForm'
import { HabitTracker } from '@/components/habits/HabitTracker'
import type { Habit } from '@/types'

export default function HabitsPage() {
  const supabase = createClient()

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Habit[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat kebiasaan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pelacak Kebiasaan</h1>
          <p className="text-gray-600 mt-2">Bangun kebiasaan baik dengan tracking harian</p>
        </div>
        <HabitForm />
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">💡 Tips Membangun Kebiasaan</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Mulai dengan kebiasaan kecil yang mudah dilakukan</li>
          <li>• Lakukan secara konsisten setiap hari</li>
          <li>• Rayakan setiap pencapaian streak Anda</li>
          <li>• Jangan patah semangat jika terlewat satu hari, lanjutkan besok!</li>
        </ul>
      </div>

      {/* Habits List */}
      {habits && habits.length > 0 ? (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitTracker key={habit.id} habit={habit} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg border text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Belum ada kebiasaan</h3>
            <p className="text-gray-600 mb-6">
              Mulai bangun kebiasaan baik hari ini! Tambahkan kebiasaan pertama Anda dan lacak
              progresnya setiap hari.
            </p>
            <HabitForm />
          </div>
        </div>
      )}

      {/* Stats */}
      {habits && habits.length > 0 && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            Total Kebiasaan: <strong>{habits.length}</strong>
          </span>
        </div>
      )}
    </div>
  )
}
