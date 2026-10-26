import { writeFileSync } from "node:fs";
import { DELIVERY_DATA } from "../src/data/menuData.js";

const esc = (s) => String(s).replace(/'/g, "''");
const lines = DELIVERY_DATA.map((zone, i) => `  ('${esc(zone.location)}', ${zone.fee}, ${i})`);
const sql = `-- Delivery zone setup and initial values; reruns preserve edits and removals.
create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee numeric(10,2) not null check (fee >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.delivery_zones enable row level security;
drop policy if exists "public read zones" on public.delivery_zones;
drop policy if exists "admin write zones" on public.delivery_zones;
create policy "public read zones" on public.delivery_zones for select using (true);
create policy "admin write zones" on public.delivery_zones for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
insert into public.delivery_zones (name, fee, sort_order) values
${lines.join(",\n")}
on conflict (name) do nothing;
`;
writeFileSync(new URL("../supabase/delivery-zones.sql", import.meta.url), sql, "utf8");
console.log(`written: ${DELIVERY_DATA.length} zones`);
