'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, BellOff, AlertTriangle, Clock, CheckCircle2, X } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { Bill } from '@/types'

interface BillReminderProps {
  bills: Bill[]
}

interface ReminderItem {
  bill: Bill
  status: 'overdue' | 'due_today' | 'upcoming'
  daysUntil: number
}

export function BillReminder({ bills }: BillReminderProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default')

  const today = new Date()
  const currentDay = today.getDate()

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
      setNotificationsEnabled(Notification.permission === 'granted')
    } else {
      setNotificationPermission('unsupported')
    }
  }, [])

  // Build reminders list
  const reminders: ReminderItem[] = bills
    .filter(bill => !bill.is_paid)
    .map(bill => {
      const daysUntil = bill.due_date - currentDay
      let status: ReminderItem['status']
      
      if (daysUntil < 0) {
        status = 'overdue'
      } else if (daysUntil === 0) {
        status = 'due_today'
      } else {
        status = 'upcoming'
      }

      return { bill, status, daysUntil }
    })
    .filter(r => r.status === 'overdue' || r.status === 'due_today' || r.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  const activeReminders = reminders.filter(r => !dismissed.includes(r.bill.id))

  // Request notification permission
  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      setNotificationsEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        sendTestNotification()
      }
    }
  }

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 My Finance - Notifikasi Aktif', {
        body: 'Kamu akan menerima reminder tagihan yang akan jatuh tempo.',
        icon: '/favicon.ico',
      })
    }
  }

  // Send browser notifications for urgent bills
  const sendBillNotification = useCallback((reminder: ReminderItem) => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return

    let title = ''
    let body = ''

    if (reminder.status === 'overdue') {
      title = `⚠️ Tagihan Terlambat: ${reminder.bill.name}`
      body = `Sudah terlambat ${Math.abs(reminder.daysUntil)} hari. Jumlah: ${formatRupiah(reminder.bill.amount)}`
    } else if (reminder.status === 'due_today') {
      title = `🔴 Tagihan Hari Ini: ${reminder.bill.name}`
      body = `Jatuh tempo hari ini! Jumlah: ${formatRupiah(reminder.bill.amount)}`
    } else {
      title = `🔔 Tagihan Mendatang: ${reminder.bill.name}`
      body = `Jatuh tempo dalam ${reminder.daysUntil} hari. Jumlah: ${formatRupiah(reminder.bill.amount)}`
    }

    new Notification(title, { body, icon: '/favicon.ico' })
  }, [])

  // Auto-send notifications on mount for urgent items
  useEffect(() => {
    if (!notificationsEnabled) return

    const notifiedKey = `bill_notified_${today.toISOString().split('T')[0]}`
    const alreadyNotified = localStorage.getItem(notifiedKey)
    
    if (!alreadyNotified) {
      const urgentReminders = reminders.filter(r => r.status === 'overdue' || r.status === 'due_today' || r.daysUntil <= 3)
      
      urgentReminders.forEach((r, i) => {
        setTimeout(() => sendBillNotification(r), i * 1500)
      })

      if (urgentReminders.length > 0) {
        localStorage.setItem(notifiedKey, 'true')
      }
    }
  }, [notificationsEnabled, reminders, today, sendBillNotification])

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id])
  }

  const getStatusConfig = (status: ReminderItem['status']) => {
    switch (status) {
      case 'overdue':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50 dark:bg-red-900/10',
          borderColor: 'border-red-200 dark:border-red-800/30',
          iconColor: 'text-red-500',
          label: 'Terlambat',
          labelBg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        }
      case 'due_today':
        return {
          icon: Bell,
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
          borderColor: 'border-orange-200 dark:border-orange-800/30',
          iconColor: 'text-orange-500 animate-bounce',
          label: 'Hari Ini',
          labelBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
        }
      case 'upcoming':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
          borderColor: 'border-yellow-200 dark:border-yellow-800/30',
          iconColor: 'text-yellow-500',
          label: 'Mendatang',
          labelBg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        }
    }
  }

  if (activeReminders.length === 0) {
    return (
      <Card className="overflow-hidden border-green-200 dark:border-green-800/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              Reminder Tagihan
            </CardTitle>
            {notificationPermission !== 'unsupported' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestPermission}
                className={`text-xs ${notificationsEnabled ? 'text-green-500' : 'text-gray-400'}`}
              >
                {notificationsEnabled ? <Bell className="h-3.5 w-3.5 mr-1" /> : <BellOff className="h-3.5 w-3.5 mr-1" />}
                {notificationsEnabled ? 'Aktif' : 'Aktifkan'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Semua tagihan aman! 🎉</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tidak ada tagihan yang jatuh tempo dalam 7 hari ke depan</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" />
            Reminder Tagihan
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-normal">
              {activeReminders.length}
            </span>
          </CardTitle>
          {notificationPermission !== 'unsupported' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestPermission}
              className={`text-xs ${notificationsEnabled ? 'text-green-500' : 'text-gray-400'}`}
            >
              {notificationsEnabled ? <Bell className="h-3.5 w-3.5 mr-1" /> : <BellOff className="h-3.5 w-3.5 mr-1" />}
              {notificationsEnabled ? 'Aktif' : 'Aktifkan'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {activeReminders.map(reminder => {
          const config = getStatusConfig(reminder.status)
          const StatusIcon = config.icon

          return (
            <div
              key={reminder.bill.id}
              className={`p-3 rounded-xl border ${config.bgColor} ${config.borderColor} transition-all`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${config.iconColor}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium dark:text-white truncate">{reminder.bill.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${config.labelBg}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {formatRupiah(reminder.bill.amount)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • Tgl {reminder.bill.due_date}
                        {reminder.status === 'upcoming' && ` (${reminder.daysUntil} hari lagi)`}
                        {reminder.status === 'overdue' && ` (${Math.abs(reminder.daysUntil)} hari lalu)`}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(reminder.bill.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
