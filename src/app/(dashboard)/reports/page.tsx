'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import {
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Expense, Budget, Wallet } from '@/types'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

const MONTH_NAMES_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function ReportsPage() {
  const supabase = createClient()
  const currentYear = new Date().getFullYear()

  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  )
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const years = Array.from({ length: currentYear - 2023 + 2 }, (_, i) => 2023 + i)

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

  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      return (data || []) as Wallet[]
    },
  })

  // --- MONTHLY DATA ---
  const monthlyExpenses = expenses?.filter((e) => {
    const expenseMonth = e.transaction_date.substring(0, 7)
    return expenseMonth === selectedMonth
  }) || []

  const monthlyIncome = monthlyExpenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const monthlyExpenseTotal = monthlyExpenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalBudget = budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0
  const budgetUsed = totalBudget > 0 ? (monthlyExpenseTotal / totalBudget) * 100 : 0

  const monthlyCategoryBreakdown = monthlyExpenses
    .filter((e) => e.type === 'expense')
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {} as Record<string, number>)

  const sortedMonthlyCategories = Object.entries(monthlyCategoryBreakdown).sort(
    ([, a], [, b]) => b - a
  )

  // --- YEARLY DATA ---
  const yearlyChartData = useMemo(() => {
    if (!expenses) return []
    return MONTHS.map((month, index) => {
      const monthExpenses = expenses.filter((e) => {
        const d = new Date(e.transaction_date)
        return d.getFullYear() === selectedYear && d.getMonth() === index
      })
      const income = monthExpenses
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + Number(e.amount), 0)
      const expense = monthExpenses
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + Number(e.amount), 0)
      return { month, income, expense, net: income - expense }
    })
  }, [expenses, selectedYear])

  const yearlyTotalIncome = yearlyChartData.reduce((s, d) => s + d.income, 0)
  const yearlyTotalExpense = yearlyChartData.reduce((s, d) => s + d.expense, 0)
  const yearlyNet = yearlyTotalIncome - yearlyTotalExpense

  const yearlyCategoryBreakdown = useMemo(() => {
    if (!expenses) return []
    const categories: Record<string, number> = {}
    expenses
      .filter((e) => {
        const d = new Date(e.transaction_date)
        return d.getFullYear() === selectedYear && e.type === 'expense'
      })
      .forEach((e) => {
        categories[e.category] = (categories[e.category] || 0) + Number(e.amount)
      })
    return Object.entries(categories).sort(([, a], [, b]) => b - a)
  }, [expenses, selectedYear])

  // --- EXPORT ---
  const getWalletName = (walletId: string | null) => {
    if (!walletId || !wallets) return ''
    return wallets.find((w) => w.id === walletId)?.name || ''
  }

  const exportYearlyCSV = () => {
    const yearExpenses = (expenses || []).filter((e) => {
      const d = new Date(e.transaction_date)
      return d.getFullYear() === selectedYear
    }).sort((a, b) => a.transaction_date.localeCompare(b.transaction_date))

    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Wallet', 'Jumlah', 'Catatan']
    const rows = yearExpenses.map((e) => [
      e.transaction_date,
      e.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      e.category,
      getWalletName(e.wallet_id),
      e.amount,
      e.note || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `laporan-keuangan-${selectedYear}.csv`
    link.click()
  }

  const exportMonthlyCSV = () => {
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Wallet', 'Jumlah', 'Catatan']
    const rows = monthlyExpenses
      .sort((a, b) => a.transaction_date.localeCompare(b.transaction_date))
      .map((e) => [
        e.transaction_date,
        e.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        e.category,
        getWalletName(e.wallet_id),
        e.amount,
        e.note || '',
      ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `laporan-keuangan-${selectedMonth}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
          Laporan Keuangan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
          Analisis dan export data keuangan Anda
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'monthly' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('monthly')}
          size="sm"
          className="gap-1.5"
        >
          <Calendar className="h-4 w-4" />
          Bulanan
        </Button>
        <Button
          variant={activeTab === 'yearly' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('yearly')}
          size="sm"
          className="gap-1.5"
        >
          <BarChart3 className="h-4 w-4" />
          Tahunan
        </Button>
      </div>

      {/* ========================= MONTHLY TAB ========================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Month selector + Export */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            />
            <Button
              onClick={exportMonthlyCSV}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Pemasukan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 truncate">
                    {formatRupiah(monthlyIncome)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 truncate">
                    {formatRupiah(monthlyExpenseTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Saldo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`text-lg sm:text-2xl font-bold truncate block ${
                    monthlyIncome - monthlyExpenseTotal >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatRupiah(monthlyIncome - monthlyExpenseTotal)}
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Budget Terpakai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span
                    className={`text-lg sm:text-2xl font-bold ${
                      budgetUsed > 100
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {budgetUsed.toFixed(0)}%
                  </span>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budgetUsed > 100 ? 'bg-red-500' : 'bg-purple-500'
                      }`}
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
              <CardTitle className="flex items-center gap-2 dark:text-white text-base">
                <FileSpreadsheet className="h-5 w-5" />
                Breakdown per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedMonthlyCategories.length > 0 ? (
                <div className="space-y-4">
                  {sortedMonthlyCategories.map(([category, amount]) => {
                    const percentage = (
                      (amount / monthlyExpenseTotal) *
                      100
                    ).toFixed(1)
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize dark:text-white text-sm">
                            {category}
                          </span>
                          <div className="text-right">
                            <span className="font-bold text-red-600 dark:text-red-400 text-sm">
                              {formatRupiah(amount)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                  Belum ada data pengeluaran untuk bulan ini
                </p>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Total {monthlyExpenses.length} transaksi pada bulan ini
          </div>
        </div>
      )}

      {/* ========================= YEARLY TAB ========================= */}
      {activeTab === 'yearly' && (
        <div className="space-y-6">
          {/* Year selector + Export */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Button
              onClick={exportYearlyCSV}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Export CSV Tahunan
            </Button>
          </div>

          {/* Yearly Summary Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400">
                  Total Pemasukan {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatRupiah(yearlyTotalIncome)}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400">
                  Total Pengeluaran {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatRupiah(yearlyTotalExpense)}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 dark:text-gray-400">
                  Saldo Bersih {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    yearlyNet >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatRupiah(yearlyNet)}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Yearly Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="dark:text-white text-base">
                Pemasukan vs Pengeluaran per Bulan — {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={yearlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickFormatter={(v) => {
                      if (v >= 1000000) return `${(v / 1000000).toFixed(0)}jt`
                      if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`
                      return v
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatRupiah(value)}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    name="Pemasukan"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    name="Pengeluaran"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="dark:text-white text-base">
                Detail Bulanan — {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2 px-3 dark:text-gray-300 font-semibold">
                        Bulan
                      </th>
                      <th className="text-right py-2 px-3 dark:text-gray-300 font-semibold">
                        Pemasukan
                      </th>
                      <th className="text-right py-2 px-3 dark:text-gray-300 font-semibold">
                        Pengeluaran
                      </th>
                      <th className="text-right py-2 px-3 dark:text-gray-300 font-semibold">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyChartData.map((data, idx) => (
                      <tr
                        key={data.month}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-2.5 px-3 font-medium dark:text-gray-200">
                          {MONTH_NAMES_FULL[idx]}
                        </td>
                        <td className="text-right py-2.5 px-3 text-green-600 dark:text-green-400">
                          {formatRupiah(data.income)}
                        </td>
                        <td className="text-right py-2.5 px-3 text-red-600 dark:text-red-400">
                          {formatRupiah(data.expense)}
                        </td>
                        <td
                          className={`text-right py-2.5 px-3 font-semibold ${
                            data.net >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {formatRupiah(data.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700/50">
                      <td className="py-2.5 px-3 dark:text-gray-200">Total</td>
                      <td className="text-right py-2.5 px-3 text-green-600 dark:text-green-400">
                        {formatRupiah(yearlyTotalIncome)}
                      </td>
                      <td className="text-right py-2.5 px-3 text-red-600 dark:text-red-400">
                        {formatRupiah(yearlyTotalExpense)}
                      </td>
                      <td
                        className={`text-right py-2.5 px-3 ${
                          yearlyNet >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatRupiah(yearlyNet)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white text-base">
                <FileSpreadsheet className="h-5 w-5" />
                Breakdown Kategori — {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {yearlyCategoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {yearlyCategoryBreakdown.map(([category, amount]) => {
                    const percentage =
                      yearlyTotalExpense > 0
                        ? ((amount / yearlyTotalExpense) * 100).toFixed(1)
                        : '0'
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize dark:text-white text-sm">
                            {category}
                          </span>
                          <div className="text-right">
                            <span className="font-bold text-red-600 dark:text-red-400 text-sm">
                              {formatRupiah(amount)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                  Belum ada data pengeluaran untuk tahun {selectedYear}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
