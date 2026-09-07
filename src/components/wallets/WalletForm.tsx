'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Pencil } from 'lucide-react'
import type { Wallet } from '@/types'

const WALLET_TYPES = [
  { value: 'bank', label: 'Bank' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Lainnya' },
] as const

interface WalletFormProps {
  wallet?: Wallet
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function WalletForm({ wallet, onSuccess, trigger }: WalletFormProps) {
  const isEdit = !!wallet
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(wallet?.name || '')
  const [type, setType] = useState<Wallet['type']>(wallet?.type || 'bank')
  const [initialBalance, setInitialBalance] = useState(
    wallet ? String(wallet.initial_balance) : ''
  )

  const supabase = createClient()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string
      type: Wallet['type']
      initial_balance: number
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (isEdit) {
        const { data: result, error } = await supabase
          .from('wallets')
          .update({
            name: data.name,
            type: data.type,
            initial_balance: data.initial_balance,
          })
          .eq('id', wallet.id)
          .select()

        if (error) throw error
        return result
      } else {
        const { data: result, error } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            name: data.name,
            type: data.type,
            initial_balance: data.initial_balance,
          })
          .select()

        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      if (!isEdit) {
        setName('')
        setType('bank')
        setInitialBalance('')
      }
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name,
      type,
      initial_balance: parseInt(initialBalance) || 0,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && isEdit) {
      setName(wallet.name)
      setType(wallet.type)
      setInitialBalance(String(wallet.initial_balance))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Wallet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Wallet' : 'Tambah Wallet Baru'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui informasi wallet Anda.'
              : 'Tambahkan wallet atau rekening untuk mencatat saldo Anda.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Nama Wallet</Label>
            <Input
              id="wallet-name"
              placeholder="Contoh: BCA, GoPay, Cash"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="wallet-type">Tipe</Label>
            <select
              id="wallet-type"
              value={type}
              onChange={(e) => setType(e.target.value as Wallet['type'])}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {WALLET_TYPES.map((wt) => (
                <option key={wt.value} value={wt.value}>
                  {wt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <Label htmlFor="wallet-balance">
              {isEdit ? 'Saldo Awal' : 'Saldo Awal (Rp)'}
            </Label>
            <Input
              id="wallet-balance"
              type="number"
              placeholder="0"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              min="0"
              step="1000"
            />
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Masukkan saldo saat ini di wallet ini. Bisa diubah nanti.
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending
                ? 'Menyimpan...'
                : isEdit
                ? 'Simpan Perubahan'
                : 'Tambah Wallet'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>

          {mutation.isError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
              Error: {(mutation.error as Error).message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
