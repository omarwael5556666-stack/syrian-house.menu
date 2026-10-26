-- Restrict management to accounts whose trusted app_metadata role is admin.
-- Assign with the Supabase dashboard/admin API; users cannot set app_metadata themselves.

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.delivery_zones enable row level security;

 drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read items" on public.menu_items;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write items" on public.menu_items;
drop policy if exists "public read zones" on public.delivery_zones;
drop policy if exists "admin write zones" on public.delivery_zones;

create policy "public read categories" on public.categories for select using (true);
create policy "public read items" on public.menu_items for select using (true);
create policy "public read zones" on public.delivery_zones for select using (true);
create policy "admin write categories" on public.categories for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write items" on public.menu_items for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write zones" on public.delivery_zones for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
