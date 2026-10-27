import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ query, onQueryChange, onFilterClick }) {
  return (
    <div className="relative w-full mb-6">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute right-4 pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Text Input */}
        <input
          id="menu-search"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ابحث في أصناف الشاورما، السندوتشات، الوجبات..."
          className="search-input"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute left-14 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 transition-all"
            aria-label="مسح البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Filter shortcut */}
        <button
          onClick={() => {
            if (onFilterClick) {
              onFilterClick();
            } else {
              const el = document.getElementById("menu-categories");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="absolute left-2.5 w-9 h-9 rounded-full bg-gray-100/90 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all active:scale-95"
          aria-label="خيارات التصفية"
          title="تصفية حسب الأقسام"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
