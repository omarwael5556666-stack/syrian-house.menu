-- SECURITY FIX - paste whole file in SQL Editor and Run (safe to re-run)
alter table public.categories enable row level security;
alter table public.menu_items  enable row level security;

drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read items"     on public.menu_items;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write items"      on public.menu_items;

create policy "public read categories" on public.categories
  for select using (true);
create policy "public read items" on public.menu_items
  for select using (true);

create policy "admin write categories" on public.categories
  for all to authenticated using (true) with check (true);
create policy "admin write items" on public.menu_items
  for all to authenticated using (true) with check (true);
