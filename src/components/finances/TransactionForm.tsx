'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import type { Expense, Wallet } from '@/types'

const CATEGORIES_EXPENSE = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Kesehatan',
  'Hiburan',
  'Pendidikan',
  'Lainnya',
]

const CATEGORIES_INCOME = [
  'Gaji',
  'Bonus',
  'Investasi',
  'Freelance',
  'Bisnis',
  'Lainnya',
]

interface TransactionFormProps {
  expense?: Expense
  defaultType?: 'income' | 'expense'
  onSuccess?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TransactionForm({
  expense,
  defaultType,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TransactionFormProps) {
  const isEdit = !!expense
  const isControlled = controlledOpen !== undefined

  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen

  const [type, setType] = useState<'expense' | 'income'>(
    expense?.type || defaultType || 'expense'
  )
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '')
  const [category, setCategory] = useState(expense?.category || '')
  const [walletId, setWalletId] = useState<string>(expense?.wallet_id || '')
  const [note, setNote] = useState(expense?.note || '')
  const [date, setDate] = useState(
    expense?.transaction_date || new Date().toISOString().split('T')[0]
  )

  const supabase = createClient()
  const queryClient = useQueryClient()

  // Fetch wallets for the selector
  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return (data || []) as Wallet[]
    },
  })

  // Reset form when opening in edit mode
  useEffect(() => {
    if (open && isEdit && expense) {
      setType(expense.type)
      setAmount(String(expense.amount))
      setCategory(expense.category)
      setWalletId(expense.wallet_id || '')
      setNote(expense.note || '')
      setDate(expense.transaction_date)
    }
    if (open && !isEdit) {
      setType(defaultType || 'expense')
      setAmount('')
      setCategory('')
      setWalletId('')
      setNote('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [open, isEdit, expense, defaultType])

  const mutation = useMutation({
    mutationFn: async (data: {
      amount: number
      type: 'expense' | 'income'
      category: string
      note: string
      transaction_date: string
      wallet_id: string | null
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (isEdit && expense) {
        const { data: result, error } = await supabase
          .from('expenses')
          .update({
            amount: data.amount,
            type: data.type,
            category: data.category,
            note: data.note || null,
            transaction_date: data.transaction_date,
            wallet_id: data.wallet_id,
          })
          .eq('id', expense.id)
          .select()

        if (error) throw error
        return result
      } else {
        const { data: result, error } = await supabase
          .from('expenses')
          .insert({
            user_id: user.id,
            amount: data.amount,
            type: data.type,
            category: data.category,
            note: data.note || null,
            transaction_date: data.transaction_date,
            wallet_id: data.wallet_id,
          })
          .select()

        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      amount: parseFloat(amount),
      type,
      category,
      note,
      transaction_date: date,
      wallet_id: walletId || null,
    })
  }

  const categories = type === 'expense' ? CATEGORIES_EXPENSE : CATEGORIES_INCOME

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui detail transaksi Anda.'
              : 'Catat pemasukan atau pengeluaran Anda.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Tipe Transaksi</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                onClick={() => {
                  setType('expense')
                  setCategory('')
                }}
                className={
                  type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''
                }
              >
                Pengeluaran
              </Button>
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                onClick={() => {
                  setType('income')
                  setCategory('')
                }}
                className={
                  type === 'income' ? 'bg-green-600 hover:bg-green-700' : ''
                }
              >
                Pemasukan
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="tx-amount">Jumlah (Rp)</Label>
            <Input
              id="tx-amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="1000"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="tx-category">Kategori</Label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Pilih kategori...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Wallet */}
          <div className="space-y-2">
            <Label htmlFor="tx-wallet">Wallet</Label>
            <select
              id="tx-wallet"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Tanpa wallet</option>
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.type === 'e-wallet' ? 'E-Wallet' : w.type === 'bank' ? 'Bank' : w.type === 'cash' ? 'Cash' : 'Lainnya'})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="tx-date">Tanggal</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="tx-note">Catatan (Opsional)</Label>
            <Textarea
              id="tx-note"
              placeholder="Tambahkan catatan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
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
                : 'Simpan'}
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
