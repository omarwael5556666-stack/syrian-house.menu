import { useEffect, useState } from "react";
import { supabase, isDbConfigured } from "../lib/supabase";
import { DELIVERY_DATA } from "../data/menuData";

const CACHE_KEY = "sh_zones_cache_v6";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.zones)) {
      return parsed.zones;
    }
    return null;
  } catch {
    return null;
  }
}

export default function useDeliveryZones() {
  const [zones, setZones] = useState(() =>
    DELIVERY_DATA.map((z) => ({
      location: z.location,
      fee: z.fee,
    }))
  );

  useEffect(() => {
    if (!isDbConfigured) return;
    let alive = true;

    const cached = readCache();
    if (cached) setZones(cached);

    (async () => {
      try {
        const { data, error } = await supabase
          .from("delivery_zones")
          .select("*")
          .order("sort_order")
          .order("name");
        if (!alive) return;
        if (error) throw error;

        const dbZones = (data || []).map((z) => ({
          location: z.name,
          fee: Number(z.fee),
        }));

        const next = dbZones;

        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ zones: next })); } catch { /* storage is optional */ }
        setZones(next);
      } catch (err) {
        console.warn("[useDeliveryZones] falling back:", err?.message);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return zones;
}
