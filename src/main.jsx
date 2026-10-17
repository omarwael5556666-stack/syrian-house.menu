import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { usePath } from "./lib/router.js";
import "./index.css";

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const CartPage = lazy(() => import("./components/CartPage.jsx"));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 text-brand-400">
      <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
}

/** Reactive route switch with code-splitting */
function Routes() {
  const path = usePath();

  if (path.startsWith("/admin")) {
    return (
      <Suspense fallback={<PageLoading />}>
        <AdminApp />
      </Suspense>
    );
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
