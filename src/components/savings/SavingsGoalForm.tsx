'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

const ICONS = ['🎯', '🏠', '🚗', '✈️', '💻', '📱', '💍', '🎓', '💰', '🏖️', '🎁', '❤️']
const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6']

export function SavingsGoalForm() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [color, setColor] = useState('#8B5CF6')

  const supabase = createClient()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !targetAmount) return

    setIsLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Silakan login terlebih dahulu')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from('savings_goals' as any).insert({
        user_id: user.id,
        name,
        target_amount: parseFloat(targetAmount),
        current_amount: 0,
        deadline: deadline || null,
        icon,
        color,
        is_completed: false,
      } as any)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
      setOpen(false)
      resetForm()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      console.error('Error creating savings goal:', errorMessage)
      alert(`Gagal membuat target: ${errorMessage || 'Pastikan tabel savings_goals sudah dibuat di Supabase'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setTargetAmount('')
    setDeadline('')
    setIcon('🎯')
    setColor('#8B5CF6')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Target Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Target Tabungan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Nama Target</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Beli iPhone, Dana Darurat"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Target Jumlah (Rp)</label>
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="10000000"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Deadline (Opsional)</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Pilih Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    icon === i ? 'bg-purple-100 dark:bg-purple-900 ring-2 ring-purple-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Pilih Warna</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Buat Target'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
