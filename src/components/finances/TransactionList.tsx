'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Expense, Wallet } from '@/types'
import { formatRupiah, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TransactionForm } from './TransactionForm'
import {
  Trash2,
  Pencil,
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Search,
  Wallet as WalletIcon,
} from 'lucide-react'

interface TransactionListProps {
  expenses: Expense[]
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export function TransactionList({ expenses }: TransactionListProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(currentMonth)
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')
  const [selectedWallet, setSelectedWallet] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const years = Array.from({ length: currentYear - 2023 + 2 }, (_, i) => 2023 + i)

  // Fetch wallets for filter
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

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus transaksi "${title}"?`)) {
      deleteExpense.mutate(id)
    }
  }

  // Get wallet name helper
  const getWalletName = (walletId: string | null) => {
    if (!walletId || !wallets) return null
    const wallet = wallets.find((w) => w.id === walletId)
    return wallet?.name || null
  }

  // Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.transaction_date)
    const expYear = expDate.getFullYear()
    const expMonth = expDate.getMonth() + 1

    if (selectedYear !== 'all' && expYear !== selectedYear) return false
    if (selectedMonth !== 'all' && expMonth !== selectedMonth) return false
    if (selectedType !== 'all' && exp.type !== selectedType) return false
    if (selectedWallet !== 'all') {
      if (selectedWallet === 'none' && exp.wallet_id !== null) return false
      if (selectedWallet !== 'none' && exp.wallet_id !== selectedWallet) return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchCategory = exp.category.toLowerCase().includes(query)
      const matchNote = exp.note?.toLowerCase().includes(query)
      const walletName = getWalletName(exp.wallet_id)
      const matchWallet = walletName?.toLowerCase().includes(query)
      if (!matchCategory && !matchNote && !matchWallet) return false
    }
    return true
  })

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime()
  )

  const totalIncome = filteredExpenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalExpense = filteredExpenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const handleResetFilters = () => {
    setSelectedYear(currentYear)
    setSelectedMonth(currentMonth)
    setSelectedType('all')
    setSelectedWallet('all')
    setSearchQuery('')
  }

  const hasActiveFilters =
    selectedYear !== currentYear ||
    selectedMonth !== currentMonth ||
    selectedType !== 'all' ||
    selectedWallet !== 'all' ||
    searchQuery !== ''

  return (
    <div className="space-y-4">
      {/* Search + Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 space-y-4 animate-slide-down">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-500" />
              Filter
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Type Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Jenis
              </label>
              <div className="flex rounded-lg border dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-all ${
                    selectedType === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedType('income')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-all ${
                    selectedType === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setSelectedType('expense')}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-all ${
                    selectedType === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Year Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Tahun
              </label>
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
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
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
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

            {/* Wallet Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <WalletIcon className="h-3 w-3" />
                Wallet
              </label>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              >
                <option value="all">Semua Wallet</option>
                <option value="none">Tanpa Wallet</option>
                {wallets?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {sortedExpenses.length}
              </span>{' '}
              transaksi
            </p>
            <div className="flex items-center gap-3 text-xs">
              {(selectedType === 'all' || selectedType === 'income') && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <ArrowDownCircle className="h-3 w-3" />
                  <span className="font-semibold">{formatRupiah(totalIncome)}</span>
                </span>
              )}
              {(selectedType === 'all' || selectedType === 'expense') && (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <ArrowUpCircle className="h-3 w-3" />
                  <span className="font-semibold">{formatRupiah(totalExpense)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      {sortedExpenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <Filter className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p>Tidak ada transaksi yang sesuai.</p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Kategori
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Catatan
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Wallet
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Jumlah
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-sm dark:text-gray-300">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map((expense) => {
                    const walletName = getWalletName(expense.wallet_id)
                    return (
                      <tr
                        key={expense.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
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
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                          {expense.note || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {walletName || '-'}
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-semibold text-right ${
                            expense.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {expense.type === 'income' ? '+' : '-'}{' '}
                          {formatRupiah(Number(expense.amount))}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <TransactionForm
                              expense={expense}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(expense.id, expense.category)
                              }
                              disabled={deleteExpense.isPending}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden space-y-2">
            {sortedExpenses.map((expense) => {
              const walletName = getWalletName(expense.wallet_id)
              return (
                <div
                  key={expense.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            expense.type === 'income'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          }`}
                        >
                          {expense.category}
                        </span>
                        {walletName && (
                          <span className="text-xs text-muted-foreground">
                            {walletName}
                          </span>
                        )}
                      </div>
                      {expense.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {expense.note}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(expense.transaction_date)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          expense.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {expense.type === 'income' ? '+' : '-'}
                        {formatRupiah(Number(expense.amount))}
                      </p>
                      <div className="flex items-center gap-1 mt-2 justify-end">
                        <TransactionForm
                          expense={expense}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-500 hover:text-purple-600"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDelete(expense.id, expense.category)
                          }
                          disabled={deleteExpense.isPending}
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
