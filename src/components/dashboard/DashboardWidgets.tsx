'use client'

import { FinanceCalendar } from '@/components/dashboard/FinanceCalendar'
import { MonthComparison } from '@/components/dashboard/MonthComparison'
import { BillReminder } from '@/components/dashboard/BillReminder'
import type { Expense, Bill } from '@/types'

interface DashboardWidgetsProps {
  expenses: Expense[]
  bills: Bill[]
}

export function DashboardWidgets({ expenses, bills }: DashboardWidgetsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bill Reminders - Full Width at top for urgency */}
      <BillReminder bills={bills} />

      {/* Calendar and Month Comparison Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <FinanceCalendar expenses={expenses} bills={bills} />
        <MonthComparison expenses={expenses} />
      </div>
    </div>
  )
}
