import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Truck, MapPinOff } from "lucide-react";
import useDeliveryZones from "../hooks/useDeliveryZones";

export default function DeliverySearch() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const zones = useDeliveryZones();

  const rootRef = useRef(null);
  const listRef = useRef(null);

  // Click anywhere outside the zones box closes the expanded list.
  useEffect(() => {
    if (!expanded) return;
    const onDocPress = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onDocPress);
    document.addEventListener("touchstart", onDocPress);
    return () => {
      document.removeEventListener("mousedown", onDocPress);
      document.removeEventListener("touchstart", onDocPress);
    };
  }, [expanded]);

  function toggleExpanded() {
    const willCollapse = expanded;
    setExpanded((v) => !v);
    if (willCollapse) {
      // Keep the viewport anchored at the box after the list shrinks,
      // instead of jumping further down the page.
      requestAnimationFrame(() => {
        listRef.current?.scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      });
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return zones;
    return zones.filter((d) => d.location.includes(q));
  }, [query, zones]);

  return (
    <div className="delivery-section" ref={rootRef}>
      {/* ─── Section Divider ────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-500/25 to-transparent" />
        <div className="flex items-center gap-2 text-brand-400 font-bold text-sm sm:text-base whitespace-nowrap">
          <Truck className="w-4 h-4" />
          <span>مناطق وأسعار التوصيل</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-500/25 to-transparent" />
      </div>

      {/* ─── Location Search ────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400/50 pointer-events-none" />
        <input
          id="delivery-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن منطقتك..."
          className="delivery-search-input"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
                       rounded-full bg-brand-500/15 text-brand-400 hover:bg-brand-500/30
                       transition-all duration-200"
            aria-label="مسح البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ─── Results Count ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-[11px] text-gray-500">
          <span className="text-brand-400 font-bold">{filtered.length}</span>{" "}
          منطقة
        </p>
        {query && (
          <p className="text-[11px] text-gray-600">
            نتائج:{" "}
            <span className="text-brand-300">&ldquo;{query}&rdquo;</span>
          </p>
        )}
      </div>

      {/* ─── Location Grid ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="delivery-empty-state">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-3">
            <MapPinOff className="w-6 h-6 text-brand-400/40" />
          </div>
          <p className="text-sm text-gray-400 font-semibold mb-1">
            لا توجد نتائج
          </p>
          <p className="text-xs text-gray-600 leading-relaxed max-w-[260px] text-center">
            عذراً، هذه المنطقة غير مدرجة في خطة التوصيل حالياً
          </p>
        </div>
      ) : (
        <>
          <div
            ref={listRef}
            className={`delivery-grid-scroll${
              expanded || query.trim() ? "" : " collapsed"
            }`}
          >
            <div className="delivery-grid">
              {filtered.map((d) => (
                <div key={d.location} className="delivery-pill">
                  <span className="delivery-pill-name">{d.location}</span>
                  <span className="delivery-pill-fee">{d.fee} ج.م</span>
                </div>
              ))}
            </div>
          </div>

          {filtered.length > 6 && (
            <button
              onClick={toggleExpanded}
              className="mt-2 w-full py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 active:scale-[0.99] transition-all duration-150 text-brand-300 text-xs font-bold"
            >
              {expanded
                ? "إخفاء المناطق"
                : `عرض كل المناطق (${filtered.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

