const photo = (name) => `/menu-photos/${name}.jpg`;

const photos = {
  beefShawarma: photo("shawarma-beef"),
  shawarmaSpit: photo("shawarma-spit"),
  shawarmaWrap: photo("shawarma-wrap"),
  chickenRice: photo("chicken-rice-bowl"),
  crepeMeat: photo("crepe-meat"),
  crepeSavory: photo("crepe-savory"),
  pizzaMargherita: photo("pizza-margherita"),
  pizzaVegetable: photo("pizza-vegetable"),
  pizzaSausage: photo("pizza-sausage"),
  pizzaChicken: photo("pizza-bbq-chicken"),
  pizzaSeafood: photo("pizza-seafood"),
  pastaChicken: photo("pasta-chicken"),
  pastaBaked: photo("pasta-baked"),
  loadedFries: photo("fries-loaded"),
  mezze: photo("mezze-platter"),
  arabicChicken: photo("arabic-chicken-plate"),
  grilledChicken: photo("grilled-chicken-flatbread"),
  friedChicken: photo("fried-chicken-basket"),
  crispySides: photo("crispy-chicken-sides"),
  samosa: photo("samosa"),
  samosaGolden: photo("samosa-golden"),
  skewers: photo("chicken-skewers"),
  hummus: photo("hummus-pita"),
  creamyDip: photo("creamy-dip"),
  pickles: photo("pickles"),
  coleslaw: photo("coleslaw"),
  rice: photo("rice"),
};

function includesAny(value, words) {
  return words.some((word) => value.includes(word));
}

export function getProductPhoto(item) {
  const title = (item?.title || "").trim().toLowerCase();
  const category = (item?.category || "").trim();

  if (category.includes("إضافات البيتزا")) {
    if (title.includes("جمبري")) return photos.pizzaSeafood;
    if (includesAny(title, ["فراخ", "دجاج"])) return photos.pizzaChicken;
    if (includesAny(title, ["لحم", "لحمة", "لحمه", "سجق", "سوسيس"])) return photos.pizzaSausage;
    return photos.pizzaMargherita;
  }

  if (category.includes("البيتزا")) {
    if (title.includes("جمبري")) return photos.pizzaSeafood;
    if (includesAny(title, ["خضراوات", "ماشروم"])) return photos.pizzaVegetable;
    if (includesAny(title, ["سوسيس", "سجق"])) return photos.pizzaSausage;
    if (includesAny(title, ["فراخ", "دجاج", "كريسبي", "تشيش", "رانش", "باربيكيو"])) return photos.pizzaChicken;
    if (includesAny(title, ["لحم", "لحمة", "لحمه", "لحوم", "ميكس"])) return photos.pizzaSausage;
    return photos.pizzaMargherita;
  }

  if (category.includes("المكرونات")) {
    return includesAny(title, ["لحم", "لحمة", "لحمه", "بشاميل"]) ? photos.pastaBaked : photos.pastaChicken;
  }

  if (category.includes("الكريبات")) {
    if (includesAny(title, ["لحمة", "لحمه", "لحم"])) return photos.crepeMeat;
    if (title.includes("شيش") || title.includes("طاووق") || title.includes("فاهيتا")) return photos.grilledChicken;
    if (includesAny(title, ["زنجر", "كريسبي"])) return photos.crispySides;
    if (title.includes("شاورما") || title.includes("ميكس") || title.includes("فراخ")) return photos.shawarmaWrap;
    return photos.crepeSavory;
  }

  if (category.includes("فتات الشاورما") || title.includes("فتة") || title.includes("فته")) {
    if (includesAny(title, ["لحمة", "لحمه", "لحم"])) return photos.beefShawarma;
    if (title.includes("شيش")) return photos.skewers;
    return photos.chickenRice;
  }

  if (category.includes("أطباق العربي")) {
    if (title.includes("عائلي")) return photos.mezze;
    if (includesAny(title, ["لحمة", "لحمه", "لحم"])) return photos.beefShawarma;
    if (includesAny(title, ["فراخ", "دجاج"])) return photos.arabicChicken;
    return photos.chickenRice;
  }

  if (category.includes("المقبلات")) {
    if (title.includes("تومية")) return photos.creamyDip;
    if (title.includes("طحينة")) return photos.hummus;
    if (title.includes("مخلل")) return photos.pickles;
    if (title.includes("محمره")) return photos.mezze;
    if (title.includes("سمبوسة") && title.includes("لحمة")) return photos.samosaGolden;
    if (title.includes("سمبوسة")) return photos.samosa;
    if (title.includes("أرز")) return photos.rice;
    if (title.includes("كولسلو")) return photos.coleslaw;
    if (title.includes("بطاطس")) return photos.loadedFries;
    if (title.includes("كريب")) return photos.crepeSavory;
    if (title.includes("محمص") || title.includes("سوري")) return photos.hummus;
    return photos.mezze;
  }

  if (category.includes("وجبات الغربي")) {
    if (includesAny(title, ["كريسبي", "زنجر"])) return photos.friedChicken;
    if (title.includes("طاووق") || title.includes("تشيش")) return photos.grilledChicken;
    return photos.crispySides;
  }

  if (category.includes("الفراخ الشواية")) return photos.arabicChicken;

  if (category.includes("أوزان الشاورما")) {
    if (title.includes("كريسبي")) return photos.crispySides;
    if (title.includes("شيش")) return photos.skewers;
    if (includesAny(title, ["لحمة", "لحمه", "لحم"])) return photos.beefShawarma;
    return photos.shawarmaSpit;
  }

  if (category.includes("الإضافات")) {
    if (title.includes("بطاطس")) return photos.loadedFries;
    if (includesAny(title, ["موتزريلا", "تشيدر"])) return photos.pizzaMargherita;
    if (includesAny(title, ["فراخ", "دجاج"])) return photos.crispySides;
    return photos.mezze;
  }

  if (category.includes("سندوتشات")) {
    if (title.includes("بطاطس")) return photos.loadedFries;
    if (includesAny(title, ["كريسبي", "زنجر"])) return photos.friedChicken;
    if (title.includes("شيش") || title.includes("طاووق")) return photos.grilledChicken;
    if (includesAny(title, ["لحمة", "لحمه", "لحم"])) return photos.beefShawarma;
    if (title.includes("ميكس")) return photos.shawarmaWrap;
    return photos.shawarmaWrap;
  }

  return null;
}
