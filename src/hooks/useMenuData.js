import { useEffect, useState } from "react";
import { supabase, isDbConfigured } from "../lib/supabase";
import menuData, { CATEGORIES } from "../data/menuData";

/**
 * Menu data hook.
 *
 * Speed strategy:
 * 1. Renders instantly from the bundled static data (no loading state).
 * 2. If Supabase env vars exist, paints a localStorage cache, then
 *    refreshes from the database once in the background.
 * 3. If the DB is not configured or unreachable, static data stays.
 */

const CACHE_KEY = "sh_menu_cache_v2";
const LEGACY_COMBINED_CATEGORY = "أطباق العربي وفتات الشاورما";
const FATTA_CATEGORY = "فتات الشاورما";
const ARABIC_CATEGORY = "أطباق العربي";

function normalizeItemCategory(category, title = "") {
  if (category !== LEGACY_COMBINED_CATEGORY) return category;
  return title.includes("فتة") || title.includes("فته") ? FATTA_CATEGORY : ARABIC_CATEGORY;
}

function normalizeCategoryList(names = []) {
  const expanded = names.flatMap((name) =>
    name === LEGACY_COMBINED_CATEGORY ? [FATTA_CATEGORY, ARABIC_CATEGORY] : [name]
  );
  const pairIndex = expanded.findIndex((name) => name === FATTA_CATEGORY || name === ARABIC_CATEGORY);
  if (pairIndex === -1) return expanded;

  const remaining = expanded.filter((name) => name !== FATTA_CATEGORY && name !== ARABIC_CATEGORY);
  remaining.splice(Math.min(pairIndex, remaining.length), 0, FATTA_CATEGORY, ARABIC_CATEGORY);
  return [...new Set(remaining)];
}

function normalizeSnapshot(snapshot) {
  return {
    ...snapshot,
    categories: normalizeCategoryList(snapshot.categories),
    items: snapshot.items.map((item) => ({
      ...item,
      category: normalizeItemCategory(item.category, item.title),
    })),
  };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.items) ? normalizeSnapshot(parsed) : null;
  } catch {
    return null;
  }
}

export function applyMenu({ categories, items }) {
  return { categories, items };
}

export function rowToItem(r) {
  return {
    id: r.id,
    category: normalizeItemCategory(r.categories?.name ?? "", r.title),
    title: r.title,
    description: r.description ?? "",
    price: r.price != null ? Number(r.price) : null,
    priceM: r.price_m != null ? Number(r.price_m) : null,
    priceL: r.price_l != null ? Number(r.price_l) : null,
    imageUrl: r.image_url ?? "",
    isNew: Boolean(r.is_new),
    isAvailable: Boolean(r.is_available),
  };
}

export default function useMenuData() {
  // Instant first paint: bundled static data, zero network delay.
  const [state, setState] = useState(() => ({
    categories: [...CATEGORIES],
    items: menuData.map((it) => ({
      ...toPublicItem(it),
      id: `static-${it.id}`,
      isAvailable: it.isAvailable ?? (it.price != null || (it.priceM != null && it.priceL != null)),
    })),
    source: isDbConfigured ? "loading" : "static",
  }));

  useEffect(() => {
    if (!isDbConfigured) return;
    let alive = true;

    // Stale-while-revalidate: cached copy paints immediately.
    const cached = readCache();
    if (cached) setState({ ...cached, source: "cache" });

    (async () => {
      try {
        const [catsRes, itemsRes] = await Promise.all([
          supabase.from("categories").select("*").order("sort_order").order("name"),
          supabase
            .from("menu_items")
            .select("*, categories(name)")
            .order("sort_order")
            .order("title"),
        ]);
        if (!alive) return;
        if (catsRes.error) throw catsRes.error;
        if (itemsRes.error) throw itemsRes.error;

        const next = {
          categories: normalizeCategoryList(catsRes.data.map((c) => c.name)),
          items: itemsRes.data.map(rowToItem),
        };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch { /* storage is optional */ }
        setState({ ...next, source: "db" });
      } catch (err) {
        console.warn("[useMenuData] falling back:", err?.message);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}

function toPublicItem(it) {
  return {
    category: it.category,
    title: it.title,
    description: it.description || "",
    price: it.price ?? null,
    priceM: it.priceM ?? null,
    priceL: it.priceL ?? null,
    isNew: Boolean(it.isNew),
    imageUrl: it.imageUrl ?? "",
    isAvailable: it.isAvailable ?? (it.price != null || (it.priceM != null && it.priceL != null)),
  };
}
