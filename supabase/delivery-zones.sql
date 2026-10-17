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
  ('قويسنا', 15, 0),
  ('قويسنا البلد', 45, 1),
  ('شمنديل', 45, 2),
  ('بناس', 45, 3),
  ('كفر بناس', 50, 4),
  ('اشليم', 60, 5),
  ('كفر اشليم', 60, 6),
  ('قباله', 75, 7),
  ('كفر العرب', 55, 8),
  ('ام خنان', 80, 9),
  ('العجايزه', 80, 10),
  ('ميت سراج', 80, 11),
  ('كفر ميت سراج', 80, 12),
  ('ميت القصري', 80, 13),
  ('ميت ابو شيخه', 70, 14),
  ('شبين الكوم', 100, 15),
  ('ابو الحسن', 55, 16),
  ('كفر المنشي', 65, 17),
  ('كفر طه', 55, 18),
  ('طه شبرا', 55, 19),
  ('عزبة راتب', 50, 20),
  ('كفر زين الدين', 100, 21),
  ('شرانيس', 45, 22),
  ('الكفور', 55, 23),
  ('المنطقه', 45, 24),
  ('ميت برا', 75, 25),
  ('شبرا بخوم', 80, 26),
  ('بره العجوز', 70, 27),
  ('بجيرم', 65, 28),
  ('بني غريان', 80, 29),
  ('كفر هلال', 90, 30),
  ('عزبة على عبد الجواد', 70, 31),
  ('كفر الاكرم', 80, 32),
  ('الرمالي', 65, 33),
  ('مصطاي', 70, 34),
  ('طوخ طنبشا', 70, 35),
  ('طنبشا', 70, 36),
  ('بركة السبع', 90, 37),
  ('عزبة منشه', 75, 38),
  ('عرب ابو ذكري', 55, 39),
  ('اجهور', 60, 40),
  ('كفر وهب', 50, 41),
  ('عزية مسيحه', 70, 42),
  ('كفر عبده', 45, 43),
  ('عزية شمس', 70, 44);
