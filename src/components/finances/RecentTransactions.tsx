'use client'

import { formatRupiah, formatDate } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Expense, Wallet } from '@/types'

interface RecentTransactionsProps {
  expenses: Expense[]
  wallets: Wallet[]
  limit?: number
}

export function RecentTransactions({
  expenses,
  wallets,
  limit = 7,
}: RecentTransactionsProps) {
  const recentExpenses = expenses
    .sort(
      (a, b) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    )
    .slice(0, limit)

  const getWalletName = (walletId: string | null) => {
    if (!walletId) return null
    return wallets.find((w) => w.id === walletId)?.name || null
  }

  if (recentExpenses.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold dark:text-white">
          Transaksi Terbaru
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi. Catat pemasukan atau pengeluaran pertama Anda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold dark:text-white">
          Transaksi Terbaru
        </h3>
        <Link
          href="/finances"
          className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium flex items-center gap-0.5"
        >
          Lihat Semua
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 divide-y dark:divide-gray-700">
        {recentExpenses.map((expense) => {
          const walletName = getWalletName(expense.wallet_id)
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between px-4 py-3 gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      expense.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {expense.category}
                  </span>
                  {walletName && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {walletName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(expense.transaction_date)}
                  {expense.note && ` · ${expense.note}`}
                </p>
              </div>
              <span
                className={`text-sm font-semibold shrink-0 ${
                  expense.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {expense.type === 'income' ? '+' : '-'}
                {formatRupiah(Number(expense.amount))}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
