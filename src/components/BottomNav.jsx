import { Home, LayoutGrid, ShoppingBag, MapPin, Phone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { navigate, usePath } from "../lib/router";

export default function BottomNav({ activeTab = "home", onTabChange }) {
  const { entries } = useCart();
  const path = usePath();
  const isCart = path.startsWith("/cart");
  const itemCount = entries.reduce((s, e) => s + e.qty, 0);

  function handleNav(tab) {
    if (onTabChange) onTabChange(tab);

    if (tab === "home") {
      if (isCart) {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (tab === "menu") {
      if (isCart) navigate("/");
      setTimeout(() => {
        const el = document.getElementById("menu-categories");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else if (tab === "cart") {
      navigate("/cart");
    } else if (tab === "delivery") {
      if (isCart) navigate("/");
      setTimeout(() => {
        const el = document.getElementById("delivery-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } else if (tab === "contact") {
      if (isCart) navigate("/");
      setTimeout(() => {
        const el = document.getElementById("contact-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }

  return (
    <nav className="bottom-nav" aria-label="شريط التنقل السريع">
      {/* 1. الرئيسية */}
      <button
        onClick={() => handleNav("home")}
        className={`bottom-nav-item ${activeTab === "home" && !isCart ? "active" : ""}`}
      >
        <Home className="w-5 h-5" />
        <span>الرئيسية</span>
      </button>

      {/* 2. المينيو */}
      <button
        onClick={() => handleNav("menu")}
        className={`bottom-nav-item ${activeTab === "menu" ? "active" : ""}`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span>المينيو</span>
      </button>

      {/* 3. الطلبات (Elevated Center Button) */}
      <button
        onClick={() => handleNav("cart")}
        className="bottom-nav-center-btn relative"
        aria-label="سلة الطلبات"
        title="عرض سلة الطلبات"
      >
        <ShoppingBag className="w-6 h-6 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-white text-[#E4002B] text-[11px] font-black flex items-center justify-center shadow-md">
            {itemCount}
          </span>
        )}
      </button>

      {/* 4. التوصيل */}
      <button
        onClick={() => handleNav("delivery")}
        className={`bottom-nav-item ${activeTab === "delivery" ? "active" : ""}`}
      >
        <MapPin className="w-5 h-5" />
        <span>التوصيل</span>
      </button>

      {/* 5. اتصل بنا */}
      <button
        onClick={() => handleNav("contact")}
        className={`bottom-nav-item ${activeTab === "contact" ? "active" : ""}`}
      >
        <Phone className="w-5 h-5" />
        <span>اتصل بنا</span>
      </button>
    </nav>
  );
}
