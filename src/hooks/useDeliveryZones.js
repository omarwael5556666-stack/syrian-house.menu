import { useEffect, useState } from "react";
import { supabase, isDbConfigured } from "../lib/supabase";
import { DELIVERY_DATA } from "../data/menuData";

const CACHE_KEY = "sh_zones_cache_v1";

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.zones) ? parsed.zones : null;
  } catch {
    return null;
  }
}

export default function useDeliveryZones() {
  const [zones, setZones] = useState(() =>
    DELIVERY_DATA.map((z) => ({ location: z.location, fee: z.fee }))
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

        const next = data.map((z) => ({
          location: z.name,
          fee: Number(z.fee),
        }));
        localStorage.setItem(CACHE_KEY, JSON.stringify({ zones: next }));
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
