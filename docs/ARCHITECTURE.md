# SwimXP Connect — Architecture Overview

This document describes the technical architecture of the SwimXP Connect MVP, including the frontend structure, data model, design system, and the planned full-stack upgrade path.

---

## System Overview

SwimXP Connect is a **mobile-first Progressive Web App (PWA)** built as a static React frontend with a lightweight Express server for production static file serving. The MVP uses in-memory mock data; the architecture is designed for a clean upgrade to a full PostgreSQL-backed API.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (PWA)                         │
│  React 19 + TypeScript + Tailwind 4 + shadcn/ui + Wouter   │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   Pages     │  │  Components  │  │   Mock Data       │  │
│  │  (13 views) │  │  (AppLayout, │  │  (mockData.ts)    │  │
│  │             │  │  CoachCard,  │  │  15 coaches       │  │
│  │             │  │  shadcn/ui)  │  │  15 pools         │  │
│  └─────────────┘  └──────────────┘  │  50 lessons       │  │
│                                     └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │  Static files served by
              ▼
┌─────────────────────────────┐
│  Express Server (server/)   │
│  Serves dist/public/*       │
│  Handles SPA routing        │
└─────────────────────────────┘
```

---

## Frontend Architecture

### Routing (Wouter)

All routes are defined in `client/src/App.tsx`. The app uses **Wouter** for lightweight client-side routing.

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Marketing landing page |
| `/onboarding` | `Onboarding` | 5-step parent profile setup |
| `/explore` | `Explore` | Coach & pool marketplace |
| `/matches` | `Matches` | Swipe-style coach matching |
| `/coach/:id` | `CoachDetail` | Coach profile detail |
| `/pool/:id` | `PoolDetail` | Pool listing detail |
| `/booking` | `Booking` | 5-step booking flow |
| `/schedule` | `Schedule` | Weekly lesson calendar |
| `/dashboard` | `Dashboard` | Swim school scheduler |
| `/admin` | `AdminDashboard` | Platform admin panel |
| `/wallet` | `Wallet` | Digital wallet |
| `/profile` | `Profile` | User profile + role switcher |

### Component Hierarchy

```
App
└── ThemeProvider
    └── TooltipProvider
        └── Router
            └── AppLayout (bottom tab nav + header)
                ├── Home
                ├── Explore
                ├── Matches
                ├── Schedule
                ├── Profile
                └── ... (all other pages)
```

### State Management

The MVP uses **local React state** (`useState`, `useReducer`) within each page component. No global state library is used. When upgrading to a real backend, consider:

- **React Query (TanStack Query)** for server state and caching
- **Zustand** for lightweight global UI state (auth, cart, notifications)

---

## Design System — Aqua Clarity

The design system is defined entirely in `client/src/index.css` as CSS custom properties (Tailwind 4 `@theme inline` block).

### Colour Palette

| Token | OKLCH | Hex Approx | Usage |
|---|---|---|---|
| `--aqua` | `oklch(0.76 0.14 192)` | `#0CC6C6` | Primary CTAs, active states, badges |
| `--aqua-dark` | `oklch(0.60 0.14 192)` | `#0A9A9A` | Hover states on aqua |
| `--navy` | `oklch(0.2 0.04 240)` | `#0A2540` | Headings, dark backgrounds |
| `--coral` | `oklch(0.68 0.19 22)` | `#FF6B6B` | Destructive, match gradient accent |
| `--sand` | `oklch(0.97 0.01 80)` | `#F8F6F0` | Section backgrounds |

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Sora | 700, 800 | Hero headings, section titles |
| UI | Sora | 600 | Card titles, nav labels |
| Body | Inter | 400, 500 | Body copy, descriptions |
| Mono | Inter | 400 | Prices, numbers, codes |

### Spacing & Radius

- Base radius: `0.875rem` (14px)
- Card padding: `1rem`–`1.5rem`
- Section padding: `3rem`–`5rem` (desktop), `2rem` (mobile)
- Bottom nav height: `4rem` (64px) + safe area inset

---

## Data Model

The full PostgreSQL schema is in `database/schema.sql`. The core entities and their relationships are:

```
users ──────────────────────────────────────────────────────┐
  │ (role: Parent)                                           │
  ├── children (1:many)                                      │
  │     └── waivers (1:many)                                 │
  │                                                          │
  │ (role: Coach)                                            │
  ├── coaches (1:1)                                          │
  │     ├── coach_availability (1:many)                      │
  │     └── coach_certifications (1:many)                    │
  │                                                          │
  │ (role: PoolHost)                                         │
  ├── pools (1:many)                                         │
  │     └── pool_availability (1:many)                       │
  │                                                          │
  └── wallets (1:1)
        └── wallet_transactions (1:many)

bookings (parent × child × coach × pool)
  └── lessons (1:1)
        └── reviews (1:many)

coach_matches (parent × coach, from swipe flow)
notifications (user inbox)
background_checks (coach compliance)
```

---

## Backend (Production Upgrade Path)

The current `server/index.ts` is a minimal Express static file server. To upgrade to a full API:

### Recommended Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | Express 5 or Fastify |
| ORM | Drizzle ORM or Prisma |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens) or Supabase Auth |
| Payments | Stripe (wallet top-up, payouts) |
| Storage | AWS S3 or Cloudflare R2 (coach photos, certs) |
| Email | Resend or SendGrid |
| Push | Web Push API (VAPID) |
| Maps | Google Maps JavaScript API |

### API Route Structure (Planned)

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/coaches              # List with filters
GET    /api/coaches/:id          # Coach detail
GET    /api/coaches/:id/availability

GET    /api/pools                # List with filters
GET    /api/pools/:id

POST   /api/bookings             # Create booking
GET    /api/bookings             # User's bookings
PATCH  /api/bookings/:id/cancel

GET    /api/lessons              # User's lessons
PATCH  /api/lessons/:id/status

GET    /api/wallet               # Balance + transactions
POST   /api/wallet/topup
POST   /api/wallet/payout

GET    /api/matches              # Coach match queue
POST   /api/matches/:coachId/like
POST   /api/matches/:coachId/pass

GET    /api/admin/stats          # Platform KPIs (Admin only)
GET    /api/admin/coaches/pending # Verification queue
PATCH  /api/admin/coaches/:id/verify
```

---

## PWA Configuration

The PWA manifest is at `client/public/manifest.json`:

```json
{
  "name": "SwimXP Connect",
  "short_name": "SwimXP",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0CC6C6",
  "background_color": "#ffffff",
  "start_url": "/"
}
```

For Play Store distribution, use [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) to wrap the PWA as a Trusted Web Activity (TWA).

---

## Security Considerations

- All passwords must be hashed with bcrypt (cost factor ≥ 12) — see `database/seed.sql` for `pgcrypto` usage
- JWT tokens: access token 15 min TTL, refresh token 30 days with rotation
- All API routes must validate input with Zod schemas
- Coach verification requires manual admin approval before appearing in search
- Waiver signatures are stored with IP address and user agent for legal compliance
- Background check records must be renewed annually

---

## Performance Notes

- All images are served from CDN (Cloudflare / Unsplash) — no local image assets
- Tailwind CSS is purged at build time — final CSS bundle is typically < 30 KB
- Framer Motion is used only for entrance animations and swipe gestures
- Route-level code splitting is not yet implemented — recommended for v1.1
