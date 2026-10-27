/* oxlint-disable react/only-export-components */
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { usePath } from "./lib/router.js";
import "./index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("[service worker] registration failed:", error?.message);
    });
  }, { once: true });
}

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const CartPage = lazy(() => import("./components/CartPage.jsx"));
const OrderTracking = lazy(() => import("./components/OrderTracking.jsx"));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF8F3] text-[#8C2334]">
      <div className="w-8 h-8 rounded-full border-2 border-[#8C2334] border-t-transparent animate-spin" />
    </div>
  );
}

/** Reactive route switch with code-splitting */
function Routes() {
  const path = usePath();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);

  if (path.startsWith("/admin")) {
    return (
      <Suspense fallback={<PageLoading />}>
        <AdminApp />
      </Suspense>
    );
  }

  if (path.startsWith("/track")) {
    return <Suspense fallback={<PageLoading />}><OrderTracking /></Suspense>;
  }

  return (
    <CartProvider>
      {path.startsWith("/cart") ? (
        <Suspense fallback={<PageLoading />}>
          <CartPage />
        </Suspense>
      ) : (
        <App />
      )}
    </CartProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
