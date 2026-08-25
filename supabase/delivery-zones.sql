-- Delivery zones table + seed (safe to re-run)

create table if not exists public.delivery_zones (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  fee        numeric(10,2) not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.delivery_zones enable row level security;

drop policy if exists 'public read zones' on public.delivery_zones;
drop policy if exists 'admin write zones' on public.delivery_zones;
create policy 'public read zones' on public.delivery_zones for select using (true);
create policy 'admin write zones' on public.delivery_zones for all to authenticated using (true) with check (true);

delete from public.delivery_zones;
insert into public.delivery_zones (name, fee, sort_order) values
  ('قويسنا البلد', 45, 0),
  ('شمنديل', 45, 1),
  ('بناس', 45, 2),
  ('كفر بناس', 50, 3),
  ('اشليم', 60, 4),
  ('كفر اشليم', 60, 5),
  ('قباله', 75, 6),
  ('كفر العرب', 55, 7),
  ('ام خنان', 80, 8),
  ('العجايزه', 80, 9),
  ('ميت سراج', 80, 10),
  ('كفر ميت سراج', 80, 11),
  ('ميت القصري', 80, 12),
  ('ميت ابو شيخه', 70, 13),
  ('شبين الكوم', 100, 14),
  ('ابو الحسن', 55, 15),
  ('كفر المنشي', 65, 16),
  ('كفر طه', 55, 17),
  ('طه شبرا', 55, 18),
  ('عزبة راتب', 50, 19),
  ('كفر زين الدين', 100, 20),
  ('شرانيس', 45, 21),
  ('الكفور', 55, 22),
  ('المنطقه', 45, 23),
  ('ميت برا', 75, 24),
  ('شبرا بخوم', 80, 25),
  ('بره العجوز', 70, 26),
  ('بجيرم', 65, 27),
  ('بني غريان', 80, 28),
  ('كفر هلال', 90, 29),
  ('عزبة على عبد الجواد', 70, 30),
  ('كفر الاكرم', 80, 31),
  ('الرمالي', 65, 32),
  ('مصطاي', 70, 33),
  ('طوخ طنبشا', 70, 34),
  ('طنبشا', 70, 35),
  ('بركة السبع', 90, 36),
  ('عزبة منشه', 75, 37),
  ('عرب ابو ذكري', 55, 38),
  ('اجهور', 60, 39),
  ('كفر وهب', 50, 40),
  ('عزية مسيحه', 70, 41),
  ('كفر عبده', 45, 42),
  ('عزية شمس', 70, 43);
