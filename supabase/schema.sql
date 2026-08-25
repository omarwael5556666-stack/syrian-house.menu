-- ═══════════════════════════════════════════════════════════
--  Syrian House Menu — Admin Panel Schema
--  Run in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ─── Tables ────────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories(id) on delete restrict,
  title        text not null,
  description  text,
  price        numeric(10,2),
  price_m      numeric(10,2),
  price_l      numeric(10,2),
  image_url    text,
  is_available boolean not null default true,
  is_new       boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_menu_items_category on public.menu_items(category_id);

-- ─── Auto-update updated_at ────────────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin set new.updated_at = now(); return new; end $$;

create trigger trg_items_updated
before update on public.menu_items
for each row execute function touch_updated_at();

-- ─── Row Level Security ────────────────────────────────────
alter table public.categories enable row level security;
alter table public.menu_items  enable row level security;

-- anyone (public site) can read
create policy "public read categories" on public.categories
  for select using (true);
create policy "public read items" on public.menu_items
  for select using (true);

-- only logged-in admins can write
create policy "admin write categories" on public.categories
  for all to authenticated using (true) with check (true);
create policy "admin write items" on public.menu_items
  for all to authenticated using (true) with check (true);
