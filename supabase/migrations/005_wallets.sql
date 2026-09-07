-- =====================================================
-- Migration: Add Wallets Table and Expenses Relation
-- =====================================================

-- 1. Create wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'cash' CHECK (type IN ('bank', 'e-wallet', 'cash', 'other')),
  initial_balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Add wallet_id column to expenses table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'expenses' 
      AND column_name = 'wallet_id'
  ) THEN
    ALTER TABLE public.expenses 
    ADD COLUMN wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS expenses_wallet_id_idx ON public.expenses(wallet_id);

-- 4. Enable Row Level Security (RLS) on wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for wallets
CREATE POLICY "Users can view their own wallets"
  ON public.wallets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets"
  ON public.wallets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets"
  ON public.wallets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
  ON public.wallets
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Trigger to automatically update updated_at on wallets
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    DROP TRIGGER IF EXISTS set_updated_at_wallets ON public.wallets;
    CREATE TRIGGER set_updated_at_wallets
      BEFORE UPDATE ON public.wallets
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- 7. Reload Supabase Schema Cache
NOTIFY pgrst, 'reload schema';
