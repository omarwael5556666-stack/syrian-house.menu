import { useState, useMemo } from "react";
import { RESTAURANT_INFO } from "./data/menuData";
import useMenuData from "./hooks/useMenuData";
import { useCart } from "./context/CartContext";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryTabs from "./components/CategoryTabs";
import MenuCard from "./components/MenuCard";
import EmptyState from "./components/EmptyState";
import CartBar from "./components/CartBar";
import { Phone, MapPin, Share2 } from "lucide-react";

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

    // Search filter (by title or description)
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

  // ─── Grouped Items by Category ───────────────────
  const groupedItems = useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Reset category when searching
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory("الكل");
    }
  };

  // Items count
  const itemCount = filteredItems.length;

  return (
    <>
      {/* Ambient Background */}
      <div className="ambient-bg" />
      <CartBar />


      {/* Main Content */}
      <div className="relative z-10 min-h-screen pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header with All Contact Numbers */}
          <Header />

          {/* Search */}
          <SearchBar query={searchQuery} onQueryChange={handleSearch} />

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              <span className="text-brand-400 font-bold">{itemCount}</span> صنف
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                نتائج البحث عن:{" "}
                <span className="text-brand-300">&ldquo;{searchQuery}&rdquo;</span>
              </p>
            )}
          </div>

          {/* Menu Grid */}
          {filteredItems.length === 0 ? (
            <EmptyState query={searchQuery || activeCategory} />
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedItems).map(([category, items]) => (
                <section key={category}>
                  {/* Section Header */}
                  {(activeCategory === "الكل" || searchQuery) && (
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-xl sm:text-2xl font-extrabold gradient-text whitespace-nowrap">
                        {category}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-l from-brand-500/20 to-transparent" />
                      <span className="text-xs text-gray-600 font-medium bg-brand-500/10 px-3 py-1 rounded-full">
                        {items.length}
                      </span>
                    </div>
                  )}

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        index={idx}
                        onAdd={(size) => addToCart(item.id, size)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Complete Contact Information */}
        <footer className="border-t border-white/10 bg-dark-900/60 backdrop-blur-md py-10 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-xl font-black gradient-text mb-2">
              {RESTAURANT_INFO.name} — {RESTAURANT_INFO.tagline}
            </h3>
            
            <p className="text-sm text-gray-400 mb-6 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              العنوان: {RESTAURANT_INFO.address}
            </p>

            <div className="glass-card rounded-2xl p-5 mb-6 border border-brand-500/20">
              <h4 className="text-sm font-bold text-brand-400 mb-3 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                أرقام خدمة توصيل الطلبات (Delivery)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" dir="ltr">
                {RESTAURANT_INFO.phones.map((contact) => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.raw}`}
                    className="p-2.5 rounded-xl bg-dark-950/80 hover:bg-brand-600 hover:text-white border border-brand-500/20 text-brand-300 font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all duration-200"
                  >
                    <span className="text-[10px] text-gray-400 mb-0.5">{contact.label}</span>
                    <span>{contact.number}</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-1">
              صفحة الفيسبوك: {RESTAURANT_INFO.facebook}
            </p>
            <p className="text-xs text-gray-600">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

