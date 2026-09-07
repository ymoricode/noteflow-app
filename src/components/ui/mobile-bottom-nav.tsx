'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Wallet,
  MoreHorizontal,
  X,
  TrendingUp,
  TrendingDown,
  PieChart,
  Receipt,
  PiggyBank,
  FileBarChart,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TransactionForm } from '@/components/finances/TransactionForm'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transaksi', href: '/finances', icon: ArrowLeftRight },
  { name: 'Add', href: '#add', icon: Plus, isCenter: true },
  { name: 'Wallet', href: '/wallets', icon: Wallet },
  { name: 'Lainnya', href: '#more', icon: MoreHorizontal, isMore: true },
]

const moreMenuItems = [
  { name: 'Budget', href: '/budgets', icon: PieChart },
  { name: 'Tagihan', href: '/bills', icon: Receipt },
  { name: 'Target Tabungan', href: '/savings', icon: PiggyBank },
  { name: 'Laporan', href: '/reports', icon: FileBarChart },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense' | null>(null)

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isCenter) {
      e.preventDefault()
      setShowQuickAdd(true)
      setShowMore(false)
    } else if (item.isMore) {
      e.preventDefault()
      setShowMore(true)
      setShowQuickAdd(false)
    }
  }

  const handleQuickAdd = (type: 'income' | 'expense') => {
    setShowQuickAdd(false)
    setQuickAddType(type)
  }

  return (
    <>
      {/* Transaction Form Dialog (controlled by quickAddType) */}
      <TransactionForm
        defaultType={quickAddType || 'expense'}
        open={quickAddType !== null}
        onOpenChange={(open) => {
          if (!open) setQuickAddType(null)
        }}
        trigger={undefined}
      />

      {/* Quick Add Sheet */}
      {showQuickAdd && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
            onClick={() => setShowQuickAdd(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah Transaksi
                </h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 px-6 pb-8">
                <button
                  onClick={() => handleQuickAdd('income')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 hover:border-green-500/40 transition-all active:scale-95"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-green-500" />
                  </div>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Pemasukan
                  </span>
                </button>
                <button
                  onClick={() => handleQuickAdd('expense')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 hover:border-red-500/40 transition-all active:scale-95"
                >
                  <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                    <TrendingDown className="w-7 h-7 text-red-500" />
                  </div>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    Pengeluaran
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* More Menu Sheet */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 pb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu Lainnya
                </h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="px-4 pb-8 space-y-1">
                {moreMenuItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />
        <div
          className="relative flex items-center justify-around px-2 pb-safe-bottom"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.isCenter) {
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(item, e)}
                  className="relative -mt-6 group"
                >
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-transform">
                    <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                </button>
              )
            }

            if (item.isMore) {
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(item, e)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all min-w-[64px]',
                    showMore
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'p-1.5 rounded-xl transition-colors',
                      showMore && 'bg-purple-100 dark:bg-purple-900/30'
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={showMore ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all min-w-[64px]',
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-colors',
                    isActive && 'bg-purple-100 dark:bg-purple-900/30'
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
