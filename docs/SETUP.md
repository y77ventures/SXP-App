# SwimXP Connect — Setup Guide

This guide covers everything needed to run SwimXP Connect locally, configure the environment, and prepare for production deployment.

---

## Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | 18.x | [nodejs.org](https://nodejs.org) |
| pnpm | 8.x | `npm install -g pnpm` |
| PostgreSQL | 14.x | [postgresql.org](https://www.postgresql.org) |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

---

## 1. Clone the Repository

```bash
git clone https://github.com/GraceLWT/swimxp-connect.git
cd swimxp-connect
```

---

## 2. Install Dependencies

```bash
pnpm install
```

This installs all frontend and backend dependencies defined in `package.json`.

---

## 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Key variables to configure:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/swimxp` |
| `JWT_SECRET` | Secret for signing JWT tokens | Any long random string |
| `VITE_APP_TITLE` | App display name | `SwimXP Connect` |
| `VITE_APP_LOGO` | Logo URL | CDN URL to logo image |
| `STRIPE_SECRET_KEY` | Stripe secret key (payments) | `sk_test_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

---

## 4. Database Setup

### Create the database

```bash
createdb swimxp_dev
```

### Run the schema migration

```bash
psql -d swimxp_dev -f database/schema.sql
```

### Seed with development data

```bash
psql -d swimxp_dev -f database/seed.sql
```

### Verify tables were created

```bash
psql -d swimxp_dev -c "\dt"
```

Expected tables: `users`, `children`, `coaches`, `coach_availability`, `pools`, `pool_availability`, `bookings`, `lessons`, `reviews`, `wallets`, `wallet_transactions`, `waivers`, `coach_certifications`, `background_checks`, `coach_matches`, `notifications`.

---

## 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app runs as a static frontend (no backend API required for the MVP). All data is served from `client/src/lib/mockData.ts`.

---

## 6. Build for Production

```bash
pnpm build
```

Output is written to `dist/`. To preview the production build locally:

```bash
pnpm preview
```

---

## 7. Run the Production Server

```bash
pnpm start
```

This starts the Express static server defined in `server/index.ts` on port `3000` (or `$PORT`).

---

## 8. PWA Installation

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮) → **Add to Home Screen**
3. For Play Store: package with [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)

### iOS (Safari)
1. Open the app in Safari
2. Tap **Share** → **Add to Home Screen**

### Desktop (Chrome / Edge)
1. Click the install icon in the address bar
2. Click **Install**

---

## 9. Linting & Formatting

```bash
# Type-check
pnpm check

# Format code
pnpm format
```

---

## 10. Project Scripts Reference

| Script | Command | Description |
|---|---|---|
| Development | `pnpm dev` | Start Vite dev server with HMR |
| Build | `pnpm build` | Production build (frontend + server) |
| Start | `pnpm start` | Run production server |
| Preview | `pnpm preview` | Preview production build locally |
| Type check | `pnpm check` | Run TypeScript compiler checks |
| Format | `pnpm format` | Run Prettier on all files |

---

## 11. Upgrading to Full-Stack

The current MVP is a static frontend with mock data. To add a real backend:

1. **Add database** — Uncomment `DATABASE_URL` in `.env` and run migrations
2. **Add authentication** — Integrate Manus OAuth or Supabase Auth
3. **Add API routes** — Extend `server/index.ts` with Express routes
4. **Replace mock data** — Replace imports from `mockData.ts` with API calls using `fetch` or `axios`
5. **Add Stripe** — Set `STRIPE_SECRET_KEY` and integrate the Stripe SDK for wallet top-ups and payouts

---

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
pnpm dev
```

**pnpm install fails:**
```bash
pnpm store prune
pnpm install --force
```

**TypeScript errors after pulling:**
```bash
pnpm check
```

**Database connection refused:**
Ensure PostgreSQL is running: `pg_ctl status` or `brew services list | grep postgresql`
