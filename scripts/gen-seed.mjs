/**
 * Generates supabase/seed.sql from the bundled static menu data.
 * Run once after creating the Supabase tables:  node scripts/gen-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import menuData, { CATEGORIES } from "../src/data/menuData.js";

const esc = (s) => String(s).replace(/'/g, "''");
const numOrNull = (v) => (v == null ? "null" : v);

const catIds = new Map();
const catLines = CATEGORIES.map((name, i) => {
  const id = randomUUID();
  catIds.set(name, id);
  return `  ('${id}', '${esc(name)}', ${i})`;
});

let sortCounter = {};
const itemLines = menuData.map((it) => {
  const sort = (sortCounter[it.category] = (sortCounter[it.category] ?? -1) + 1);
  return `  ('${catIds.get(it.category)}', '${esc(it.title)}', ${
    it.description ? `'${esc(it.description)}'` : "null"
  }, ${numOrNull(it.price)}, ${numOrNull(it.priceM)}, ${numOrNull(it.priceL)}, ${
    it.isNew ? "true" : "false"
  }, true, ${sort})`;
});

const sql = `-- Auto-generated seed data. Run in Supabase SQL Editor.
-- WARNING: wipes existing categories/items first.

truncate table public.menu_items, public.categories cascade;

insert into public.categories (id, name, sort_order) values
${catLines.join(",\n")};

insert into public.menu_items
  (category_id, title, description, price, price_m, price_l, is_new, is_available, sort_order)
values
${itemLines.join(",\n")};
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql, "utf8");
console.log(`seed.sql written: ${CATEGORIES.length} categories, ${menuData.length} items`);
