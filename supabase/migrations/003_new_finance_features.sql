-- Migration for new finance features
-- Savings Goals, Investments, and Custom Categories

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    deadline DATE,
    icon TEXT NOT NULL DEFAULT '🎯',
    color TEXT NOT NULL DEFAULT '#8B5CF6',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('stocks', 'mutual_funds', 'crypto', 'bonds', 'other')),
    initial_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '📁',
    color TEXT NOT NULL DEFAULT '#6366F1',
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name, parent_id)
);

-- Enable Row Level Security
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for savings_goals
CREATE POLICY "Users can view their own savings goals" ON savings_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings goals" ON savings_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals" ON savings_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals" ON savings_goals
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for investments
CREATE POLICY "Users can view their own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments" ON investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" ON investments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments" ON investments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can view their own categories" ON categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
    FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
