'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { BillForm } from '@/components/bills/BillForm'
import { BillCard } from '@/components/bills/BillCard'
import { formatRupiah } from '@/lib/utils'
import { Bill } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function BillsPage() {
  const supabase = createClient()

  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('bills' as any)
        .select('*')
        .order('due_date', { ascending: true })

      if (error) throw error
      return (data || []) as Bill[]
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  const today = new Date().getDate()
  const unpaidBills = bills?.filter(b => !b.is_paid) || []
  const paidBills = bills?.filter(b => b.is_paid) || []
  const overdueBills = unpaidBills.filter(b => b.due_date < today)
  const upcomingBills = unpaidBills.filter(b => b.due_date >= today)

  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalPaid = paidBills.reduce((sum, b) => sum + Number(b.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Tagihan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Kelola tagihan dan langganan bulanan Anda</p>
        </div>
        <BillForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Total Tagihan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold dark:text-white">{bills?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Belum Bayar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatRupiah(totalUnpaid)}
            </div>
            <p className="text-xs text-gray-500">{unpaidBills.length} tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Sudah Bayar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatRupiah(totalPaid)}
            </div>
            <p className="text-xs text-gray-500">{paidBills.length} tagihan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Terlambat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {overdueBills.length}
            </div>
            <p className="text-xs text-gray-500">tagihan</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Bills */}
      {overdueBills.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Tagihan Terlambat
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">Tagihan Mendatang</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Sudah Dibayar Bulan Ini
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paidBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bills?.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold dark:text-white mb-2">Belum Ada Tagihan</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Tambahkan tagihan pertama Anda untuk melacak pembayaran bulanan
          </p>
        </div>
      )}
    </div>
  )
}
