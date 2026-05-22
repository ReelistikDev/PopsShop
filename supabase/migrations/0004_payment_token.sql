-- Run this in your Supabase SQL editor

alter table woodworking_orders
  add column if not exists payment_token uuid unique;
