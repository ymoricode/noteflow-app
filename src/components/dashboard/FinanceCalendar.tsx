'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar, ArrowDownCircle, ArrowUpCircle, Receipt, X } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { Expense, Bill } from '@/types'

interface FinanceCalendarProps {
  expenses: Expense[]
  bills: Bill[]
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export function FinanceCalendar({ expenses, bills }: FinanceCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  // Navigate months
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(null)
  }

  // Calculate calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Group expenses by day
  const expensesByDay = useMemo(() => {
    const map: Record<number, { income: number; expense: number; transactions: Expense[] }> = {}
    expenses.forEach(exp => {
      const d = new Date(exp.transaction_date)
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate()
        if (!map[day]) map[day] = { income: 0, expense: 0, transactions: [] }
        if (exp.type === 'income') {
          map[day].income += Number(exp.amount)
        } else {
          map[day].expense += Number(exp.amount)
        }
        map[day].transactions.push(exp)
      }
    })
    return map
  }, [expenses, currentMonth, currentYear])

  // Group bills by due date
  const billsByDay = useMemo(() => {
    const map: Record<number, Bill[]> = {}
    bills.forEach(bill => {
      const day = bill.due_date
      if (day >= 1 && day <= daysInMonth) {
        if (!map[day]) map[day] = []
        map[day].push(bill)
      }
    })
    return map
  }, [bills, daysInMonth])

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // Selected date details
  const selectedExpenses = selectedDate ? expensesByDay[selectedDate] : null
  const selectedBills = selectedDate ? billsByDay[selectedDate] : null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Kalender Keuangan
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs text-purple-500 hover:text-purple-600">
            Hari Ini
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold dark:text-white text-sm sm:text-base">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayData = expensesByDay[day]
            const dayBills = billsByDay[day]
            const hasIncome = dayData && dayData.income > 0
            const hasExpense = dayData && dayData.expense > 0
            const hasBill = dayBills && dayBills.length > 0
            const hasOverdueBill = dayBills?.some(b => !b.is_paid && day < today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear())
            const isSelected = selectedDate === day

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all text-xs sm:text-sm ${
                  isToday(day)
                    ? 'bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/30'
                    : isSelected
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200'
                }`}
              >
                <span>{day}</span>
                {/* Indicators */}
                <div className="flex gap-0.5 mt-0.5">
                  {hasIncome && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-green-300' : 'bg-green-500'}`} />
                  )}
                  {hasExpense && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-red-300' : 'bg-red-500'}`} />
                  )}
                  {hasBill && (
                    <span className={`w-1.5 h-1.5 rounded-full ${hasOverdueBill ? 'bg-orange-500 animate-pulse' : isToday(day) ? 'bg-yellow-300' : 'bg-yellow-500'}`} />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Masuk
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Keluar
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Tagihan
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (selectedExpenses || selectedBills) && (
          <div className="mt-3 pt-3 border-t dark:border-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold dark:text-white">
                {selectedDate} {MONTH_NAMES[currentMonth]} {currentYear}
              </h4>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transactions */}
            {selectedExpenses && selectedExpenses.transactions.length > 0 && (
              <div className="space-y-1.5">
                {selectedExpenses.transactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      {t.type === 'income' ? (
                        <ArrowDownCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <ArrowUpCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className="text-xs dark:text-gray-200">{t.category}</span>
                    </div>
                    <span className={`text-xs font-semibold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(Number(t.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bills */}
            {selectedBills && selectedBills.length > 0 && (
              <div className="space-y-1.5">
                {selectedBills.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs dark:text-gray-200">{b.name}</span>
                      {b.is_paid && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 rounded-full">Lunas</span>}
                    </div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {formatRupiah(b.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!selectedExpenses && !selectedBills && (
              <p className="text-xs text-gray-400 text-center py-2">Tidak ada aktivitas</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
