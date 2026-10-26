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

A menu and ordering platform built for **Syrian House** restaurant in Egypt. Customers browse the Arabic RTL menu, check delivery coverage, place a WhatsApp order, and look up its status. Staff manage menu content, delivery areas, settings, and order statuses through the Supabase-backed admin panel.

## ✨ Features

### Customer side
- 🔍 **Instant search** across item titles, descriptions, and categories
- 🗂️ **Category tabs** with live result counts and grouped sections
- 🛒 **Persistent cart** with size variants, per-item notes, current prices, and a floating cart bar
- 💬 **WhatsApp checkout** with a server-validated order record, delivery fee, ETA, and status tracking link when Supabase is configured
- 📦 **Order status lookup** by order ID and the phone number used at checkout
- ❤️ **Saved favorites** and Arabic-aware search across names, descriptions, and categories
- 📞 **One-tap calling** — all 5 delivery hotlines rendered as `tel:` actions
- 📍 **Delivery zone checker** — validates the customer's area against Supabase-backed zones (graceful fallback to static data when offline/unconfigured)
- 📱 **Installable PWA** with cached app shell, fully RTL layout, and responsive menu grids
- ⚡ **Static fallback mode** — browses bundled menu data when Supabase credentials are absent

### Admin panel (`/admin`)
- 🔐 Supabase Auth email/password login
- 📝 Manage menu items, categories, price variants, photos, availability, and display order
- 🚚 Manage delivery coverage zones and fees
- ⚙️ Manage restaurant contact details, opening hours, order pauses, delivery estimate, and minimum order value
- 📦 Review incoming orders and update fulfillment status
- 🛡️ RLS restricts writes to accounts with a trusted `app_metadata.role = "admin"` claim

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

For a new Supabase database, run these files in the SQL Editor, in order:

1. `supabase/all-in-one.sql` — safe, additive schema, order RPCs, and RLS policies. It does not drop or truncate existing data.
2. `supabase/seed.sql` — adds the starter menu, with Fatta and Arabic separated and all Arabic double meals priced at EGP 220.
3. `supabase/delivery-zones.sql` — inserts only missing starter delivery zones and preserves edits/removals.

For an existing database, run `supabase/menu-category-price-update.sql` to split the old combined category and set the three Arabic double meals to EGP 220 without reseeding the rest of the menu.

Before enabling `/admin`, assign the restaurant operator's Supabase Auth user a trusted `app_metadata.role` value of `admin` using the Supabase Dashboard or Auth Admin API. Do not use `user_metadata` for authorization; users can edit their own user metadata. Never put a service-role key in `.env.local` or any browser bundle.

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

Any push to `main` triggers an automatic production deployment. Set `VITE_SUPABASE_*` env vars in the Vercel project settings. Without Supabase, the menu and WhatsApp flow use local static data; recorded orders and status lookup require the SQL setup above.

## 📄 License

MIT © [Omar Eraky](https://github.com/omarwael5556666-stack)

---

<div align="center">
<sub>Built with ❤️ for البيت السوري — شغل نظيف، طعم أصيل</sub>
</div>
