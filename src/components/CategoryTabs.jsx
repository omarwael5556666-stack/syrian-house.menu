import { useEffect, useRef } from "react";
import { Utensils, Sandwich, Soup, Drumstick, Pizza, Flame, CookingPot, Carrot, Plus, CircleEllipsis } from "lucide-react";

const CATEGORY_ICONS = {
  الكل: Utensils,
  "سندوتشات البيت السوري": Sandwich,
  الكريبات: CircleEllipsis,
  المقبلات: Soup,
  "وجبات الغربي": CookingPot,
  "الفراخ الشواية": Drumstick,
  "أوزان الشاورما": Flame,
  "فتات الشاورما": Soup,
  "أطباق العربي": Sandwich,
  البيتزا: Pizza,
  المكرونات: CookingPot,
  الإضافات: Plus,
  "إضافات البيتزا": Carrot,
};

const SHORT_NAMES = {
  الكل: "الكل",
  "سندوتشات البيت السوري": "سندوتشات",
  الكريبات: "كريب",
  المقبلات: "مقبلات",
  "وجبات الغربي": "وجبات غربي",
  "الفراخ الشواية": "فراخ شواية",
  "أوزان الشاورما": "شاورما بالكيلو",
  "فتات الشاورما": "فتات",
  "أطباق العربي": "عربي",
  البيتزا: "بيتزا",
  المكرونات: "مكرونة",
  الإضافات: "إضافات",
  "إضافات البيتزا": "إضافات بيتزا",
};

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const activeBtnRef = useRef(null);

  useEffect(() => {
    activeBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  return (
    <nav
      id="menu-categories"
      aria-label="أقسام قائمة الطعام"
      className="sticky top-0 z-30 -mx-4 mb-4 border-b border-[#eadfdb] bg-[#FAF7F2]/95 px-4 py-2 backdrop-blur-md"
    >
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
        role="tablist"
        aria-label="اختار قسمك بسرعة"
      >
        {["الكل", ...categories].map((category) => {
          const isActive = activeCategory === category;
          const Icon = CATEGORY_ICONS[category] || CircleEllipsis;
          return (
            <button
              key={category}
              ref={isActive ? activeBtnRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category)}
              className={`min-h-10 shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 text-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4002B] ${
                isActive
                  ? "bg-[#E4002B] text-white font-black shadow-sm shadow-red-900/15"
                  : "bg-white text-gray-700 border border-gray-200 font-bold hover:border-[#E4002B]/30 hover:text-[#9A031E]"
              }`}
              title={category}
            >
              <Icon className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>{SHORT_NAMES[category] || category}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
