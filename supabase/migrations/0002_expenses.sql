-- Run this in your Supabase SQL editor

create table if not exists expenses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now() not null,
  date        date not null default current_date,
  amount      numeric(10, 2) not null check (amount > 0),
  category    text not null,
  description text,
  vendor      text,
  order_id    uuid references woodworking_orders(id) on delete set null
);

create index if not exists expenses_date_idx  on expenses (date desc);
create index if not exists expenses_order_idx on expenses (order_id) where order_id is not null;
