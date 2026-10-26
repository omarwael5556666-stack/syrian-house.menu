import { memo, useState } from "react";
import { Plus, Minus, Heart, ImageOff } from "lucide-react";

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
  if (item.imageUrl) return item.imageUrl;
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

function MenuCardImage({ item, source, imageError, onImageError, isFavorite, onToggleFavorite }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl mb-2.5 overflow-hidden bg-gradient-to-b from-orange-50/50 to-gray-50 shadow-inner group-hover:shadow-sm transition-all">
      {source && !imageError ? (
        <img
          src={source}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={onImageError}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
          <ImageOff className="w-7 h-7" />
          <span className="text-[10px] font-bold">صورة غير متاحة</span>
        </div>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(item.id);
        }}
        className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xs ${
          isFavorite
            ? "text-red-500 bg-white/95 shadow-red-500/20 scale-105"
            : "text-gray-600 hover:text-red-500 bg-white/80 hover:bg-white"
        }`}
        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-pressed={isFavorite}
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}

function MenuCardDetails({ item }) {
  return (
    <div className="mb-2 text-right">
      <h3 className="font-black text-gray-900 text-sm leading-snug line-clamp-2 min-h-10">
        {item.title}
        {item.isNew && <span className="new-badge ms-1.5 align-middle">جديد</span>}
      </h3>

      {item.description ? (
        <p className="text-xs text-gray-600 leading-relaxed mt-1 line-clamp-3 min-h-[48px]">
          {item.description}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[48px]">
          {item.category}
        </p>
      )}

      {item.isAvailable === false && (
        <p className="mt-1 text-[11px] font-bold text-red-600">غير متاح حاليًا</p>
      )}
    </div>
  );
}

function SizeSelector({ item, selectedSize, onSelectSize }) {
  return (
    <div className="flex items-center justify-between gap-1 mb-2 bg-gray-100/90 p-0.5 rounded-lg text-xs font-black">
      <button
        type="button"
        onClick={() => onSelectSize("M")}
        className={`flex-1 py-1 rounded-md transition-all ${
          selectedSize === "M" ? "bg-white text-[#E4002B] shadow-xs" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        وسط: {item.priceM} ج
      </button>
      <button
        type="button"
        onClick={() => onSelectSize("L")}
        className={`flex-1 py-1 rounded-md transition-all ${
          selectedSize === "L" ? "bg-white text-[#E4002B] shadow-xs" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        كبير: {item.priceL} ج
      </button>
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-red-50 p-1" dir="ltr" aria-label={`الكمية في السلة ${quantity}`}>
      <button type="button" onClick={onDecrease} aria-label="تقليل الكمية" className="w-8 h-8 rounded-full bg-white text-[#E4002B] flex items-center justify-center shadow-sm">
        <Minus className="w-4 h-4" />
      </button>
      <span aria-live="polite" className="min-w-5 text-center text-sm font-black text-gray-900">{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="زيادة الكمية" className="w-8 h-8 rounded-full bg-[#E4002B] text-white flex items-center justify-center shadow-sm">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function CardAction({ item, quantity, available, onAdd, onSetQuantity }) {
  if (quantity > 0) {
    return (
      <QuantityControl
        quantity={quantity}
        onDecrease={() => onSetQuantity(quantity - 1)}
        onIncrease={() => onSetQuantity(quantity + 1)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={!available}
      className="w-9 h-9 rounded-full bg-[#E4002B] hover:bg-[#C8102E] disabled:bg-gray-300 disabled:shadow-none text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
      aria-label={`أضف ${item.title} للسلة`}
      title={available ? "أضف للسلة" : "السعر غير محدد أو الصنف غير متاح"}
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}

function CardPurchaseArea({
  item,
  hasSizes,
  selectedSize,
  onSelectSize,
  price,
  quantity,
  available,
  onAdd,
  onSetQuantity,
}) {
  const priceLabel = hasSizes
    ? `${price} ج.م`
    : Number.isFinite(item.price)
      ? `${item.price} ج.م`
      : "السعر غير محدد";

  return (
    <div className="pt-2 border-t border-gray-100 mt-auto">
      {hasSizes && <SizeSelector item={item} selectedSize={selectedSize} onSelectSize={onSelectSize} />}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] text-gray-400 block leading-none mb-0.5">السعر</span>
          <span className="text-xs sm:text-sm font-black text-gray-900 tabular-nums">{priceLabel}</span>
        </div>
        <CardAction
          item={item}
          quantity={quantity}
          available={available}
          onAdd={onAdd}
          onSetQuantity={onSetQuantity}
        />
      </div>
    </div>
  );
}

function MenuCard({ item, onAdd, isFavorite, onToggleFavorite, quantityForSize, onSetQuantity, canOrder = true }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [imageError, setImageError] = useState(false);
  const hasSizes = Number.isFinite(item.priceM) && Number.isFinite(item.priceL);
  const price = hasSizes ? (selectedSize === "M" ? item.priceM : item.priceL) : item.price;
  const quantity = quantityForSize?.(hasSizes ? selectedSize : null) || 0;
  const available = canOrder && item.isAvailable !== false && Number.isFinite(price) && price >= 0;

  return (
    <article className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-gray-100/90 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group">
      <MenuCardImage
        item={item}
        source={getItemImage(item)}
        imageError={imageError}
        onImageError={() => setImageError(true)}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
      <MenuCardDetails item={item} />
      <CardPurchaseArea
        item={item}
        hasSizes={hasSizes}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        price={price}
        quantity={quantity}
        available={available}
        onAdd={() => onAdd(item.id, hasSizes ? selectedSize : null)}
        onSetQuantity={(nextQuantity) => onSetQuantity(hasSizes ? selectedSize : null, nextQuantity)}
      />
    </article>
  );
}

export default memo(MenuCard);
