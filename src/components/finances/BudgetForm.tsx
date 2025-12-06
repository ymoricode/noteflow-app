'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { Budget } from '@/types'
import { format } from 'date-fns'

const CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Hiburan',
  'Tagihan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
]

interface BudgetFormProps {
  budget?: Budget
  onSuccess?: () => void
}

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))

  const supabase = createClient()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (budget) {
      setCategory(budget.category)
      setAmount(budget.amount.toString())
      setMonth(budget.month.substring(0, 7))
    }
  }, [budget])

  const saveBudget = useMutation({
    mutationFn: async (data: {
      category: string
      amount: number
      month: string
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const monthDate = `${data.month}-01`

      if (budget) {
        const { data: result, error } = await supabase
          .from('budgets')
          .update({ category: data.category, amount: data.amount, month: monthDate })
          .eq('id', budget.id)
          .select()

        if (error) throw error
        return result
      } else {
        const { data: result, error } = await supabase
          .from('budgets')
          .insert({
            user_id: user.id,
            category: data.category,
            amount: data.amount,
            month: monthDate,
          })
          .select()

        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      setCategory('')
      setAmount('')
      setMonth(format(new Date(), 'yyyy-MM'))
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveBudget.mutate({
      category,
      amount: parseFloat(amount),
      month,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {budget ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Tambah Budget Baru'}</DialogTitle>
          <DialogDescription>
            Set target pengeluaran untuk kategori tertentu
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Target Budget (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Bulan</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={saveBudget.isPending}
              className="flex-1"
            >
              {saveBudget.isPending ? 'Menyimpan...' : budget ? 'Update' : 'Simpan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>

          {saveBudget.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              Error: {(saveBudget.error as Error).message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
