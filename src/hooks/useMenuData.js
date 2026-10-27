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
const SANDWICH_CATEGORY = "سندوتشات البيت السوري";
const PRIORITY_CATEGORIES = [FATTA_CATEGORY, ARABIC_CATEGORY, "البيتزا", "المكرونات"];

function normalizeItemCategory(category, title = "") {
  if (category !== LEGACY_COMBINED_CATEGORY) return category;
  return title.includes("فتة") || title.includes("فته") ? FATTA_CATEGORY : ARABIC_CATEGORY;
}

function normalizeSandwichTitle(category, title = "") {
  const normalizedTitle = title.trim();
  if (category !== SANDWICH_CATEGORY || !normalizedTitle.startsWith("شاورما")) return normalizedTitle;
  return `ساندوتش ${normalizedTitle}`;
}

function normalizeFattaDescription(category, title, description = "") {
  const isFatta = category === FATTA_CATEGORY || title.includes("فتة") || title.includes("فته");
  if (!isFatta) return description;

  const normalizedDescription = String(description || "").trim();
  if (normalizedDescription.includes("رز") || normalizedDescription.includes("أرز")) {
    return normalizedDescription;
  }
  return normalizedDescription ? `رز + ${normalizedDescription}` : "رز";
}

function normalizeCategoryList(names = []) {
  const expanded = names.flatMap((name) =>
    name === LEGACY_COMBINED_CATEGORY ? [FATTA_CATEGORY, ARABIC_CATEGORY] : [name]
  );
  const unique = [...new Set(expanded)];
  const prioritized = PRIORITY_CATEGORIES.filter((name) => unique.includes(name));
  const remaining = unique.filter((name) => !PRIORITY_CATEGORIES.includes(name));
  const sandwichIndex = remaining.indexOf(SANDWICH_CATEGORY);
  remaining.splice(sandwichIndex < 0 ? 0 : sandwichIndex + 1, 0, ...prioritized);
  return remaining;
}

function normalizeSnapshot(snapshot) {
  return {
    ...snapshot,
    categories: normalizeCategoryList(snapshot.categories),
    items: snapshot.items.map((item) => {
      const category = normalizeItemCategory(item.category, item.title);
      return {
        ...item,
        category,
        title: normalizeSandwichTitle(category, item.title),
        description: normalizeFattaDescription(category, item.title, item.description),
      };
    }),
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
  const category = normalizeItemCategory(r.categories?.name ?? "", r.title);
  return {
    id: r.id,
    category,
    title: normalizeSandwichTitle(category, r.title ?? ""),
    description: normalizeFattaDescription(category, r.title ?? "", r.description ?? ""),
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
  const category = normalizeItemCategory(it.category, it.title);
  return {
    category,
    title: normalizeSandwichTitle(category, it.title),
    description: normalizeFattaDescription(category, it.title, it.description || ""),
    price: it.price ?? null,
    priceM: it.priceM ?? null,
    priceL: it.priceL ?? null,
    isNew: Boolean(it.isNew),
    imageUrl: it.imageUrl ?? "",
    isAvailable: it.isAvailable ?? (it.price != null || (it.priceM != null && it.priceL != null)),
  };
}
