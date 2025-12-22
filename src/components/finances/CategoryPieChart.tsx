'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRupiah } from '@/lib/utils'

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6']

interface CategoryPieChartProps {
  data: Record<string, number>
  title?: string
}

export function CategoryPieChart({ data, title = "Pengeluaran per Kategori" }: CategoryPieChartProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Belum ada data pengeluaran bulan ini
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2 p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Pie Chart */}
          <div className="h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatRupiah(value), 'Jumlah']}
                  labelStyle={{ color: 'white', fontWeight: 'bold' }}
                  itemStyle={{ color: 'white' }}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                  }}
                  wrapperStyle={{ zIndex: 100 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend List */}
          <div className="flex-1 w-full space-y-2 sm:space-y-3">
            {chartData.map((item, index) => {
              const percent = ((item.value / total) * 100).toFixed(1)
              return (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {formatRupiah(item.value)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({percent}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Pengeluaran</span>
          <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">{formatRupiah(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
