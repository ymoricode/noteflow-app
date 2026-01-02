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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

const CATEGORIES = [
  'Listrik',
  'Air',
  'Internet',
  'Telepon',
  'Streaming',
  'Asuransi',
  'Cicilan',
  'Sewa',
  'Langganan',
  'Lainnya',
]

export function BillForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('1')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [isRecurring, setIsRecurring] = useState(true)
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()
  const queryClient = useQueryClient()

  const resetForm = () => {
    setName('')
    setAmount('')
    setDueDate('1')
    setCategory(CATEGORIES[0])
    setIsRecurring(true)
    setFrequency('monthly')
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !amount) return

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Silakan login terlebih dahulu')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from('bills' as any).insert({
        user_id: user.id,
        name,
        amount: parseFloat(amount),
        due_date: parseInt(dueDate),
        category,
        is_recurring: isRecurring,
        frequency,
        is_paid: false,
        notes: notes || null,
      } as any)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['bills'] })
      setOpen(false)
      resetForm()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      alert(`Gagal membuat tagihan: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tagihan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Tambah Tagihan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-200">Nama Tagihan</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: PLN, Indihome"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-gray-200">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="dark:text-gray-200">Jatuh Tempo (Tanggal)</Label>
              <select
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="dark:text-gray-200">Kategori</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 dark:text-gray-200">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded"
              />
              Berulang
            </label>
            {isRecurring && (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'monthly' | 'yearly')}
                className="px-3 py-1 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-gray-200">Catatan (Opsional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Tagihan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
