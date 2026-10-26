import { ChevronLeft, Heart, MapPin, Phone } from "lucide-react";
import EmptyState from "./EmptyState";
import MenuCard from "./MenuCard";
import { getEmptyStateQuery, getMenuSubtitle } from "../lib/menuFilters";

export function MenuHeading({
  activeCategory,
  favoritesOnly,
  itemCount,
  searchQuery,
  settingsReady,
  isOpen,
  settings,
  onToggleFavorites,
  onShowAll,
}) {
  const title = favoritesOnly ? "أصنافي المفضلة" : activeCategory === "الكل" ? "قائمة الطعام" : activeCategory;

  return (
    <div className="flex items-center justify-between gap-3 mb-3 mt-1">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-[11px] text-gray-600 font-semibold">
          {getMenuSubtitle({ searchQuery, itemCount, settingsReady, isOpen, settings })}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleFavorites}
          aria-pressed={favoritesOnly}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${favoritesOnly ? "bg-red-50 border-red-200 text-[#E4002B]" : "bg-white border-gray-200 text-[#51423F]"}`}
        >
          <Heart className={`w-4 h-4 ${favoritesOnly ? "fill-current" : ""}`} />
          المفضلة{favoritesOnly ? " ✓" : ""}
        </button>

        {activeCategory !== "الكل" && (
          <button
            type="button"
            onClick={onShowAll}
            className="text-xs font-bold text-[#E4002B] hover:underline flex items-center gap-0.5"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ClosedNotice({ settings }) {
  const hasHours = settings.opening_time && settings.closing_time;
  const message = hasHours
    ? `مواعيد العمل ${settings.opening_time}–${settings.closing_time}.`
    : "يمكنك تصفح القائمة والاتصال بالمطعم للاستفسار.";

  return (
    <div role="status" className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
      المطعم لا يستقبل طلبات الآن. {message}
    </div>
  );
}

export function MenuResults({
  items,
  groups,
  activeCategory,
  favoritesOnly,
  searchQuery,
  favorites,
  onToggleFavorite,
  onAdd,
  quantityForSize,
  onSetQuantity,
  canOrder,
}) {
  if (items.length === 0) {
    return <EmptyState query={getEmptyStateQuery({ favoritesOnly, searchQuery, activeCategory })} />;
  }

  return (
    <div className="space-y-6">
      {groups.map(([category, categoryItems]) => (
        <MenuCategorySection
          key={category}
          category={category}
          items={categoryItems}
          showHeading={activeCategory === "الكل"}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onAdd={onAdd}
          quantityForSize={quantityForSize}
          onSetQuantity={onSetQuantity}
          canOrder={canOrder}
        />
      ))}
    </div>
  );
}

function MenuCategorySection({
  category,
  items,
  showHeading,
  favorites,
  onToggleFavorite,
  onAdd,
  quantityForSize,
  onSetQuantity,
  canOrder,
}) {
  return (
    <section>
      {showHeading && (
        <div className="flex items-center justify-between gap-3 mb-2.5 pt-1">
          <h3 className="text-sm font-black text-gray-800">{category}</h3>
          <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
            {items.length} صنف
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAdd={onAdd}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={onToggleFavorite}
            quantityForSize={(size) => quantityForSize(item.id, size)}
            onSetQuantity={(size, quantity) => onSetQuantity(item.id, size, quantity)}
            canOrder={canOrder}
          />
        ))}
      </div>
    </section>
  );
}

export function RestaurantContact({ restaurantInfo }) {
  return (
    <section id="contact-section" className="mt-6 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center">
      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1 leading-normal py-0.5">
        {restaurantInfo.restaurant_name}
      </h3>
      <p className="text-xs font-bold text-[#E4002B] mb-2">{restaurantInfo.tagline}</p>
      <p className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-[#E4002B] shrink-0" />
        <span>{restaurantInfo.address}</span>
      </p>

      <div className="border-t border-gray-100 pt-3">
        <h4 className="text-xs font-black text-gray-700 mb-2.5 flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#E4002B]" />
          <span>أرقام خدمة توصيل الطلبات (اضغط للاتصال):</span>
        </h4>
        <div className="grid grid-cols-2 gap-2" dir="ltr">
          {restaurantInfo.phones.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.raw}`}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#FFF0F2] border border-gray-100 hover:border-red-200 text-gray-800 hover:text-[#E4002B] text-xs font-bold flex flex-col items-center justify-center transition-all"
            >
              <span className="text-[10px] text-gray-400">{contact.label}</span>
              <span className="tracking-wide">{contact.number}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col items-center gap-1.5">
        <p className="text-xs sm:text-sm font-black text-gray-900 tracking-wide">
          {restaurantInfo.restaurant_name} — {restaurantInfo.tagline}
        </p>
        <p className="text-[11px] text-gray-600 font-semibold">
          صفحة الفيسبوك: <span className="text-[#E4002B] font-bold">{restaurantInfo.facebook_page}</span>
        </p>
        <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {restaurantInfo.restaurant_name}
        </p>
      </div>
    </section>
  );
}
