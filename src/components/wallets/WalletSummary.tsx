'use client'

import { Landmark, Smartphone, Banknote, MoreHorizontal, ChevronRight } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'
import type { Wallet } from '@/types'

interface WalletSummaryProps {
  wallets: Wallet[]
  walletBalances: Record<string, number>
}

const WALLET_ICONS: Record<string, typeof Landmark> = {
  bank: Landmark,
  'e-wallet': Smartphone,
  cash: Banknote,
  other: MoreHorizontal,
}

const WALLET_ICON_COLORS: Record<string, string> = {
  bank: 'bg-blue-500/20 text-blue-500',
  'e-wallet': 'bg-emerald-500/20 text-emerald-500',
  cash: 'bg-amber-500/20 text-amber-500',
  other: 'bg-gray-500/20 text-gray-500',
}

export function WalletSummary({ wallets, walletBalances }: WalletSummaryProps) {
  if (wallets.length === 0) return null

  const totalBalance = wallets.reduce(
    (sum, w) => sum + (walletBalances[w.id] || 0),
    0
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold dark:text-white">Wallet</h3>
        <Link
          href="/wallets"
          className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium flex items-center gap-0.5"
        >
          Lihat Semua
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Wallet Cards - Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible">
        {wallets.slice(0, 6).map((wallet) => {
          const Icon = WALLET_ICONS[wallet.type] || MoreHorizontal
          const iconColor = WALLET_ICON_COLORS[wallet.type]
          const balance = walletBalances[wallet.id] || 0

          return (
            <div
              key={wallet.id}
              className="flex-shrink-0 w-[160px] lg:w-auto p-3 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium dark:text-gray-300 truncate">
                  {wallet.name}
                </span>
              </div>
              <p
                className={`text-sm font-bold truncate ${
                  balance >= 0 ? 'dark:text-white' : 'text-red-500'
                }`}
              >
                {formatRupiah(balance)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">Total Saldo Wallet</span>
        <span className={`text-sm font-bold ${totalBalance >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-500'}`}>
          {formatRupiah(totalBalance)}
        </span>
      </div>
    </div>
  )
}
