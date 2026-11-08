# ✅ FinSight Analytics Platform — TODO

Progress tracker for the build. Check items off as you go.

---

## 🏗️ Project Setup

- [x] Initialize monorepo structure (`apps/web`, `apps/api`)
- [x] Set up TypeScript configs (frontend + backend)
- [x] Configure ESLint + Prettier
- [x] Set up Supabase project (dev + prod)
- [x] Create `.env.example` with required variables
- [ ] Set up local PostgreSQL instance / Supabase connection
- [ ] Configure CI (lint + type-check on PR)

## 🗄️ Database

- [ ] Design final schema (users, accounts, categories, transactions, budgets)
- [ ] Write initial migration files
- [ ] Add indexes on `transaction_date`, `category_id`, `account_id`
- [ ] Set up Row-Level Security (RLS) policies in Supabase
- [ ] Seed database with sample financial data for dev/testing

## ⚙️ Backend / API

- [ ] Scaffold Node.js REST API server
- [ ] Implement auth middleware (verify Supabase JWT)
- [ ] `GET /api/transactions` — list + filters (date, category, account)
- [ ] `POST /api/transactions` — create transaction
- [ ] `GET /api/accounts` — list accounts + balances
- [ ] `GET /api/categories` — list categories
- [ ] `POST /api/budgets` — create/update budget
- [ ] `GET /api/budgets/variance` — budget vs. actual report
- [ ] `GET /api/dashboard/summary` — aggregated revenue/expense summary
- [ ] `GET /api/reports/export` — filtered report export
- [ ] Add input validation (e.g. zod/yup schemas)
- [ ] Add centralized error handling middleware
- [ ] Write unit tests for services/controllers

## 🖥️ Frontend

- [ ] Scaffold Next.js app + routing
- [ ] Build auth flow (login, signup, session handling)
- [ ] Build dashboard layout shell (nav, filters, date range picker)
- [ ] Revenue overview chart (trend line, YoY comparison)
- [ ] Expense breakdown chart (category pie/bar + drill-down)
- [ ] Budget vs. actual variance chart
- [ ] Cash flow summary view
- [ ] Transaction entry form
- [ ] Responsive layout / mobile pass
- [ ] Loading & empty states for all data views
- [ ] Error boundaries + toast notifications

## 🔐 Auth & Security

- [ ] Wire up Supabase auth on frontend
- [ ] Enforce JWT verification on all API routes
- [ ] Test RLS policies against multiple user roles
- [ ] Add rate limiting on API

## 🧪 Testing & QA

- [ ] Unit tests — backend services
- [ ] Integration tests — API endpoints
- [ ] E2E tests — critical dashboard flows (Playwright/Cypress)
- [ ] Manual QA pass on budgeting + reporting features

## 🚀 Deployment

- [ ] Set up hosting for frontend (Vercel)
- [ ] Set up hosting for API (Railway/Render/Fly.io)
- [ ] Connect production Supabase project
- [ ] Set up production environment variables
- [ ] Smoke test production deployment

## 📄 Documentation

- [x] Write README.md with architecture diagrams
- [ ] Document API endpoints in more detail (OpenAPI/Swagger)
- [ ] Add CONTRIBUTING.md
- [ ] Add screenshots/GIFs of dashboard to README

---

## 🗺️ Future / Roadmap (post-MVP)

- [ ] Multi-currency support
- [ ] Forecasting module (trend projection)
- [ ] Role-based access control (Admin / Analyst / Viewer)
- [ ] Scheduled email reports (PDF export)
- [ ] Bank feed integration (Plaid)

---

_Last updated: 2026-07-22_
