-- Run this in your Supabase SQL editor

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  slug        text not null unique,
  name        text not null,
  category    text not null,
  image_url   text,
  alt         text,
  blurb       text,
  size_note   text,
  wood_note   text,
  finish_note text,
  featured    boolean not null default false,
  active      boolean not null default true,
  sort_order  integer not null default 0
);

create index if not exists products_active_idx    on products (active, sort_order);
create index if not exists products_featured_idx  on products (featured) where featured = true;

-- Also create the product-images storage bucket in Supabase Dashboard:
-- Storage → New bucket → Name: "product-images" → Public: ON
