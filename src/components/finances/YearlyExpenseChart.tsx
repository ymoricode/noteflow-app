'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Expense } from '@/types'
import { formatRupiah } from '@/lib/utils'

interface YearlyExpenseChartProps {
  expenses: Expense[]
  year: number
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
]

export function YearlyExpenseChart({ expenses, year }: YearlyExpenseChartProps) {
  const chartData = useMemo(() => {
    // Initialize data for all 12 months
    const monthlyData = MONTHS.map((month, index) => ({
      month,
      monthNumber: index + 1,
      expense: 0,
      income: 0,
      net: 0,
    }))

    // Filter expenses for the selected year and aggregate by month
    expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.transaction_date)
        return expenseDate.getFullYear() === year
      })
      .forEach((expense) => {
        const expenseDate = new Date(expense.transaction_date)
        const monthIndex = expenseDate.getMonth()
        const amount = Number(expense.amount)

        if (expense.type === 'expense') {
          monthlyData[monthIndex].expense += amount
        } else if (expense.type === 'income') {
          monthlyData[monthIndex].income += amount
        }
      })

    // Calculate net for each month
    monthlyData.forEach((data) => {
      data.net = data.income - data.expense
    })

    return monthlyData
  }, [expenses, year])

  const totalExpense = chartData.reduce((sum, data) => sum + data.expense, 0)
  const totalIncome = chartData.reduce((sum, data) => sum + data.income, 0)
  const totalNet = totalIncome - totalExpense

  return (
    <div className="space-y-4">
      {/* Summary Cards - Mobile Optimized */}
      <div className="space-y-3">
        {/* Saldo Bersih - Full Width Hero Card */}
        <div className={`relative overflow-hidden p-5 rounded-2xl ${
          totalNet >= 0 
            ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700' 
            : 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600'
        }`}>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative">
            <p className="text-sm font-medium text-white/80 mb-1">Saldo Bersih</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {formatRupiah(totalNet)}
            </p>
            <div className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              totalNet >= 0 
                ? 'bg-green-400/20 text-green-100' 
                : 'bg-red-400/20 text-red-100'
            }`}>
              {totalNet >= 0 ? '📈 Surplus' : '📉 Defisit'}
            </div>
          </div>
        </div>

        {/* Pemasukan & Pengeluaran - 2 Column Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Pengeluaran */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-red-500 text-sm">📉</span>
              </div>
            </div>
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
              Total Pengeluaran
            </p>
            <p className="text-lg sm:text-xl font-bold text-red-700 dark:text-red-300 truncate">
              {formatRupiah(totalExpense)}
            </p>
          </div>

          {/* Total Pemasukan */}
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-sm">📈</span>
              </div>
            </div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
              Total Pemasukan
            </p>
            <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 truncate">
              {formatRupiah(totalIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Rincian Bulanan - {year}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
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
            <Legend />
            <Bar 
              dataKey="expense" 
              fill="#ef4444" 
              name="Pengeluaran"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="income" 
              fill="#10b981" 
              name="Pemasukan"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Details Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Detail Bulanan</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-2 px-4 dark:text-gray-300">Bulan</th>
              <th className="text-right py-2 px-4 dark:text-gray-300">Pemasukan</th>
              <th className="text-right py-2 px-4 dark:text-gray-300">Pengeluaran</th>
              <th className="text-right py-2 px-4 dark:text-gray-300">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((data) => (
              <tr key={data.month} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-4 font-medium dark:text-gray-200">{data.month}</td>
                <td className="text-right py-2 px-4 text-green-600 dark:text-green-400">
                  {formatRupiah(data.income)}
                </td>
                <td className="text-right py-2 px-4 text-red-600 dark:text-red-400">
                  {formatRupiah(data.expense)}
                </td>
                <td className={`text-right py-2 px-4 font-semibold ${data.net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {formatRupiah(data.net)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold bg-gray-50 dark:bg-gray-700/50">
              <td className="py-2 px-4 dark:text-gray-200">Total</td>
              <td className="text-right py-2 px-4 text-green-600 dark:text-green-400">
                {formatRupiah(totalIncome)}
              </td>
              <td className="text-right py-2 px-4 text-red-600 dark:text-red-400">
                {formatRupiah(totalExpense)}
              </td>
              <td className={`text-right py-2 px-4 ${totalNet >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {formatRupiah(totalNet)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
