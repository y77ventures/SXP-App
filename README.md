# SwimXP Connect

**Singapore's #1 Swim Coach Marketplace** — A mobile-first Progressive Web App (PWA) connecting parents with certified swim coaches, private pools, and swim schools.

> Design system: **Aqua Clarity** · Signature colour: `#0CC6C6` · Display font: Sora · Body font: Inter

---

## Overview

SwimXP Connect is a full-featured MVP SaaS web application built as a PWA, installable on Android (Play Store via TWA) and iOS (App Store via PWA wrapper). It covers the complete swim-lesson lifecycle — from coach discovery and matching through booking, scheduling, and school management.

---

## Features

| Screen | Description |
|---|---|
| **Home / Landing** | Hero with AI-generated photo, stats bar, How It Works, featured coaches & pools, testimonials, trust badges, footer CTA |
| **Onboarding** | 5-step parent profile setup with swim level quiz and goal selection |
| **Explore** | Searchable, filterable coach & pool marketplace with match scores and distance |
| **Matches** | Tinder-style swipe card matching — pass, save, like, or book instantly |
| **Booking Flow** | 5-step flow: coach → pool → date → time slot → confirmation |
| **Schedule** | Weekly calendar strip with today's lesson list and status badges |
| **Coach Detail** | Full coach profile with certifications, availability, reviews, and booking CTA |
| **Pool Detail** | Pool listing with features, availability, pricing, and host info |
| **Swim School Dashboard** | Overview KPIs, lesson list, student roster, coach roster, analytics charts |
| **Admin Dashboard** | Platform KPIs, coach verification queue, revenue charts, compliance tracker |
| **Digital Wallet** | Balance card, transaction history, top-up flow, and payout request flow |
| **Profile** | Role switcher (Parent / Coach / Swim School / Pool Host) with quick access links |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Routing | Wouter |
| Charts | Recharts |
| Animation | Framer Motion + CSS keyframes |
| Icons | Lucide React |
| Toasts | Sonner |
| Forms | React Hook Form + Zod |
| Build | Vite 7 |
| Package manager | pnpm |
| PWA | Web App Manifest + meta tags |

---

## Project Structure

```
swimxp-connect/
├── client/
│   ├── index.html              # PWA shell — manifest, Sora/Inter fonts, meta tags
│   ├── public/
│   │   └── manifest.json       # PWA manifest (standalone, portrait, aqua theme)
│   └── src/
│       ├── App.tsx             # Routes (Wouter) — all 13 routes defined here
│       ├── index.css           # Aqua Clarity design tokens, animations, utilities
│       ├── main.tsx            # React entry point
│       ├── components/
│       │   ├── AppLayout.tsx   # Mobile PWA shell with bottom tab navigation
│       │   ├── CoachCard.tsx   # Reusable coach card (compact + full variants)
│       │   └── ui/             # shadcn/ui component library (30+ components)
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       ├── hooks/
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       ├── lib/
│       │   ├── mockData.ts     # All mock data: 15 coaches, 15 pools, 50 lessons, wallet txns
│       │   └── utils.ts
│       └── pages/
│           ├── Home.tsx            # Landing page
│           ├── Onboarding.tsx      # 5-step parent onboarding
│           ├── Explore.tsx         # Coach & pool marketplace
│           ├── Matches.tsx         # Swipe-style coach matching
│           ├── CoachDetail.tsx     # Coach profile detail
│           ├── PoolDetail.tsx      # Pool listing detail
│           ├── Booking.tsx         # 5-step booking flow
│           ├── Schedule.tsx        # Weekly schedule view
│           ├── Dashboard.tsx       # Swim school scheduler dashboard
│           ├── AdminDashboard.tsx  # Platform admin dashboard
│           ├── Wallet.tsx          # Digital wallet
│           ├── Profile.tsx         # User profile + role switcher
│           └── NotFound.tsx        # 404 page
├── server/
│   └── index.ts                # Express static server (production)
├── shared/
│   └── const.ts                # Shared constants
├── ideas.md                    # Design brainstorm — Aqua Clarity design philosophy
├── components.json             # shadcn/ui config
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Mock Data (`client/src/lib/mockData.ts`)

The app runs entirely on frontend mock data — no backend required for the MVP:

- **15 coaches** — names, photos, ratings, specialities, certifications, availability, hourly rates
- **15 pools** — names, images, addresses, features, rental rates, availability
- **10 students** — profiles with swim levels, assigned coaches, lesson counts
- **50 lessons** — with statuses: Scheduled, Confirmed, Completed, Cancelled, Makeup Requested
- **8 wallet transactions** — credits, debits, payouts with pending/completed states
- **Platform admin stats** — user counts, revenue, bookings, growth rate

---

## Design System — Aqua Clarity

| Token | Value | Usage |
|---|---|---|
| `--aqua` | `oklch(0.76 0.14 192)` — `#0CC6C6` | Primary CTAs, active states, badges |
| `--navy` | `oklch(0.2 0.04 240)` — `#0A2540` | Headings, dark backgrounds |
| `--coral` | `oklch(0.68 0.19 22)` — `#FF6B6B` | Destructive, match gradient accent |
| Display font | Sora (700/800) | All headings and numeric displays |
| Body font | Inter (400/500/600) | All body copy and UI labels |
| Border radius | `0.875rem` | Rounded cards and inputs |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install & Run

```bash
git clone https://github.com/GraceLWT/swimxp-connect.git
cd swimxp-connect
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## PWA Installation

The app is fully PWA-ready:

- **Android**: Open in Chrome → "Add to Home Screen" or package with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) for Play Store
- **iOS**: Open in Safari → Share → "Add to Home Screen"
- **Manifest**: `client/public/manifest.json` — standalone display, portrait orientation, aqua theme colour

---

## Roadmap

- [ ] Real authentication (Manus OAuth / Supabase)
- [ ] Live database (PostgreSQL) for coaches, bookings, and users
- [ ] Google Maps integration for pool/coach proximity search
- [ ] Coach profile edit flow with certification upload
- [ ] Push notifications for lesson reminders
- [ ] Stripe payments for lesson booking and wallet top-up
- [ ] Video intro upload for coach profiles
- [ ] Parent review and rating system post-lesson
- [ ] Automated makeup lesson scheduling

---

## License

MIT © 2026 SwimXP Connect
