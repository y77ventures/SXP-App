# SwimXP Connect — Design Brainstorm

## Reference
The reference site (swimxp.systeme.io) is a basic systeme.io page with a pool-water hero image, teal/blue color scheme, minimal sections, and lorem ipsum testimonials. The goal is to build something significantly more polished, feature-complete, and startup-ready.

---

## Three Stylistic Approaches

### 1. Coastal Premium
**Theme:** Clean, airy, luxury coastal brand — think Airbnb meets ClassPass
**Probability:** 0.07

### 2. Deep Ocean Depth
**Theme:** Dark, rich navy/teal depth — immersive, premium, modern SaaS
**Probability:** 0.04

### 3. Aqua Clarity
**Theme:** Crisp white-dominant with bold aqua accents, editorial typography, asymmetric layout — premium swim brand meets modern marketplace
**Probability:** 0.08

---

## Chosen Approach: Aqua Clarity (Approach 3)

### Design Movement
Editorial Marketplace — ClassPass meets Airbnb with a swim-specific identity. Clean, confident, and family-premium.

### Core Principles
1. **Whitespace as luxury** — generous padding, breathing room between elements
2. **Aqua as the signature** — one ownable color used sparingly for maximum impact
3. **Asymmetric editorial layouts** — avoid centered-grid monotony; use offset columns, diagonal accents
4. **Depth through layering** — cards with soft shadows, frosted glass nav, subtle gradients

### Color Philosophy
- **Background:** Pure white (#FFFFFF) with off-white sections (#F8FAFB)
- **Signature Aqua:** `#0CC6C6` — a vibrant, ownable teal-cyan that reads as "water" without being generic blue
- **Deep Navy:** `#0A2540` — for headings and authority text
- **Soft Slate:** `#64748B` — body text, secondary info
- **Warm Coral:** `#FF6B6B` — accent for match/like actions (dating-app inspiration)
- **Success Green:** `#10B981` — confirmed/active states

### Layout Paradigm
- Landing page: Full-bleed hero with offset text + image split, NOT centered
- Coach cards: Horizontal scroll on mobile, 3-col grid on desktop with hover lift
- Dashboard: Left sidebar (fixed) + main content area
- Matching flow: Tinder-style card stack with swipe animations

### Signature Elements
1. **Wave motif** — subtle SVG wave dividers between sections (not tacky, just a nod to water)
2. **Match percentage badge** — coral/aqua gradient pill on coach cards
3. **Frosted glass nav** — `backdrop-blur` header that transitions from transparent to white on scroll

### Interaction Philosophy
- Hover: cards lift with `translateY(-4px)` + shadow deepening
- Buttons: scale(0.97) on press, 160ms ease-out
- Page transitions: fade-in with slight upward drift (opacity 0→1, translateY 16px→0)
- Match cards: spring physics for swipe/like animations

### Animation
- Entrance: stagger 60ms per card, opacity 0→1 + translateY 20px→0, 400ms ease-out
- Nav: smooth background transition on scroll (200ms)
- CTA buttons: subtle shimmer on hover
- Match percentage: count-up animation on load

### Typography System
- **Display/Headings:** `Sora` — geometric, modern, confident (Google Fonts)
- **Body:** `Inter` — only for body text, not headings (breaking the "AI slop" rule)
- **Accent numbers:** `Sora` bold for stats and percentages
- Heading scale: 72px hero → 48px section → 32px card → 20px label

### Brand Essence
SwimXP Connect — the intelligent swim coach marketplace for families who want the best match, not just the nearest option. **Premium. Personal. Precise.**

Personality adjectives: **Trustworthy, Vibrant, Expert**

### Brand Voice
Headlines are confident and benefit-driven. CTAs are action-oriented and specific. No generic filler.
- Example headline: "Your child's perfect swim coach is 3 minutes away."
- Example CTA: "See My Coach Matches"
- Banned phrases: "Welcome to our website", "Get started today", "Learn more"

### Wordmark & Logo
A stylized wave-drop mark — a water droplet with a swimmer silhouette inside, rendered in aqua on white. Bold, simple, scalable.

### Signature Brand Color
`#0CC6C6` — Aqua Clarity. Unmistakably SwimXP.
