import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import useMenuData from "../hooks/useMenuData";
import { navigate, usePath } from "../lib/router";

export default function CartBar() {
  const { entries } = useCart();
  const { items } = useMenuData();
  const path = usePath();

  if (path.startsWith("/cart") || entries.length === 0) return null;

  const byId = new Map(items.map((i) => [i.id, i]));
  let count = 0;
  let total = 0;
  for (const e of entries) {
    const item = byId.get(e.id);
    if (!item) continue;
    count += e.qty;
    total += e.qty * (e.size === "M" ? item.priceM : e.size === "L" ? item.priceL : item.price);
  }

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <button
        onClick={() => navigate("/cart")}
        aria-label={`فتح السلة، ${count} صنف، الإجمالي ${total} جنيه`}
        className="pointer-events-auto inline-flex items-center gap-2.5 h-11 ps-2 pe-4 rounded-full bg-gradient-to-l from-brand-500 to-brand-600 shadow-lg shadow-black/50 text-white font-extrabold active:scale-95 transition-all duration-150"
      >
        <span className="relative w-8 h-8 rounded-full bg-white/25 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-brand-600 text-[11px] font-black flex items-center justify-center tabular-nums">
            {count}
          </span>
        </span>
        <span className="text-sm">عرض السلة</span>
        <span className="text-sm font-bold opacity-90 tabular-nums">
          {total} ج.م
        </span>
      </button>
    </div>
  );
}
