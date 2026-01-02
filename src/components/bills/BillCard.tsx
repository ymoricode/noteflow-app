'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Bill } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { Trash2, Check, Calendar, RefreshCw } from 'lucide-react'

interface BillCardProps {
  bill: Bill
}

export function BillCard({ bill }: BillCardProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const today = new Date()
  const currentDay = today.getDate()
  const daysUntilDue = bill.due_date - currentDay
  
  const isOverdue = daysUntilDue < 0 && !bill.is_paid
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3 && !bill.is_paid

  const markAsPaid = useMutation({
    mutationFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('bills' as any)
        .update({
          is_paid: true,
          last_paid_date: new Date().toISOString(),
        } as any)
        .eq('id', bill.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : JSON.stringify(error)
      alert(`Gagal update: ${msg}`)
    },
  })

  const resetPaid = useMutation({
    mutationFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('bills' as any)
        .update({
          is_paid: false,
        } as any)
        .eq('id', bill.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
  })

  const deleteBill = useMutation({
    mutationFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('bills' as any)
        .delete()
        .eq('id', bill.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : JSON.stringify(error)
      alert(`Gagal hapus: ${msg}`)
    },
  })

  const handleDelete = () => {
    if (confirm(`Hapus tagihan "${bill.name}"?`)) {
      deleteBill.mutate()
    }
  }

  return (
    <Card className={`relative overflow-hidden ${
      bill.is_paid 
        ? 'border-green-500/50 bg-green-50/50 dark:bg-green-900/10' 
        : isOverdue 
        ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
        : isDueSoon
        ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
        : ''
    }`}>
      {/* Status Badge */}
      {bill.is_paid && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs rounded-bl-lg">
          ✓ Lunas
        </div>
      )}
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs rounded-bl-lg">
          Terlambat
        </div>
      )}
      {isDueSoon && !bill.is_paid && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-xs rounded-bl-lg">
          Segera
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg dark:text-white">{bill.name}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {formatRupiah(bill.amount)}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Jatuh tempo: Tanggal {bill.due_date}</span>
          </div>
          {bill.is_recurring && (
            <div className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>{bill.frequency === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
            </div>
          )}
        </div>

        {bill.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{bill.notes}</p>
        )}

        <div className="flex gap-2 pt-2">
          {!bill.is_paid ? (
            <Button
              onClick={() => markAsPaid.mutate()}
              disabled={markAsPaid.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Tandai Lunas
            </Button>
          ) : (
            <Button
              onClick={() => resetPaid.mutate()}
              disabled={resetPaid.isPending}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
