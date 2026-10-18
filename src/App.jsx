import { useState, useMemo } from "react";
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
import { Phone, MapPin, ChevronLeft } from "lucide-react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { categories, items: menuData } = useMenuData();
  const { add: addToCart } = useCart();

  // ─── Filtered Items ──────────────────────────────
  const filteredItems = useMemo(() => {
    let items = menuData;

    // Category filter
    if (activeCategory !== "الكل") {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Search filter (by title, description, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [searchQuery, activeCategory, menuData]);

  // ─── Grouped Items by Category (Logical Order: Sandwiches first, Extras last) ───
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const cat = item.category || "أخرى";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });

    const getPriority = (c) => {
      const lower = (c || "").toLowerCase().trim();
      // 1. سندوتشات البيت السوري - رقم 1 دائماً
      if (lower.includes("سندوتش")) return 1;
      // 2. وجبات الغربي
      if (lower.includes("وجبات") || lower.includes("غربي")) return 2;
      // 3. الكريبات
      if (lower.includes("كريب")) return 3;
      // 4. أطباق العربي وفتات الشاورما
      if (lower.includes("فتات") || lower.includes("عربي")) return 4;
      // 5. البيتزا
      if (lower.includes("بيتزا")) return 5;
      // 6. المكرونات
      if (lower.includes("مكرون")) return 6;
      // 7. الفراخ الشواية
      if (lower.includes("شواية") || lower.includes("فراخ")) return 7;
      // 8. أوزان الشاورما
      if (lower.includes("أوزان") || lower.includes("اوزان") || lower.includes("شاورما") || lower.includes("كيلو")) return 8;
      // 9. المقبلات
      if (lower.includes("مقبلات") || lower.includes("تومية")) return 9;
      // 10. الإضافات في الآخر خالص
      if (lower.includes("إضاف") || lower.includes("اضاف")) return 99;
      return 50;
    };

    const sortedEntries = Object.entries(groups).sort(([catA], [catB]) => {
      return getPriority(catA) - getPriority(catB);
    });

    return Object.fromEntries(sortedEntries);
  }, [filteredItems]);

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
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

        {/* Category Tabs (Circular Icons Scroll) */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* ─── Section Header (Popular Combos) ───────── */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              {activeCategory === "الكل" ? "الأصناف الأكثر طلباً" : activeCategory}
            </h2>
            <p className="text-[11px] text-gray-500 font-semibold">
              {searchQuery ? `نتائج البحث عن "${searchQuery}"` : `${itemCount} صنف متوفر`}
            </p>
          </div>

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
        {filteredItems.length === 0 ? (
          <EmptyState query={searchQuery || activeCategory} />
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
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {items.map((item, idx) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      index={idx}
                      onAdd={addToCart}
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
            {RESTAURANT_INFO.name}
          </h3>
          <p className="text-xs font-bold text-[#E4002B] mb-2">
            {RESTAURANT_INFO.tagline}
          </p>

          <p className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E4002B] shrink-0" />
            <span>{RESTAURANT_INFO.address}</span>
          </p>

          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-xs font-black text-gray-700 mb-2.5 flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E4002B]" />
              <span>أرقام خدمة توصيل الطلبات (اضغط للاتصال):</span>
            </h4>

            <div className="grid grid-cols-2 gap-2" dir="ltr">
              {RESTAURANT_INFO.phones.map((contact) => (
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
              {RESTAURANT_INFO.name} — {RESTAURANT_INFO.tagline}
            </p>
            <p className="text-[11px] text-gray-600 font-semibold">
              صفحة الفيسبوك: <span className="text-[#E4002B] font-bold">{RESTAURANT_INFO.facebook}</span>
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}
            </p>
          </div>
        </section>
      </main>

      {/* ─── Bottom Navigation Bar (5 Tabs) ───────── */}
      <BottomNav activeTab="home" />
    </div>
  );
}
