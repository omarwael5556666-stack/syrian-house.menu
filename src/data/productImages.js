const photo = (name) => `/menu-photos/${name}.jpg`;

const photos = {
  beefShawarma: photo("shawarma-beef"),
  shawarmaWrap: photo("shawarma-wraps"),
  shawarmaPocket: photo("shawarma-pocket"),
  shawarmaWeightChicken: photo("shawarma-weight-chicken"),
  shawarmaRiceChicken: photo("shawarma-rice-chicken"),
  shawarmaBeefReference: photo("shawarma-beef-reference"),
  shawarmaRiceMix: photo("shawarma-rice-mix"),
  arabicShawarma: photo("shawarma-arabic"),
  crepeTriangle: photo("crepe-triangle"),
  pizzaMargherita: photo("pizza-margherita"),
  pizzaVegetable: photo("pizza-vegetable"),
  pizzaSausage: photo("pizza-sausage"),
  pizzaChicken: photo("pizza-bbq-chicken"),
  pizzaSeafood: photo("pizza-seafood"),
  pastaChicken: photo("pasta-white-sauce"),
  pastaBaked: photo("pasta-baked-reference"),
  fries: photo("fries-bowl"),
  grilledChicken: photo("grilled-chicken-rice"),
  grilledChickenFlatbread: photo("grilled-chicken-flatbread"),
  friedChicken: photo("fried-chicken-basket"),
  crispySandwich: photo("crispy-chicken-sandwich"),
  zingerFlatbread: photo("zinger-flatbread"),
  tawookPitaWrap: photo("tawook-pita-wrap"),
  crispySides: photo("crispy-chicken-sides"),
  samosa: photo("samosa"),
  samosaGolden: photo("samosa-golden"),
  skewers: photo("chicken-skewers"),
  garlicDip: photo("toum"),
  pickles: photo("pickles"),
  coleslaw: photo("coleslaw"),
  rice: photo("rice-bowl"),
};

function includesAny(value, words) {
  return words.some((word) => value.includes(word));
}

const MEAT_WORDS = ["لحمة", "لحمه", "لحم", "لحوم"];
const CHICKEN_WORDS = ["فراخ", "دجاج", "تشيش", "طاووق", "رانش", "باربيكيو"];

export function getProductPhoto(item) {
  const title = (item?.title || "").trim().toLowerCase();
  const category = (item?.category || "").trim();

  // Toppings are ingredients, so a full pizza photo would describe a different product.
  if (category.includes("إضافات البيتزا")) return null;

  if (category.includes("البيتزا")) {
    if (title.includes("جمبري")) return photos.pizzaSeafood;
    if (includesAny(title, ["خضراوات", "خضروات", "ماشروم"])) return photos.pizzaVegetable;
    if (includesAny(title, ["سوسيس", "سجق", "لحم", "لحمة", "لحمه", "لحوم", "ميكس لحوم"])) {
      return photos.pizzaSausage;
    }
    if (includesAny(title, ["فراخ", "دجاج", "كريسبي", "تشيش", "رانش", "باربيكيو", "شاورما"])) {
      return photos.pizzaChicken;
    }
    return photos.pizzaMargherita;
  }

  if (category.includes("المكرونات")) {
    if (includesAny(title, ["بشاميل", "نجرسكو"])) return photos.pastaBaked;
    return photos.pastaChicken;
  }

  if (category.includes("الكريبات")) {
    return photos.crepeTriangle;
  }

  if (category.includes("فتات الشاورما") || title.includes("فتة") || title.includes("فته")) {
    if (title.includes("ميكس") || title.includes("مشكل")) return photos.shawarmaRiceMix;
    if (includesAny(title, MEAT_WORDS)) return photos.shawarmaBeefReference;
    return photos.shawarmaRiceChicken;
  }

  if (category.includes("أطباق العربي")) return photos.arabicShawarma;

  if (category.includes("المقبلات")) {
    if (title.includes("تومية")) return photos.garlicDip;
    if (title.includes("مخلل")) return photos.pickles;
    if (title.includes("سمبوسة") && title.includes("لحمة")) return photos.samosaGolden;
    if (title.includes("سمبوسة")) return photos.samosa;
    if (title.includes("أرز")) return photos.rice;
    if (title.includes("كولسلو")) return photos.coleslaw;
    if (title.includes("بطاطس")) return photos.fries;

    // No bread, tahini, or muhammara photo is close enough in the current library.
    return null;
  }

  if (category.includes("وجبات الغربي")) {
    if (includesAny(title, ["كريسبي", "زنجر"])) return photos.friedChicken;
    if (includesAny(title, ["طاووق", "تشيش"])) return photos.skewers;
    return photos.crispySides;
  }

  if (category.includes("الفراخ الشواية")) {
    return title.includes("سادة") ? photos.grilledChickenFlatbread : photos.grilledChicken;
  }

  if (category.includes("أوزان الشاورما")) {
    if (title.includes("كريسبي")) return photos.crispySides;
    if (title.includes("شيش")) return photos.skewers;
    if (includesAny(title, MEAT_WORDS)) return photos.arabicShawarma;
    return photos.shawarmaWeightChicken;
  }

  if (category === "الإضافات") {
    return title.includes("بطاطس") ? photos.fries : null;
  }

  if (category.includes("سندوتشات")) {
    if (title.includes("بطاطس")) return photos.fries;
    if (title.includes("شاورما") && title.includes("كريسبي")) return photos.shawarmaPocket;
    if (title.includes("زنجر")) return photos.zingerFlatbread;
    if (includesAny(title, ["شيش", "طاووق"])) return photos.tawookPitaWrap;
    if (title.includes("كريسبي")) return photos.crispySandwich;
    if (includesAny(title, MEAT_WORDS)) return photos.beefShawarma;
    if (includesAny(title, CHICKEN_WORDS) || title.includes("شاورما") || title.includes("ميكس")) {
      return photos.shawarmaWrap;
    }
    return null;
  }

  return null;
}
