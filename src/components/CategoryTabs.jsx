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
  const scrollRef = useRef(null);
  const activeBtnRef = useRef(null);

  useEffect(() => {
    activeBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  return (
    <div id="menu-categories" className="mb-6 pt-1">
      <div ref={scrollRef} className="flex items-start gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth" role="tablist" aria-label="أقسام قائمة الطعام">
        {["الكل", ...categories].map((category) => {
          const isActive = activeCategory === category;
          const Icon = CATEGORY_ICONS[category] || CircleEllipsis;
          return (
            <button
              key={category}
              ref={isActive ? activeBtnRef : null}
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E4002B]"
            >
              <span className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 bg-white ${isActive ? "ring-2 ring-[#E4002B] ring-offset-2 scale-105 shadow-md shadow-red-500/10" : "border border-gray-200 group-hover:border-gray-300 group-hover:scale-105"}`}>
                <Icon className={`w-7 h-7 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#E4002B]" : "text-gray-600"}`} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className={`text-[11px] max-w-[78px] text-center leading-tight truncate ${isActive ? "text-[#E4002B] font-black" : "text-gray-700 font-semibold"}`} title={category}>
                {SHORT_NAMES[category] || category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
