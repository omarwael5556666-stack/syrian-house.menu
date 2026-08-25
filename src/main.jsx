import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./admin/AdminApp.jsx";
import CartPage from "./components/CartPage.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { usePath } from "./lib/router.js";
import "./index.css";

/** Reactive route switch: re-renders whenever the URL path changes,
 *  so in-app navigation and browser back/forward both work. */
function Routes() {
  const path = usePath();

  if (path.startsWith("/admin")) return <AdminApp />;

  return (
    <CartProvider>
      {path.startsWith("/cart") ? <CartPage /> : <App />}
    </CartProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
