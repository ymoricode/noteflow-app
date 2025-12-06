'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Expense } from '@/types'
import { format, subDays, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'
import { formatRupiah } from '@/lib/utils'

interface DailyExpenseChartProps {
  expenses: Expense[]
}

export function DailyExpenseChart({ expenses }: DailyExpenseChartProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i))
      return {
        date: format(date, 'EEE, d MMM', { locale: id }),
        fullDate: format(date, 'yyyy-MM-dd'),
        expense: 0,
        income: 0,
      }
    })

    expenses.forEach((expense) => {
      const expenseDate = format(new Date(expense.transaction_date), 'yyyy-MM-dd')
      const dayData = last7Days.find((day) => day.fullDate === expenseDate)
      
      if (dayData) {
        const amount = Number(expense.amount)
        if (expense.type === 'expense') {
          dayData.expense += amount
        } else {
          dayData.income += amount
        }
      }
    })

    return last7Days
  }, [expenses])

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">7 Hari Terakhir</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => formatRupiah(value)} />
          <Tooltip 
            formatter={(value: number) => formatRupiah(value)}
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
          />
          <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" radius={[8, 8, 0, 0]} />
          <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
