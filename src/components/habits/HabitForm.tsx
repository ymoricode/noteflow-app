'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Habit } from '@/types'

interface HabitFormProps {
  habit?: Habit
  onSuccess?: () => void
}

const COLORS = [
  { name: 'Biru', value: '#3b82f6' },
  { name: 'Hijau', value: '#10b981' },
  { name: 'Ungu', value: '#8b5cf6' },
  { name: 'Merah', value: '#ef4444' },
  { name: 'Kuning', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
]

export function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#3b82f6')

  const supabase = createClient()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (habit) {
      setName(habit.name)
      setDescription(habit.description || '')
      setColor(habit.color)
    }
  }, [habit])

  const saveHabit = useMutation({
    mutationFn: async (data: {
      name: string
      description: string
      color: string
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (habit) {
        // Update existing habit
        const { data: result, error } = await supabase
          .from('habits')
          .update(data)
          .eq('id', habit.id)
          .select()

        if (error) throw error
        return result
      } else {
        // Create new habit
        const { data: result, error } = await supabase
          .from('habits')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()

        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      // Reset form
      setName('')
      setDescription('')
      setColor('#3b82f6')
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveHabit.mutate({
      name,
      description,
      color,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {habit ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kebiasaan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru'}</DialogTitle>
          <DialogDescription>
            {habit ? 'Ubah kebiasaan Anda di sini.' : 'Buat kebiasaan baru untuk dilacak setiap hari.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kebiasaan</Label>
            <Input
              id="name"
              placeholder="Contoh: Olahraga pagi, Baca buku..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Tambahkan deskripsi atau target..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    color === c.value ? 'border-gray-900 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={saveHabit.isPending}
              className="flex-1"
            >
              {saveHabit.isPending ? 'Menyimpan...' : habit ? 'Update' : 'Simpan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>

          {saveHabit.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              Error: {(saveHabit.error as Error).message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
