import { memo, useState } from "react";
import { Plus, Heart, Star } from "lucide-react";

// ─── Real Food Photography Mapping ──────────────────────────────
// Maps menu items & categories directly to authentic Syrian food photos.
const FOOD_PHOTOS = {
  shawarmaChicken: "/food-shawarma-chicken.jpg",
  shawarmaBeef: "/food-shawarma-beef.jpg",
  crispy: "/food-crispy.jpg",
  crepe: "/food-crepe.jpg",
  fatta: "/food-fatta.jpg",
  arabicPlatter: "/food-arabic.jpg",
  pizza: "/food-pizza.jpg",
  pasta: "/food-pasta.jpg",
  chicken: "/food-chicken.jpg",
  skewer: "/shawarma-skewer.jpg",
};

function getItemImage(item) {
  if (!item) return null;
  const t = (item.title || "").toLowerCase();
  const c = (item.category || "").toLowerCase();

  // 1. Pizza Category or Title
  if (c.includes("بيتزا") || t.includes("بيتزا")) {
    return FOOD_PHOTOS.pizza;
  }

  // 2. Crepes Category or Title
  if (c.includes("كريب") || t.includes("كريب")) {
    return FOOD_PHOTOS.crepe;
  }

  // 3. Fatta Dishes
  if (t.includes("فتة") || t.includes("فته") || c.includes("فتات")) {
    return FOOD_PHOTOS.fatta;
  }

  // 4. Arabic Platters (عربي مقطع / عربي عائلي)
  if (t.includes("عربي") || t.includes("مقطع")) {
    return FOOD_PHOTOS.arabicPlatter;
  }

  // 5. Pasta & Negresco
  if (
    c.includes("مكرون") ||
    t.includes("مكرون") ||
    t.includes("نجرسكو") ||
    t.includes("بشاميل") ||
    t.includes("وايت صوص")
  ) {
    return FOOD_PHOTOS.pasta;
  }

  // 6. Grilled / Rotisserie Chicken
  if (
    c.includes("شواية") ||
    c.includes("شوايه") ||
    t.includes("مشوية") ||
    t.includes("مشويه") ||
    t.includes("شواية") ||
    t.includes("فرخة") ||
    t.includes("فرخه")
  ) {
    return FOOD_PHOTOS.chicken;
  }

  // 7. Shawarma by Weight (كيلو / نصف / ربع)
  if (c.includes("أوزان") || c.includes("اوزان") || t.includes("كيلو")) {
    return FOOD_PHOTOS.skewer;
  }

  // 8. Western Meals (وجبات الغربي)
  if (c.includes("غربي") || c.includes("وجبات")) {
    if (t.includes("طاووق") || t.includes("شيش")) return FOOD_PHOTOS.shawarmaChicken;
    return FOOD_PHOTOS.crispy;
  }

  // 9. Crispy & Zinger Sandwiches
  if (t.includes("كريسبي") || t.includes("زنجر")) {
    return FOOD_PHOTOS.crispy;
  }

  // 10. Shish Tawook
  if (t.includes("شيش") || t.includes("طاووق")) {
    return FOOD_PHOTOS.shawarmaChicken;
  }

  // 11. Shawarma Sandwiches (Beef vs Chicken)
  if (t.includes("لحم") || t.includes("لحمة") || t.includes("لحمه") || t.includes("ميكس")) {
    return FOOD_PHOTOS.shawarmaBeef;
  }

  if (t.includes("شاورما") || t.includes("فراخ") || t.includes("دجاج")) {
    return FOOD_PHOTOS.shawarmaChicken;
  }

  // 12. Appetizers & Sides & Extras
  if (
    c.includes("مقبلات") ||
    c.includes("إضاف") ||
    c.includes("اضاف") ||
    t.includes("بطاطس") ||
    t.includes("تومية") ||
    t.includes("سمبوسة")
  ) {
    return FOOD_PHOTOS.arabicPlatter;
  }

  return FOOD_PHOTOS.shawarmaChicken;
}

// Fallback categorized emojis for appetizing visuals
function getItemEmoji(item) {
  const t = (item.title || "").toLowerCase();
  const c = (item.category || "").toLowerCase();

  if (t.includes("بيتزا") || c.includes("بيتزا")) return "🍕";
  if (t.includes("كريب") || c.includes("كريب")) return "🥞";
  if (t.includes("شاورما") || c.includes("شاورما")) return "🌯";
  if (t.includes("فراخ") || t.includes("دجاج") || c.includes("شواية")) return "🍗";
  if (t.includes("بطاطس") || c.includes("غربي")) return "🍟";
  if (t.includes("فتة") || c.includes("فتات")) return "🍚";
  if (t.includes("مكرونة") || c.includes("مكرونات")) return "🍝";
  if (c.includes("مقبلات") || t.includes("تومية")) return "🧄";
  return "🍲";
}

function getNumericId(id) {
  if (typeof id === "number" && !Number.isNaN(id)) return id;
  const s = String(id || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function MenuCard({ item, index, onAdd }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [imgError, setImgError] = useState(false);
  const hasSizes = item.priceM != null && item.priceL != null;

  const foodImage = getItemImage(item);
  const emoji = getItemEmoji(item);

  const numId = getNumericId(item.id);
  const rating = (4.7 + ((numId * 7) % 3) * 0.1).toFixed(1);
  const reviewCount = 80 + ((numId * 19) % 210);

  function handleAdd() {
    if (hasSizes) {
      onAdd(item.id, selectedSize);
    } else {
      onAdd(item.id, null);
    }
  }

  return (
    <article className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-gray-100/90 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group">
      {/* ─── Real Food Visual with Floating Heart ──── */}
      <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl mb-2.5 overflow-hidden bg-gradient-to-b from-orange-50/50 to-gray-50 shadow-inner group-hover:shadow-sm transition-all">
        {foodImage && !imgError ? (
          <img
            src={foodImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            <span className="select-none filter drop-shadow-xs">{emoji}</span>
          </div>
        )}

        {/* Top Favorite Heart (Floating on Image) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xs ${
            isFavorite
              ? "text-red-500 bg-white/95 shadow-red-500/20 scale-105"
              : "text-gray-600 hover:text-red-500 bg-white/80 hover:bg-white"
          }`}
          aria-label="إضافة للمفضلة"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* ─── Product Title & Description ───────────── */}
      <div className="mb-2 text-right">
        <h3 className="font-black text-gray-900 text-xs sm:text-sm leading-snug line-clamp-1">
          {item.title}
        </h3>

        {item.description ? (
          <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed mt-0.5 line-clamp-2 min-h-[28px]">
            {item.description}
          </p>
        ) : (
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 line-clamp-1 min-h-[28px]">
            {item.category}
          </p>
        )}

        {/* Rating row */}
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-bold">
          <Star className="w-3 h-3 text-amber-400 fill-current" />
          <span>{rating}</span>
          <span className="text-gray-400 font-normal">({reviewCount}+)</span>
        </div>
      </div>

      {/* ─── Bottom Price & Add Action ─────────────── */}
      <div className="pt-2 border-t border-gray-100 mt-auto">
        {hasSizes ? (
          <div>
            {/* Size Selector Tabs */}
            <div className="flex items-center justify-between gap-1 mb-2 bg-gray-100/90 p-0.5 rounded-lg text-[10px] font-black">
              <button
                type="button"
                onClick={() => setSelectedSize("M")}
                className={`flex-1 py-1 rounded-md transition-all ${
                  selectedSize === "M"
                    ? "bg-white text-[#E4002B] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                M: {item.priceM} ج
              </button>
              <button
                type="button"
                onClick={() => setSelectedSize("L")}
                className={`flex-1 py-1 rounded-md transition-all ${
                  selectedSize === "L"
                    ? "bg-white text-[#E4002B] shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                L: {item.priceL} ج
              </button>
            </div>

            {/* Price and Add button */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 block leading-none mb-0.5">السعر</span>
                <span className="text-xs sm:text-sm font-black text-gray-900 tabular-nums">
                  {selectedSize === "M" ? item.priceM : item.priceL} ج.م
                </span>
              </div>
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full bg-[#E4002B] hover:bg-[#C8102E] text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
                title="أضف للسلة"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[9px] text-gray-400 block leading-none mb-0.5">السعر</span>
              <span className="text-xs sm:text-sm font-black text-gray-900 tabular-nums">
                {item.price} ج.م
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-[#E4002B] hover:bg-[#C8102E] text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
              title={`أضف ${item.title} للسلة`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(MenuCard);
