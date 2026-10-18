import { useState } from "react";
import {
  Menu,
  PhoneCall,
  ShoppingBag,
  MapPin,
  ArrowLeft,
  X,
  Phone,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { RESTAURANT_INFO } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { navigate } from "../lib/router";

export default function Header({ searchQuery, onSearchChange }) {
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
      {/* ─── 1. Top App Bar (KFC Style) ─────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
        {/* Menu Burger Button */}
        <button
          onClick={() => setShowMenuDrawer(true)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-gray-100/90 flex items-center justify-center text-gray-800 hover:text-[#E4002B] hover:bg-gray-50 transition-all active:scale-95"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center Brand Identity */}
        <div className="text-center flex-1 min-w-0 px-1">
          <p className="text-[11px] font-bold text-gray-400 flex items-center justify-center gap-1">
            <span>أهلاً بك 👋</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-[#E4002B] tracking-tight leading-none mt-0.5 truncate">
            {RESTAURANT_INFO.name}
          </h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 mt-1 truncate">
            {RESTAURANT_INFO.tagline} • {RESTAURANT_INFO.englishName}
          </p>
        </div>

        {/* Right Action Icons: Phones + Cart */}
        <div className="flex items-center gap-1.5">
          {/* Quick Phones Button with 5 badge */}
          <button
            onClick={() => setShowPhonesModal(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-gray-100/90 flex items-center justify-center text-gray-800 hover:text-[#E4002B] relative transition-all active:scale-95"
            aria-label="أرقام التوصيل"
            title="أرقام خدمة التوصيل"
          >
            <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E4002B] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {RESTAURANT_INFO.phones.length}
            </span>
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={() => navigate("/cart")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-xs border border-gray-100/90 flex items-center justify-center text-gray-800 hover:text-[#E4002B] relative transition-all active:scale-95"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E4002B] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── 2. Search Bar (KFC Style) ─────────────────── */}
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

      {/* ─── 3. Hero Banner Card with Syrian Shawarma & Meals Feast Background ─── */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[185px] sm:min-h-[205px] flex flex-col justify-between p-4 sm:p-5 mb-3 text-white border border-black/10">
        {/* Real Syrian Feast Background (Shawarma Sandwiches, Fatta, Fries, Toum - No Kofta) */}
        <img
          src="/syrian-hero-bg.jpg"
          alt="ساندوتشات شاورما لحمة وفراخ ووجبات البيت السوري"
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center transform scale-102"
          loading="eager"
        />

        {/* Gradient Overlays for High Text Contrast & Readability in RTL */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/92 via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-[#7A0210]/15 mix-blend-multiply" />

        <div className="relative z-10 max-w-[280px] sm:max-w-xs">
          <span className="inline-block text-[10px] font-black tracking-wider bg-[#E4002B] text-white px-2.5 py-0.5 rounded-full mb-1.5 uppercase shadow-sm">
            {RESTAURANT_INFO.tagline}
          </span>
          <h2 className="text-xl sm:text-2xl font-black leading-tight mb-1 text-white drop-shadow-md">
            طعم سوري أصيل.
          </h2>
          <p className="text-[11px] sm:text-xs text-white/95 font-semibold mb-3.5 leading-relaxed drop-shadow-sm">
            أشهى شاورما لحمة وفراخ، فتات، كريب، ووجبات غربي طازجة فورية.
          </p>

          <button
            onClick={handleOrderClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E4002B] hover:bg-[#C8102E] text-white text-xs font-black shadow-lg shadow-black/40 active:scale-95 transition-all"
          >
            <span>{itemCount > 0 ? "استكمال الطلب" : "اطلب الآن"}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 pt-2">
          <span className="w-4 h-1 rounded-full bg-[#E4002B] shadow-xs" />
          <span className="w-1.5 h-1 rounded-full bg-white/60" />
          <span className="w-1.5 h-1 rounded-full bg-white/60" />
          <span className="w-1.5 h-1 rounded-full bg-white/60" />
        </div>
      </div>

      {/* ─── 4. Compact Address & Delivery Chip ───────── */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-3.5 py-2 shadow-xs border border-gray-100 mb-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-700 font-bold truncate">
          <MapPin className="w-3.5 h-3.5 text-[#E4002B] shrink-0" />
          <span className="truncate text-[11px]">{RESTAURANT_INFO.address}</span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("delivery-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="text-[#E4002B] font-black text-[11px] shrink-0 hover:underline ms-2"
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
                <PhoneCall className="w-5 h-5 text-[#E4002B]" />
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
              {RESTAURANT_INFO.phones.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.raw}`}
                  dir="ltr"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-[#FFF0F2] border border-gray-100 hover:border-[#E4002B]/30 text-gray-800 hover:text-[#E4002B] font-bold text-xs transition-all"
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
                  <h3 className="font-black text-base text-[#E4002B]">{RESTAURANT_INFO.name}</h3>
                  <p className="text-[11px] text-gray-500">{RESTAURANT_INFO.tagline}</p>
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
              <p className="font-bold text-gray-700 mb-0.5">{RESTAURANT_INFO.address}</p>
              <p>فيسبوك: {RESTAURANT_INFO.facebook}</p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowMenuDrawer(false)} />
        </div>
      )}
    </header>
  );
}
