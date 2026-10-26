import { useState } from "react";
import { ArrowRight, Search, PackageCheck } from "lucide-react";
import { navigate } from "../lib/router";
import { isDbConfigured, supabase } from "../lib/supabase";
import { formatMoney, isValidEgyptianMobile, normalizeDigits } from "../lib/arabic";

const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat("ar-EG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Cairo",
});

const STATUS_LABELS = {
  pending: "وصل للمطعم",
  confirmed: "تم تأكيد الطلب",
  preparing: "قيد التحضير",
  out_for_delivery: "خرج للتوصيل",
  completed: "تم التوصيل",
  cancelled: "تم إلغاء الطلب",
};

export default function OrderTracking() {
  const initialOrder = new URLSearchParams(window.location.search).get("order") || "";
  const [orderId, setOrderId] = useState(initialOrder);
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(event) {
    event.preventDefault();
    if (!isDbConfigured) {
      setError("متابعة الطلب متاحة بعد ربط قاعدة بيانات المطعم.");
      return;
    }
    if (!/^[0-9a-f-]{36}$/i.test(orderId.trim()) || !isValidEgyptianMobile(phone)) {
      setError("راجع رقم الطلب ورقم الموبايل المصري.");
      return;
    }
    const normalizedPhone = normalizeDigits(phone).replace(/\D/g, "").replace(/^(?:0020|20)/, "");
    setLoading(true); setError(""); setOrder(null);
    try {
      const { data, error: err } = await supabase.rpc("get_order_status", {
        p_order_id: orderId.trim(), p_phone: normalizedPhone,
      });
      if (err) throw err;
      if (!data) throw new Error("لم نجد طلبًا بهذه البيانات. تأكد من الرقم والهاتف المستخدمين عند الطلب.");
      setOrder(data);
    } catch (err) {
      setError(err?.message || "تعذر جلب حالة الطلب. حاول مرة أخرى.");
    } finally { setLoading(false); }
  }

  return (
    <div className="app-shell min-h-screen px-4 py-5">
      <button onClick={() => navigate("/")} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#E4002B]">
        <ArrowRight className="w-4 h-4" /> العودة للقائمة
      </button>
      <main className="mx-auto max-w-xl">
        <h1 className="text-2xl font-black text-gray-900">متابعة الطلب</h1>
        <p className="mt-2 mb-6 text-sm text-gray-600">أدخل رقم الطلب ورقم الموبايل المستخدم عند الإرسال لعرض آخر حالة.</p>
        <form onSubmit={lookup} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <label htmlFor="track-order-id" className="mb-1 block text-xs font-bold text-gray-700">رقم الطلب</label>
            <input id="track-order-id" required dir="ltr" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-[#E4002B]" />
          </div>
          <div>
            <label htmlFor="track-phone" className="mb-1 block text-xs font-bold text-gray-700">رقم الموبايل</label>
            <input id="track-phone" type="tel" inputMode="tel" dir="ltr" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-[#E4002B]" />
          </div>
          <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E4002B] text-sm font-black text-white disabled:opacity-60">
            <Search className="w-4 h-4" /> {loading ? "جارٍ البحث…" : "عرض حالة الطلب"}
          </button>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">{error}</p>}
        {order && (
          <section role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3 text-green-900">
              <PackageCheck className="w-6 h-6" />
              <div><h2 className="font-black">{STATUS_LABELS[order.status] || "حالة الطلب"}</h2><p className="text-xs">طلب {order.id.slice(0, 8).toUpperCase()}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-green-200 pt-4 text-xs text-gray-700">
              <p>المنطقة: <strong>{order.zone_name}</strong></p>
              <p>الإجمالي: <strong>{formatMoney(order.total)} ج.م</strong></p>
              <p className="col-span-2">وقت الطلب: <strong>{ORDER_DATE_FORMATTER.format(new Date(order.created_at))}</strong></p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
