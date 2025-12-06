'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Habit } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Check, X } from 'lucide-react'
import { HabitForm } from './HabitForm'
import { format, subDays, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'

interface HabitTrackerProps {
  habit: Habit
}

export function HabitTracker({ habit }: HabitTrackerProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i))
    return {
      date,
      dateStr: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE', { locale: id }),
    }
  })

  // Fetch habit logs
  const { data: logs } = useQuery({
    queryKey: ['habit-logs', habit.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habit.id)
        .gte('log_date', last7Days[0].dateStr)

      if (error) throw error
      return data || []
    },
  })

  const toggleLog = useMutation({
    mutationFn: async ({ date, currentStatus }: { date: string; currentStatus: boolean }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (currentStatus) {
        // Delete log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habit.id)
          .eq('log_date', date)

        if (error) throw error
      } else {
        // Create log
        const { error } = await supabase.from('habit_logs').insert({
          habit_id: habit.id,
          user_id: user.id,
          log_date: date,
          completed: true,
        })

        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs', habit.id] })
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  const deleteHabit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('habits').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  const handleDelete = () => {
    if (confirm(`Hapus kebiasaan "${habit.name}"?`)) {
      deleteHabit.mutate(habit.id)
    }
  }

  const getLogStatus = (dateStr: string) => {
    return logs?.some((log) => log.log_date === dateStr && log.completed) || false
  }

  const streak = logs?.filter((log) => log.completed).length || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <div>
              <CardTitle className="text-lg">{habit.name}</CardTitle>
              {habit.description && (
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <HabitForm habit={habit} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Streak */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Streak:</span>
            <span className="font-semibold text-lg" style={{ color: habit.color }}>
              {streak} hari
            </span>
          </div>

          {/* Last 7 days */}
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day) => {
              const isCompleted = getLogStatus(day.dateStr)
              const isToday = day.dateStr === format(new Date(), 'yyyy-MM-dd')

              return (
                <button
                  key={day.dateStr}
                  onClick={() =>
                    toggleLog.mutate({
                      date: day.dateStr,
                      currentStatus: isCompleted,
                    })
                  }
                  disabled={toggleLog.isPending}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all ${
                    isCompleted
                      ? 'border-transparent text-white'
                      : isToday
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: isCompleted ? habit.color : undefined,
                  }}
                >
                  <span className="font-medium">{day.dayName}</span>
                  {isCompleted && <Check className="h-4 w-4 mt-1" />}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
