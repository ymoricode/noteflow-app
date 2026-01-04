'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface HeroBalanceCardProps {
  balance: number
  income: number
  expense: number
}

export function HeroBalanceCard({ balance, income, expense }: HeroBalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800" />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5" />
      
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
      
      {/* Content */}
      <div className="relative p-5 sm:p-6 lg:p-8">
        <p className="text-purple-200 text-sm font-medium mb-1">
          Saldo Bersih
        </p>
        
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
          isPositive ? 'text-white' : 'text-red-300'
        }`}>
          {formatRupiah(balance)}
        </h2>
        
        {/* Income & Expense summary */}
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-purple-200">Masuk</p>
              <p className="text-sm font-semibold text-white">{formatRupiah(income)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-purple-200">Keluar</p>
              <p className="text-sm font-semibold text-white">{formatRupiah(expense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
