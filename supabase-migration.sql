-- Run this in the Supabase SQL Editor for your project
-- Adds admin columns to the existing woodworking_orders table

ALTER TABLE woodworking_orders
  ADD COLUMN IF NOT EXISTS quote_amount     DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS deposit_amount   DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_date         DATE,
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_status  TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS admin_notes      TEXT,
  ADD COLUMN IF NOT EXISTS created_at       TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_due_date   ON woodworking_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON woodworking_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON woodworking_orders(created_at);

-- Status values: new | quoted | approved | in_progress | complete | shipped | cancelled
-- shipping_status values: pending | shipped | delivered
