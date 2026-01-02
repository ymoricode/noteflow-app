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

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  month: string // YYYY-MM-01 format
  created_at: string
  updated_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  is_completed: boolean
  created_at: string
  updated_at: string
}



export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  parent_id: string | null
  type: 'income' | 'expense'
  created_at: string
}

export interface Bill {
  id: string
  user_id: string
  name: string
  amount: number
  due_date: number // Day of month (1-31)
  category: string
  is_recurring: boolean
  frequency: 'monthly' | 'yearly'
  is_paid: boolean
  last_paid_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}
