'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Budget, Expense } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { BudgetForm } from './BudgetForm'
import { formatRupiah } from '@/lib/utils'

interface BudgetCardProps {
  budget: Budget
  expenses: Expense[]
}

export function BudgetCard({ budget, expenses }: BudgetCardProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const spent = expenses
    .filter((exp) => {
      const expMonth = exp.transaction_date.substring(0, 7)
      const budgetMonth = budget.month.substring(0, 7)
      const match = exp.type === 'expense' && exp.category === budget.category && expMonth === budgetMonth
      return match
    })
    .reduce((acc, exp) => acc + Number(exp.amount), 0)
  
  const percentage = (spent / budget.amount) * 100
  const remaining = budget.amount - spent

  const getColor = () => {
    if (percentage >= 100) return 'red'
    if (percentage >= 90) return 'orange'
    if (percentage >= 70) return 'yellow'
    return 'green'
  }

  const color = getColor()

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })

  const handleDelete = () => {
    if (confirm(`Hapus budget "${budget.category}"?`)) {
      deleteBudget.mutate(budget.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{budget.category}</CardTitle>
          <div className="flex gap-1">
            <BudgetForm budget={budget} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteBudget.isPending}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold">{percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                color === 'green'
                  ? 'bg-green-500'
                  : color === 'yellow'
                  ? 'bg-yellow-500'
                  : color === 'orange'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-600">Budget</p>
            <p className="font-semibold">{formatRupiah(budget.amount)}</p>
          </div>
          <div>
            <p className="text-gray-600">Terpakai</p>
            <p className="font-semibold text-red-600">{formatRupiah(spent)}</p>
          </div>
          <div>
            <p className="text-gray-600">Sisa</p>
            <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatRupiah(remaining)}
            </p>
          </div>
        </div>

        {percentage >= 90 && (
          <div className={`text-xs p-2 rounded ${
            percentage >= 100
              ? 'bg-red-50 text-red-700'
              : 'bg-orange-50 text-orange-700'
          }`}>
            {percentage >= 100
              ? '⚠️ Budget sudah terlampaui!'
              : '⚠️ Budget hampir habis!'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
