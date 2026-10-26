/**
 * Generates an idempotent, non-destructive menu seed.
 * Run after supabase/all-in-one.sql on a new database: node scripts/gen-seed.mjs
 */
import { writeFileSync } from "node:fs";
import menuData, { CATEGORIES } from "../src/data/menuData.js";

const esc = (s) => String(s).replace(/'/g, "''");
const numOrNull = (v) => (v == null ? "null" : v);
const knownIds = new Map([
  ["سندوتشات البيت السوري", "8fd02f2f-0cbe-4b81-bca1-231c5d7cede3"],
  ["الكريبات", "927051c8-aa2d-42d4-886f-7185c92d6d8c"],
  ["المقبلات", "21b33ada-a706-49c2-bd97-1519af2320da"],
  ["وجبات الغربي", "6ba1b8be-1877-4647-aacf-3ec91a86bf58"],
  ["الفراخ الشواية", "2cfd8e27-33e2-4e18-a6ca-6183ed465976"],
  ["أوزان الشاورما", "ca16c4a3-6d28-4051-ba98-913beb2eed6e"],
  ["فتات الشاورما", "8e1d557a-2f74-42cc-97ae-e392cb749c85"],
  ["أطباق العربي", "7e4706b2-1877-4647-aacf-3ec91a86bf58"],
  ["البيتزا", "f41bf8ba-0079-4cf6-ae8c-aabc06bec8f0"],
  ["المكرونات", "1f4503ce-d4c5-42fc-a62e-43bb81653d90"],
  ["الإضافات", "4c1356f9-7b61-4efc-b724-2036c6aac942"],
  ["إضافات البيتزا", "18ebda76-1343-4790-8956-5c74cf5b1d59"],
]);
const catIds = new Map(CATEGORIES.map((name, i) => [name, knownIds.get(name) ?? `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`]));
const catLines = CATEGORIES.map((name, i) => `  ('${catIds.get(name)}', '${esc(name)}', ${i})`);
const categoryOrderLines = CATEGORIES.map((name, i) => `  ('${esc(name)}', ${i})`);

const sortCounter = {};
const itemLines = menuData.map((item) => {
  const sort = (sortCounter[item.category] = (sortCounter[item.category] ?? -1) + 1);
  const priced = item.price != null || (item.priceM != null && item.priceL != null);
  const categoryId = `(select id from public.categories where name = '${esc(item.category)}')`;
  return `  (${categoryId}, '${esc(item.title)}', ${item.description ? `'${esc(item.description)}'` : "null"}, ${numOrNull(item.price)}, ${numOrNull(item.priceM)}, ${numOrNull(item.priceL)}, ${item.isNew ? "true" : "false"}, ${priced ? "true" : "false"}, ${sort})`;
});

const sql = `-- Generated starter menu. Safe to rerun; only the explicitly listed menu corrections are applied to existing rows.
-- Run only after supabase/all-in-one.sql.

-- Rename the old combined category while preserving its id and existing Arabic-dish items.
update public.categories legacy
set name = 'أطباق العربي'
where legacy.name = 'أطباق العربي وفتات الشاورما'
  and not exists (select 1 from public.categories existing_category where existing_category.name = 'أطباق العربي');

insert into public.categories (id, name, sort_order) values
${catLines.join(",\n")}
on conflict do nothing;

-- Keep the four requested categories immediately after sandwiches.
update public.categories as category
set sort_order = requested.sort_order
from (values
${categoryOrderLines.join(",\n")}
) as requested(name, sort_order)
where category.name = requested.name;

-- Move existing fata dishes out of the legacy combined category before inserting any missing rows.
update public.menu_items mi
set category_id = (select id from public.categories where name = 'فتات الشاورما')
where mi.title in ('فتة شاورما دجاج', 'فتة شاورما لحمة', 'فتة شاورما ميكس', 'فتة شيش طاووق')
  and mi.category_id is distinct from (select id from public.categories where name = 'فتات الشاورما');

insert into public.menu_items
  (category_id, title, description, price, price_m, price_l, is_new, is_available, sort_order)
select seed.* from (values
${itemLines.join(",\n")}
) as seed(category_id, title, description, price, price_m, price_l, is_new, is_available, sort_order)
where not exists (
  select 1 from public.menu_items existing
  where existing.category_id = seed.category_id and existing.title = seed.title
);

-- All Arabic double meals are sold at EGP 220 and should be orderable.
update public.menu_items
set price = 220, price_m = null, price_l = null, is_available = true
where title in (
  'شاورما دجاج عربي مقطع دبل 2 ساندوتش',
  'شاورما لحمة عربي مقطع دبل 2 ساندوتش',
  'شاورما ميكس عربي مقطع دبل 2 ساندوتش'
);
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql, "utf8");
console.log(`seed.sql written: ${CATEGORIES.length} categories, ${menuData.length} items`);
