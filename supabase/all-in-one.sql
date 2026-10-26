-- Safe setup for Syrian House. This file creates or upgrades objects without dropping or truncating menu data.
-- Grant the admin role through Supabase Auth app_metadata; never place the service-role key in the browser.

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

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee numeric(10,2) not null check (fee >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_settings (
  id integer primary key default 1 check (id = 1),
  restaurant_name text not null default 'مطعم البيت السوري',
  tagline text not null default 'أهل قويسنا',
  english_name text not null default 'Syrian House',
  address text not null default 'قويسنا - ميدان الفلاح - إتجاه موقف شبين',
  order_whatsapp text not null default '201055318226',
  facebook_page text not null default 'Syrian House 2 البيت السوري',
  phones jsonb not null default '[{"label":"موبايل 1","number":"01221437500","raw":"+201221437500"},{"label":"موبايل 2","number":"01092992468","raw":"+201092992468"},{"label":"موبايل 3","number":"01110600785","raw":"+201110600785"},{"label":"موبايل 4","number":"01055318226","raw":"+201055318226"},{"label":"هاتف أرضي","number":"0482580187","raw":"+20482580187"}]'::jsonb,
  accepting_orders boolean not null default true,
  opening_time time,
  closing_time time,
  eta_minutes integer not null default 45 check (eta_minutes between 5 and 240),
  minimum_order numeric(10,2) not null default 0 check (minimum_order >= 0),
  updated_at timestamptz not null default now()
);
alter table public.restaurant_settings add column if not exists restaurant_name text not null default 'مطعم البيت السوري';
alter table public.restaurant_settings add column if not exists tagline text not null default 'أهل قويسنا';
alter table public.restaurant_settings add column if not exists english_name text not null default 'Syrian House';
alter table public.restaurant_settings add column if not exists address text not null default 'قويسنا - ميدان الفلاح - إتجاه موقف شبين';
alter table public.restaurant_settings add column if not exists order_whatsapp text not null default '201055318226';
alter table public.restaurant_settings add column if not exists facebook_page text not null default 'Syrian House 2 البيت السوري';
alter table public.restaurant_settings add column if not exists phones jsonb not null default '[{"label":"موبايل 1","number":"01221437500","raw":"+201221437500"},{"label":"موبايل 2","number":"01092992468","raw":"+201092992468"},{"label":"موبايل 3","number":"01110600785","raw":"+201110600785"},{"label":"موبايل 4","number":"01055318226","raw":"+201055318226"},{"label":"هاتف أرضي","number":"0482580187","raw":"+20482580187"}]'::jsonb;
insert into public.restaurant_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text not null,
  phone2 text,
  zone_name text not null,
  delivery_detail text,
  customer_note text,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  delivery_fee numeric(10,2) not null check (delivery_fee >= 0),
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','preparing','out_for_delivery','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null,
  title text not null,
  size text,
  quantity integer not null check (quantity between 1 and 99),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  note text
);

create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_items_updated on public.menu_items;
create trigger trg_items_updated before update on public.menu_items for each row execute function public.touch_updated_at();
drop trigger if exists trg_settings_updated on public.restaurant_settings;
create trigger trg_settings_updated before update on public.restaurant_settings for each row execute function public.touch_updated_at();

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read items" on public.menu_items;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write items" on public.menu_items;
drop policy if exists "public read zones" on public.delivery_zones;
drop policy if exists "admin write zones" on public.delivery_zones;
drop policy if exists "public read restaurant settings" on public.restaurant_settings;
drop policy if exists "admin write restaurant settings" on public.restaurant_settings;
drop policy if exists "admin read orders" on public.orders;
drop policy if exists "admin update orders" on public.orders;
drop policy if exists "admin read order items" on public.order_items;

create policy "public read categories" on public.categories for select using (true);
create policy "public read items" on public.menu_items for select using (true);
create policy "public read zones" on public.delivery_zones for select using (true);
create policy "public read restaurant settings" on public.restaurant_settings for select using (true);
create policy "admin write categories" on public.categories for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write items" on public.menu_items for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write zones" on public.delivery_zones for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin write restaurant settings" on public.restaurant_settings for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin read orders" on public.orders for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin update orders" on public.orders for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin read order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

create or replace function public.place_order(p_customer jsonb, p_zone_name text, p_items jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_settings public.restaurant_settings%rowtype;
  v_zone public.delivery_zones%rowtype;
  v_input record;
  v_menu public.menu_items%rowtype;
  v_order_id uuid := gen_random_uuid();
  v_lines jsonb := '[]'::jsonb;
  v_subtotal numeric(10,2) := 0;
  v_price numeric(10,2);
  v_local_time time;
  v_phone text := coalesce(p_customer->>'phone','');
  v_detail text := coalesce(p_customer->>'delivery_detail','');
  v_qty integer;
  v_size text;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then
    raise exception 'السلة غير صالحة';
  end if;
  if v_phone !~ '^01[0125][0-9]{8}$' then raise exception 'رقم الهاتف المصري غير صالح'; end if;
  if length(coalesce(p_customer->>'name','')) > 120 or length(v_detail) > 400 or length(coalesce(p_customer->>'note','')) > 1000 then
    raise exception 'بعض بيانات الطلب أطول من المسموح';
  end if;
  select * into v_settings from public.restaurant_settings where id = 1;
  if not found or not v_settings.accepting_orders then raise exception 'المطعم متوقف عن استقبال الطلبات'; end if;
  v_local_time := (now() at time zone 'Africa/Cairo')::time;
  if v_settings.opening_time is not null and v_settings.closing_time is not null then
    if v_settings.closing_time < v_settings.opening_time then
      if not (v_local_time >= v_settings.opening_time or v_local_time < v_settings.closing_time) then raise exception 'المطعم مغلق الآن'; end if;
    elsif not (v_local_time >= v_settings.opening_time and v_local_time < v_settings.closing_time) then
      raise exception 'المطعم مغلق الآن';
    end if;
  end if;
  select * into v_zone from public.delivery_zones where name = p_zone_name;
  if not found then raise exception 'منطقة التوصيل غير متاحة'; end if;
  if v_zone.fee < 0 then raise exception 'رسوم التوصيل غير صالحة'; end if;
  if p_zone_name = 'قويسنا' and btrim(v_detail) = '' then raise exception 'العنوان التفصيلي مطلوب داخل قويسنا'; end if;

  for v_input in select value from jsonb_array_elements(p_items) loop
    v_qty := (v_input.value->>'quantity')::integer;
    v_size := nullif(v_input.value->>'size','');
    if v_qty < 1 or v_qty > 99 then raise exception 'كمية صنف غير صالحة'; end if;
    select * into v_menu from public.menu_items where id = (v_input.value->>'id')::uuid and is_available = true;
    if not found then raise exception 'أحد الأصناف لم يعد متاحًا'; end if;
    if v_size = 'M' then v_price := v_menu.price_m;
    elsif v_size = 'L' then v_price := v_menu.price_l;
    elsif v_size is null then v_price := v_menu.price;
    else raise exception 'مقاس الصنف غير صالح'; end if;
    if v_price is null or v_price < 0 then raise exception 'سعر أحد الأصناف غير محدد'; end if;
    v_subtotal := v_subtotal + v_price * v_qty;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'id', v_menu.id, 'title', v_menu.title, 'size', v_size, 'quantity', v_qty,
      'unit_price', v_price, 'note', left(coalesce(v_input.value->>'note',''), 300)
    ));
  end loop;
  if v_subtotal < v_settings.minimum_order then raise exception 'قيمة الطلب أقل من الحد الأدنى'; end if;

  insert into public.orders(id, customer_name, phone, phone2, zone_name, delivery_detail, customer_note, subtotal, delivery_fee, total)
  values (v_order_id, nullif(left(btrim(coalesce(p_customer->>'name','')),120),''), v_phone,
    nullif(left(coalesce(p_customer->>'phone2',''),20),''), v_zone.name,
    nullif(left(btrim(v_detail),400),''), nullif(left(btrim(coalesce(p_customer->>'note','')),1000),''),
    v_subtotal, v_zone.fee, v_subtotal + v_zone.fee);
  insert into public.order_items(order_id, menu_item_id, title, size, quantity, unit_price, note)
  select v_order_id, (x->>'id')::uuid, x->>'title', nullif(x->>'size',''), (x->>'quantity')::integer, (x->>'unit_price')::numeric, nullif(x->>'note','')
  from jsonb_array_elements(v_lines) x;
  return jsonb_build_object('id', v_order_id, 'subtotal', v_subtotal, 'delivery_fee', v_zone.fee, 'total', v_subtotal + v_zone.fee, 'eta_minutes', v_settings.eta_minutes);
end $$;
revoke all on function public.place_order(jsonb, text, jsonb) from public;
grant execute on function public.place_order(jsonb, text, jsonb) to anon, authenticated;

create or replace function public.get_order_status(p_order_id uuid, p_phone text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_order public.orders%rowtype;
begin
  if p_phone !~ '^01[0125][0-9]{8}$' then return null; end if;
  select * into v_order from public.orders where id = p_order_id and phone = p_phone;
  if not found then return null; end if;
  return jsonb_build_object('id', v_order.id, 'status', v_order.status, 'created_at', v_order.created_at, 'total', v_order.total, 'zone_name', v_order.zone_name);
end $$;
revoke all on function public.get_order_status(uuid, text) from public;
grant execute on function public.get_order_status(uuid, text) to anon, authenticated;
