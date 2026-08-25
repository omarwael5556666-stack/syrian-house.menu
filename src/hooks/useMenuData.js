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

const CACHE_KEY = "sh_menu_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.items) ? parsed : null;
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
    category: r.categories?.name ?? "",
    title: r.title,
    description: r.description ?? "",
    price: r.price != null ? Number(r.price) : null,
    priceM: r.price_m != null ? Number(r.price_m) : null,
    priceL: r.price_l != null ? Number(r.price_l) : null,
    imageUrl: r.image_url ?? "",
    isNew: Boolean(r.is_new),
  };
}

export default function useMenuData() {
  // Instant first paint: bundled static data, zero network delay.
  const [state, setState] = useState(() => ({
    categories: [...CATEGORIES],
    items: menuData.map((it) => ({
      ...toPublicItem(it),
      id: `static-${it.id}`,
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
            .eq("is_available", true)
            .order("sort_order")
            .order("title"),
        ]);
        if (!alive) return;
        if (catsRes.error) throw catsRes.error;
        if (itemsRes.error) throw itemsRes.error;

        const next = {
          categories: catsRes.data.map((c) => c.name),
          items: itemsRes.data.map(rowToItem),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
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
  };
}
