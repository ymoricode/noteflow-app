'use client'

import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface QuickStatsProps {
  income: number
  expense: number
  budgetRemaining: number
  totalBudget?: number
  savingsProgress?: number
  incomeChange?: number
  expenseChange?: number
}

export function QuickStats({ 
  income, 
  expense, 
  budgetRemaining, 
  totalBudget = 0,
  savingsProgress = 0,
  incomeChange = 0,
  expenseChange = 0 
}: QuickStatsProps) {
  const budgetUsagePercent = totalBudget > 0 
    ? Math.round(((totalBudget - budgetRemaining) / totalBudget) * 100) 
    : 0

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card 1 - Pemasukan */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 dark:border-green-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          {incomeChange !== 0 && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              incomeChange > 0 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {incomeChange > 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
              {Math.abs(incomeChange).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
          Pemasukan
        </p>
        <p className="text-lg font-bold text-green-600 dark:text-green-400 truncate">
          {formatRupiah(income)}
        </p>
      </div>

      {/* Card 2 - Pengeluaran */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 dark:border-red-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          {expenseChange !== 0 && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              expenseChange > 0 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {expenseChange > 0 ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
              {Math.abs(expenseChange).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
          Pengeluaran
        </p>
        <p className="text-lg font-bold text-red-600 dark:text-red-400 truncate">
          {formatRupiah(expense)}
        </p>
      </div>

      {/* Card 3 - Sisa Budget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 dark:border-purple-500/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-purple-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
          Sisa Budget
        </p>
        <p className={`text-lg font-bold truncate ${
          budgetRemaining >= 0 
            ? 'text-purple-600 dark:text-purple-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {formatRupiah(budgetRemaining)}
        </p>
        {totalBudget > 0 && (
          <div className="mt-2 h-1.5 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsagePercent > 90 ? 'bg-red-500' : budgetUsagePercent > 75 ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Card 4 - Target */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-600/5 border border-blue-500/20 dark:border-blue-500/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
          Target
        </p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {savingsProgress}%
        </p>
        <div className="mt-2 h-1.5 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(savingsProgress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}



