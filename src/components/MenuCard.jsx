import { memo, useState } from "react";
import {
  Plus,
  Minus,
  Heart,
  Sandwich,
  Soup,
  Pizza,
  CookingPot,
  Drumstick,
  Flame,
  Carrot,
  Utensils,
} from "lucide-react";
import { getProductPhoto } from "../data/productImages";

const LEGACY_MENU_PHOTOS = new Set([
  "food-shawarma-chicken.jpg",
  "food-shawarma-beef.jpg",
  "food-pizza.jpg",
  "food-pasta.jpg",
  "food-fatta.jpg",
  "food-crispy.jpg",
  "food-crepe.jpg",
  "food-chicken.jpg",
  "food-arabic.jpg",
  "shawarma-skewer.jpg",
]);

function isLegacyMenuPhoto(url) {
  const filename = url.split(/[?#]/, 1)[0].split("/").pop();
  return LEGACY_MENU_PHOTOS.has(filename);
}

function getItemVisual(item) {
  const title = (item.title || "").toLowerCase();
  const category = (item.category || "").toLowerCase();

  if (title.includes("بيتزا") || category.includes("بيتزا")) return { Icon: Pizza, label: "بيتزا" };
  if (title.includes("كريب") || category.includes("كريب")) return { Icon: Sandwich, label: "كريب" };
  if (title.includes("فتة") || title.includes("فته") || category.includes("فتات")) return { Icon: Soup, label: "فتة شاورما" };
  if (title.includes("مكرون") || title.includes("نجرسكو") || title.includes("بشاميل") || category.includes("مكرون")) {
    return { Icon: CookingPot, label: "مكرونة" };
  }
  if (title.includes("كيلو") || category.includes("أوزان") || category.includes("اوزان")) {
    return { Icon: Flame, label: "شاورما بالوزن" };
  }
  if (category.includes("مقبلات") || category.includes("إضاف") || category.includes("اضاف") || title.includes("بطاطس")) {
    return { Icon: Carrot, label: "إضافة جانبية" };
  }
  if (title.includes("عربي") || title.includes("مقطع") || category.includes("عربي")) {
    return { Icon: Utensils, label: "طبق عربي" };
  }
  if (title.includes("فراخ") || title.includes("دجاج") || title.includes("كريسبي") || title.includes("زنجر") || category.includes("فراخ")) {
    return { Icon: Drumstick, label: "وجبة فراخ" };
  }
  if (title.includes("شاورما") || title.includes("لحم") || title.includes("لحمة") || title.includes("لحمه")) {
    return { Icon: Sandwich, label: "شاورما البيت السوري" };
  }

  return { Icon: Utensils, label: item.category || "من مطبخنا" };
}

function MenuCardImage({ item, source, referenceImage, imageError, onImageError, isFavorite, onToggleFavorite }) {
  const { Icon, label } = getItemVisual(item);

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl mb-2.5 overflow-hidden bg-[#F4F0EA] group-hover:shadow-sm transition-all">
      {source && !imageError ? (
        <img
          src={source}
          alt={referenceImage ? `صورة توضيحية لـ ${item.title}` : item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={onImageError}
        />
      ) : (
        <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center gap-2 bg-[#F4F0EA] text-[#6E1B29]">
          <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/80 border border-[#E7DED2] flex items-center justify-center">
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.6} aria-hidden="true" />
          </div>
          <span className="relative z-10 text-[10px] sm:text-[11px] font-bold tracking-wide">{label}</span>
        </div>
      )}

      {source && !imageError && referenceImage && (
        <span className="absolute bottom-2 right-2 rounded-full border border-white/30 bg-black/55 px-2 py-1 text-[8px] font-bold text-white/95 backdrop-blur-sm">
          صورة توضيحية
        </span>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(item.id);
        }}
        className={`absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          isFavorite
            ? "text-brand-500 bg-white shadow-brand-500/20 scale-105"
            : "text-gray-600 bg-white/95 hover:text-brand-500 hover:bg-white"
        }`}
        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-pressed={isFavorite}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
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
        className={`flex-1 min-h-9 rounded-md transition-all ${
          selectedSize === "M" ? "bg-white text-[#8C2334] shadow-xs" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        وسط: {item.priceM} ج
      </button>
      <button
        type="button"
        onClick={() => onSelectSize("L")}
        className={`flex-1 min-h-9 rounded-md transition-all ${
          selectedSize === "L" ? "bg-white text-[#8C2334] shadow-xs" : "text-gray-500 hover:text-gray-800"
        }`}
      >
        كبير: {item.priceL} ج
      </button>
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-brand-50 p-1" dir="ltr" aria-label={`الكمية في السلة ${quantity}`}>
      <button type="button" onClick={onDecrease} aria-label="تقليل الكمية" className="w-9 h-9 rounded-full bg-white text-[#8C2334] flex items-center justify-center shadow-sm">
        <Minus className="w-4 h-4" />
      </button>
      <span aria-live="polite" className="min-w-5 text-center text-sm font-black text-gray-900">{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="زيادة الكمية" className="w-9 h-9 rounded-full bg-[#8C2334] text-white flex items-center justify-center shadow-sm">
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
      className="min-h-11 min-w-[76px] px-3 rounded-full bg-[#8C2334] hover:bg-[#6E1B29] disabled:bg-gray-300 disabled:shadow-none text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
      aria-label={`أضف ${item.title} للسلة`}
      title={available ? "أضف للسلة" : "السعر غير محدد أو الصنف غير متاح"}
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span className="text-xs font-black">أضف</span>
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
  const customImage = typeof item.imageUrl === "string" ? item.imageUrl.trim() : "";
  const referencePhoto = getProductPhoto(item);
  const legacyImage = customImage && isLegacyMenuPhoto(customImage);
  const referenceImage = (!customImage || legacyImage) && Boolean(referencePhoto);
  const imageSource = customImage && !legacyImage ? customImage : referencePhoto || customImage || "";

  return (
    <article className="bg-white rounded-[1.35rem] p-2.5 sm:p-3 shadow-[0_4px_18px_-10px_rgba(39,29,27,0.16)] border border-[#E8DFD5] flex flex-col justify-between hover:border-[#D4C7B9] hover:shadow-[0_12px_24px_-16px_rgba(39,29,27,0.24)] transition-all duration-200 relative group">
      <MenuCardImage
        item={item}
        source={imageSource}
        referenceImage={referenceImage}
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
