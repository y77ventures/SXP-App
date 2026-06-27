# Changelog

All notable changes to SwimXP Connect are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-06-24

### Added

**Application Shell**
- PWA manifest with standalone display mode, portrait orientation, and aqua theme colour
- Mobile-first app shell with bottom tab navigation (Home, Explore, Matches, Schedule, Profile)
- Scroll-aware top navigation bar with transparent-to-opaque transition
- Sora display font + Inter body font via Google Fonts CDN
- Aqua Clarity design system: CSS custom properties for colour, spacing, radius, and animation tokens

**Pages & Features**
- **Home** — full marketing landing page: hero with AI-generated photography, stats bar, How It Works (3 steps), featured coaches carousel, match percentage CTA, available pools list, parent testimonials, trust badges, footer CTA
- **Onboarding** — 5-step parent profile setup: welcome, child details, swim level assessment, goals selection, and location preferences
- **Explore** — searchable and filterable coach & pool marketplace with match scores, distance, speciality filters, and price range
- **Matches** — Tinder-style swipe card matching flow: pass, save, like, and book actions with spring animation
- **Coach Detail** — full coach profile: photo, bio, certifications, specialities, availability grid, reviews, and booking CTA
- **Pool Detail** — pool listing: photo gallery, features list, availability, host info, pricing, and booking CTA
- **Booking** — 5-step guided booking flow: coach selection, pool selection, date picker, time slot picker, and confirmation with summary
- **Schedule** — weekly calendar strip with today's lesson list, status badges (Confirmed, Scheduled, Completed, Cancelled, Makeup Requested)
- **Swim School Dashboard** — overview KPIs, lesson list with status management, student roster, coach roster, and analytics charts (Recharts)
- **Admin Dashboard** — platform KPIs, coach verification queue with approve/reject actions, revenue and booking trend charts, compliance tracker
- **Digital Wallet** — balance card, transaction history with type icons, top-up flow, and payout request flow
- **Profile** — user profile card, role switcher (Parent / Coach / Swim School / Pool Host), quick access links, settings

**Data & Infrastructure**
- Comprehensive mock data: 15 coaches, 15 pools, 10 students, 50 lessons, 8 wallet transactions, platform admin stats
- TypeScript interfaces for all domain entities: `Coach`, `Pool`, `Parent`, `Child`, `Lesson`, `Student`, `WalletTransaction`
- PostgreSQL database schema: 16 tables covering users, children, coaches, pools, bookings, lessons, reviews, wallets, waivers, certifications, background checks, matches, notifications
- Database seed data mirroring frontend mock data
- Express static server for production deployment

**Developer Experience**
- GitHub Actions CI workflow: type check + production build on every push and PR
- Comprehensive README with stack overview, project structure, design system reference, and roadmap
- SETUP.md with step-by-step local setup, database migration, and PWA installation instructions
- ARCHITECTURE.md with system diagram, routing table, component hierarchy, data model ERD, and upgrade path
- CONTRIBUTING.md with commit convention, coding standards, and PR checklist
- One-command setup script: `bash scripts/setup.sh`
- MIT License

---

## [Unreleased]

### Planned for v0.2.0
- Real authentication (JWT + refresh tokens or Supabase Auth)
- Live PostgreSQL API replacing mock data
- Google Maps integration for proximity search
- Coach profile edit flow with certification upload
- Stripe wallet top-up and payout integration
- Push notifications for lesson reminders
- Parent review and rating flow post-lesson
- Route-level code splitting for faster initial load
