'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Expense } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Filter, ArrowDownCircle, ArrowUpCircle, Calendar } from 'lucide-react'

interface TransactionListProps {
  expenses: Expense[]
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export function TransactionList({ expenses }: TransactionListProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(currentMonth)
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')
  
  // Generate years from 2023 to current year + 1
  const years = Array.from({ length: currentYear - 2023 + 2 }, (_, i) => 2023 + i)

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus transaksi "${title}"?`)) {
      deleteExpense.mutate(id)
    }
  }

  // Filter expenses by year, month, and type
  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.transaction_date)
    const expYear = expDate.getFullYear()
    const expMonth = expDate.getMonth() + 1 // 1-12

    // Year filter
    if (selectedYear !== 'all' && expYear !== selectedYear) return false
    
    // Month filter
    if (selectedMonth !== 'all' && expMonth !== selectedMonth) return false
    
    // Type filter
    if (selectedType !== 'all' && exp.type !== selectedType) return false

    return true
  })

  // Sort by date descending
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
  )

  // Calculate totals for filtered results
  const totalIncome = filteredExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalExpense = filteredExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const handleResetFilters = () => {
    setSelectedYear(currentYear)
    setSelectedMonth(currentMonth)
    setSelectedType('all')
  }

  const hasActiveFilters = selectedYear !== currentYear || selectedMonth !== currentMonth || selectedType !== 'all'

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-purple-500" />
            <h3 className="text-sm font-semibold dark:text-white">Filter Transaksi</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Jenis Transaksi</label>
            <div className="flex rounded-lg border dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  selectedType === 'income'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowDownCircle className="h-3 w-3" />
                Masuk
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  selectedType === 'expense'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowUpCircle className="h-3 w-3" />
                Keluar
              </button>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            >
              <option value="all">Semua Tahun</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            >
              <option value="all">Semua Bulan</option>
              {MONTH_NAMES.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan <span className="font-semibold text-gray-700 dark:text-gray-200">{sortedExpenses.length}</span> transaksi
          </p>
          <div className="flex items-center gap-3 text-xs">
            {(selectedType === 'all' || selectedType === 'income') && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <ArrowDownCircle className="h-3 w-3" />
                Masuk: <span className="font-semibold">{formatRupiah(totalIncome)}</span>
              </span>
            )}
            {(selectedType === 'all' || selectedType === 'expense') && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <ArrowUpCircle className="h-3 w-3" />
                Keluar: <span className="font-semibold">{formatRupiah(totalExpense)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {sortedExpenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <Filter className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p>Tidak ada transaksi yang sesuai dengan filter.</p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
              >
                Reset filter untuk melihat semua transaksi
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300 hidden sm:table-cell">Catatan</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm dark:text-gray-300">Jumlah</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-sm dark:text-gray-200">
                      {formatDate(expense.transaction_date)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expense.type === 'income'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {expense.note || '-'}
                    </td>
                    <td
                      className={`py-3 px-4 text-sm font-semibold text-right ${
                        expense.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {expense.type === 'income' ? '+' : '-'} {formatRupiah(Number(expense.amount))}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id, expense.category)}
                          disabled={deleteExpense.isPending}
                          className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
