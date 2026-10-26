import { useState, useMemo, useEffect } from "react";
import { RESTAURANT_INFO } from "./data/menuData";
import useMenuData from "./hooks/useMenuData";
import { useCart } from "./context/CartContext";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import MenuCard from "./components/MenuCard";
import EmptyState from "./components/EmptyState";
import CartBar from "./components/CartBar";
import BottomNav from "./components/BottomNav";
import DeliverySearch from "./components/DeliverySearch";
import { Phone, MapPin, ChevronLeft, Heart } from "lucide-react";
import { normalizeArabic, formatMoney } from "./lib/arabic";
import useRestaurantSettings from "./hooks/useRestaurantSettings";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("sh_favorites_v1") || "[]")); }
    catch { return new Set(); }
  });
  const { categories, items: menuData } = useMenuData();
  const { add: addToCart, entries: cartEntries, setQty } = useCart();
  const { settings, ready: settingsReady, isOpen } = useRestaurantSettings();
  const restaurantInfo = { ...RESTAURANT_INFO, ...settings };

  useEffect(() => {
    try { localStorage.setItem("sh_favorites_v1", JSON.stringify([...favorites])); } catch { /* storage may be unavailable */ }
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const cartQuantities = useMemo(() => new Map(cartEntries.map((entry) => [entry.key, entry.qty])), [cartEntries]);
  function getItemQuantity(id, size) { return cartQuantities.get(`${id}:${size ?? ""}`) || 0; }
  function setItemQuantity(id, size, quantity) {
    const key = `${id}:${size ?? ""}`;
    if (quantity <= 0) setQty(key, 0);
    else if (cartQuantities.has(key)) setQty(key, quantity);
    else addToCart(id, size, quantity);
  }

  // ─── Filtered Items ──────────────────────────────
  const filteredItems = useMemo(() => {
    let items = menuData;

    // Category filter
    if (activeCategory !== "الكل") {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Search filter (by title, description, or category)
    if (searchQuery.trim()) {
      const q = normalizeArabic(searchQuery);
      items = items.filter(
        (item) => [item.title, item.description, item.category].some((value) => normalizeArabic(value).includes(q))
      );
    }

    if (favoritesOnly) items = items.filter((item) => favorites.has(item.id));

    return items;
  }, [searchQuery, activeCategory, menuData, favoritesOnly, favorites]);

  // Keep the order configured by the restaurant in the database.
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const cat = item.category || "أخرى";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });

    const sortedEntries = Object.entries(groups).sort(([catA], [catB]) => {
      const a = categories.indexOf(catA);
      const b = categories.indexOf(catB);
      return (a < 0 ? Number.MAX_SAFE_INTEGER : a) - (b < 0 ? Number.MAX_SAFE_INTEGER : b);
    });

    return Object.fromEntries(sortedEntries);
  }, [filteredItems, categories]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory("الكل");
    }
  };

  const itemCount = filteredItems.length;

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <CartBar />

      {/* Main Scrollable Content */}
      <main className="flex-1 px-4 pt-2 pb-44 sm:pb-48">
        {/* Top Bar + Search + Hero Banner (KFC Style Order) */}
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} restaurantInfo={restaurantInfo} />

        {/* Category Tabs (Circular Icons Scroll) */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => { setActiveCategory(category); setActiveTab("menu"); }}
        />

        {/* ─── Section Header (Popular Combos) ───────── */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {favoritesOnly ? "أصنافي المفضلة" : activeCategory === "الكل" ? "قائمة الطعام" : activeCategory}
            </h2>
            <p className="text-[11px] text-gray-600 font-semibold">
              {searchQuery ? `نتائج البحث عن "${searchQuery}"` : `${itemCount} صنف · ${settingsReady ? (isOpen ? `التوصيل خلال ${settings.eta_minutes} دقيقة تقريبًا · الحد الأدنى ${formatMoney(settings.minimum_order)} ج.م` : "الطلبات مغلقة الآن") : "جارٍ تحميل إعدادات المطعم…"}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFavoritesOnly((value) => !value)}
            aria-pressed={favoritesOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${favoritesOnly ? "bg-red-50 border-red-200 text-[#E4002B]" : "bg-white border-gray-200 text-[#51423F]"}`}
          >
            <Heart className={`w-4 h-4 ${favoritesOnly ? "fill-current" : ""}`} />
            المفضلة{favoritesOnly ? " ✓" : ""}
          </button>

          {activeCategory !== "الكل" && (
            <button
              onClick={() => setActiveCategory("الكل")}
              className="text-xs font-bold text-[#E4002B] hover:underline flex items-center gap-0.5"
            >
              <span>عرض الكل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ─── Menu Grid (2 Columns Mobile First) ───── */}
        {settingsReady && !isOpen && (
          <div role="status" className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            المطعم لا يستقبل طلبات الآن. {settings.opening_time && settings.closing_time ? `مواعيد العمل ${settings.opening_time}–${settings.closing_time}.` : "يمكنك تصفح القائمة والاتصال بالمطعم للاستفسار."}
          </div>
        )}
        {filteredItems.length === 0 ? (
          <EmptyState query={favoritesOnly && !searchQuery ? "المفضلة" : searchQuery || activeCategory} />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <section key={category}>
                {activeCategory === "الكل" && (
                  <div className="flex items-center justify-between gap-3 mb-2.5 pt-1">
                    <h3 className="text-sm font-black text-gray-800">
                      {category}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                      {items.length} صنف
                    </span>
                  </div>
                )}

                {/* 2-column Grid matching KFC cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                  {items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      isFavorite={favorites.has(item.id)}
                      onToggleFavorite={toggleFavorite}
                      quantityForSize={(size) => getItemQuantity(item.id, size)}
                      onSetQuantity={(size, quantity) => setItemQuantity(item.id, size, quantity)}
                      canOrder={isOpen}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ─── Delivery Section ──────────────────────── */}
        <section id="delivery-section" className="mt-8">
          <DeliverySearch />
        </section>

        {/* ─── Contact & Info Section ────────────────── */}
        <section
          id="contact-section"
          className="mt-6 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center"
        >
          <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1 leading-normal py-0.5">
            {restaurantInfo.restaurant_name}
          </h3>
          <p className="text-xs font-bold text-[#E4002B] mb-2">
            {restaurantInfo.tagline}
          </p>

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
      </main>

      {/* ─── Bottom Navigation Bar (5 Tabs) ───────── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
