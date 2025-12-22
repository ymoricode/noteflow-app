'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { Download, FileSpreadsheet, TrendingUp, TrendingDown } from 'lucide-react'
import type { Expense, Budget } from '@/types'

export default function ReportsPage() {
  const supabase = createClient()
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  )

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (error) throw error
      return (data || []) as Expense[]
    },
  })

  const { data: budgets } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: async () => {
      const monthDate = `${selectedMonth}-01`
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', monthDate)

      if (error) throw error
      return (data || []) as Budget[]
    },
  })

  // Filter expenses for selected month
  const monthlyExpenses = expenses?.filter(e => {
    const expenseMonth = e.transaction_date.substring(0, 7)
    return expenseMonth === selectedMonth
  }) || []

  // Calculate stats
  const totalIncome = monthlyExpenses.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0)
  const totalExpense = monthlyExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0)
  const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0
  const budgetUsed = (totalExpense / totalBudget * 100) || 0

  // Category breakdown
  const categoryBreakdown = monthlyExpenses
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {} as Record<string, number>)

  const sortedCategories = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Jumlah', 'Catatan']
    const rows = monthlyExpenses.map(e => [
      e.transaction_date,
      e.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      e.category,
      e.amount,
      e.note || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `laporan-keuangan-${selectedMonth}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Laporan Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Analisis dan export data keuangan Anda</p>
        </div>
        <div className="flex gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
          />
          <Button onClick={exportToCSV} className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Total Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatRupiah(totalIncome)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatRupiah(totalExpense)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatRupiah(totalIncome - totalExpense)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 dark:text-gray-400">Penggunaan Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className={`text-2xl font-bold ${budgetUsed > 100 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                {budgetUsed.toFixed(1)}%
              </span>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${budgetUsed > 100 ? 'bg-red-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min(100, budgetUsed)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <FileSpreadsheet className="h-5 w-5" />
            Breakdown per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-4">
              {sortedCategories.map(([category, amount]) => {
                const percentage = (amount / totalExpense * 100).toFixed(1)
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize dark:text-white">{category}</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600 dark:text-red-400">{formatRupiah(amount)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Belum ada data pengeluaran untuk bulan ini
            </p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Perbandingan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Pemasukan</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatRupiah(
                  (expenses || []).filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0) / 
                  (new Set((expenses || []).map(e => e.transaction_date.substring(0, 7))).size || 1)
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per bulan</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Pengeluaran</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatRupiah(
                  (expenses || []).filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0) / 
                  (new Set((expenses || []).map(e => e.transaction_date.substring(0, 7))).size || 1)
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per bulan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Count */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Total {monthlyExpenses.length} transaksi pada bulan ini
      </div>
    </div>
  )
}
