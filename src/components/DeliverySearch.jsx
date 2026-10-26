import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Truck, MapPinOff, ChevronDown, ChevronUp } from "lucide-react";
import useDeliveryZones from "../hooks/useDeliveryZones";
import { formatMoney, normalizeArabic } from "../lib/arabic";

export default function DeliverySearch() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const zones = useDeliveryZones();

  const rootRef = useRef(null);
  const listRef = useRef(null);

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
    setExpanded((v) => !v);
  }

  const filtered = useMemo(() => {
    const q = normalizeArabic(query);
    if (!q) return zones;
    return zones.filter((d) => normalizeArabic(d.location).includes(q));
  }, [query, zones]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 mb-4" ref={rootRef}>
      {/* ─── Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm">
          <Truck className="w-4 h-4 text-[#E4002B]" />
          <span>مناطق وأسعار التوصيل (قويسنا والقرى)</span>
        </div>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {zones.length} منطقة
        </span>
      </div>

      {/* ─── Search Input ──────────────────────────────── */}
      <div className="relative mb-3">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          id="delivery-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن قريتك أو منطقتك لمعرفة سعر التوصيل..."
          className="w-full h-10 pr-9 pl-9 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#E4002B] focus:bg-white transition-colors"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:text-gray-900"
            aria-label="مسح البحث"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ─── Location Grid ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2 text-red-400">
            <MapPinOff className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-700">لا توجد نتائج</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            المنطقة غير مسجلة حالياً، اتصل بالمطعم للاستفسار
          </p>
        </div>
      ) : (
        <>
          <div
            ref={listRef}
            className={`grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-hidden transition-all duration-300 ${
              expanded || query.trim() ? "max-h-[320px] overflow-y-auto no-scrollbar" : "max-h-[96px]"
            }`}
          >
            {filtered.map((d) => (
              <div
                key={d.location}
                className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-colors"
              >
                <span className="text-xs font-bold text-gray-800 truncate">{d.location}</span>
                <span className="text-xs font-black text-[#E4002B] shrink-0 ms-1">
                  {formatMoney(d.fee)} ج.م
                </span>
              </div>
            ))}
          </div>

          {filtered.length > 4 && !query.trim() && (
            <button
              onClick={toggleExpanded}
              className="mt-2.5 w-full py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all text-gray-600 text-[11px] font-bold flex items-center justify-center gap-1"
            >
              <span>{expanded ? "إخفاء باقي المناطق" : `عرض جميع المناطق (${filtered.length})`}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </>
      )}
    </div>
  );
}
