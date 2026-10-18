import { memo, useState } from "react";
import { Plus, Heart, Star } from "lucide-react";

// ─── Food Image Mapping ────────────────────────────────────────
// Maps keywords in item titles/categories to real food photos.
// Falls back to categorized emojis for items without specific images.
const FOOD_IMAGES = {
  // Shawarma sandwiches
  "شاورما فراخ": "/food-shawarma-chicken.jpg",
  "شاورما دجاج": "/food-shawarma-chicken.jpg",
  "شاورما لحم": "/food-shawarma-beef.jpg",
  "شاورما لحمة": "/food-shawarma-beef.jpg",
  "شاورما ميكس": "/food-shawarma-beef.jpg",
  "شاورما كريسبي": "/food-crispy.jpg",
  // Crispy & Zinger
  "كريسبي": "/food-crispy.jpg",
  "زنجر": "/food-crispy.jpg",
  // Crepes with shawarma
  "كريب شاورما دجاج": "/food-shawarma-chicken.jpg",
  "كريب شاورما لحمة": "/food-shawarma-beef.jpg",
  "كريب شاورما ميكس": "/food-shawarma-beef.jpg",
  "كريب كريسبي": "/food-crispy.jpg",
  "كريب زنجر": "/food-crispy.jpg",
  // Fatta dishes
  "فتة شاورما دجاج": "/food-shawarma-chicken.jpg",
  "فتة شاورما لحمة": "/food-shawarma-beef.jpg",
  "فتة شاورما ميكس": "/food-shawarma-beef.jpg",
  "فتة شيش طاووق": "/food-shawarma-chicken.jpg",
  // Shish Tawook
  "شيش طاووق": "/food-shawarma-chicken.jpg",
  // Weight shawarma
  "كيلو شاورما فراخ": "/food-shawarma-chicken.jpg",
  "كيلو شاورما لحمة": "/food-shawarma-beef.jpg",
  // Arabic dishes
  "عربي مقطع": "/food-shawarma-beef.jpg",
  "عربي عائلي": "/food-shawarma-beef.jpg",
};

function getItemImage(item) {
  const title = (item.title || "").trim();

  // 1. Try exact title match first
  if (FOOD_IMAGES[title]) return FOOD_IMAGES[title];

  // 2. Try partial match on title keywords
  for (const [keyword, imgPath] of Object.entries(FOOD_IMAGES)) {
    if (title.includes(keyword)) return imgPath;
  }

  // 3. No image match — return null (will use emoji fallback)
  return null;
}

// Categorized emojis for items without real images
function getItemEmoji(item) {
  const t = (item.title || "").toLowerCase();
  const c = (item.category || "").toLowerCase();

  if (t.includes("برجر") || c.includes("برجر")) return "🍔";
  if (t.includes("بيتزا") || c.includes("بيتزا")) return "🍕";
  if (t.includes("كريب") || c.includes("كريب")) return "🥞";
  if (t.includes("شاورما") || c.includes("شاورما")) return "🌯";
  if (t.includes("فراخ") || t.includes("دجاج") || c.includes("شواية")) return "🍗";
  if (t.includes("بطاطس") || c.includes("غربي")) return "🍟";
  if (t.includes("فتة") || c.includes("فتات")) return "🍚";
  if (t.includes("مكرونة") || c.includes("مكرونات")) return "🍝";
  if (c.includes("مقبلات") || t.includes("تومية")) return "🧄";
  if (t.includes("سمبوسة")) return "🥟";
  if (t.includes("أرز") || t.includes("رز")) return "🍚";
  if (t.includes("سلطة")) return "🥗";
  if (t.includes("طحينة")) return "🫙";
  if (t.includes("مخلل")) return "🥒";
  if (t.includes("عيش")) return "🫓";
  if (t.includes("محمره")) return "🌶️";
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
  const rating = (4.6 + ((numId * 7) % 4) * 0.1).toFixed(1);
  const reviewCount = 60 + ((numId * 17) % 190);

  function handleAdd() {
    if (hasSizes) {
      onAdd(item.id, selectedSize);
    } else {
      onAdd(item.id, null);
    }
  }

  return (
    <article className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100/90 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group">
      {/* ─── Top Favorite Heart ─── */}
      <div className="flex items-center justify-end mb-1">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isFavorite ? "text-red-500 bg-red-50" : "text-gray-300 hover:text-red-400 bg-gray-50"
          }`}
          aria-label="إضافة للمفضلة"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* ─── Center Visual: Real Image or Emoji Fallback ── */}
      {foodImage && !imgError ? (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-2 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
          <img
            src={foodImage}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-orange-50/70 to-[#FFF0F2]/60 mx-auto flex items-center justify-center text-3xl sm:text-4xl mb-2 shadow-inner group-hover:scale-105 transition-transform">
          <span className="select-none filter drop-shadow-xs">{emoji}</span>
        </div>
      )}

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

