import { useState } from "react";
import {
  Menu,
  PhoneCall,
  ShoppingBag,
  MapPin,
  ArrowLeft,
  X,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { RESTAURANT_INFO } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { navigate } from "../lib/router";

export default function Header({ searchQuery, onSearchChange, restaurantInfo = RESTAURANT_INFO }) {
  const { entries } = useCart();
  const itemCount = entries.reduce((s, e) => s + e.qty, 0);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showPhonesModal, setShowPhonesModal] = useState(false);

  function handleOrderClick() {
    if (itemCount > 0) {
      navigate("/cart");
    } else {
      const el = document.getElementById("menu-categories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <header className="pt-1 pb-1">
      {/* ─── 1. Syrian House brand bar ─────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
        {/* Menu Burger Button */}
        <button
          onClick={() => setShowMenuDrawer(true)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-[#E8DFD5] flex items-center justify-center text-gray-800 hover:text-[#8C2334] hover:bg-[#FAF2F1] transition-all active:scale-95"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center Brand Identity */}
        <div className="flex flex-1 min-w-0 items-center justify-center gap-1.5 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1.1rem] border border-[#B87A4B]/35 bg-[#3C1019] text-[#F4D9A8] shadow-sm sm:h-10 sm:w-10" aria-hidden="true">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
              <path d="M6.5 26V15a9.5 9.5 0 0 1 19 0v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M11 26v-9.5a5 5 0 0 1 10 0V26M5 26h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 8.2v4.1m-2.05-2.05h4.1" stroke="#B87A4B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0 text-right">
            <h1 className="truncate text-[14px] font-black leading-tight tracking-tight text-[#271D1B] sm:text-xl">
              {restaurantInfo.restaurant_name || restaurantInfo.name}
            </h1>
            <p className="mt-0.5 truncate text-[9px] font-bold text-[#756B65] sm:text-[11px]">
              <span>{restaurantInfo.tagline}</span><span className="mx-1 text-[#B87A4B]">•</span>
              {restaurantInfo.english_name || restaurantInfo.englishName}
            </p>
          </div>
        </div>

        {/* Right Action Icons: Phones + Cart */}
        <div className="flex items-center gap-1.5">
          {/* Quick Phones Button with 5 badge */}
          <button
            onClick={() => setShowPhonesModal(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-[#E8DFD5] flex items-center justify-center text-gray-800 hover:text-[#8C2334] relative transition-all active:scale-95"
            aria-label="أرقام التوصيل"
            title="أرقام خدمة التوصيل"
          >
            <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#8C2334] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {restaurantInfo.phones.length}
            </span>
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => navigate("/cart")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-[#E8DFD5] flex items-center justify-center text-gray-800 hover:text-[#8C2334] relative transition-all active:scale-95"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#8C2334] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── 2. Fast menu search ───────────────────────── */}
      <div className="relative w-full mb-3">
        <div className="relative flex items-center">
          <div className="absolute right-3.5 pointer-events-none text-gray-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <input
            id="menu-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث في الأصناف، الشاورما، السندوتشات..."
            className="search-input text-xs sm:text-sm pr-10 pl-11 h-11 sm:h-12"
            autoComplete="off"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-11 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 transition-all"
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById("menu-categories");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="absolute left-2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all active:scale-95"
            aria-label="تصفية حسب الأقسام"
            title="تصفية حسب الأقسام"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 3. Hero Banner ────────────────────────────── */}
      <div className="relative isolate min-h-[190px] sm:min-h-[238px] flex flex-col justify-center overflow-hidden rounded-[1.75rem] border border-[#D7BD91]/45 bg-[#1B120D] p-4 sm:p-7 mb-3 text-white shadow-[0_18px_45px_-18px_rgba(35,20,10,0.42)]">
        <img
          src="/syrian-hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-left sm:object-center"
          loading="eager"
          fetchPriority="high"
        />

        <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-l from-[#160F0A]/28 via-[#160F0A]/10 to-transparent" />

        <div className="relative z-20 ms-auto w-[76%] max-w-[420px] pe-1 text-right sm:me-2 sm:w-[54%] sm:max-w-[440px]">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[9px] font-extrabold tracking-wide text-[#F4D9A8] shadow-sm sm:mb-3 sm:text-[10px]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#8C2334]" />
            {restaurantInfo.tagline}
          </span>
          <h2 className="mb-1 whitespace-nowrap text-[22px] font-black leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:mb-2 sm:text-3xl">
            طعم سوري <span className="text-[#D9AA76]">أصيل.</span>
          </h2>
          <p className="mb-3 max-w-[34rem] text-[11px] font-medium leading-relaxed text-white/90 drop-shadow-sm sm:mb-4 sm:text-sm">
            شاورما ومشاوي شامية على أصولها، طازة كل يوم.
          </p>

          <button
            onClick={handleOrderClick}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#8C2334] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(140,35,52,0.32)] transition-all hover:bg-[#6E1B29] hover:shadow-[0_10px_24px_rgba(140,35,52,0.42)] active:scale-[0.98] sm:min-h-11 sm:px-5 sm:text-sm"
          >
            <span>{itemCount > 0 ? "استكمال الطلب" : "اطلب الآن"}</span>
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>

      </div>

      {/* ─── 4. Compact Address & Delivery Chip ───────── */}
      <div className="flex items-center justify-between rounded-2xl border border-[#E8DFD5] bg-white px-3.5 py-2 shadow-[0_3px_12px_-8px_rgba(39,29,27,0.22)] mb-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-700 font-bold truncate">
          <MapPin className="w-3.5 h-3.5 text-[#8C2334] shrink-0" />
          <span className="truncate text-[11px]">{restaurantInfo.address}</span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("delivery-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="text-[#8C2334] font-black text-[11px] shrink-0 hover:underline ms-2"
        >
          مناطق التوصيل
        </button>
      </div>

      {/* ─── Quick Contact Numbers Modal ─────────────── */}
      {showPhonesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-900 font-black">
                <PhoneCall className="w-5 h-5 text-[#8C2334]" />
                <h3 className="text-base">أرقام خدمة التوصيل</h3>
              </div>
              <button
                onClick={() => setShowPhonesModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              اضغط على أي رقم للاتصال المباشر بالمطعم لطلب الدليفري أو الاستفسار:
            </p>
            <div className="space-y-1.5 mb-3">
              {restaurantInfo.phones.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.raw}`}
                  dir="ltr"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-[#FAF2F1] border border-gray-100 hover:border-[#8C2334]/30 text-gray-800 hover:text-[#8C2334] font-bold text-xs transition-all"
                >
                  <span className="text-[11px] text-gray-500">{p.label}</span>
                  <span className="tracking-wider">{p.number}</span>
                </a>
              ))}
            </div>
            <button
              onClick={() => setShowPhonesModal(false)}
              className="w-full py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ─── Side Menu Drawer ────────────────────────── */}
      {showMenuDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="bg-white w-4/5 max-w-xs h-full p-5 shadow-2xl flex flex-col justify-between animate-slide-up">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <div>
                  <h3 className="font-black text-base text-[#8C2334]">{restaurantInfo.restaurant_name || restaurantInfo.name}</h3>
                  <p className="text-[11px] text-gray-500">{restaurantInfo.tagline}</p>
                </div>
                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-bold text-gray-700">
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full text-right p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>الرئيسية</span>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    navigate("/cart");
                  }}
                  className="w-full text-right p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>سلة الطلبات ({itemCount})</span>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    const el = document.getElementById("delivery-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-right p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>مناطق ورسوم التوصيل</span>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    setShowPhonesModal(true);
                  }}
                  className="w-full text-right p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>أرقام الدليفري</span>
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500">
              <p className="font-bold text-gray-700 mb-0.5">{restaurantInfo.address}</p>
              <p>فيسبوك: {restaurantInfo.facebook_page || restaurantInfo.facebook}</p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowMenuDrawer(false)} />
        </div>
      )}
    </header>
  );
}
