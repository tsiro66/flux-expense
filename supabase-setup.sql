-- Flux Expense: Supabase Database Setup
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)

-- 1. Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Insert the two users (replace UUIDs with actual values from Auth → Users)
INSERT INTO profiles (id, display_name) VALUES
  ('3417f2e7-3445-49cb-bf2e-7e8ce54f83d4', 'Tsiro'),
  ('16c34613-2461-4bcb-abb5-4f84bbc67c3a', 'Mike');

-- 3. Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL CHECK (type IN ('expense', 'income', 'payment')),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_created_by ON transactions(created_by);

-- 4. Net balance RPC function
CREATE OR REPLACE FUNCTION get_net_balance()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  balance numeric
) AS $$
  WITH ref_user AS (
    SELECT id, display_name FROM profiles ORDER BY created_at LIMIT 1
  ),
  effects AS (
    SELECT
      CASE
        WHEN t.type = 'expense' AND t.created_by = (SELECT id FROM ref_user)
          THEN t.amount / 2
        WHEN t.type = 'expense' AND t.created_by != (SELECT id FROM ref_user)
          THEN -(t.amount / 2)
        WHEN t.type = 'income' AND t.created_by = (SELECT id FROM ref_user)
          THEN -(t.amount / 2)
        WHEN t.type = 'income' AND t.created_by != (SELECT id FROM ref_user)
          THEN t.amount / 2
        WHEN t.type = 'payment' AND t.created_by = (SELECT id FROM ref_user)
          THEN t.amount
        WHEN t.type = 'payment' AND t.created_by != (SELECT id FROM ref_user)
          THEN -t.amount
      END AS effect
    FROM transactions t
  )
  SELECT
    (SELECT id FROM ref_user),
    (SELECT display_name FROM ref_user),
    COALESCE(SUM(effect), 0) AS balance
  FROM effects;
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all profiles"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Authenticated can view all transactions"
  ON transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert own transactions"
  ON transactions FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- 6. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
