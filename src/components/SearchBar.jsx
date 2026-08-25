import { Search, X } from "lucide-react";

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8 animate-fade-in">
      {/* Search Icon */}
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400/60 pointer-events-none" />

      {/* Input */}
      <input
        id="menu-search"
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="ابحث عن صنف أو مكون..."
        className="search-input"
        autoComplete="off"
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
                     rounded-full bg-brand-500/15 text-brand-400 hover:bg-brand-500/30
                     transition-all duration-200"
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

