'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { Expense } from '@/types'

interface MonthComparisonProps {
  expenses: Expense[]
}

export function MonthComparison({ expenses }: MonthComparisonProps) {
  const comparison = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    
    // Prev month
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear

    let thisIncome = 0, thisExpense = 0
    let prevIncome = 0, prevExpense = 0

    expenses.forEach(exp => {
      const d = new Date(exp.transaction_date)
      const m = d.getMonth()
      const y = d.getFullYear()
      const amount = Number(exp.amount)

      if (m === thisMonth && y === thisYear) {
        if (exp.type === 'income') thisIncome += amount
        else thisExpense += amount
      } else if (m === prevMonth && y === prevYear) {
        if (exp.type === 'income') prevIncome += amount
        else prevExpense += amount
      }
    })

    const incomeChange = prevIncome > 0 ? ((thisIncome - prevIncome) / prevIncome) * 100 : (thisIncome > 0 ? 100 : 0)
    const expenseChange = prevExpense > 0 ? ((thisExpense - prevExpense) / prevExpense) * 100 : (thisExpense > 0 ? 100 : 0)
    const balanceThis = thisIncome - thisExpense
    const balancePrev = prevIncome - prevExpense

    return {
      thisIncome, thisExpense, prevIncome, prevExpense,
      incomeChange, expenseChange,
      balanceThis, balancePrev,
    }
  }, [expenses])

  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
  ]

  const now = new Date()
  const thisMonthName = MONTH_NAMES[now.getMonth()]
  const prevMonthIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const prevMonthName = MONTH_NAMES[prevMonthIdx]

  const ChangeIndicator = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
    // For expenses, an increase is bad (red) and decrease is good (green)
    // For income, an increase is good (green) and decrease is bad (red)
    const isPositive = value > 0
    const isGood = inverted ? !isPositive : isPositive
    
    if (Math.abs(value) < 0.5) {
      return (
        <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
          <Minus className="h-3 w-3" />
          0%
        </span>
      )
    }

    return (
      <span className={`flex items-center gap-0.5 text-xs font-medium ${isGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {Math.abs(value).toFixed(1)}%
      </span>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg dark:text-white flex items-center gap-2">
          📊 Perbandingan {prevMonthName} vs {thisMonthName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Income Comparison */}
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Pemasukan</span>
            </div>
            <ChangeIndicator value={comparison.incomeChange} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{prevMonthName}</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{formatRupiah(comparison.prevIncome)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{thisMonthName}</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatRupiah(comparison.thisIncome)}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2 h-1.5 bg-green-200 dark:bg-green-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, comparison.prevIncome > 0 ? (comparison.thisIncome / comparison.prevIncome) * 100 : 100)}%` }}
            />
          </div>
        </div>

        {/* Expense Comparison */}
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Pengeluaran</span>
            </div>
            <ChangeIndicator value={comparison.expenseChange} inverted />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{prevMonthName}</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{formatRupiah(comparison.prevExpense)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{thisMonthName}</p>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">{formatRupiah(comparison.thisExpense)}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2 h-1.5 bg-red-200 dark:bg-red-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, comparison.prevExpense > 0 ? (comparison.thisExpense / comparison.prevExpense) * 100 : 100)}%` }}
            />
          </div>
        </div>

        {/* Balance Comparison */}
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Saldo</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{prevMonthName}</p>
              <p className={`text-sm font-bold ${comparison.balancePrev >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(comparison.balancePrev)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{thisMonthName}</p>
              <p className={`text-sm font-bold ${comparison.balanceThis >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatRupiah(comparison.balanceThis)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
