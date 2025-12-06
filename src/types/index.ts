export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  note: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  log_date: string
  completed: boolean
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  month: string // YYYY-MM-01 format
  created_at: string
  updated_at: string
}
