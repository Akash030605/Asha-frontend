# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 8080
npm run build     # Production build
npm run build:dev # Development build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

There are no test scripts configured in this project.

## Architecture

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui (Radix UI primitives)

**API:** All requests go to `https://api.ashaboutique.co.in`. Use the `apiFetch<T>` and `apiFetchForm<T>` helpers in [src/lib/utils.ts](src/lib/utils.ts) — they automatically attach the auth token from localStorage.

**Auth:** Token-based via localStorage. User token key: `auth_token`, admin token key: `admin_token`. Route guards `RequireAuth()` and `RequireAdmin` in [src/App.tsx](src/App.tsx) enforce access.

**State:** React Query (TanStack) for all server state. No Redux or Zustand — component-local `useState` for UI state.

**Routing:** React Router v6. Public routes at top level, protected user routes wrapped in `RequireAuth`, admin routes under `/admin` wrapped in `RequireAdmin` which renders `AdminLayout`.

**Forms:** React Hook Form + Zod for schema validation.

**Payments:** Razorpay loaded globally via script tag in `index.html`. Order creation at `POST /api/payment/create-order`, verification at `POST /api/payment/verify`.

## Key Directories

- [src/pages/](src/pages/) — Public-facing pages (shop, product detail, cart, collections, auth)
- [src/admin/](src/admin/) — Admin dashboard pages (products, orders, users, collections, analytics)
- [src/components/](src/components/) — Shared components; [src/components/ui/](src/components/ui/) contains shadcn/ui primitives (do not edit directly)
- [src/lib/utils.ts](src/lib/utils.ts) — `apiFetch`, `apiFetchForm`, Cloudinary image URL helpers, `cn()` class utility

## Styling Notes

- Path alias `@` maps to `src/`
- Custom fonts: Playfair Display (headings/serif) and Inter (body/sans)
- Dark mode uses the CSS class strategy (`class` in tailwind config)
- Custom animations defined in `tailwind.config.ts`: `fade-in`, `slide-up`, `ken-burns`
