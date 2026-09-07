'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { WalletForm } from '@/components/wallets/WalletForm'
import { WalletCard } from '@/components/wallets/WalletCard'
import { Landmark } from 'lucide-react'
import type { Wallet, Expense } from '@/types'

export default function WalletsPage() {
  const supabase = createClient()

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data || []) as Wallet[]
    },
  })

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('transaction_date', { ascending: false })

      if (error) throw error
      return (data || []) as Expense[]
    },
  })

  const isLoading = walletsLoading || expensesLoading

  // Compute balance per wallet: initial_balance + income - expense
  const getWalletBalance = (walletId: string, initialBalance: number) => {
    if (!expenses) return initialBalance

    const walletExpenses = expenses.filter((e) => e.wallet_id === walletId)
    const income = walletExpenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0)
    const expense = walletExpenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0)

    return initialBalance + income - expense
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Kelola rekening dan sumber uang Anda
          </p>
        </div>
        <WalletForm />
      </div>

      {/* Wallet Grid */}
      {wallets && wallets.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              balance={getWalletBalance(wallet.id, wallet.initial_balance)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border dark:border-gray-700 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
              <Landmark className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Belum ada wallet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Tambahkan wallet untuk mencatat saldo di setiap rekening atau sumber uang Anda.
            </p>
            <WalletForm />
          </div>
        </div>
      )}
    </div>
  )
}
