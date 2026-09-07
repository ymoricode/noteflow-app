import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { MonthlyExpenseChart } from '@/components/finances/MonthlyExpenseChart'
import { CategoryPieChart } from '@/components/finances/CategoryPieChart'
import { MobileHeader } from '@/components/ui/mobile-header'
import { HeroBalanceCard } from '@/components/ui/hero-balance-card'
import { QuickStats } from '@/components/ui/quick-stats'
import { WalletSummary } from '@/components/wallets/WalletSummary'
import { RecentTransactions } from '@/components/finances/RecentTransactions'
import type { Expense, Budget, Bill, Wallet as WalletType } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`

  const now = new Date()
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const prevMonthStartStr = prevMonthStart.toISOString().split('T')[0]
  const prevMonthEndStr = prevMonthEnd.toISOString().split('T')[0]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [expensesResult, prevMonthResult, allExpensesResult, budgetsResult, savingsResult, walletsResult] = await Promise.all([
    supabase
      .from('expenses')
      .select('amount, type, category')
      .gte('transaction_date', new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]),
    supabase
      .from('expenses')
      .select('amount, type')
      .gte('transaction_date', prevMonthStartStr)
      .lte('transaction_date', prevMonthEndStr),
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
    supabase
      .from('wallets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
  ])

  const allExpenses = (allExpensesResult.data || []) as Expense[]
  const budgets = (budgetsResult.data || []) as Budget[]
  const wallets = (walletsResult.data || []) as WalletType[]

  // Calculate monthly totals
  const monthlyExpense = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'expense') return acc + Number(curr.amount)
    return acc
  }, 0) || 0

  const monthlyIncome = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'income') return acc + Number(curr.amount)
    return acc
  }, 0) || 0

  const balance = monthlyIncome - monthlyExpense

  // Previous month for percentage change
  const prevMonthIncome = (prevMonthResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'income') return acc + Number(curr.amount)
    return acc
  }, 0) || 0

  const prevMonthExpense = (prevMonthResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'expense') return acc + Number(curr.amount)
    return acc
  }, 0) || 0

  const incomeChange = prevMonthIncome > 0
    ? ((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100
    : (monthlyIncome > 0 ? 100 : 0)
  const expenseChange = prevMonthExpense > 0
    ? ((monthlyExpense - prevMonthExpense) / prevMonthExpense) * 100
    : (monthlyExpense > 0 ? 100 : 0)

  // Budget
  const totalBudget = budgets.reduce((acc, b) => acc + Number(b.amount), 0)
  const budgetRemaining = totalBudget - monthlyExpense

  // Savings
  const savingsGoals = savingsResult.data || []
  const totalSavingsTarget = savingsGoals.reduce((acc: number, g: { target_amount: number }) => acc + Number(g.target_amount), 0)
  const totalSavingsCollected = savingsGoals.reduce((acc: number, g: { current_amount: number }) => acc + Number(g.current_amount), 0)
  const savingsProgress = totalSavingsTarget > 0 ? Math.round((totalSavingsCollected / totalSavingsTarget) * 100) : 0

  // Category spending
  const categorySpending = (expensesResult.data as Expense[] | null)?.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount)
    }
    return acc
  }, {} as Record<string, number>) || {}

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Wallet balances (computed)
  const walletBalances: Record<string, number> = {}
  wallets.forEach((w) => {
    const walletTxns = allExpenses.filter((e) => e.wallet_id === w.id)
    const income = walletTxns
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0)
    const expense = walletTxns
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0)
    walletBalances[w.id] = w.initial_balance + income - expense
  })

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Greeting */}
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
          incomeChange={incomeChange}
          expenseChange={expenseChange}
        />
      </div>

      {/* Desktop Stats Grid */}
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
              Bulan ini
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
            <div className="flex items-center gap-1.5 mt-1">
              {incomeChange !== 0 ? (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  incomeChange > 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {incomeChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(incomeChange).toFixed(1)}%
                </span>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">vs bulan lalu</span>
            </div>
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
            <div className="flex items-center gap-1.5 mt-1">
              {expenseChange !== 0 ? (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  expenseChange > 0
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {expenseChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(expenseChange).toFixed(1)}%
                </span>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">vs bulan lalu</span>
            </div>
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

      {/* Wallet Summary */}
      <WalletSummary wallets={wallets} walletBalances={walletBalances} />

      {/* Top 3 Spending + Charts Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Spending Categories */}
        {topCategories.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base dark:text-white flex items-center gap-2">
                Top Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium dark:text-white capitalize text-sm">{category}</span>
                    </div>
                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                      {formatRupiah(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Pie Chart */}
        <CategoryPieChart data={categorySpending} title="Pengeluaran per Kategori" />
      </div>

      {/* Monthly Chart */}
      <MonthlyExpenseChart expenses={allExpenses} />

      {/* Recent Transactions */}
      <RecentTransactions expenses={allExpenses} wallets={wallets} />
    </div>
  )
}
