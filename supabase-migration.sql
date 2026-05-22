-- Run this in your Supabase SQL editor to add admin columns to woodworking_orders
ALTER TABLE woodworking_orders
  ADD COLUMN IF NOT EXISTS quote_amount    DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS deposit_amount  DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_date        DATE,
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_status  TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS admin_notes      TEXT,
  ADD COLUMN IF NOT EXISTS created_at       TIMESTAMPTZ DEFAULT NOW();
