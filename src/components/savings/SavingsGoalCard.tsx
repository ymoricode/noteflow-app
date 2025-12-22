'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatRupiah } from '@/lib/utils'
import { Plus, Minus, Trash2, Check } from 'lucide-react'
import type { SavingsGoal } from '@/types'

interface SavingsGoalCardProps {
  goal: SavingsGoal
}

export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()
  const queryClient = useQueryClient()

  const progress = (goal.current_amount / goal.target_amount) * 100
  const remaining = goal.target_amount - goal.current_amount

  // Calculate monthly savings needed if deadline exists
  const monthlySavings = goal.deadline ? (() => {
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const months = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    return remaining / months
  })() : null

  const handleAddFunds = async (isAdd: boolean) => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsLoading(true)
    try {
      const newAmount = isAdd
        ? goal.current_amount + parseFloat(amount)
        : Math.max(0, goal.current_amount - parseFloat(amount))

      const isCompleted = newAmount >= goal.target_amount

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('savings_goals' as any)
        .update({
          current_amount: newAmount,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', goal.id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
      setShowAddFunds(false)
      setAmount('')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : JSON.stringify(error)
      alert(`Gagal update: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Hapus target ini?')) return

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('savings_goals' as any)
        .delete()
        .eq('id', goal.id)

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['savings_goals'] })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : JSON.stringify(error)
      alert(`Gagal hapus: ${msg}`)
    }
  }

  return (
    <>
      <Card className={`relative overflow-hidden ${goal.is_completed ? 'ring-2 ring-green-500' : ''}`}>
        {goal.is_completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl p-2 rounded-lg"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              {goal.icon}
            </span>
            <div className="flex-1">
              <CardTitle className="text-lg dark:text-white">{goal.name}</CardTitle>
              {goal.deadline && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium dark:text-white">{Math.min(100, progress).toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
          </div>

          {/* Amount Info */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Terkumpul</p>
              <p className="font-bold text-green-600 dark:text-green-400" style={{ color: goal.color }}>
                {formatRupiah(goal.current_amount)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
              <p className="font-bold dark:text-white">
                {formatRupiah(goal.target_amount)}
              </p>
            </div>
          </div>

          {/* Monthly Savings Recommendation */}
          {monthlySavings && !goal.is_completed && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
              <p className="text-xs text-purple-600 dark:text-purple-400">Nabung per bulan</p>
              <p className="font-bold text-purple-700 dark:text-purple-300">
                {formatRupiah(monthlySavings)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowAddFunds(true)}
              disabled={goal.is_completed}
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Dana
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Withdraw Funds Dialog */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Kelola Dana - {goal.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Jumlah (Rp)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100000"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAddFunds(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleAddFunds(false)}
                disabled={isLoading}
              >
                <Minus className="h-4 w-4 mr-1" />
                Tarik
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
