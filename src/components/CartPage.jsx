import { useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, Trash2, MapPin, ShoppingBag, Send } from "lucide-react";
import { useCart } from "../context/CartContext";
import useMenuData from "../hooks/useMenuData";
import useDeliveryZones from "../hooks/useDeliveryZones";
import { RESTAURANT_INFO } from "../data/menuData";
import { navigate } from "../lib/router";
import BottomNav from "./BottomNav";

export default function CartPage() {
  const { entries, setQty, setNote, remove, clear } = useCart();
  const { items: menuItems } = useMenuData();
  const zones = useDeliveryZones();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [quesnaDetail, setQuesnaDetail] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Resolve live item data
  const lines = useMemo(() => {
    const byId = new Map(menuItems.map((i) => [i.id, i]));
    const live = [];
    for (const e of entries) {
      const item = byId.get(e.id);
      if (item) {
        const price =
          e.size === "M" ? item.priceM : e.size === "L" ? item.priceL : item.price;
        live.push({ ...e, item, price });
      }
    }
    return { live };
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
  const isQuesna = zoneName === "قويسنا";
  const quesnaOk = !isQuesna || quesnaDetail.trim().length > 0;

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
      if (isQuesna && quesnaDetail.trim()) {
        L.push(`*المكان بالتفصيل في قويسنا:* ${quesnaDetail.trim()}`);
      }
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
    <div className="app-shell flex flex-col min-h-screen">
      <div className="flex-1 px-4 pt-4 pb-28">
        {/* ─── Top Bar ───────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#E4002B] hover:bg-gray-50 transition-colors"
            aria-label="رجوع للمينيو"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900">سلة الطلبات</h1>
            <p className="text-[11px] font-bold text-gray-400">
              {lines.live.length} أصناف في السلة
            </p>
          </div>
        </div>

        {lines.live.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-[#E4002B]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">السلة فارغة</h3>
            <p className="text-xs text-gray-400 mb-5">
              لم تقم بإضافة أي وجبة أو ساندوتش إلى السلة بعد
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-full bg-[#E4002B] hover:bg-[#C8102E] text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              تصفح قائمة الطعام
            </button>
          </div>
        ) : (
          <>
            {/* ─── Cart Items List ───────────────────── */}
            <div className="space-y-3 mb-6">
              {lines.live.map((l) => (
                <div
                  key={l.key}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm leading-snug">
                        {l.item.title}
                        {l.size && (
                          <span className="ms-2 inline-block text-[11px] font-black bg-red-50 text-[#E4002B] px-2 py-0.5 rounded-md">
                            حجم {l.size}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{l.price} ج.م للقطعة</p>
                    </div>

                    <button
                      onClick={() => remove(l.key)}
                      aria-label={`إزالة ${l.item.title}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-50">
                    {/* Quantity controls */}
                    <div
                      className="flex items-center gap-1 bg-gray-100/80 rounded-full p-1"
                      dir="ltr"
                    >
                      <button
                        onClick={() => setQty(l.key, l.qty - 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-800 hover:text-[#E4002B] shadow-xs active:scale-90 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-gray-900 tabular-nums">
                        {l.qty}
                      </span>
                      <button
                        onClick={() => setQty(l.key, l.qty + 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-800 hover:text-[#E4002B] shadow-xs active:scale-90 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-[#E4002B] tabular-nums">
                      {l.price * l.qty} ج.م
                    </span>
                  </div>

                  {/* Note input */}
                  <input
                    type="text"
                    value={l.note}
                    onChange={(e) => setNote(l.key, e.target.value)}
                    placeholder="ملاحظات خاصة... مثال: زيادة تومية، بدون خيار"
                    className="mt-2.5 w-full h-8 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#E4002B] focus:bg-white transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* ─── Customer Details Form ──────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3 mb-4">
              <h4 className="text-xs font-black text-gray-700 pb-1 border-b border-gray-100">
                بيانات التوصيل
              </h4>

              <div>
                <label htmlFor="cust-name" className="block text-[11px] font-bold text-gray-500 mb-1">
                  الاسم (اختياري)
                </label>
                <input
                  id="cust-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسمك"
                  className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E4002B] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="cust-phone" className="block text-[11px] font-bold text-gray-500 mb-1">
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
                    className={`w-full h-10 px-3 rounded-xl bg-gray-50 border text-xs text-gray-900 outline-none ${
                      phone && !phoneOk
                        ? "border-red-400 bg-red-50/30"
                        : "border-gray-200 focus:border-[#E4002B] focus:bg-white"
                    }`}
                  />
                  {phone && !phoneOk && (
                    <p className="text-[10px] text-red-500 mt-1">
                      اكتب رقم موبايل صحيح (10-14 رقم)
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cust-phone2" className="block text-[11px] font-bold text-gray-500 mb-1">
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
                    className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E4002B] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cust-zone" className="block text-[11px] font-bold text-gray-500 mb-1">
                  منطقة التوصيل *
                </label>
                <select
                  id="cust-zone"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E4002B] focus:bg-white"
                >
                  <option value="">اختر منطقتك أو قريتك...</option>
                  {zones.map((z) => (
                    <option key={z.location} value={z.location}>
                      {z.location} — رسوم {z.fee} ج.م
                    </option>
                  ))}
                </select>
              </div>

              {isQuesna && (
                <div className="pt-1">
                  <label
                    htmlFor="cust-quesna-detail"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#E4002B] mb-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>العنوان بالتفصيل في قويسنا *</span>
                  </label>
                  <input
                    id="cust-quesna-detail"
                    type="text"
                    value={quesnaDetail}
                    onChange={(e) => setQuesnaDetail(e.target.value)}
                    placeholder="اسم الشارع، رقم العمارة، علامة مميزة..."
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E4002B]/40 text-xs text-gray-900 outline-none focus:border-[#E4002B]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="order-note" className="block text-[11px] font-bold text-gray-500 mb-1">
                  ملاحظات عامة على الأوردر (اختياري)
                </label>
                <textarea
                  id="order-note"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="أي طلبات خاصة بطريقة التوصيل أو الاستلام..."
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#E4002B] focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* ─── Bill Summary ──────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 mb-4 text-xs font-bold">
              <div className="flex justify-between text-gray-500">
                <span>مجموع الأصناف</span>
                <span className="text-gray-900 tabular-nums">{subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>رسوم التوصيل</span>
                <span className="text-gray-900 tabular-nums">
                  {zone ? `${deliveryFee} ج.م` : "اختر المنطقة"}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#E4002B] pt-2 border-t border-gray-100">
                <span>الإجمالي النهائي</span>
                <span className="tabular-nums">
                  {zone ? `${total} ج.م` : `${subtotal} ج.م + التوصيل`}
                </span>
              </div>
            </div>

            {/* ─── WhatsApp Order Button ─────────────── */}
            <button
              onClick={sendToWhatsapp}
              disabled={!zone || lines.live.length === 0 || !phoneOk || !quesnaOk}
              className="w-full h-13 py-3 rounded-2xl bg-[#E4002B] hover:bg-[#C8102E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الطلب عبر واتساب ({zone ? `${total} ج.م` : "تحديد البيانات"})</span>
            </button>

            {!phoneOk && (
              <p className="text-[11px] text-gray-400 text-center mt-2">
                يرجى إدخال رقم الموبايل لتفعيل زر إرسال الطلب
              </p>
            )}
            {phoneOk && !zone && (
              <p className="text-[11px] text-gray-400 text-center mt-2">
                يرجى تحديد منطقة التوصيل لحساب الإجمالي
              </p>
            )}

            <button
              onClick={clear}
              className="block mx-auto mt-4 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
            >
              تفريغ محتويات السلة
            </button>
          </>
        )}
      </div>

      <BottomNav activeTab="cart" />
    </div>
  );
}
