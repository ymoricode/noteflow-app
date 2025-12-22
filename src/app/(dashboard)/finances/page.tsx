'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/finances/ExpenseForm'
import { YearlyExpenseChart } from '@/components/finances/YearlyExpenseChart'
import { MonthlyExpenseChart } from '@/components/finances/MonthlyExpenseChart'
import { DailyExpenseChart } from '@/components/finances/DailyExpenseChart'
import { TransactionList } from '@/components/finances/TransactionList'

export default function FinancesPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [activeView, setActiveView] = useState<'week' | 'month' | 'year'>('month')
  const supabase = createClient()

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (error) throw error
      return data || []
    },
  })

  const currentYear = new Date().getFullYear()
  // Generate years from 2023 to current year + 5 (for future planning)
  const years = Array.from({ length: currentYear - 2023 + 6 }, (_, i) => 2023 + i)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola pemasukan dan pengeluaran Anda</p>
        </div>
        <ExpenseForm />
      </div>

      {/* View Selector */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'week' ? 'default' : 'ghost'}
          onClick={() => setActiveView('week')}
          size="sm"
        >
          Minggu Ini
        </Button>
        <Button
          variant={activeView === 'month' ? 'default' : 'ghost'}
          onClick={() => setActiveView('month')}
          size="sm"
        >
          Bulan Ini
        </Button>
        <Button
          variant={activeView === 'year' ? 'default' : 'ghost'}
          onClick={() => setActiveView('year')}
          size="sm"
        >
          Tahunan
        </Button>
      </div>

      {/* Charts based on active view */}
      {activeView === 'week' && (
        <div className="space-y-6">
          <DailyExpenseChart expenses={expenses || []} />
        </div>
      )}

      {activeView === 'month' && (
        <div className="space-y-6">
          <MonthlyExpenseChart expenses={expenses || []} />
        </div>
      )}

      {activeView === 'year' && (
        <div className="space-y-6">
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium dark:text-white">Pilih Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <YearlyExpenseChart expenses={expenses || []} year={selectedYear} />
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold dark:text-white">Riwayat Transaksi</h2>
        <TransactionList expenses={expenses || []} />
      </div>
    </div>
  )
}
