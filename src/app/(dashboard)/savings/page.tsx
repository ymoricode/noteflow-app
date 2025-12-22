'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { SavingsGoalForm } from '@/components/savings/SavingsGoalForm'
import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard'
import { formatRupiah } from '@/lib/utils'
import type { SavingsGoal } from '@/types'

export default function SavingsPage() {
  const supabase = createClient()

  const { data: goals, isLoading } = useQuery({
    queryKey: ['savings_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as SavingsGoal[]
    },
  })

  // Calculate totals
  const totalTarget = goals?.reduce((acc, g) => acc + Number(g.target_amount), 0) || 0
  const totalSaved = goals?.reduce((acc, g) => acc + Number(g.current_amount), 0) || 0
  const completedGoals = goals?.filter(g => g.is_completed).length || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat target tabungan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Target Tabungan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola dan lacak target tabungan Anda</p>
        </div>
        <SavingsGoalForm />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-80">Total Terkumpul</p>
          <p className="text-2xl font-bold">{formatRupiah(totalSaved)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-80">Total Target</p>
          <p className="text-2xl font-bold">{formatRupiah(totalTarget)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-80">Target Tercapai</p>
          <p className="text-2xl font-bold">{completedGoals} / {goals?.length || 0}</p>
        </div>
      </div>

      {/* Goals Grid */}
      {goals && goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <SavingsGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border dark:border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Belum ada target tabungan</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Mulai buat target tabungan untuk mencapai tujuan finansial Anda!
            </p>
            <SavingsGoalForm />
          </div>
        </div>
      )}
    </div>
  )
}
