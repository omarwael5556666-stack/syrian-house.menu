import { UtensilsCrossed, MapPin, Phone, PhoneCall, ShoppingBag, Sparkles, ArrowDown } from "lucide-react";
import { RESTAURANT_INFO } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { navigate } from "../lib/router";
import DeliverySearch from "./DeliverySearch";

export default function Header() {
  const { entries } = useCart();
  const itemCount = entries.reduce((s, e) => s + e.qty, 0);

  function handleOrderClick() {
    if (itemCount > 0) {
      navigate("/cart");
    } else {
      const searchEl = document.getElementById("menu-search");
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => searchEl.focus(), 350);
      }
    }
  }

  return (
    <header className="relative pt-8 pb-6 text-center">
      {/* Decorative Line */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="block h-px w-16 bg-gradient-to-l from-brand-500/60 to-transparent" />
        <UtensilsCrossed className="w-5 h-5 text-brand-400" />
        <span className="block h-px w-16 bg-gradient-to-r from-brand-500/60 to-transparent" />
      </div>

      {/* Restaurant Name */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text leading-tight mb-1">
        {RESTAURANT_INFO.name}
      </h1>

      {/* Subtitle */}
      <p className="text-brand-300/80 text-lg sm:text-xl font-bold mb-1">
        {RESTAURANT_INFO.tagline}
      </p>
      <p className="text-gray-400 text-xs sm:text-sm font-light tracking-wide mb-4">
        {RESTAURANT_INFO.englishName} — أشهى المأكولات والمشويات والبيتزا
      </p>

      {/* Address */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs sm:text-sm text-brand-300 mb-5">
        <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
        <span>{RESTAURANT_INFO.address}</span>
      </div>

      {/* ─── Hero Order CTA Button ─────────────────────── */}
      <div className="mb-8 max-w-lg mx-auto px-2">
        <button
          onClick={handleOrderClick}
          className="hero-order-btn w-full px-6 py-4 rounded-2xl text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer group"
          title="اضغط لطلب الأوردر أونلاين"
        >
          {/* Live pulsing status dot */}
          <span className="pulse-indicator w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />

          <ShoppingBag className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shrink-0" />

          <span className="tracking-wide">
            {itemCount > 0
              ? `استكمال طلبك (${itemCount} أصناف في السلة)`
              : "اضغط هنا لطلب الأوردر أونلاين"}
          </span>

          {itemCount > 0 ? (
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
          ) : (
            <ArrowDown className="w-4 h-4 text-white/80 transition-transform duration-300 group-hover:translate-y-1 shrink-0" />
          )}
        </button>

        <p className="mt-2.5 text-xs sm:text-sm text-brand-300/80 font-medium leading-relaxed">
          {itemCount > 0
            ? "اضغط للدخول على سلة الطلبات وتأكيد الأوردر عبر واتساب 📲"
            : "الموقع للطلب المباشر — اختر وجباتك وأرسل طلبك فوراً لواتساب المطعم"}
        </p>
      </div>

      {/* Quick Call Numbers Banner + Delivery Section */}
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-4 sm:p-5 border border-brand-500/20 shadow-lg shadow-black/40 mb-2">
        {/* ── Phone Numbers ──────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-3 text-brand-400 font-bold text-sm sm:text-base">
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>خدمة توصيل الطلبات والاستفسار (اضغط للاتصال المباشر):</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {RESTAURANT_INFO.phones.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.raw}`}
              dir="ltr"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900/80 hover:bg-brand-500 hover:text-white border border-brand-500/20 hover:border-brand-500 text-brand-200 text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 shadow-sm hover:shadow-brand-500/30 hover:-translate-y-0.5"
              title={`اتصال بـ ${contact.label}`}
            >
              <Phone className="w-3.5 h-3.5 text-brand-400 group-hover:text-white" />
              <span>{contact.number}</span>
              {contact.label.includes("أرضي") && (
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-normal">
                  أرضي
                </span>
              )}
            </a>
          ))}
        </div>

        {/* ── Delivery Locations (inside same card) ─── */}
        <DeliverySearch />
      </div>

      {/* Bottom Decorative Line */}
      <div className="mt-8 mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
    </header>
  );
}

