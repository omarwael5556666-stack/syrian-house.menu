import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Cart entries store only {id, size, qty, note}.
 * Titles and prices are always resolved from live menu data,
 * so admin price changes reflect instantly in open carts.
 */

const CartContext = createContext(null);
const STORAGE_KEY = "sh_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const entryKey = (id, size) => `${id}:${size ?? ""}`;

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const value = useMemo(() => {
    return {
      entries,
      add(id, size = null, qty = 1) {
        const key = entryKey(id, size);
        setEntries((prev) => {
          const existing = prev.find((e) => e.key === key);
          if (existing) {
            return prev.map((e) =>
              e.key === key ? { ...e, qty: e.qty + qty } : e
            );
          }
          return [...prev, { key, id, size, qty, note: "" }];
        });
      },
      setQty(key, qty) {
        setEntries((prev) =>
          qty <= 0
            ? prev.filter((e) => e.key !== key)
            : prev.map((e) => (e.key === key ? { ...e, qty } : e))
        );
      },
      setNote(key, note) {
        setEntries((prev) =>
          prev.map((e) => (e.key === key ? { ...e, note } : e))
        );
      },
      remove(key) {
        setEntries((prev) => prev.filter((e) => e.key !== key));
      },
      clear() {
        setEntries([]);
      },
    };
  }, [entries]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
