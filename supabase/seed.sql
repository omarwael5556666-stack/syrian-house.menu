-- Generated starter menu. Safe to rerun; only the explicitly listed menu corrections are applied to existing rows.
-- Run only after supabase/all-in-one.sql.

-- Rename the old combined category while preserving its id and existing Arabic-dish items.
update public.categories legacy
set name = 'أطباق العربي'
where legacy.name = 'أطباق العربي وفتات الشاورما'
  and not exists (select 1 from public.categories existing_category where existing_category.name = 'أطباق العربي');

insert into public.categories (id, name, sort_order) values
  ('8fd02f2f-0cbe-4b81-bca1-231c5d7cede3', 'سندوتشات البيت السوري', 0),
  ('927051c8-aa2d-42d4-886f-7185c92d6d8c', 'الكريبات', 1),
  ('21b33ada-a706-49c2-bd97-1519af2320da', 'المقبلات', 2),
  ('6ba1b8be-1877-4647-aacf-3ec91a86bf58', 'وجبات الغربي', 3),
  ('2cfd8e27-33e2-4e18-a6ca-6183ed465976', 'الفراخ الشواية', 4),
  ('ca16c4a3-6d28-4051-ba98-913beb2eed6e', 'أوزان الشاورما', 5),
  ('8e1d557a-2f74-42cc-97ae-e392cb749c85', 'فتات الشاورما', 6),
  ('7e4706b2-1877-4647-aacf-3ec91a86bf58', 'أطباق العربي', 7),
  ('f41bf8ba-0079-4cf6-ae8c-aabc06bec8f0', 'البيتزا', 8),
  ('1f4503ce-d4c5-42fc-a62e-43bb81653d90', 'المكرونات', 9),
  ('4c1356f9-7b61-4efc-b724-2036c6aac942', 'الإضافات', 10),
  ('18ebda76-1343-4790-8956-5c74cf5b1d59', 'إضافات البيتزا', 11)
on conflict do nothing;

-- Move existing fata dishes out of the legacy combined category before inserting any missing rows.
update public.menu_items mi
set category_id = (select id from public.categories where name = 'فتات الشاورما')
where mi.title in ('فتة شاورما دجاج', 'فتة شاورما لحمة', 'فتة شاورما ميكس', 'فتة شيش طاووق')
  and mi.category_id is distinct from (select id from public.categories where name = 'فتات الشاورما');

insert into public.menu_items
  (category_id, title, description, price, price_m, price_l, is_new, is_available, sort_order)
select seed.* from (values
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما فراخ', 'شاورما فراخ - شرايح خيار توميه', 90, null, null, false, true, 0),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما لحم', 'شاورما لحمه - شرايح خيار - طحينه - شرايح طماطم', 95, null, null, false, true, 1),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما ميكس', 'شاورما لحمه+فراخ - شرايح خيار - طحينه', 100, null, null, false, true, 2),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما كريسبي', 'قطع كريسبي+شاورمافراخ - توميه - كاتشب', 110, null, null, false, true, 3),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش كريسبي', 'قطع كريسبي - كاتشب - توميه', 100, null, null, false, true, 4),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش زنجر', 'قطع زنجر - كاتشب - توميه', 100, null, null, false, true, 5),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش شيش طاووق', 'قطع شيش طاووق - توميه', 100, null, null, false, true, 6),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما لحمة اكسترا', 'إضافة بطاطس + موتزريلا', 95, null, null, false, true, 7),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'شاورما فراخ اكسترا', 'إضافة بطاطس + موتزريلا', 100, null, null, false, true, 8),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش ميكس فراخ', 'شاورما فراخ + شيش طاووق + كريسبي + كاتشب + توميه', 110, null, null, false, true, 9),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش بطاطس سوري', 'بطاطس + توميه + كاتشب ', 40, null, null, false, true, 10),
  ((select id from public.categories where name = 'سندوتشات البيت السوري'), 'ساندوتش بطاطس موتزريلا', null, 50, null, null, false, true, 11),
  ((select id from public.categories where name = 'الكريبات'), 'كريب شاورما دجاج', null, 100, null, null, false, true, 0),
  ((select id from public.categories where name = 'الكريبات'), 'كريب شاورما لحمة', null, 105, null, null, false, true, 1),
  ((select id from public.categories where name = 'الكريبات'), 'كريب شاورما ميكس', null, 110, null, null, false, true, 2),
  ((select id from public.categories where name = 'الكريبات'), 'كريب كريسبي', null, 100, null, null, false, true, 3),
  ((select id from public.categories where name = 'الكريبات'), 'كريب زنجر', null, 100, null, null, false, true, 4),
  ((select id from public.categories where name = 'الكريبات'), 'كريب شيش طاووق', null, 100, null, null, false, true, 5),
  ((select id from public.categories where name = 'الكريبات'), 'كريب شيش بطاطس', null, 110, null, null, false, true, 6),
  ((select id from public.categories where name = 'الكريبات'), 'كريب كريسبي بطاطس', null, 110, null, null, false, true, 7),
  ((select id from public.categories where name = 'الكريبات'), 'كريب زنجر بطاطس', null, 110, null, null, false, true, 8),
  ((select id from public.categories where name = 'الكريبات'), 'كريب ميكس فراخ', null, 120, null, null, false, true, 9),
  ((select id from public.categories where name = 'الكريبات'), 'كريب بطاطس', null, 55, null, null, false, true, 10),
  ((select id from public.categories where name = 'الكريبات'), 'كريب ميكسيكي حار', null, 100, null, null, false, true, 11),
  ((select id from public.categories where name = 'الكريبات'), 'كريب ميكس جبن وبطاطس', null, 70, null, null, false, true, 12),
  ((select id from public.categories where name = 'الكريبات'), 'كريب فاهيتا دجاج', null, 100, null, null, false, true, 13),
  ((select id from public.categories where name = 'المقبلات'), 'تومية صغيرة', null, 20, null, null, false, true, 0),
  ((select id from public.categories where name = 'المقبلات'), 'تومية كبيرة', null, 30, null, null, false, true, 1),
  ((select id from public.categories where name = 'المقبلات'), 'مخلل سوري', null, 10, null, null, false, true, 2),
  ((select id from public.categories where name = 'المقبلات'), 'عيش محمص', null, 20, null, null, false, true, 3),
  ((select id from public.categories where name = 'المقبلات'), 'عيش كريب', null, 5, null, null, false, true, 4),
  ((select id from public.categories where name = 'المقبلات'), 'عيش سوري', null, 4, null, null, false, true, 5),
  ((select id from public.categories where name = 'المقبلات'), 'طبق بطاطس', null, 25, null, null, false, true, 6),
  ((select id from public.categories where name = 'المقبلات'), 'محمره صغيره', null, 20, null, null, false, true, 7),
  ((select id from public.categories where name = 'المقبلات'), ' محمره كبيره', null, 30, null, null, false, true, 8),
  ((select id from public.categories where name = 'المقبلات'), 'طبق سمبوسة 3 قطع جبنة', null, 20, null, null, false, true, 9),
  ((select id from public.categories where name = 'المقبلات'), 'طبق سمبوسة 3 قطع لحمة', null, 25, null, null, false, true, 10),
  ((select id from public.categories where name = 'المقبلات'), 'طبق أرز', null, 30, null, null, false, true, 11),
  ((select id from public.categories where name = 'المقبلات'), 'سلطة كولسلو', null, 30, null, null, false, true, 12),
  ((select id from public.categories where name = 'المقبلات'), 'طحينة', null, 30, null, null, false, true, 13),
  ((select id from public.categories where name = 'وجبات الغربي'), 'وجبة ميكس فراخ', 'يقدم مع تومية / أرز بسمتي / بطاطس / مخلل / عيش / سمبوسة', 180, null, null, false, true, 0),
  ((select id from public.categories where name = 'وجبات الغربي'), 'وجبة كريسبي', 'يقدم مع تومية / أرز / بطاطس / مخلل / عيش / سمبوسة', 175, null, null, false, true, 1),
  ((select id from public.categories where name = 'وجبات الغربي'), 'وجبة تشيش طاووق', 'يقدم مع تومية / أرز / بطاطس / مخلل / عيش / سمبوسة', 175, null, null, false, true, 2),
  ((select id from public.categories where name = 'وجبات الغربي'), 'وجبة زنجر', 'يقدم مع تومية / أرز / بطاطس / مخلل / عيش / سمبوسة', 175, null, null, false, true, 3),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'فرخة مشوية شواية', 'يقدم مع تومية + عيش + مخلل + رز', 380, null, null, true, true, 0),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'نصف فرخة مشوية', 'يقدم مع تومية + عيش + مخلل+ رز', 190, null, null, true, true, 1),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'ربع فرخة مشوية (ورك)', 'يقدم مع تومية + عيش + مخلل + رز', 120, null, null, true, true, 2),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'ربع فرخة مشوية (صدر)', 'يقدم مع تومية + عيش + مخلل + رز', 135, null, null, true, true, 3),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'فرخة سادة', null, 340, null, null, true, true, 4),
  ((select id from public.categories where name = 'الفراخ الشواية'), 'نصف فرخة سادة', null, 180, null, null, true, true, 5),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'ربع كيلو شاورما فراخ', null, 175, null, null, false, true, 0),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'ربع كيلو شاورما لحمة', null, 175, null, null, false, true, 1),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'نصف كيلو شاورما فراخ', null, 350, null, null, false, true, 2),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'نصف كيلو شاورما لحمة', null, 350, null, null, false, true, 3),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'ربع كيلو شيش', null, 175, null, null, false, true, 4),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'ربع كيلو كريسبي', null, 175, null, null, false, true, 5),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'نصف كيلو شيش', null, 350, null, null, false, true, 6),
  ((select id from public.categories where name = 'أوزان الشاورما'), 'نصف كيلو كريسبي', null, 350, null, null, false, true, 7),
  ((select id from public.categories where name = 'فتات الشاورما'), 'فتة شاورما دجاج', 'تومية + عيش محمص + مخلل', 145, null, null, false, true, 0),
  ((select id from public.categories where name = 'فتات الشاورما'), 'فتة شاورما لحمة', 'تومية + عيش محمص + مخلل', 145, null, null, false, true, 1),
  ((select id from public.categories where name = 'فتات الشاورما'), 'فتة شاورما ميكس', 'تومية + عيش محمص + مخلل', 150, null, null, false, true, 2),
  ((select id from public.categories where name = 'فتات الشاورما'), 'فتة شيش طاووق', 'تومية + عيش محمص + مخلل', 150, null, null, false, true, 3),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما دجاج عربي مقطع ساندوتش واحد', 'بطاطس + تومية + مخلل سوري + محمرة + عيش سوري', 130, null, null, false, true, 0),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما لحمة عربي مقطع ساندوتش واحد', 'بطاطس + تومية + مخلل سوري + محمرة + عيش سوري', 135, null, null, false, true, 1),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما ميكس عربي مقطع ساندوتش واحد', 'بطاطس + تومية + مخلل سوري + محمرة + عيش سوري', 135, null, null, false, true, 2),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما دجاج عربي مقطع دبل 2 ساندوتش', 'يقدم مع خضار مشكل و بطاطس وتوميه ومخلل', 220, null, null, false, true, 3),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما لحمة عربي مقطع دبل 2 ساندوتش', 'يقدم مع خضار مشكل وبطاطس و توميه ومخلل', 220, null, null, false, true, 4),
  ((select id from public.categories where name = 'أطباق العربي'), 'شاورما ميكس عربي مقطع دبل 2 ساندوتش', 'يقدم مع خضار مشكل وبطاطس وتومية ومخلل', 220, null, null, false, true, 5),
  ((select id from public.categories where name = 'أطباق العربي'), 'وجبة عربي عائلي فراخ', '3 ساندوتش عربي مقطع + مخلل + محمرة + عيش سوري', 350, null, null, false, true, 6),
  ((select id from public.categories where name = 'أطباق العربي'), 'وجبة عربي عائلي لحمة', '3 ساندوتش عربي مقطع + مخلل + محمرة + عيش سوري', 350, null, null, false, true, 7),
  ((select id from public.categories where name = 'أطباق العربي'), 'وجبة عربي عائلي ميكس', '3 ساندوتش عربي مقطع + مخلل + محمرة + عيش سوري', 350, null, null, false, true, 8),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا مرجريتا', null, null, 115, 140, false, true, 0),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا خضراوات', null, null, 115, 140, false, true, 1),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا سوسيس', null, null, 135, 155, false, true, 2),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا سجق', null, null, 135, 155, false, true, 3),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا لحم مفروم', null, null, 135, 160, false, true, 4),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا تشيش', null, null, 135, 160, false, true, 5),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا كريسبي', null, null, 135, 160, false, true, 6),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا شاورما فراخ', null, null, 135, 160, false, true, 7),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا شاورما لحم', null, null, 140, 165, false, true, 8),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا ميكس شاورما', null, null, 140, 165, false, true, 9),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا ميكس لحوم', null, null, 140, 165, false, true, 10),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا ميكس فراخ', null, null, 130, 140, false, true, 11),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا ماشروم', null, null, 130, 150, false, true, 12),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا جمبري', null, null, 155, 170, false, true, 13),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا تشيكن رانش', null, null, 145, 165, false, true, 14),
  ((select id from public.categories where name = 'البيتزا'), 'بيتزا تشيكن باربيكيو', null, null, 145, 165, false, true, 15),
  ((select id from public.categories where name = 'المكرونات'), 'نجرسكو فراخ', null, 110, null, null, true, true, 0),
  ((select id from public.categories where name = 'المكرونات'), 'مكرونة بشاميل لحم مفرومة', null, 110, null, null, true, true, 1),
  ((select id from public.categories where name = 'المكرونات'), 'مكرونة وايت صوص فراخ', null, 110, null, null, true, true, 2),
  ((select id from public.categories where name = 'المكرونات'), 'مكرونة وايت صوص تشيش', null, 110, null, null, true, true, 3),
  ((select id from public.categories where name = 'المكرونات'), 'مكرونة وايت صوص كريسبي', null, 110, null, null, true, true, 4),
  ((select id from public.categories where name = 'الإضافات'), 'بطاطس', null, 10, null, null, true, true, 0),
  ((select id from public.categories where name = 'الإضافات'), 'موتزريلا', null, 15, null, null, true, true, 1),
  ((select id from public.categories where name = 'الإضافات'), 'تشيدر', null, 20, null, null, true, true, 2),
  ((select id from public.categories where name = 'الإضافات'), 'فراخ', null, 25, null, null, true, true, 3),
  ((select id from public.categories where name = 'إضافات البيتزا'), 'حشو أطراف', null, null, 30, 40, false, true, 0),
  ((select id from public.categories where name = 'إضافات البيتزا'), 'إضافات لحم', null, null, 40, 45, false, true, 1),
  ((select id from public.categories where name = 'إضافات البيتزا'), 'إضافات فراخ', null, null, 40, 45, false, true, 2),
  ((select id from public.categories where name = 'إضافات البيتزا'), 'إضافة جمبري', null, null, 50, 60, false, true, 3),
  ((select id from public.categories where name = 'إضافات البيتزا'), 'إضافة موتزريلا', null, null, 30, 40, false, true, 4)
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
