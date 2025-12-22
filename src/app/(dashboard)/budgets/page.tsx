'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { BudgetForm } from '@/components/finances/BudgetForm'
import { BudgetCard } from '@/components/finances/BudgetCard'
import { format } from 'date-fns'
import { useState } from 'react'
import type { Budget, Expense } from '@/types'

export default function BudgetsPage() {
  const supabase = createClient()
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))

  const { data: budgets, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: async () => {
      const monthDate = `${selectedMonth}-01`
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', monthDate)
        .order('category')

      if (error) throw error
      return (data || []) as Budget[]
    },
  })

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', selectedMonth],
    queryFn: async () => {
      // Get first day of selected month
      const startDate = `${selectedMonth}-01`
      
      // Get first day of next month
      const [year, month] = selectedMonth.split('-')
      const nextMonth = new Date(parseInt(year), parseInt(month), 1)
      const endDate = nextMonth.toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('transaction_date', startDate)
        .lt('transaction_date', endDate)

      if (error) throw error
      
      return (data || []) as Expense[]
    },
  })

  const isLoading = budgetsLoading || expensesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat budget...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Budget Planning</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola budget pengeluaran Anda</p>
        </div>
        <BudgetForm />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium dark:text-white">Bulan:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
        />
      </div>

      {budgets && budgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} expenses={expenses || []} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border dark:border-gray-700 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Belum ada budget</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Mulai kelola keuangan dengan membuat budget untuk setiap kategori pengeluaran.
            </p>
            <BudgetForm />
          </div>
        </div>
      )}
    </div>
  )
}
