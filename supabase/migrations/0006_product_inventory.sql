-- Run this in your Supabase SQL editor
-- Adds in-stock vs made-to-order distinction, inventory, lead time, and shipping cost to products.

alter table products
  add column if not exists stock_type      text    not null default 'made_to_order'
    check (stock_type in ('in_stock', 'made_to_order')),
  add column if not exists stock_quantity  integer not null default 0
    check (stock_quantity >= 0),
  add column if not exists lead_time       text,
  add column if not exists shipping_cost   numeric(10, 2) not null default 0
    check (shipping_cost >= 0);

create index if not exists products_stock_type_idx on products (stock_type);
