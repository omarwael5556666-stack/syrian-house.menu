import { UtensilsCrossed, MapPin, Phone, PhoneCall } from "lucide-react";
import { RESTAURANT_INFO } from "../data/menuData";
import DeliverySearch from "./DeliverySearch";

export default function Header() {
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
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs sm:text-sm text-brand-300 mb-4">
        <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
        <span>{RESTAURANT_INFO.address}</span>
      </div>

      {/* Ordering hint */}
      <div className="mb-6">
        <p className="inline-block text-xs sm:text-sm text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-2.5 leading-relaxed">
          اطلب أونلاين: اضغط «أضف للسلة» على الأصناف اللي تحبها، وابعت طلبك
          واتساب في ثانية
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

