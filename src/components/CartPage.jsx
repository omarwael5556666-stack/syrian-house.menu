import { useMemo, useState, useEffect } from "react";
import { ArrowRight, Minus, Plus, Trash2, MapPin, ShoppingBag, Send } from "lucide-react";
import { useCart } from "../context/CartContext";
import useMenuData from "../hooks/useMenuData";
import useDeliveryZones from "../hooks/useDeliveryZones";
import { RESTAURANT_INFO } from "../data/menuData";
import { navigate } from "../lib/router";
import BottomNav from "./BottomNav";
import useRestaurantSettings from "../hooks/useRestaurantSettings";
import { isDbConfigured, supabase } from "../lib/supabase";
import { formatMoney, isValidEgyptianMobile, normalizeDigits } from "../lib/arabic";

export default function CartPage() {
  // Scroll to top immediately when cart page opens
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { entries, setQty, setNote, remove, clear } = useCart();
  const { items: menuItems } = useMenuData();
  const zones = useDeliveryZones();
  const { settings, isOpen } = useRestaurantSettings();
  const restaurantInfo = { ...RESTAURANT_INFO, ...settings };

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [quesnaDetail, setQuesnaDetail] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  // Resolve live item data
  const lines = useMemo(() => {
    const byId = new Map(menuItems.map((i) => [i.id, i]));
    const live = [];
    const invalid = [];
    for (const e of entries) {
      const item = byId.get(e.id);
      if (item && item.isAvailable !== false) {
        const price =
          e.size === "M" ? item.priceM : e.size === "L" ? item.priceL : item.price;
        if (Number.isFinite(price) && price >= 0) live.push({ ...e, item, price });
        else invalid.push({ ...e, item });
      } else invalid.push({ ...e, item: item ?? null });
    }
    return { live, invalid };
  }, [entries, menuItems]);

  const subtotal = lines.live.reduce((sum, l) => sum + l.price * l.qty, 0);
  const zone = zones.find((z) => z.location === zoneName);
  const deliveryFee = zone ? zone.fee : 0;
  const total = subtotal + deliveryFee;

  const phoneOk = isValidEgyptianMobile(phone);
  const phone2Ok = !phone2.trim() || isValidEgyptianMobile(phone2);
  const normalizedPhone = normalizeDigits(phone).replace(/\D/g, "").replace(/^(?:0020|20)/, "");
  const normalizedPhone2 = normalizeDigits(phone2).replace(/\D/g, "").replace(/^(?:0020|20)/, "");
  const isQuesna = zoneName === "قويسنا";
  const quesnaOk = !isQuesna || quesnaDetail.trim().length > 0;
  const minimumOk = subtotal >= Number(settings.minimum_order || 0);

  async function sendToWhatsapp() {
    if (sending || !isOpen || !zone || !phoneOk || !phone2Ok || !quesnaOk || !minimumOk || lines.invalid.length) return;
    const whatsappWindow = window.open("about:blank", "_blank");
    if (!whatsappWindow) {
      setNotice("تعذر فتح نافذة واتساب. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى.");
      return;
    }
    setSending(true);
    setNotice("");
    try {
        let savedOrder = null;
        const canRecord = isDbConfigured && lines.live.every((line) => typeof line.id === "string" && !line.id.startsWith("static-"));
        if (isDbConfigured && !canRecord) {
          setNotice("تعذر التحقق من نسخة المنيو الحالية؛ الطلب لن يُسجل داخل النظام وسيظل محفوظًا في السلة.");
        }
        if (canRecord) {
          try {
            const { data, error } = await supabase.rpc("place_order", {
              p_customer: {
                name: customerName.trim(), phone: normalizedPhone, phone2: normalizedPhone2,
                delivery_detail: quesnaDetail.trim(), note: orderNote.trim(),
              },
              p_zone_name: zoneName,
              p_items: lines.live.map((line) => ({ id: line.id, size: line.size, quantity: line.qty, note: line.note })),
            });
            if (error) throw error;
            savedOrder = data;
          } catch (error) {
            if (error?.code === "P0001") {
              whatsappWindow.close();
              setNotice(error.message || "تعذر اعتماد الطلب. راجع بيانات السلة وحاول مرة أخرى.");
              return;
            }
            setNotice(`تعذر تسجيل الطلب داخل النظام (${error?.message || "خطأ اتصال"})، لكن يمكنك إرساله عبر واتساب.`);
          }
        }

        const L = [];
        L.push(`*طلب جديد - ${restaurantInfo.restaurant_name || restaurantInfo.name}*`);
        if (savedOrder?.id) {
          L.push(`رقم الطلب: ${savedOrder.id}`);
          L.push(`متابعة الحالة: ${window.location.origin}/track?order=${encodeURIComponent(savedOrder.id)}`);
        }
        L.push("");
        for (const l of lines.live) {
          L.push(`• ${l.qty}× ${l.item.title}${l.size ? ` (${l.size === "M" ? "وسط" : "كبير"})` : ""}`);
          if (l.note && l.note.trim()) L.push(`   ملاحظة: ${l.note.trim()}`);
        }
        if (orderNote.trim()) {
          L.push("");
          L.push(`*ملاحظات عامة:* ${orderNote.trim()}`);
        }
        L.push("");
        const orderSubtotal = savedOrder?.subtotal ?? subtotal;
        const orderTotal = savedOrder?.total ?? total;
        const orderDeliveryFee = savedOrder?.delivery_fee ?? deliveryFee;
        L.push(`*المجموع:* ${orderSubtotal} ج.م`);
        if (zone) {
          L.push(`*التوصيل:* ${zone.location} (${orderDeliveryFee} ج.م)`);
          if (isQuesna && quesnaDetail.trim()) {
            L.push(`*المكان بالتفصيل في قويسنا:* ${quesnaDetail.trim()}`);
          }
          L.push(`*الإجمالي:* ${orderTotal} ج.م`);
          L.push(`*الوقت المتوقع:* ${savedOrder?.eta_minutes ?? settings.eta_minutes} دقيقة تقريبًا`);
        }
        if (customerName.trim()) {
          L.push("");
          L.push(`الاسم: ${customerName.trim()}`);
        }
        if (phone.trim()) {
          L.push(`*الموبايل:* ${normalizedPhone}`);
        }
        if (phone2.trim()) {
          L.push(`موبايل 2: ${normalizedPhone2}`);
        }

        const url = `https://wa.me/${restaurantInfo.order_whatsapp || restaurantInfo.orderWhatsapp}?text=${encodeURIComponent(
          L.join("\n")
        )}`;
        whatsappWindow.location.href = url;
        if (savedOrder || !isDbConfigured) clear();
    } catch (error) {
      whatsappWindow.close();
      setNotice(`تعذر تجهيز الطلب (${error?.message || "خطأ غير متوقع"}). لم يتم إرساله، حاول مرة أخرى.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-36">
        {/* ─── Top Bar ───────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#8C2334] hover:bg-gray-50 transition-colors"
              aria-label="رجوع للمينيو"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-normal py-0.5">سلة الطلبات</h1>
              <p className="text-[11px] font-bold text-gray-400">
                {entries.length} أصناف في السلة
              </p>
            </div>
          </div>

          {entries.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-[#8C2334] text-xs font-bold transition-all active:scale-95 border border-brand-100 shadow-xs"
              aria-label="إفراغ السلة بالكامل"
              title="إفراغ السلة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إفراغ السلة</span>
            </button>
          )}
        </div>

        {notice && <p role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-900">{notice}</p>}
        {lines.live.length === 0 && lines.invalid.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4 text-[#8C2334]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">السلة فارغة</h3>
            <p className="text-xs text-gray-400 mb-5">
              لم تقم بإضافة أي وجبة أو ساندوتش إلى السلة بعد
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-full bg-[#8C2334] hover:bg-[#6E1B29] text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              تصفح قائمة الطعام
            </button>
          </div>
        ) : (
          <>
            {lines.invalid.length > 0 && (
              <div role="alert" className="mb-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <p className="mb-2 text-sm font-black text-red-800">في السلة أصناف غير متاحة أو سعرها غير محدد</p>
                <ul className="space-y-2">
                  {lines.invalid.map((line) => (
                    <li key={line.key} className="flex items-center justify-between gap-3 text-xs text-red-800">
                      <span>{line.item?.title || "صنف محذوف من القائمة"}</span>
                      <button onClick={() => remove(line.key)} className="font-black underline underline-offset-2">إزالة</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                            <span className="ms-2 inline-block text-[11px] font-black bg-brand-50 text-[#8C2334] px-2 py-0.5 rounded-md">
                            {l.size === "M" ? "وسط" : "كبير"}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{l.price} ج.م للقطعة</p>
                    </div>

                    <button
                      onClick={() => remove(l.key)}
                      aria-label={`إزالة ${l.item.title}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#8F2433] hover:text-[#B42318] hover:bg-brand-50 transition-colors shrink-0"
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
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-800 hover:text-[#8C2334] shadow-xs active:scale-90 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-black text-sm text-gray-900 tabular-nums">
                        {l.qty}
                      </span>
                      <button
                        onClick={() => setQty(l.key, l.qty + 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-800 hover:text-[#8C2334] shadow-xs active:scale-90 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-[#8C2334] tabular-nums">
                      {l.price * l.qty} ج.م
                    </span>
                  </div>

                  {/* Note input */}
                  <input
                    type="text"
                    value={l.note}
                    onChange={(e) => setNote(l.key, e.target.value)}
                    placeholder="ملاحظات خاصة... مثال: زيادة تومية، بدون خيار"
                    className="mt-2.5 w-full h-8 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#8C2334] focus:bg-white transition-colors"
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
                  className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#8C2334] focus:bg-white"
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
                        ? "border-red-400 bg-brand-50/30"
                        : "border-gray-200 focus:border-[#8C2334] focus:bg-white"
                    }`}
                  />
                  {phone && !phoneOk && (
                    <p className="text-[10px] text-red-600 mt-1">
                      أدخل رقم موبايل مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015
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
                    className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#8C2334] focus:bg-white"
                  />
                  {phone2 && !phone2Ok && <p className="text-[10px] text-red-600 mt-1">أدخل رقم موبايل مصري صحيح أو اترك الحقل فارغًا</p>}
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
                  className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#8C2334] focus:bg-white"
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
                    className="flex items-center gap-1 text-[11px] font-bold text-[#8C2334] mb-1"
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
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#8C2334]/40 text-xs text-gray-900 outline-none focus:border-[#8C2334]"
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
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 outline-none focus:border-[#8C2334] focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* ─── Bill Summary ──────────────────────── */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 mb-4 text-xs font-bold">
              <div className="flex justify-between text-gray-500">
                <span>مجموع الأصناف</span>
                <span className="text-gray-900 tabular-nums">{formatMoney(subtotal)} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>رسوم التوصيل</span>
                <span className="text-gray-900 tabular-nums">
                  {zone ? `${formatMoney(deliveryFee)} ج.م` : "اختر المنطقة"}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#8C2334] pt-2 border-t border-gray-100">
                <span>الإجمالي النهائي</span>
                <span className="tabular-nums">
                  {zone ? `${formatMoney(total)} ج.م` : `${formatMoney(subtotal)} ج.م + التوصيل`}
                </span>
              </div>
            </div>

            {/* ─── WhatsApp Order Button ─────────────── */}
            <button
              onClick={sendToWhatsapp}
              disabled={sending || !isOpen || !zone || lines.live.length === 0 || lines.invalid.length > 0 || !phoneOk || !phone2Ok || !quesnaOk || !minimumOk}
              className="w-full h-13 py-3 rounded-2xl bg-[#8C2334] hover:bg-[#6E1B29] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-brand-700/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? "جارٍ تجهيز الطلب…" : !isOpen ? "المطعم مغلق حاليًا" : `إرسال الطلب عبر واتساب (${zone ? `${formatMoney(total)} ج.م` : "تحديد البيانات"})`}</span>
            </button>

            {!phoneOk && (
              <p className="text-[11px] text-gray-400 text-center mt-2">
                يرجى إدخال رقم الموبايل لتفعيل زر إرسال الطلب
              </p>
            )}
            {!phone2Ok && <p className="text-[11px] text-red-600 text-center mt-2">رقم الموبايل الإضافي غير صحيح</p>}
            {!minimumOk && <p className="text-[11px] text-gray-500 text-center mt-2">الحد الأدنى للطلب {formatMoney(settings.minimum_order)} ج.م</p>}
            {!isOpen && <p className="text-[11px] text-gray-500 text-center mt-2">{settings.opening_time && settings.closing_time ? `مواعيد استقبال الطلبات ${String(settings.opening_time).slice(0, 5)}–${String(settings.closing_time).slice(0, 5)}` : "المطعم متوقف مؤقتًا عن استقبال الطلبات"}</p>}
            {phoneOk && !zone && (
              <p className="text-[11px] text-gray-400 text-center mt-2">
                يرجى تحديد منطقة التوصيل لحساب الإجمالي
              </p>
            )}

            <button
              onClick={clear}
              className="block mx-auto mt-4 text-[11px] font-bold text-gray-400 hover:text-brand-500 transition-colors"
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
