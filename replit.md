# Karya AI

A work preflight and verification tool built with TanStack Start (React + SSR), Tailwind CSS v4, and Radix UI primitives.

## What it does

Karya AI turns messy assignments, briefs, documents, and instructions into a clear work plan — finding missing information, ambiguities, dependencies, and what must be verified before the work is finished.

## Stack

- **Framework**: TanStack Start (file-based SSR routing with React)
- **Styling**: Tailwind CSS v4 with a custom design system (oklch color space)
- **UI primitives**: Radix UI via shadcn/ui
- **Type system**: TypeScript 5.8
- **Package manager**: npm (Node.js 24)
- **Build tool**: Vite 8

## Running locally on Replit

```
npm run dev   # starts dev server at port 5000
npm run build # production build (outputs to dist/)
```

The dev server runs on `0.0.0.0:5000` (configured in `vite.config.ts`).

## Project structure

```
src/
  routes/          # File-based routes (TanStack Router)
    index.tsx      # Landing page — fully redesigned with visual product demos
    __root.tsx     # Root layout, HTML shell, fonts
    home.tsx       # App home (authenticated)
    work.*.tsx     # Work detail routes
    login.tsx      # Login page
  components/
    landing-visuals.tsx  # All landing page visual components (animated demos)
    reveal.tsx           # Scroll-reveal animation wrapper
    ui/                  # Radix/shadcn UI primitives
  styles.css       # Design system: theme, utilities, animation classes
  assets/
    karya-mark.png # Logo mark
```

## Design system

Colors are defined in `src/styles.css` using CSS custom properties in oklch format. Key semantic tokens:

- `--ready` / `--ready-soft` — green (complete/satisfied)
- `--warn` / `--warn-soft` — amber (warnings/assumptions)
- `--blocked` / `--blocked-soft` — red (missing/blocked)
- `--info` / `--info-soft` — blue (clarification needed)
- `--surface` — panel backgrounds
- `--hairline` — subtle borders

Custom utilities: `label-caps`, `rise` (hero entrance animation), `grid-backdrop`.

Animation: `.reveal` / `.reveal-in` classes drive scroll-reveal via IntersectionObserver. Respects `prefers-reduced-motion`.

## Landing page

The landing page (`src/routes/index.tsx`) uses components from `src/components/landing-visuals.tsx` to tell the product story visually across 17 sections:

1. Hero with animated 3-panel product demo (cycles through analysis stages)
2. Before/After — problem vs. Karya AI
3. Core 7-step workflow
4. Requirement → Evidence chain (3 examples)
5. Ambiguity detection demo
6. Missing information detection
7. Dependency planning visualization
8. Readiness states (interactive — 5 states)
9. Assumption register
10. Final verification panel
11. Handoff transformation
12. Comparison — "not another task manager"
13. Feature architecture by workflow phase
14. Multi-format input
15. Use case switcher (6 tabs, interactive)
16. Request → Deliverable → Requirement → Evidence → Verification chain callout
17. Final CTA

## User preferences

- Product name: **Karya AI** (not WorkReady)
- No fake testimonials, statistics, user counts, logos, or reviews
- Static product demonstrations clearly labelled "Product example"
- Animations must explain the product, not decorate it
- Respect `prefers-reduced-motion`
