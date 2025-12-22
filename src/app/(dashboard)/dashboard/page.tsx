import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { MonthlyExpenseChart } from '@/components/finances/MonthlyExpenseChart'
import { YearlyExpenseChart } from '@/components/finances/YearlyExpenseChart'
import { CategoryPieChart } from '@/components/finances/CategoryPieChart'
import type { Expense, Budget } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current month in YYYY-MM-01 format
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`

  // Fetch summary data (finance only)
  const [expensesResult, allExpensesResult, budgetsResult] = await Promise.all([
    supabase
      .from('expenses')
      .select('amount, type, category')
      .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    supabase
      .from('expenses')
      .select('*')
      .order('transaction_date', { ascending: false }),
    supabase
      .from('budgets')
      .select('*')
      .eq('month', currentMonth),
  ])

  const allExpenses = (allExpensesResult.data || []) as Expense[]
  const budgets = (budgetsResult.data || []) as Budget[]

  // Calculate monthly expense
  const monthlyExpense = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      return acc + Number(curr.amount)
    }
    return acc
  }, 0) || 0

  const monthlyIncome = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'income') {
      return acc + Number(curr.amount)
    }
    return acc
  }, 0) || 0

  const balance = monthlyIncome - monthlyExpense

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount), 0)
  const budgetRemaining = totalBudget - monthlyExpense

  // Get top spending categories
  const categorySpending = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount)
    }
    return acc
  }, {} as Record<string, number>) || {}

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header - Responsive */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Selamat datang, {user.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          Ringkasan keuangan bulan ini
        </p>
      </div>

      {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Saldo
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-lg sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatRupiah(balance)}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
              Masuk: {formatRupiah(monthlyIncome)} | Keluar: {formatRupiah(monthlyExpense)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Pemasukan
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {formatRupiah(monthlyIncome)}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Pengeluaran
            </CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
              {formatRupiah(monthlyExpense)}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Budget
            </CardTitle>
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-lg sm:text-2xl font-bold ${budgetRemaining >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatRupiah(budgetRemaining)}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
              Sisa dari {formatRupiah(totalBudget)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Spending Categories Widget */}
      {topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">🏷️ Top 3 Pengeluaran Terbesar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 
                      'text-orange-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-medium dark:text-white capitalize">{category}</span>
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {formatRupiah(amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold dark:text-white">Ringkasan Keuangan</h2>
        
        {/* Pie Chart and Monthly Chart Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Pie Chart */}
          <CategoryPieChart data={categorySpending} title="📊 Pengeluaran per Kategori" />
          
          {/* Monthly Chart */}
          <MonthlyExpenseChart expenses={allExpenses} />
        </div>
        
        {/* Yearly Chart */}
        <YearlyExpenseChart expenses={allExpenses} year={new Date().getFullYear()} />
      </div>


    </div>
  )
}
