-- Safe base schema for the menu only. For orders/settings as well, run all-in-one.sql.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null,
  description text,
  price numeric(10,2),
  price_m numeric(10,2),
  price_l numeric(10,2),
  image_url text,
  is_available boolean not null default true,
  is_new boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_menu_items_category on public.menu_items(category_id);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_items_updated on public.menu_items;
create trigger trg_items_updated before update on public.menu_items for each row execute function public.touch_updated_at();

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read items" on public.menu_items;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write items" on public.menu_items;
create policy "public read categories" on public.categories for select using (true);
create policy "public read items" on public.menu_items for select using (true);
create policy "admin write categories" on public.categories for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write items" on public.menu_items for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
