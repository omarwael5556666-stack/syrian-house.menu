import { useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import useMenuData from "../hooks/useMenuData";
import useDeliveryZones from "../hooks/useDeliveryZones";
import { RESTAURANT_INFO } from "../data/menuData";
import { navigate } from "../lib/router";

export default function CartPage() {
  const { entries, setQty, setNote, remove, clear } = useCart();
  const { items: menuItems } = useMenuData();
  const zones = useDeliveryZones();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Resolve live item data; drop items that disappeared or became unavailable.
  const lines = useMemo(() => {
    const byId = new Map(menuItems.map((i) => [i.id, i]));
    const live = [];
    const droppedTitles = [];
    for (const e of entries) {
      const item = byId.get(e.id);
      if (item) {
        const price =
          e.size === "M" ? item.priceM : e.size === "L" ? item.priceL : item.price;
        live.push({ ...e, item, price });
      } else if (!e.id.startsWith("static-")) {
        droppedTitles.push(e.id);
      }
    }
    return { live, dropped: droppedTitles.length };
  }, [entries, menuItems]);

  const subtotal = lines.live.reduce((sum, l) => sum + l.price * l.qty, 0);
  const zone = zones.find((z) => z.location === zoneName);
  const deliveryFee = zone ? zone.fee : 0;
  const total = subtotal + deliveryFee;

  function normalizeDigits(v) {
    return String(v).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => {
      const c = d.charCodeAt(0);
      return String(c <= 0x0669 ? c - 0x0660 : c - 0x06f0);
    });
  }

  const isValidPhone = (p) => {
    const digits = normalizeDigits(p).replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 14;
  };

  const phoneOk = isValidPhone(phone);

  function sendToWhatsapp() {
    const L = [];
    L.push(`*طلب جديد - ${RESTAURANT_INFO.name}*`);
    L.push("");
    for (const l of lines.live) {
      L.push(`• ${l.qty}× ${l.item.title}${l.size ? ` (${l.size})` : ""}`);
      if (l.note && l.note.trim()) L.push(`   ملاحظة: ${l.note.trim()}`);
    }
    if (orderNote.trim()) {
      L.push("");
      L.push(`*ملاحظات عامة:* ${orderNote.trim()}`);
    }
    L.push("");
    L.push(`*المجموع:* ${subtotal} ج.م`);
    if (zone) {
      L.push(`*التوصيل:* ${zone.location} (${deliveryFee} ج.م)`);
      L.push(`*الإجمالي:* ${total} ج.م`);
    }
    if (customerName.trim()) {
      L.push("");
      L.push(`الاسم: ${customerName.trim()}`);
    }
    if (phone.trim()) {
      L.push(`*الموبايل:* ${normalizeDigits(phone).trim()}`);
    }
    if (phone2.trim()) {
      L.push(`موبايل 2: ${normalizeDigits(phone2).trim()}`);
    }

    const url = `https://wa.me/${RESTAURANT_INFO.orderWhatsapp}?text=${encodeURIComponent(
      L.join("\n")
    )}`;
    window.open(url, "_blank");
  }

  return (
    <div className="relative z-10 min-h-screen pb-32">
      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-dark-800 border border-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/10 transition-colors duration-150"
            aria-label="رجوع للمينيو"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold gradient-text">سلة الطلبات</h1>
        </div>

        {lines.live.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">السلة فاضية</p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-colors duration-150"
            >
              تصفح المينيو
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="space-y-3 mb-8">
              {lines.live.map((l) => (
                <li
                  key={l.key}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-100 text-sm sm:text-base leading-snug">
                        {l.item.title}
                        {l.size && (
                          <span className="size-badge inline-block ms-2 align-middle">
                            {l.size}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{l.price} ج.م للوحدة</p>
                    </div>
                    <button
                      onClick={() => remove(l.key)}
                      aria-label={`إزالة ${l.item.title}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-1 bg-dark-950/70 rounded-full p-1 border border-white/5"
                      dir="ltr"
                    >
                      <button
                        onClick={() => setQty(l.key, l.qty - 1)}
                        aria-label="تقليل الكمية"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-brand-400 hover:bg-brand-500/20 active:scale-90 transition-all duration-150"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-sm tabular-nums">
                        {l.qty}
                      </span>
                      <button
                        onClick={() => setQty(l.key, l.qty + 1)}
                        aria-label="زيادة الكمية"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-brand-400 hover:bg-brand-500/20 active:scale-90 transition-all duration-150"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-brand-300 tabular-nums">
                      {l.price * l.qty} ج.م
                    </span>
                  </div>

                  <input
                    type="text"
                    value={l.note}
                    onChange={(e) => setNote(l.key, e.target.value)}
                    placeholder="ملاحظات لهذا الصنف… مثال: من غير مخلل"
                    className="mt-3 w-full h-9 px-3 rounded-xl bg-dark-950/70 border border-white/5 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-brand-500/50 transition-colors duration-150"
                  />
                </li>
              ))}
            </ul>

            {/* Customer name */}
            <div className="mb-4">
              <label htmlFor="cust-name" className="block text-xs font-bold text-gray-400 mb-1">
                الاسم (اختياري)
              </label>
              <input
                id="cust-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اسمك"
                className="w-full h-11 px-4 rounded-xl bg-dark-800/80 border border-white/10 text-sm outline-none focus:border-brand-500/60 transition-colors duration-150"
              />
            </div>

            {/* Phone numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label htmlFor="cust-phone" className="block text-xs font-bold text-gray-400 mb-1">
                  رقم الموبايل *
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  autoComplete="tel"
                  className={`w-full h-11 px-4 rounded-xl bg-dark-800/80 border text-sm outline-none transition-colors duration-150 ${
                    phone && !phoneOk
                      ? "border-red-400/70"
                      : "border-white/10 focus:border-brand-500/60"
                  }`}
                />
                {phone && !phoneOk && (
                  <p className="text-[11px] text-red-400 mt-1">
                    اكتب رقم صحيح (10 أرقام على الأقل)
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cust-phone2" className="block text-xs font-bold text-gray-400 mb-1">
                  رقم إضافي (اختياري)
                </label>
                <input
                  id="cust-phone2"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  autoComplete="off"
                  className="w-full h-11 px-4 rounded-xl bg-dark-800/80 border border-white/10 text-sm outline-none focus:border-brand-500/60 transition-colors duration-150"
                />
              </div>
            </div>

            {/* Delivery zone */}
            <div className="mb-4">
              <label htmlFor="cust-zone" className="block text-xs font-bold text-gray-400 mb-1">
                منطقة التوصيل *
              </label>
              <select
                id="cust-zone"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-xl bg-dark-800/80 border border-white/10 text-sm outline-none focus:border-brand-500/60 transition-colors duration-150 appearance-none"
              >
                <option value="">اختر منطقتك…</option>
                {zones.map((z) => (
                  <option key={z.location} value={z.location}>
                    {z.location} — {z.fee} ج.م
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-600 mt-1">
                المنطقة اللي تختارها هتتنسخ تلقائياً في رسالة الواتساب مع سعر
                التوصيل
              </p>
            </div>

            {/* General order note */}
            <div className="mb-6">
              <label htmlFor="order-note" className="block text-xs font-bold text-gray-400 mb-1">
                ملاحظات عامة (اختياري)
              </label>
              <textarea
                id="order-note"
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="مثال: الاتصال قبل الوصول، العمارة 5 الدور 2…"
                className="w-full px-4 py-2 rounded-xl bg-dark-800/80 border border-white/10 text-sm outline-none focus:border-brand-500/60 transition-colors duration-150 resize-none"
              />
            </div>

            {/* Totals */}
            <div className="glass-card rounded-2xl p-4 space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>مجموع الأصناف</span>
                <span className="tabular-nums">{subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>التوصيل</span>
                <span className="tabular-nums">
                  {zone ? `${deliveryFee} ج.م` : "اختر المنطقة"}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-brand-400 pt-2 border-t border-white/10">
                <span>الإجمالي</span>
                <span className="tabular-nums">{zone ? `${total} ج.م` : `${subtotal}+ `}</span>
              </div>
            </div>

            {/* Send */}
            <button
              onClick={sendToWhatsapp}
              disabled={!zone || lines.live.length === 0 || !phoneOk}
              className="w-full h-12 rounded-2xl bg-gradient-to-l from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-all duration-150 text-white font-extrabold text-base shadow-lg shadow-black/30"
            >
              إرسال الطلب عبر واتساب
            </button>
            {!phoneOk && (
              <p className="text-xs text-gray-500 text-center mt-2">
                اكتب رقم موبايلك عشان نعرف نوصللك الطلب
              </p>
            )}

            <button
              onClick={clear}
              className="block mx-auto mt-4 text-xs text-gray-500 hover:text-red-400 transition-colors duration-150"
            >
              تفريغ السلة
            </button>
          </>
        )}
      </div>
    </div>
  );
}
