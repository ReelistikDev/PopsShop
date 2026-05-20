-- PopsShop — custom order requests
-- Apply this to the DEDICATED PopsShop Supabase project (NOT the Ten-Eight/FleetManage project).

create table if not exists public.woodworking_orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  customer_name text not null,
  phone         text not null,
  email         text,
  category      text,
  product       text,
  dimensions    text,
  wood_type     text,
  finish        text,
  quantity      text,
  budget        text,
  deadline      text,
  notes         text,
  photo_url     text,
  status        text not null default 'new',
  sms_status    text
);

comment on table public.woodworking_orders is
  'Custom woodworking order requests submitted from the PopsShop site. Written by the server using the service-role key; contains customer PII.';

create index if not exists woodworking_orders_created_at_idx
  on public.woodworking_orders (created_at desc);
create index if not exists woodworking_orders_status_idx
  on public.woodworking_orders (status);

-- RLS on, with NO public policies.
-- The app writes via the service-role key (which bypasses RLS); customer PII is never
-- exposed to anon/authenticated clients. Read orders via the Supabase dashboard or a
-- future authenticated admin tool.
alter table public.woodworking_orders enable row level security;

-- Storage bucket for optional inspiration photos. Public read so the link in the SMS
-- opens for the shop; uploads happen server-side via the service-role key.
insert into storage.buckets (id, name, public)
values ('order-photos', 'order-photos', true)
on conflict (id) do nothing;
