import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { MonthlyExpenseChart } from '@/components/finances/MonthlyExpenseChart'
import { YearlyExpenseChart } from '@/components/finances/YearlyExpenseChart'
import { CategoryPieChart } from '@/components/finances/CategoryPieChart'
import { MobileHeader } from '@/components/ui/mobile-header'
import { HeroBalanceCard } from '@/components/ui/hero-balance-card'
import { QuickStats } from '@/components/ui/quick-stats'
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
  const [expensesResult, allExpensesResult, budgetsResult, savingsResult] = await Promise.all([
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
    supabase
      .from('savings_goals')
      .select('*'),
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

  // Calculate savings progress
  const savingsGoals = savingsResult.data || []
  const totalSavingsTarget = savingsGoals.reduce((acc: number, g: { target_amount: number }) => acc + Number(g.target_amount), 0)
  const totalSavingsCollected = savingsGoals.reduce((acc: number, g: { current_amount: number }) => acc + Number(g.current_amount), 0)
  const savingsProgress = totalSavingsTarget > 0 ? Math.round((totalSavingsCollected / totalSavingsTarget) * 100) : 0

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
    <div className="space-y-5 lg:space-y-8">
      {/* Mobile Header with Greeting */}
      <MobileHeader 
        showGreeting={true} 
        subtitle="Ringkasan keuangan bulan ini" 
      />

      {/* Hero Balance Card - Mobile */}
      <div className="lg:hidden">
        <HeroBalanceCard 
          balance={balance}
          income={monthlyIncome}
          expense={monthlyExpense}
        />
      </div>

      {/* Quick Stats - 2x2 Grid on Mobile */}
      <div className="lg:hidden">
        <QuickStats
          income={monthlyIncome}
          expense={monthlyExpense}
          budgetRemaining={budgetRemaining}
          totalBudget={totalBudget}
          savingsProgress={savingsProgress}
        />
      </div>

      {/* Desktop Stats Grid - Hidden on Mobile */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Saldo
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatRupiah(balance)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Masuk: {formatRupiah(monthlyIncome)} | Keluar: {formatRupiah(monthlyExpense)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pemasukan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatRupiah(monthlyIncome)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pengeluaran
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatRupiah(monthlyExpense)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Budget
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatRupiah(budgetRemaining)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sisa dari {formatRupiah(totalBudget)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Spending Categories Widget */}
      {topCategories.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg dark:text-white flex items-center gap-2">
              🏷️ Top 3 Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 
                      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium dark:text-white capitalize text-sm sm:text-base">{category}</span>
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-semibold text-sm sm:text-base">
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
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white">
          📊 Ringkasan Keuangan
        </h2>
        
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

