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
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{formatRupiah(totalExpense)}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatRupiah(totalIncome)}</p>
        </div>
        <div className={`${totalNet >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'} p-4 rounded-lg border`}>
          <p className={`text-sm font-medium ${totalNet >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
            Saldo Bersih
          </p>
          <p className={`text-2xl font-bold ${totalNet >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
            {formatRupiah(totalNet)}
          </p>
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
