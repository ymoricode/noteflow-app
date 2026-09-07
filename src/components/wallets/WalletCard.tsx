'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Landmark, Smartphone, Banknote, MoreHorizontal } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { WalletForm } from './WalletForm'
import type { Wallet } from '@/types'

interface WalletCardProps {
  wallet: Wallet
  balance: number
}

const WALLET_TYPE_CONFIG: Record<Wallet['type'], { icon: typeof Landmark; label: string }> = {
  bank: { icon: Landmark, label: 'Bank' },
  'e-wallet': { icon: Smartphone, label: 'E-Wallet' },
  cash: { icon: Banknote, label: 'Cash' },
  other: { icon: MoreHorizontal, label: 'Lainnya' },
}

const WALLET_COLORS: Record<string, string> = {
  bank: 'from-blue-500/15 to-blue-600/5 border-blue-500/20',
  'e-wallet': 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20',
  cash: 'from-amber-500/15 to-amber-600/5 border-amber-500/20',
  other: 'from-gray-500/15 to-gray-600/5 border-gray-500/20',
}

const WALLET_ICON_COLORS: Record<string, string> = {
  bank: 'bg-blue-500/20 text-blue-500',
  'e-wallet': 'bg-emerald-500/20 text-emerald-500',
  cash: 'bg-amber-500/20 text-amber-500',
  other: 'bg-gray-500/20 text-gray-500',
}

export function WalletCard({ wallet, balance }: WalletCardProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', wallet.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  const handleDelete = () => {
    if (confirm(`Hapus wallet "${wallet.name}"? Transaksi yang terkait tidak akan dihapus.`)) {
      deleteMutation.mutate()
    }
  }

  const config = WALLET_TYPE_CONFIG[wallet.type]
  const Icon = config.icon
  const colorClass = WALLET_COLORS[wallet.type]
  const iconColorClass = WALLET_ICON_COLORS[wallet.type]

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${colorClass} border`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm dark:text-white">{wallet.name}</h3>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <WalletForm
              wallet={wallet}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Saldo</p>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
            {formatRupiah(balance)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
