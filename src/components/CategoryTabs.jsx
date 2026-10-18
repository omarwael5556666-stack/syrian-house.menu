import { useRef, useEffect } from "react";

// Emoji map for authentic Syrian House categories matching KFC circular styling
const CATEGORY_EMOJIS = {
  الكل: "🍽️",
  "سندوتشات البيت السوري": "🌯",
  الكريبات: "🥞",
  المقبلات: "🧄",
  "وجبات الغربي": "🍟",
  "الفراخ الشواية": "🍗",
  "أوزان الشاورما": "🥩",
  "أطباق العربي وفتات الشاورما": "🍚",
  البيتزا: "🍕",
  المكرونات: "🍝",
  الإضافات: "🧀",
  "إضافات البيتزا": "🍄",
};

// Short friendly display names for clean 1-line circle caption
const SHORT_NAMES = {
  الكل: "الكل",
  "سندوتشات البيت السوري": "سندوتشات",
  الكريبات: "كريب",
  المقبلات: "مقبلات",
  "وجبات الغربي": "وجبات غربي",
  "الفراخ الشواية": "فراخ شواية",
  "أوزان الشاورما": "شاورما بالكيلو",
  "أطباق العربي وفتات الشاورما": "فتات وعربي",
  البيتزا: "بيتزا",
  المكرونات: "مكرونة",
  الإضافات: "إضافات",
  "إضافات البيتزا": "إضافات بيتزا",
};

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);
  const activeBtnRef = useRef(null);

  // Auto center active category button on change
  useEffect(() => {
    if (activeBtnRef.current && scrollRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  const sortedCategories = [...categories].sort((a, b) => {
    const getPriority = (c) => {
      const lower = (c || "").toLowerCase().trim();
      // 1. سندوتشات البيت السوري - رقم 1 دائماً
      if (lower.includes("سندوتش")) return 1;
      // 2. وجبات الغربي
      if (lower.includes("وجبات") || lower.includes("غربي")) return 2;
      // 3. الكريبات
      if (lower.includes("كريب")) return 3;
      // 4. أطباق العربي وفتات الشاورما
      if (lower.includes("فتات") || lower.includes("عربي")) return 4;
      // 5. البيتزا
      if (lower.includes("بيتزا")) return 5;
      // 6. المكرونات
      if (lower.includes("مكرون")) return 6;
      // 7. الفراخ الشواية
      if (lower.includes("شواية") || lower.includes("فراخ")) return 7;
      // 8. أوزان الشاورما
      if (lower.includes("أوزان") || lower.includes("اوزان") || lower.includes("شاورما") || lower.includes("كيلو")) return 8;
      // 9. المقبلات
      if (lower.includes("مقبلات") || lower.includes("تومية")) return 9;
      // 10. الإضافات
      if (lower.includes("إضاف") || lower.includes("اضاف")) return 99;
      return 50;
    };
    return getPriority(a) - getPriority(b);
  });

  const allCategories = ["الكل", ...sortedCategories];

  return (
    <div id="menu-categories" className="mb-6 pt-1">
      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        role="tablist"
      >
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const emoji = CATEGORY_EMOJIS[cat] || "🍲";
          const shortName = SHORT_NAMES[cat] || cat;

          return (
            <button
              key={cat}
              ref={isActive ? activeBtnRef : null}
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(cat)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              {/* Circular Icon (KFC Style) */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 bg-white shadow-sm ${
                  isActive
                    ? "ring-2 ring-[#E4002B] ring-offset-2 scale-105 shadow-md shadow-red-500/10"
                    : "border border-gray-100 hover:border-gray-200 group-hover:scale-102"
                }`}
              >
                <span className="text-2xl select-none transition-transform duration-200 group-hover:scale-110">
                  {emoji}
                </span>
              </div>

              {/* Text Label */}
              <span
                className={`text-[11px] max-w-[72px] text-center leading-tight transition-colors duration-200 truncate ${
                  isActive
                    ? "text-[#E4002B] font-black"
                    : "text-gray-600 font-semibold group-hover:text-gray-900"
                }`}
                title={cat}
              >
                {shortName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
