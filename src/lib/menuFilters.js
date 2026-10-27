import { formatMoney, normalizeArabic } from "./arabic";

export function filterMenuItems(menuItems, { activeCategory, searchQuery, favoritesOnly, favorites }) {
  const normalizedQuery = normalizeArabic(searchQuery);

  return menuItems.filter((item) => {
    if (activeCategory !== "الكل" && item.category !== activeCategory) return false;
    if (
      normalizedQuery &&
      ![item.title, item.description, item.category].some((value) =>
        normalizeArabic(value).includes(normalizedQuery)
      )
    ) {
      return false;
    }
    return !favoritesOnly || favorites.has(item.id);
  });
}

export function groupMenuItems(items, categories) {
  const groups = new Map();
  const categoryOrder = new Map(categories.map((category, index) => [category, index]));

  items.forEach((item) => {
    const category = item.category || "أخرى";
    const group = groups.get(category) ?? [];
    group.push(item);
    groups.set(category, group);
  });

  return [...groups.entries()].sort(([categoryA], [categoryB]) => {
    const orderA = categoryOrder.get(categoryA) ?? Number.MAX_SAFE_INTEGER;
    const orderB = categoryOrder.get(categoryB) ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

export function getMenuSubtitle({ searchQuery, settingsReady, isOpen, settings }) {
  if (searchQuery) return `نتائج البحث عن "${searchQuery}"`;
  if (!settingsReady) return "جاري تجهيز القائمة";
  if (!isOpen) return "المطعم لا يستقبل الطلبات حاليًا";
  return `التوصيل خلال ${settings.eta_minutes} دقيقة تقريبًا · الحد الأدنى ${formatMoney(settings.minimum_order)} ج.م`;
}

export function getEmptyStateQuery({ favoritesOnly, searchQuery, activeCategory }) {
  return favoritesOnly && !searchQuery ? "المفضلة" : searchQuery || activeCategory;
}
