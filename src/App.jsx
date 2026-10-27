import { useState, useMemo, useEffect } from "react";
import { RESTAURANT_INFO } from "./data/menuData";
import useMenuData from "./hooks/useMenuData";
import { useCart } from "./context/CartContext";
import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import CartBar from "./components/CartBar";
import BottomNav from "./components/BottomNav";
import DeliverySearch from "./components/DeliverySearch";
import useRestaurantSettings from "./hooks/useRestaurantSettings";
import { filterMenuItems, groupMenuItems } from "./lib/menuFilters";
import { ClosedNotice, MenuHeading, MenuResults, RestaurantContact } from "./components/MenuSections";
import PhotoCredits from "./components/PhotoCredits";

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("sh_favorites_v1") || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem("sh_favorites_v1", JSON.stringify([...favorites]));
  } catch {
    // Browser storage is optional.
  }
}

function toggleSetValue(values, value) {
  if (values.has(value)) values.delete(value);
  else values.add(value);
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeTab, setActiveTab] = useState("home");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(readFavorites);
  const { categories, items: menuData } = useMenuData();
  const { add: addToCart, entries: cartEntries, setQty } = useCart();
  const { settings, ready: settingsReady, isOpen } = useRestaurantSettings();
  const restaurantInfo = { ...RESTAURANT_INFO, ...settings };

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = new Set(current);
      toggleSetValue(next, id);
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

  const filteredItems = useMemo(() => {
    return filterMenuItems(menuData, { activeCategory, searchQuery, favoritesOnly, favorites });
  }, [searchQuery, activeCategory, menuData, favoritesOnly, favorites]);

  const groupedItems = useMemo(() => groupMenuItems(filteredItems, categories), [filteredItems, categories]);

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
        {/* Brand bar, search, and food-first hero */}
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} restaurantInfo={restaurantInfo} />

        {/* Category Tabs (Circular Icons Scroll) */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => { setActiveCategory(category); setActiveTab("menu"); }}
        />

        <MenuHeading
          activeCategory={activeCategory}
          favoritesOnly={favoritesOnly}
          itemCount={itemCount}
          searchQuery={searchQuery}
          settingsReady={settingsReady}
          isOpen={isOpen}
          settings={settings}
          onToggleFavorites={() => setFavoritesOnly((value) => !value)}
          onShowAll={() => setActiveCategory("الكل")}
        />

        {settingsReady && !isOpen && <ClosedNotice settings={settings} />}
        <MenuResults
          items={filteredItems}
          groups={groupedItems}
          activeCategory={activeCategory}
          favoritesOnly={favoritesOnly}
          searchQuery={searchQuery}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAdd={addToCart}
          quantityForSize={getItemQuantity}
          onSetQuantity={setItemQuantity}
          canOrder={isOpen}
        />

        {/* ─── Delivery Section ──────────────────────── */}
        <section id="delivery-section" className="mt-8">
          <DeliverySearch />
        </section>

        {/* ─── Contact & Info Section ────────────────── */}
        <RestaurantContact restaurantInfo={restaurantInfo} />
        <PhotoCredits />
      </main>

      {/* ─── Bottom Navigation Bar (5 Tabs) ───────── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
