-- Targeted update for an existing database.
-- Splits the legacy combined category and sets Arabic double meals to EGP 220.
-- Safe to run more than once; does not reseed or delete menu rows.

begin;

update public.categories legacy
set name = 'أطباق العربي'
where legacy.name = 'أطباق العربي وفتات الشاورما'
  and not exists (
    select 1
    from public.categories existing_category
    where existing_category.name = 'أطباق العربي'
  );

insert into public.categories (id, name, sort_order)
values ('8e1d557a-2f74-42cc-97ae-e392cb749c85', 'فتات الشاورما', 6)
on conflict do nothing;

update public.menu_items mi
set category_id = (select id from public.categories where name = 'فتات الشاورما')
where mi.title in (
  'فتة شاورما دجاج',
  'فتة شاورما لحمة',
  'فتة شاورما ميكس',
  'فتة شيش طاووق'
)
  and mi.category_id is distinct from (
    select id from public.categories where name = 'فتات الشاورما'
  );

update public.menu_items
set price = 220, price_m = null, price_l = null, is_available = true
where title in (
  'شاورما دجاج عربي مقطع دبل 2 ساندوتش',
  'شاورما لحمة عربي مقطع دبل 2 ساندوتش',
  'شاورما ميكس عربي مقطع دبل 2 ساندوتش'
);

commit;
