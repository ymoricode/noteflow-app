'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Expense } from '@/types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { id } from 'date-fns/locale'
import { formatRupiah } from '@/lib/utils'

interface MonthlyExpenseChartProps {
  expenses: Expense[]
}

export function MonthlyExpenseChart({ expenses }: MonthlyExpenseChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const dailyData = daysInMonth.map((date) => ({
      date: format(date, 'd MMM', { locale: id }),
      fullDate: format(date, 'yyyy-MM-dd'),
      cumulative: 0,
    }))

    // Calculate cumulative expenses
    let cumulativeExpense = 0
    dailyData.forEach((day) => {
      const dayExpenses = expenses.filter(
        (expense) =>
          expense.type === 'expense' &&
          format(new Date(expense.transaction_date), 'yyyy-MM-dd') === day.fullDate
      )

      const dayTotal = dayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
      cumulativeExpense += dayTotal
      day.cumulative = cumulativeExpense
    })

    return dailyData
  }, [expenses])

  const totalExpense = chartData[chartData.length - 1]?.cumulative || 0

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Bulan Ini (Kumulatif)</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatRupiah(totalExpense)}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            interval={Math.floor(chartData.length / 6)}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9ca3af' }} 
            tickFormatter={(value) => formatRupiah(value)}
          />
          <Tooltip 
            formatter={(value: number) => formatRupiah(value)}
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Pengeluaran Kumulatif"
            dot={{ fill: '#ef4444', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
