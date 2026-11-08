# FinSight

Cashflow analytics demo — Next.js dashboard + REST API routes over a seeded in-memory store, with Supabase SQL migrations ready for Postgres.

Demo login: `demo@finsight.dev` / `demo1234`

## Live on Vercel

Production MVP deploys from the monorepo root with `vercel.json` targeting the `web` workspace:

```bash
# from repo root
npm install
npm run build
vercel --prod
```

| Item | Value |
| --- | --- |
| Framework | Next.js (`apps/web`) |
| Install | `npm install` |
| Build | `npm run build --workspace=web` (root `npm run build`) |
| Output | `.next` (rootDirectory `apps/web`) |
| Live URL | https://finsight-pierres-projects-3ccb9894.vercel.app |
| Demo login | `demo@finsight.dev` / `demo1234` |

**Live URL:** https://finsight-nu-lime.vercel.app

### Design system (locked)

- **Fonts:** Fraunces (display) + Outfit (UI) via `next/font/google`
- **Palette:** `--bg #0F1714`, `--surface #18241F`, `--panel #1F2E28`, `--mint #2EC4A0`, `--mint-dim #1A8F74`, `--ink #E8F2ED`, `--muted #8AA99A`, `--warn #E8A317`, `--loss #E85D4C`, `--grid rgba(46,196,160,0.08)`
- **Atmosphere:** cool forest-ledger dark dashboard with mint data accents, diagonal hatch + soft gradient mesh

## Stack

- **Web:** Next.js 16, TypeScript, Tailwind CSS v4, SVG charts (no chart-lib required for MVP UI)
- **Data:** Demo store for local/Vercel demo; `supabase/migrations` + `seed.sql` for real Postgres
- **Auth:** Cookie session against demo credentials (swap for Supabase JWT when wired)

## Features

- Brand-first shell + protected dashboard
- KPI count-up (revenue / expenses / net)
- Cashflow trend + spending mix charts
- Recent transactions + create form
- Accounts strip
- Unit tests on the demo store + GitHub Actions CI

## Quick start

```bash
npm install
npm run dev:web
# http://localhost:3000  →  demo login above
npm test
```

## API (Next.js route handlers)

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST / DELETE | `/api/auth/login` | Demo sign-in / sign-out |
| GET | `/api/accounts` | Accounts |
| GET | `/api/categories` | Categories |
| GET / POST | `/api/transactions` | List / create |
| GET | `/api/budgets` | Budgets |
| GET | `/api/dashboard/summary` | Aggregated KPIs + chart series |

## Schema

See `supabase/migrations/20261108_init.sql` — profiles, accounts, categories, transactions, budgets (+ RLS stubs).

## License

MIT


