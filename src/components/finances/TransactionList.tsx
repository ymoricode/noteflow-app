'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Expense } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TransactionListProps {
  expenses: Expense[]
}

export function TransactionList({ expenses }: TransactionListProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(currentYear)
  
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

  // Filter expenses by year
  const filteredExpenses = selectedYear === 'all' 
    ? expenses 
    : expenses.filter(exp => {
        const expYear = new Date(exp.transaction_date).getFullYear()
        return expYear === selectedYear
      })

  // Sort by date descending
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
  )

  return (
    <div className="space-y-4">
      {/* Year Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium dark:text-white">Filter Tahun:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
          >
            <option value="all">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sortedExpenses.length} transaksi
        </p>
      </div>

      {/* Table */}
      {sortedExpenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          {selectedYear === 'all' 
            ? 'Belum ada transaksi. Tambahkan transaksi pertama Anda!'
            : `Tidak ada transaksi di tahun ${selectedYear}`
          }
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
