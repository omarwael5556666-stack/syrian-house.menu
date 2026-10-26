import { ArrowLeft } from "lucide-react";
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
    <div className="fixed bottom-[76px] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none animate-slide-up">
      <button
        onClick={() => navigate("/cart")}
        aria-label={`فتح السلة، ${count} صنف، الإجمالي ${total} جنيه`}
        className="pointer-events-auto w-full max-w-[560px] h-12 rounded-2xl bg-[#E4002B] hover:bg-[#C8102E] shadow-xl shadow-red-600/30 text-white font-black flex items-center justify-between px-4 transition-all duration-150 active:scale-[0.98]"
      >
        {/* Count Badge + Total */}
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-black">
            {count}
          </span>
          <span className="text-sm font-extrabold tracking-wide">
            {total} ج.م
          </span>
        </div>

        {/* Action Callout */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black">
          <span>استكمال الطلب</span>
          <ArrowLeft className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
