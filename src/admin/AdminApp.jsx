import { useCallback, useEffect, useState } from "react";
import { supabase, isDbConfigured } from "../lib/supabase";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { RESTAURANT_INFO } from "../data/menuData";

const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" });

export default function AdminApp() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

/* ─── Access gate ─────────────────────────────────── */

function Gate() {
  const { session, ready, signOut } = useAuth();

  if (!isDbConfigured) {
    return (
      <Shell>
        <div className="bg-surface border border-line rounded-lg p-6 max-w-md mx-auto mt-24 text-center">
          <h1 className="text-lg font-bold text-fg mb-2">قاعدة البيانات غير مربوطة</h1>
          <p className="text-sm text-fg-secondary leading-relaxed">
            أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env.local ثم
            أعد تشغيل الخادم.
          </p>
        </div>
      </Shell>
    );
  }

  if (!ready) {
    return (
      <Shell>
        <p className="text-sm text-fg-muted text-center mt-24">جارٍ التحقق…</p>
      </Shell>
    );
  }

  if (!session) return <LoginScreen />;
  return session.user?.app_metadata?.role === "admin" ? <Panel /> : (
    <Shell><div role="alert" className="bg-surface border border-line rounded-lg p-6 max-w-md mx-auto mt-24 text-center">
      <h1 className="text-lg font-bold mb-2">الحساب غير مصرح له بإدارة المطعم</h1>
      <p className="text-sm text-fg-secondary mb-4">اطلب من مسؤول قاعدة البيانات تعيين دور admin لهذا الحساب.</p>
      <button onClick={signOut} className="h-10 px-4 rounded-md bg-accent text-on-accent text-sm font-bold">تسجيل الخروج</button>
    </div></Shell>
  );
}

function Shell({ children }) {
  return (
    <div dir="rtl" className="min-h-screen bg-bg text-fg px-4 py-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}

/* ─── Login ───────────────────────────────────────── */

function getSignInErrorMessage(error) {
  const code = String(error?.code ?? "").toLowerCase();

  if (error?.status === 429 || code.includes("rate_limit") || code.includes("over_request")) {
    return "حصلت محاولات دخول كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.";
  }

  if (error?.status === 400 || error?.status === 401 || code === "invalid_credentials") {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  if (error?.status >= 500) {
    return "خدمة تسجيل الدخول تواجه مشكلة مؤقتة. حاول مرة أخرى بعد قليل.";
  }

  return "تعذر تسجيل الدخول إلى Supabase. تحقق من الاتصال وإعدادات المشروع ثم حاول مرة أخرى.";
}

function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const err = await signIn(email.trim(), password);
      if (err) setError(getSignInErrorMessage(err));
    } catch {
      setError("تعذر الاتصال بخدمة الدخول. تحقق من الاتصال وحاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-line rounded-lg p-6 max-w-sm mx-auto mt-24"
      >
        <h1 className="text-lg font-bold mb-1">لوحة تحكم المطعم</h1>
        <p className="text-sm text-fg-muted mb-2">تسجيل دخول المسؤول</p>
        <p className="text-xs text-fg-muted leading-relaxed mb-6">
          اسم المستخدم هو البريد الإلكتروني المسجّل في Supabase؛ تغييره يحتاج دخول مالك المشروع إلى إدارة المستخدمين.
        </p>

        <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="admin-email">
          البريد الإلكتروني (اسم المستخدم)
        </label>
        <input
          id="admin-email"
          type="email"
          required
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-3 mb-4 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150"
          autoComplete="username"
        />

        <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="admin-pass">
          كلمة المرور
        </label>
        <input
          id="admin-pass"
          type="password"
          required
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 px-3 mb-4 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150"
          autoComplete="current-password"
        />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full h-10 rounded-md bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition duration-150 disabled:opacity-60"
        >
          {busy ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </Shell>
  );
}

/* ─── Panel ───────────────────────────────────────── */

function Panel() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState("items");

  return (
    <Shell>
      <header className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-lg font-extrabold">لوحة التحكم</h1>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="inline-flex items-center h-9 px-3 rounded-md border border-line text-sm text-fg-secondary hover:bg-surface hover:text-fg transition-colors duration-150"
          >
            عرض الموقع
          </a>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center h-9 px-3 rounded-md border border-line text-sm text-fg-secondary hover:bg-surface hover:text-fg transition-colors duration-150"
          >
            خروج
          </button>
        </div>
      </header>

      <div className="flex gap-2 mb-6" role="tablist" aria-label="أقسام اللوحة">
        {[
          ["orders", "الطلبات"],
          ["items", "إدارة الأصناف"],
          ["cats", "إدارة الأقسام"],
          ["zones", "مناطق التوصيل"],
          ["settings", "إعدادات المطعم"],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`h-9 px-4 rounded-md text-sm font-bold border transition-colors duration-150 ${
              tab === id
                ? "bg-accent border-accent text-on-accent"
                : "bg-surface border-line text-fg-secondary hover:text-fg hover:border-line-strong"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        <OrdersManager />
      ) : tab === "settings" ? (
        <SettingsManager />
      ) : tab === "items" ? (
        <ItemsManager />
      ) : tab === "cats" ? (
        <CategoriesManager />
      ) : (
        <ZonesManager />
      )}
    </Shell>
  );
}

/* ─── Items manager ───────────────────────────────── */

const EMPTY_FORM = {
  title: "",
  description: "",
  category_id: "",
  price: "",
  price_m: "",
  price_l: "",
  image_url: "",
  is_new: false,
  is_available: true,
  sort_order: 0,
};

function ItemsManager() {
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null | "new" | uuid
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from("menu_items").select("*, categories(name)").order("sort_order").order("title"),
      supabase.from("categories").select("*").order("sort_order").order("name"),
    ]);
    if (itemsRes.error || catsRes.error) {
      setError(itemsRes.error?.message || catsRes.error?.message);
    } else {
      setError("");
      setRows(itemsRes.data);
      setCats(catsRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    const defaultCategoryId = cats[0]?.id ?? "";
    const nextSort = Math.max(-1, ...rows.filter((row) => row.category_id === defaultCategoryId).map((row) => Number(row.sort_order) || 0)) + 1;
    setForm({
      ...EMPTY_FORM,
      category_id: defaultCategoryId,
      sort_order: nextSort,
    });
    setEditingId("new");
  }

  function openEdit(row) {
    setForm({
      title: row.title,
      description: row.description ?? "",
      category_id: row.category_id,
      price: row.price ?? "",
      price_m: row.price_m ?? "",
      price_l: row.price_l ?? "",
      image_url: row.image_url ?? "",
      is_new: row.is_new,
      is_available: row.is_available,
      sort_order: row.sort_order ?? 0,
    });
    setEditingId(row.id);
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function save(e) {
    e.preventDefault();
    const price = numOrNull(form.price);
    const priceM = numOrNull(form.price_m);
    const priceL = numOrNull(form.price_l);
    const hasAnySize = priceM != null || priceL != null;
    if ([price, priceM, priceL].some((value) => value != null && value < 0)) {
      setError("الأسعار لا يمكن أن تكون أقل من صفر");
      return;
    }
    if (hasAnySize && (priceM == null || priceL == null || price != null)) {
      setError("أدخل سعري الوسط والكبير معًا، أو استخدم سعرًا واحدًا للصنف");
      return;
    }
    if (form.is_available && price == null && !(priceM != null && priceL != null)) {
      setError("الصنف المتاح للبيع يجب أن يكون له سعر صحيح");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      category_id: form.category_id,
      price,
      price_m: priceM,
      price_l: priceL,
      image_url: form.image_url.trim() || null,
      is_new: form.is_new,
      is_available: form.is_available,
      sort_order: Math.max(0, parseInt(normalizeDigits(form.sort_order), 10) || 0),
    };

    setSaving(true);
    try {
      const res = editingId === "new"
        ? await supabase.from("menu_items").insert(payload)
        : await supabase.from("menu_items").update(payload).eq("id", editingId);
      if (res.error) {
        setError(res.error.message);
        return;
      }
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err?.message || "تعذر حفظ الصنف. تحقق من الاتصال وحاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!confirm(`حذف "${row.title}" نهائياً؟`)) return;
    const { error: err } = await supabase.from("menu_items").delete().eq("id", row.id);
    if (err) setError(err.message);
    else setRows((r) => r.filter((x) => x.id !== row.id));
  }

  async function toggleAvailability(row) {
    const next = !row.is_available;
    if (next && row.price == null && (row.price_m == null || row.price_l == null)) {
      setError(`لا يمكن إتاحة "${row.title}" قبل إدخال سعر صحيح.`);
      return;
    }
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, is_available: next } : x)));
    const { error: err } = await supabase
      .from("menu_items")
      .update({ is_available: next })
      .eq("id", row.id);
    if (err) {
      setError(err.message);
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, is_available: !next } : x)));
    }
  }

  const grouped = groupBy(rows, (r) => r.categories?.name ?? "");

  return (
    <section aria-label="إدارة الأصناف">
      {error && (
        <p className="mb-4 text-sm text-red-400 bg-surface border border-line rounded-md p-3">
          {error}
        </p>
      )}

      {editingId === null ? (
        <button
          onClick={openNew}
          className="mb-4 h-10 px-4 rounded-md bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition duration-150"
        >
          + صنف جديد
        </button>
      ) : (
        <ItemForm
          form={form}
          setField={setField}
          cats={cats}
          onSave={save}
          onCancel={() => setEditingId(null)}
          isNew={editingId === "new"}
          saving={saving}
        />
      )}

      {loading ? (
        <p className="text-sm text-fg-muted">جارٍ التحميل…</p>
      ) : (
        Object.entries(grouped).map(([catName, items]) => (
          <div key={catName} className="mb-8">
            <h2 className="text-base font-extrabold text-fg mb-3 pb-2 border-b border-line">
              {catName}{" "}
              <span className="text-xs font-normal text-fg-muted">({items.length})</span>
            </h2>
            <ul className="space-y-2">
              {items.map((row) => (
                <li
                  key={row.id}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-2 p-3 rounded-md bg-surface border border-line ${
                    row.is_available ? "" : "opacity-50"
                  }`}
                >
                  <span className="font-bold text-sm flex-1 min-w-[140px]">{row.title}</span>

                  <span className="text-xs text-fg-muted tabular-nums" dir="ltr">
                    {formatPrices(row)}
                  </span>

                  {row.is_new && (
                    <span className="px-2 py-0.5 rounded-md border border-accent text-accent text-xs font-bold">
                      جديد
                    </span>
                  )}

                  <label className="flex items-center gap-1.5 text-xs text-fg-secondary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={row.is_available}
                      onChange={() => toggleAvailability(row)}
                      className="accent-orange-500 w-4 h-4"
                    />
                    متاح
                  </label>

                  <div className="flex items-center gap-2 ms-auto">
                    <button
                      onClick={() => openEdit(row)}
                      className="h-8 px-3 rounded-md border border-line text-xs font-bold text-fg-secondary hover:text-fg hover:border-line-strong transition-colors duration-150"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => remove(row)}
                      className="h-8 px-3 rounded-md border border-line text-xs font-bold text-red-400 hover:border-red-400/50 transition-colors duration-150"
                    >
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}

function ItemForm({ form, setField, cats, onSave, onCancel, isNew, saving }) {
  const field =
    "w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150";
  const label = "block text-xs font-bold text-fg-secondary mb-1";

  return (
    <form onSubmit={onSave} className="bg-surface border border-line rounded-lg p-4 sm:p-5 mb-6">
      <h3 className="text-base font-extrabold mb-4">
        {isNew ? "صنف جديد" : "تعديل الصنف"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={label} htmlFor="f-title">اسم الصنف *</label>
          <input id="f-title" required value={form.title} onChange={(e) => setField("title", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="f-cat">القسم *</label>
          <select id="f-cat" required value={form.category_id} onChange={(e) => setField("category_id", e.target.value)} className={field}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="f-desc">الوصف</label>
          <textarea id="f-desc" maxLength={500} rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} className="w-full px-3 py-2 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150 resize-y" />
        </div>
        <div>
          <label className={label} htmlFor="f-price">السعر (ج.م)</label>
          <input id="f-price" type="number" min="0" step="0.01" inputMode="decimal" dir="ltr" value={form.price} onChange={(e) => setField("price", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="f-sort">ترتيب الصنف داخل القسم</label>
          <input id="f-sort" type="number" min="0" step="1" inputMode="numeric" dir="ltr" value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="f-pm">وسط M</label>
            <input id="f-pm" type="number" min="0" step="0.01" inputMode="decimal" dir="ltr" value={form.price_m} onChange={(e) => setField("price_m", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="f-pl">كبير L</label>
            <input id="f-pl" type="number" min="0" step="0.01" inputMode="decimal" dir="ltr" value={form.price_l} onChange={(e) => setField("price_l", e.target.value)} className={field} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="f-img">رابط الصورة</label>
          <input id="f-img" type="url" dir="ltr" placeholder="https://…" value={form.image_url} onChange={(e) => setField("image_url", e.target.value)} className={field} />
        </div>
      </div>

      <div className="flex items-center gap-6 mb-5">
        <label className="flex items-center gap-2 text-sm text-fg-secondary cursor-pointer select-none">
          <input type="checkbox" checked={form.is_new} onChange={(e) => setField("is_new", e.target.checked)} className="accent-orange-500 w-4 h-4" />
          وسام «جديد»
        </label>
        <label className="flex items-center gap-2 text-sm text-fg-secondary cursor-pointer select-none">
          <input type="checkbox" checked={form.is_available} onChange={(e) => setField("is_available", e.target.checked)} className="accent-orange-500 w-4 h-4" />
          متاح للبيع
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={saving} className="h-10 px-5 rounded-md bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition duration-150 disabled:opacity-60">
          {saving ? "جارٍ الحفظ…" : "حفظ"}
        </button>
        <button type="button" onClick={onCancel} className="h-10 px-4 rounded-md border border-line text-sm text-fg-secondary hover:text-fg transition-colors duration-150">
          إلغاء
        </button>
      </div>
    </form>
  );
}

/* ─── Categories manager ──────────────────────────── */

function CategoriesManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newSort, setNewSort] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("categories")
      .select("*, menu_items(count)")
      .order("sort_order")
      .order("name");
    if (err) setError(err.message);
    else {
      setError("");
      setRows(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function rename(row, name) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === row.name) return;
    const { error: err } = await supabase.from("categories").update({ name: trimmed }).eq("id", row.id);
    if (err) {
      setError(err.message);
      load();
    }
  }

  async function setSort(row, value) {
    const n = parseInt(normalizeDigits(value), 10);
    if (Number.isNaN(n) || n === row.sort_order) return;
    const { error: err } = await supabase.from("categories").update({ sort_order: n }).eq("id", row.id);
    if (err) setError(err.message);
    else load();
  }

  async function remove(row) {
    const count = row.menu_items?.[0]?.count ?? 0;
    if (count > 0) {
      setError(`لا يمكن حذف "${row.name}" لاحتوائه على ${count} صنف.`);
      return;
    }
    if (!confirm(`حذف القسم "${row.name}"؟`)) return;
    const { error: err } = await supabase.from("categories").delete().eq("id", row.id);
    if (err) setError(err.message);
    else setRows((r) => r.filter((x) => x.id !== row.id));
  }

  async function add(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const { data, error: err } = await supabase
      .from("categories")
      .insert({ name, sort_order: parseInt(newSort, 10) || rows.length + 1 })
      .select();
    if (err) {
      setError(err.code === "23505" ? "هذا القسم موجود بالفعل" : err.message);
      return;
    }
    setNewName("");
    setNewSort("");
    setRows((r) => [...r, { ...data[0], menu_items: [{ count: 0 }] }]);
  }

  return (
    <section aria-label="إدارة الأقسام">
      {error && (
        <p className="mb-4 text-sm text-red-400 bg-surface border border-line rounded-md p-3">
          {error}
        </p>
      )}

      <form onSubmit={add} className="flex flex-wrap items-end gap-3 mb-6 bg-surface border border-line rounded-lg p-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="c-name">قسم جديد</label>
          <input id="c-name" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150" />
        </div>
        <div className="w-24">
          <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="c-sort">الترتيب</label>
          <input id="c-sort" type="number" dir="ltr" value={newSort} onChange={(e) => setNewSort(e.target.value)} className="w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150" />
        </div>
        <button type="submit" className="h-10 px-4 rounded-md bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition duration-150">
          إضافة
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-fg-muted">جارٍ التحميل…</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 p-3 rounded-md bg-surface border border-line">
              <CategoryNameInput row={row} onRename={rename} />
              <span className="text-xs text-fg-muted">({row.menu_items?.[0]?.count ?? 0} صنف)</span>
              <label className="flex items-center gap-1.5 text-xs text-fg-secondary ms-auto">
                الترتيب
                <input
                  inputMode="numeric"
                  dir="ltr"
                  defaultValue={row.sort_order}
                  onBlur={(e) => setSort(row, e.target.value)}
                  className="w-16 h-8 px-2 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent"
                />
              </label>
              <button
                onClick={() => remove(row)}
                className="h-8 px-3 rounded-md border border-line text-xs font-bold text-red-400 hover:border-red-400/50 transition-colors duration-150"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CategoryNameInput({ row, onRename }) {
  const [value, setValue] = useState(row.name);
  useEffect(() => setValue(row.name), [row.name]);
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onRename(row, value)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      aria-label={`اسم القسم ${row.name}`}
      className="w-44 h-8 px-2 rounded-md bg-bg border border-line text-sm font-bold outline-none focus:border-accent transition-colors duration-150"
    />
  );
}

/* ─── Delivery zones manager ──────────────────────── */

function ZonesManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newFee, setNewFee] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("sort_order")
      .order("name");
    if (err) setError(err.message);
    else {
      setError("");
      setRows(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function rename(row, name) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === row.name) return;
    const { error: err } = await supabase
      .from("delivery_zones")
      .update({ name: trimmed })
      .eq("id", row.id);
    if (err) {
      setError(err.message);
      load();
    }
  }

  async function setFee(row, value) {
    const fee = numOrNull(value);
    if (fee == null || fee === Number(row.fee)) return;
    if (fee < 0) { setError("رسوم التوصيل لا يمكن أن تكون أقل من صفر"); load(); return; }
    const { error: err } = await supabase
      .from("delivery_zones")
      .update({ fee })
      .eq("id", row.id);
    if (err) {
      setError(err.message);
      load();
    }
  }

  async function remove(row) {
    if (!confirm(`حذف منطقة "${row.name}"؟`)) return;
    const { error: err } = await supabase
      .from("delivery_zones")
      .delete()
      .eq("id", row.id);
    if (err) setError(err.message);
    else setRows((r) => r.filter((x) => x.id !== row.id));
  }

  async function add(e) {
    e.preventDefault();
    const name = newName.trim();
    const fee = numOrNull(newFee);
    if (!name) return;
    if (fee == null || fee < 0) {
      setError("أدخل سعر توصيل صحيح للمنطقة الجديدة");
      return;
    }
    const { data, error: err } = await supabase
      .from("delivery_zones")
      .insert({ name, fee, sort_order: rows.length + 1 })
      .select();
    if (err) {
      setError(err.code === "23505" ? "هذه المنطقة موجودة بالفعل" : err.message);
      return;
    }
    setError("");
    setNewName("");
    setNewFee("");
    setRows((r) => [...r, data[0]]);
  }

  return (
    <section aria-label="إدارة مناطق التوصيل">
      {error && (
        <p className="mb-4 text-sm text-red-400 bg-surface border border-line rounded-md p-3">
          {error}
        </p>
      )}

      <form onSubmit={add} className="flex flex-wrap items-end gap-3 mb-6 bg-surface border border-line rounded-lg p-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="z-name">منطقة جديدة</label>
          <input id="z-name" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-bold text-fg-secondary mb-1" htmlFor="z-fee">السعر (ج.م)</label>
          <input id="z-fee" required inputMode="decimal" dir="ltr" value={newFee} onChange={(e) => setNewFee(e.target.value)} className="w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent transition-colors duration-150" />
        </div>
        <button type="submit" className="h-10 px-4 rounded-md bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition duration-150">
          إضافة
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-fg-muted">جارٍ التحميل…</p>
      ) : (
        <>
          <p className="text-xs text-fg-muted mb-3">{rows.length} منطقة</p>
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 p-3 rounded-md bg-surface border border-line">
                <ZoneNameInput row={row} onRename={rename} />
                <label className="flex items-center gap-1.5 text-xs text-fg-secondary ms-auto">
                  السعر ج.م
                  <input
                    defaultValue={String(row.fee)}
                    inputMode="decimal"
                    dir="ltr"
                    onBlur={(e) => setFee(row, e.target.value)}
                    className="w-20 h-8 px-2 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent"
                  />
                </label>
                <button
                  onClick={() => remove(row)}
                  className="h-8 px-3 rounded-md border border-line text-xs font-bold text-red-400 hover:border-red-400/50 transition-colors duration-150"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function ZoneNameInput({ row, onRename }) {
  const [value, setValue] = useState(row.name);
  useEffect(() => setValue(row.name), [row.name]);
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onRename(row, value)}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      aria-label={`اسم المنطقة ${row.name}`}
      className="flex-1 min-w-[140px] h-8 px-2 rounded-md bg-bg border border-line text-sm font-bold outline-none focus:border-accent transition-colors duration-150"
    />
  );
}

const ORDER_STATUS = {
  pending: "جديد",
  confirmed: "تم التأكيد",
  preparing: "قيد التحضير",
  out_for_delivery: "خرج للتوصيل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

function OrdersManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(100);
      if (err) throw err;
      setRows(data || []);
      setError("");
    } catch (err) {
      setError(err?.message || "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(row, status) {
    setUpdatingId(row.id);
    setError("");
    try {
      const { error: err } = await supabase.from("orders").update({ status }).eq("id", row.id);
      if (err) throw err;
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, status } : item));
    } catch (err) {
      setError(err?.message || "تعذر تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section aria-label="إدارة الطلبات">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div><h2 className="text-base font-extrabold">الطلبات الواردة</h2><p className="text-xs text-fg-muted mt-1">آخر 100 طلب محفوظ في النظام</p></div>
        <button onClick={load} disabled={loading} className="h-9 px-3 rounded-md border border-line text-sm font-bold disabled:opacity-50">تحديث</button>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-700 bg-brand-50 border border-brand-200 rounded-md p-3">{error}</p>}
      {loading ? <p className="text-sm text-fg-muted">جارٍ تحميل الطلبات…</p> : rows.length === 0 ? <p className="p-8 rounded-lg bg-surface border border-line text-center text-sm text-fg-muted">لا توجد طلبات مسجلة حتى الآن.</p> : (
        <ul className="space-y-3">
          {rows.map((order) => (
            <li key={order.id} className="p-4 rounded-lg bg-surface border border-line">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-sm">طلب {order.id.slice(0, 8).toUpperCase()} · {order.customer_name || "عميل"}</p>
                  <p className="text-xs text-fg-muted mt-1">{ORDER_DATE_FORMATTER.format(new Date(order.created_at))} · {order.zone_name} · {order.phone}</p>
                </div>
                <select aria-label={`حالة الطلب ${order.id.slice(0, 8).toUpperCase()}`} value={order.status} disabled={updatingId === order.id} onChange={(event) => changeStatus(order, event.target.value)} className="h-9 px-2 rounded-md border border-line bg-bg text-sm font-bold">
                  {Object.entries(ORDER_STATUS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
              <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs">
                {(order.order_items || []).map((line) => <li key={line.id}>{line.quantity} × {line.title}{line.size ? ` (${line.size})` : ""} — {line.unit_price} ج.م{line.note ? ` · ${line.note}` : ""}</li>)}
              </ul>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-fg-secondary">{order.delivery_detail || order.zone_name}{order.customer_note ? ` · ${order.customer_note}` : ""}</span>
                <strong className="text-accent">الإجمالي {order.total} ج.م</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const DEFAULT_ADMIN_SETTINGS = {
  restaurant_name: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  english_name: RESTAURANT_INFO.englishName,
  address: RESTAURANT_INFO.address,
  order_whatsapp: RESTAURANT_INFO.orderWhatsapp,
  facebook_page: RESTAURANT_INFO.facebook,
  phones: RESTAURANT_INFO.phones,
  accepting_orders: true, opening_time: "", closing_time: "", eta_minutes: 45, minimum_order: 0,
};

function SettingsManager() {
  const [form, setForm] = useState(() => ({ ...DEFAULT_ADMIN_SETTINGS }));
  const [phonesText, setPhonesText] = useState(() => DEFAULT_ADMIN_SETTINGS.phones.map((phone) => `${phone.label}|${phone.number}`).join("\n"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from("restaurant_settings").select("*").eq("id", 1).maybeSingle();
      if (err) throw err;
      if (data) {
        setForm({ ...DEFAULT_ADMIN_SETTINGS, ...data, opening_time: data.opening_time ? String(data.opening_time).slice(0, 5) : "", closing_time: data.closing_time ? String(data.closing_time).slice(0, 5) : "" });
        const phones = Array.isArray(data.phones) ? data.phones : DEFAULT_ADMIN_SETTINGS.phones;
        setPhonesText(phones.map((phone) => `${phone.label}|${phone.number}`).join("\n"));
      }
      setError("");
    } catch (err) { setError(err?.message || "تعذر تحميل إعدادات المطعم"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(event) {
    event.preventDefault();
    const eta = Number(form.eta_minutes);
    const minimum = Number(form.minimum_order);
    if (!Number.isInteger(eta) || eta < 5 || eta > 240 || !Number.isFinite(minimum) || minimum < 0) {
      setError("تحقق من وقت التوصيل (5 إلى 240 دقيقة) والحد الأدنى للطلب.");
      return;
    }
    if (Boolean(form.opening_time) !== Boolean(form.closing_time)) {
      setError("أدخل موعد الفتح والإغلاق معًا، أو اتركهما فارغين للاعتماد على زر إيقاف الطلبات.");
      return;
    }
    const phoneRows = phonesText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [labelText, numberText] = line.split("|");
      const number = normalizeDigits(numberText || "").replace(/\D/g, "");
      const raw = number.startsWith("0") ? `+20${number.slice(1)}` : `+${number}`;
      return { label: (labelText || "").trim(), number, raw };
    });
    if (!form.restaurant_name.trim() || !form.address.trim() || !/^20\d{10}$/.test(normalizeDigits(form.order_whatsapp).replace(/\D/g, ""))) {
      setError("تحقق من اسم المطعم والعنوان ورقم واتساب بصيغة 20xxxxxxxxxx.");
      return;
    }
    if (phoneRows.length === 0 || phoneRows.some((phone) => !phone.label || phone.number.length < 9 || phone.number.length > 14)) {
      setError("أدخل رقمًا صحيحًا لكل وسيلة اتصال بهذا الشكل: الاسم|الرقم.");
      return;
    }
    setSaving(true); setError(""); setMessage("");
    try {
      const { error: err } = await supabase.from("restaurant_settings").upsert({
        id: 1, accepting_orders: form.accepting_orders,
        restaurant_name: form.restaurant_name.trim(), tagline: form.tagline.trim(),
        english_name: form.english_name.trim(), address: form.address.trim(),
        order_whatsapp: normalizeDigits(form.order_whatsapp).replace(/\D/g, ""),
        facebook_page: form.facebook_page.trim(), phones: phoneRows,
        opening_time: form.opening_time || null, closing_time: form.closing_time || null,
        eta_minutes: eta, minimum_order: minimum,
      });
      if (err) throw err;
      setMessage("تم حفظ إعدادات المطعم.");
    } catch (err) { setError(err?.message || "تعذر حفظ الإعدادات"); }
    finally { setSaving(false); }
  }

  const field = "w-full h-10 px-3 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent";
  const label = "block text-xs font-bold text-fg-secondary mb-1";
  if (loading) return <p className="text-sm text-fg-muted">جارٍ تحميل الإعدادات…</p>;
  return (
    <section aria-label="إعدادات المطعم">
      {error && <p role="alert" className="mb-4 text-sm text-red-700 bg-brand-50 border border-brand-200 rounded-md p-3">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}
      <form onSubmit={save} className="max-w-2xl bg-surface border border-line rounded-lg p-4 sm:p-6 space-y-5">
        <h2 className="text-base font-extrabold">بيانات المطعم والتواصل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={label} htmlFor="restaurant-name">اسم المطعم</label><input id="restaurant-name" required maxLength={100} value={form.restaurant_name} onChange={(e) => setForm((current) => ({ ...current, restaurant_name: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="restaurant-tagline">العبارة التعريفية</label><input id="restaurant-tagline" maxLength={100} value={form.tagline} onChange={(e) => setForm((current) => ({ ...current, tagline: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="restaurant-english">الاسم بالإنجليزية</label><input id="restaurant-english" dir="ltr" value={form.english_name} onChange={(e) => setForm((current) => ({ ...current, english_name: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="restaurant-whatsapp">واتساب استقبال الطلبات (20xxxxxxxxxx)</label><input id="restaurant-whatsapp" inputMode="numeric" dir="ltr" value={form.order_whatsapp} onChange={(e) => setForm((current) => ({ ...current, order_whatsapp: e.target.value }))} className={field} /></div>
          <div className="sm:col-span-2"><label className={label} htmlFor="restaurant-address">العنوان</label><input id="restaurant-address" required maxLength={250} value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} className={field} /></div>
          <div className="sm:col-span-2"><label className={label} htmlFor="restaurant-facebook">اسم أو رابط صفحة فيسبوك</label><input id="restaurant-facebook" value={form.facebook_page} onChange={(e) => setForm((current) => ({ ...current, facebook_page: e.target.value }))} className={field} /></div>
          <div className="sm:col-span-2"><label className={label} htmlFor="restaurant-phones">أرقام التواصل — سطر لكل رقم، بالصيغة: الاسم|الرقم</label><textarea id="restaurant-phones" rows={5} dir="ltr" value={phonesText} onChange={(e) => setPhonesText(e.target.value)} className="w-full px-3 py-2 rounded-md bg-bg border border-line text-sm outline-none focus:border-accent" placeholder="موبايل 1|012xxxxxxxx" /></div>
        </div>
        <h2 className="text-base font-extrabold">استقبال الطلبات والتوصيل</h2>
        <label className="flex items-center justify-between gap-4 py-2 border-b border-line">
          <span><strong className="block text-sm">استقبال الطلبات</strong><small className="text-xs text-fg-muted">يمكن إيقاف استقبال الطلبات مؤقتًا</small></span>
          <input type="checkbox" checked={Boolean(form.accepting_orders)} onChange={(e) => setForm((current) => ({ ...current, accepting_orders: e.target.checked }))} className="w-5 h-5 accent-orange-600" />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={label} htmlFor="open-time">موعد الفتح</label><input id="open-time" type="time" value={form.opening_time} onChange={(e) => setForm((current) => ({ ...current, opening_time: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="close-time">موعد الإغلاق</label><input id="close-time" type="time" value={form.closing_time} onChange={(e) => setForm((current) => ({ ...current, closing_time: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="eta-minutes">وقت التوصيل المتوقع (دقيقة)</label><input id="eta-minutes" type="number" min="5" max="240" step="1" value={form.eta_minutes} onChange={(e) => setForm((current) => ({ ...current, eta_minutes: e.target.value }))} className={field} /></div>
          <div><label className={label} htmlFor="minimum-order">الحد الأدنى للطلب (ج.م)</label><input id="minimum-order" type="number" min="0" step="0.01" value={form.minimum_order} onChange={(e) => setForm((current) => ({ ...current, minimum_order: e.target.value }))} className={field} /></div>
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">عند ترك مواعيد الفتح والإغلاق فارغة، يظل استقبال الطلبات متاحًا ما دام مفتاح الاستقبال مفعّلًا. التوقيت مضبوط على القاهرة.</p>
        <button type="submit" disabled={saving} className="h-10 px-5 rounded-md bg-accent text-on-accent text-sm font-bold disabled:opacity-60">{saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}</button>
      </form>
    </section>
  );
}

/* ─── Helpers ─────────────────────────────────────── */

function normalizeDigits(v) {
  // Accept Arabic-Indic (٠-٩) and Persian (۰-۹) digits from local keyboards.
  return String(v).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code <= 0x0669 ? code - 0x0660 : code - 0x06f0);
  });
}

function groupBy(arr, fn) {
  const out = {};
  for (const item of arr) {
    const k = fn(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

function numOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(normalizeDigits(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function formatPrices(row) {
  if (row.price_m != null && row.price_l != null) return `M ${row.price_m} / L ${row.price_l}`;
  return row.price != null ? `${row.price}` : "";
}
