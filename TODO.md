# FinSight — TODO (honest demo MVP)

**Status:** Demo MVP shipped. Live demo uses the in-memory store + cookie session. Supabase SQL is prepared for a later Phase 2 — not wired in production.

**Live:** https://finsight-nu-lime.vercel.app  
**Demo login:** `demo@finsight.dev` / `demo1234`

> Local note: `Projects\FinSight` (repo-root sibling) is a **non-canonical** working copy. This repo under `1) Full-Stack Engineering\FinSight` is the source of truth for git/GitHub.

---

## Done (demo MVP)

- [x] Monorepo: `apps/web` (Next.js) + `apps/api` helpers
- [x] TypeScript + ESLint + Prettier
- [x] Seeded in-memory demo store (accounts, categories, transactions, budgets, dashboard summary)
- [x] Cookie demo auth (`demo@finsight.dev` / `demo1234`) — not Supabase JWT
- [x] Next.js route handlers for auth + dashboard APIs
- [x] Dashboard UI: KPIs, cashflow trend, spending mix, transactions, accounts
- [x] Unit tests on the demo store
- [x] GitHub Actions CI (`.github/workflows/ci.yml` — install, test, web build)
- [x] Vercel production deploy (demo store path)
- [x] `supabase/migrations` + `seed.sql` checked in for a future Postgres cutover
- [x] `.env.example` documents optional Supabase vars (unused by the live demo)
- [x] README accurate to the demo-MVP reality

---

## Phase 2 — real Supabase (out of scope for portfolio demo)

Do **not** treat these as done. Migrations exist; production DB / JWT / RLS are **not** connected.

- [ ] Point a real Supabase project at `supabase/migrations`
- [ ] Replace demo cookie auth with Supabase Auth + JWT verification on API routes
- [ ] Enforce RLS for multi-user data isolation
- [ ] Swap the demo store for live Postgres reads/writes
- [ ] Production env vars for Supabase URL/keys (keep secrets out of git)
- [ ] Optional: OpenAPI/Swagger for the REST surface
- [ ] Optional: E2E (Playwright) on critical dashboard flows

---

## Roadmap (post Phase 2)

- [ ] Multi-currency
- [ ] Forecasting / trend projection
- [ ] Role-based access (Admin / Analyst / Viewer)
- [ ] Scheduled email / PDF reports
- [ ] Bank feed (Plaid)

---

_Last updated: 2026-11-08_
