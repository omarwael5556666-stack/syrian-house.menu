import { useEffect, useState } from "react";
import { isDbConfigured, supabase } from "../lib/supabase";
import { RESTAURANT_INFO } from "../data/menuData";

export const DEFAULT_SETTINGS = {
  restaurant_name: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  english_name: RESTAURANT_INFO.englishName,
  address: RESTAURANT_INFO.address,
  order_whatsapp: RESTAURANT_INFO.orderWhatsapp,
  facebook_page: RESTAURANT_INFO.facebook,
  phones: RESTAURANT_INFO.phones,
  accepting_orders: true,
  opening_time: "",
  closing_time: "",
  eta_minutes: 45,
  minimum_order: 0,
};

export function isRestaurantOpen(settings, date = new Date()) {
  if (!settings?.accepting_orders) return false;
  if (!settings.opening_time || !settings.closing_time) return true;
  const timeParts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const current = Number(timeParts.find((part) => part.type === "hour")?.value) * 60 + Number(timeParts.find((part) => part.type === "minute")?.value);
  const [openHour, openMinute] = settings.opening_time.split(":").map(Number);
  const [closeHour, closeMinute] = settings.closing_time.split(":").map(Number);
  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;
  return close < open ? current >= open || current < close : current >= open && current < close;
}

export default function useRestaurantSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(!isDbConfigured);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase
      .from("restaurant_settings")
      .select("restaurant_name, tagline, english_name, address, order_whatsapp, facebook_page, phones, accepting_orders, opening_time, closing_time, eta_minutes, minimum_order")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (!error && data) setSettings({ ...DEFAULT_SETTINGS, ...data, phones: Array.isArray(data.phones) ? data.phones : DEFAULT_SETTINGS.phones });
        setReady(true);
      })
      .catch(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  return { settings, ready, isOpen: ready && isRestaurantOpen(settings) };
}
