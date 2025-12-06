import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, FileText, Target, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import { MonthlyExpenseChart } from '@/components/finances/MonthlyExpenseChart'
import { YearlyExpenseChart } from '@/components/finances/YearlyExpenseChart'
import type { Expense } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch summary data
  const [notesResult, expensesResult, habitsResult, allExpensesResult] = await Promise.all([
    supabase
      .from('notes')
      .select('id', { count: 'exact', head: true })
      .eq('is_archived', false),
    supabase
      .from('expenses')
      .select('amount, type')
      .gte('transaction_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
    supabase
      .from('habits')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('expenses')
      .select('*')
      .order('transaction_date', { ascending: false }),
  ])

  const notesCount = notesResult.count || 0
  const habitsCount = habitsResult.count || 0
  const allExpenses = (allExpensesResult.data || []) as Expense[]

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Selamat datang kembali, {user.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Berikut ringkasan aktivitas Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Saldo Bulan Ini
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
              Catatan Aktif
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{notesCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total catatan belum diarsipkan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Kebiasaan Aktif
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{habitsCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Kebiasaan yang dilacak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pengeluaran Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatRupiah(monthlyExpense)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total pengeluaran
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold dark:text-white">Ringkasan Keuangan</h2>
        
        {/* Monthly Chart */}
        <MonthlyExpenseChart expenses={allExpenses} />
        
        {/* Yearly Chart */}
        <YearlyExpenseChart expenses={allExpenses} year={new Date().getFullYear()} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/notes"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <h3 className="font-semibold dark:text-white">Buat Catatan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Catat pemikiran Anda</p>
            </a>
            <a
              href="/finances"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <h3 className="font-semibold dark:text-white">Tambah Transaksi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Catat pemasukan atau pengeluaran</p>
            </a>
            <a
              href="/habits"
              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <h3 className="font-semibold dark:text-white">Lacak Kebiasaan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tandai progres hari ini</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
