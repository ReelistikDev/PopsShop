-- Run this in your Supabase SQL editor

alter table woodworking_orders
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'deposit', 'paid'));
