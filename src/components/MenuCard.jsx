import { memo, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function FavoriteButton({ item, isFavorite, onToggleFavorite, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onToggleFavorite(item.id)}
      className={cx("menu-item-favorite", className)}
      aria-label={isFavorite ? `إزالة ${item.title} من المفضلة` : `إضافة ${item.title} للمفضلة`}
      aria-pressed={isFavorite}
    >
      <Heart className={isFavorite ? "fill-current" : ""} aria-hidden="true" />
    </button>
  );
}

function SizeSelector({ item, selectedSize, onSelectSize, className = "" }) {
  const sizes = [
    { id: "M", label: "وسط", price: item.priceM },
    { id: "L", label: "كبير", price: item.priceL },
  ];

  return (
    <div className={cx("menu-size-choices", className)} role="group" aria-label={`مقاس ${item.title}`}>
      {sizes.map((size) => (
        <button
          key={size.id}
          type="button"
          onClick={() => onSelectSize(size.id)}
          className="menu-size-choice"
          aria-pressed={selectedSize === size.id}
        >
          <span>{size.label}</span>
          <span className="menu-size-choice-price" dir="ltr">{size.price} ج</span>
        </button>
      ))}
    </div>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease, canIncrease = true, className = "" }) {
  return (
    <div
      className={cx("menu-item-quantity", className)}
      dir="ltr"
      aria-label={`الكمية في السلة ${quantity}`}
    >
      <button type="button" onClick={onDecrease} aria-label="تقليل الكمية" className="menu-item-step">
        <Minus aria-hidden="true" />
      </button>
      <span aria-live="polite" className="menu-item-quantity-value">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label="زيادة الكمية"
        className="menu-item-step menu-item-step-primary"
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
}

function AddToCartButton({ item, available, canOrder, onAdd, className = "" }) {
  const buttonTitle = !Number.isFinite(item.price) && !Number.isFinite(item.priceM)
    ? "السعر غير محدد"
    : item.isAvailable === false
      ? "الصنف غير متاح حاليًا"
      : !canOrder
        ? "المطعم لا يستقبل طلبات الآن"
      : "أضف للسلة";

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={!available}
      className={cx("menu-item-add", className)}
      aria-label={`أضف ${item.title} للسلة`}
      title={buttonTitle}
    >
      <Plus aria-hidden="true" />
      <span>أضف</span>
    </button>
  );
}

function MenuCard({
  item,
  onAdd,
  isFavorite,
  onToggleFavorite,
  quantityForSize,
  onSetQuantity,
  canOrder = true,
  className = "",
}) {
  const [selectedSize, setSelectedSize] = useState("M");
  const hasSizes = Number.isFinite(item.priceM) && Number.isFinite(item.priceL);
  const price = hasSizes ? (selectedSize === "M" ? item.priceM : item.priceL) : item.price;
  const quantity = quantityForSize?.(hasSizes ? selectedSize : null) || 0;
  const available = canOrder && item.isAvailable !== false && Number.isFinite(price) && price >= 0;
  const priceLabel = Number.isFinite(price) ? `${price} ج.م` : "السعر غير محدد";

  return (
    <article className={cx("menu-item-row", className)} role="listitem">
      <div className="menu-item-identity">
        <div className="menu-item-name-line">
          <h3 className="menu-item-name">
            {item.title}
            {item.isNew && <span className="new-badge ms-2 align-middle">جديد</span>}
          </h3>
          <FavoriteButton item={item} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
        </div>

        {hasSizes && (
          <SizeSelector item={item} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
        )}

        {item.isAvailable === false && (
          <p className="menu-item-unavailable" role="status">غير متاح حاليًا</p>
        )}
      </div>

      <div className="menu-item-purchase">
        {!hasSizes && (
          <p className={cx("menu-item-price", !Number.isFinite(price) && "menu-item-price-unknown")}>
            {priceLabel}
          </p>
        )}
        {quantity > 0 ? (
          <QuantityControl
            quantity={quantity}
            canIncrease={available}
            onDecrease={() => onSetQuantity(hasSizes ? selectedSize : null, quantity - 1)}
            onIncrease={() => onSetQuantity(hasSizes ? selectedSize : null, quantity + 1)}
          />
        ) : (
          <AddToCartButton
            item={item}
            available={available}
            canOrder={canOrder}
            onAdd={() => onAdd(item.id, hasSizes ? selectedSize : null)}
          />
        )}
      </div>
    </article>
  );
}

export default memo(MenuCard);
