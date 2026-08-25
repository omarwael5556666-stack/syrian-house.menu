<div align="center">

# 🍽️ Syrian House — Digital Menu

**البيت السوري | A fast, RTL-first restaurant menu & ordering PWA-style web app**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-syrian--house--menu.vercel.app-22c55e?style=for-the-badge&labelColor=0f172a)](https://syrian-house-menu.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white&labelColor=20232a)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white&labelColor=1a1a2e)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0c1a28)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_+_Auth-3ecf8e?style=flat-square&logo=supabase&logoColor=white&labelColor=0d1b12)](https://supabase.com)

</div>

---

A production menu platform built for the real-world **Syrian House** restaurant (Egypt): customers browse a fully Arabic RTL menu, check delivery coverage for their area, and order directly via WhatsApp or phone — while staff manage categories, items, prices, and sizes through a secured admin panel backed by **Supabase**.

## ✨ Features

### Customer side
- 🔍 **Instant search** across item titles, descriptions, and categories
- 🗂️ **Category tabs** with live result counts and grouped sections
- 🛒 **Cart with size variants** (Medium / Large pricing per item) and a floating cart bar
- 💬 **WhatsApp checkout** — order summary sent straight to the restaurant's WhatsApp
- 📞 **One-tap calling** — all 5 delivery hotlines rendered as `tel:` actions
- 📍 **Delivery zone checker** — validates the customer's area against Supabase-backed zones (graceful fallback to static data when offline/unconfigured)
- 🌙 **Dark glassmorphism UI**, fully **RTL**, responsive from small phones to desktop
- ⚡ **Zero-backend mode** — runs entirely on bundled static data if no Supabase credentials are present

### Admin panel (`/admin`)
- 🔐 Supabase Auth email/password login
- 📝 Full CRUD for menu items and categories (prices, descriptions, size variants, NEW badges)
- 🚚 Manage delivery coverage zones
- 🛡️ Row Level Security enforced server-side (`supabase/fix-security.sql`)

## 🧰 Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| UI         | React 19 · JavaScript (JSX) |
| Build      | Vite 8 |
| Styling    | Tailwind CSS 3.4 + custom glassmorphism design tokens |
| State      | React Context (`CartContext`, `AuthContext`) |
| Backend    | Supabase (PostgreSQL, Auth, RLS) |
| Icons      | lucide-react |
| Linting    | Oxlint |
| Hosting    | Vercel |

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/omarwael5556666-stack/syrian-house.menu.git
cd syrian-house.menu

# 2. Install
npm install

# 3. Run
npm run dev
```

The app works out of the box in **static mode** (bundled menu data). To enable live database features:

```bash
cp .env.local.example .env.local   # then fill in your keys
```

```ini
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

> Only the **anon key** is used client-side — write access is locked behind Auth + RLS policies.

### Database setup

Run the SQL files against your Supabase project (SQL Editor), in order:

1. `supabase/all-in-one.sql` — schema, policies, and seed in one shot *(recommended)*
   <details><summary>or granularly:</summary>

   - `schema.sql` — `categories` + `menu_items` tables
   - `delivery-zones.sql` — `delivery_zones` table
   - `seed.sql` / `gen-seed.mjs` — sample data generators
   - `fix-security.sql` — RLS hardening
   </details>

## 📜 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Dev server with HMR      |
| `npm run build` | Production bundle        |
| `npm run preview` | Preview the production build |
| `npm run lint`  | Lint with Oxlint         |

## 🗂️ Project Structure

```
src/
├── admin/           # Admin panel: login gate + management dashboard
├── components/      # Header, SearchBar, CategoryTabs, MenuCard,
│                    # CartBar, CartPage, DeliverySearch, EmptyState
├── context/         # CartContext · AuthContext
├── hooks/           # useMenuData · useDeliveryZones
├── lib/             # supabase client (null-safe static fallback)
├── data/            # Static menu + delivery fallback data
└── App.jsx          # Menu browsing experience
supabase/            # SQL migrations, seeds, security fixes
scripts/             # Seed generation utilities
```

## ☁️ Deployment

Deployed on **Vercel**: [syrian-house-menu.vercel.app](https://syrian-house-menu.vercel.app/)

Any push to `main` triggers an automatic production deployment. Set `VITE_SUPABASE_*` env vars in the Vercel project settings.

## 📄 License

MIT © [Omar Eraky](https://github.com/omarwael5556666-stack)

---

<div align="center">
<sub>Built with ❤️ for البيت السوري — شغل نظيف، طعم أصيل</sub>
</div>
