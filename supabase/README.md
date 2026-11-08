# FinSight Supabase Setup

Remote Supabase projects and local CLI configuration for the FinSight monorepo.

## Remote projects

| Environment | Project        | Ref                    | Region    | Dashboard |
| ----------- | -------------- | ---------------------- | --------- | --------- |
| Development | FinSight-dev   | `esnfalxdcufywylvmiyn` | us-east-1 | [Open](https://supabase.com/dashboard/project/esnfalxdcufywylvmiyn) |
| Production  | FinSight-prod  | `zwinewubtlefhaokkvcr` | us-east-1 | [Open](https://supabase.com/dashboard/project/zwinewubtlefhaokkvcr) |

Project metadata (refs, URLs, hosts) lives in [`projects.json`](./projects.json).

## Local development stack

The Supabase CLI runs a full local stack via Docker (Postgres, Auth, Storage, Studio).

```bash
# Start local Supabase (requires Docker)
npm run supabase:start

# Stop local stack
npm run supabase:stop

# Reset local DB (reapply migrations + seed.sql)
npm run supabase:db:reset
```

Local services after `supabase start`:

- **Studio:** http://127.0.0.1:54323
- **API:** http://127.0.0.1:54321
- **Database:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## Linking a remote project

Link the CLI to the **dev** project for `db push`, `db pull`, and type generation:

```bash
npx supabase login
npx supabase link --project-ref esnfalxdcufywylvmiyn
```

You will be prompted for the database password (set at project creation; reset in Dashboard → Settings → Database if needed).

To target **prod**, re-link with the prod ref before pushing migrations:

```bash
npx supabase link --project-ref zwinewubtlefhaokkvcr
npx supabase db push --dry-run   # always preview first
npx supabase db push
```

## Directory layout

```
supabase/
├── config.toml       # Local stack config (safe to commit)
├── migrations/       # Versioned SQL migrations
├── policies/         # RLS policy reference / exports
├── seed.sql          # Dev seed data (applied on db reset)
├── projects.json     # Remote project refs and URLs
└── README.md
```

## Workflow

1. Develop schema locally (`supabase db diff` or write migrations in `migrations/`).
2. Test with `npm run supabase:db:reset`.
3. Push to **FinSight-dev** with `supabase db push`.
4. After validation, push the same migrations to **FinSight-prod**.

Never run `db reset --linked` or `--include-seed` against production.

## Free-tier note

Supabase free plans allow **2 active projects** per organization admin. To create both FinSight environments, `mvita-hq` was paused. Restore it from the [Supabase dashboard](https://supabase.com/dashboard/project/wouoednektljheirbcks) when needed — you may need to pause one FinSight project first to stay within the limit.

## Secrets

Retrieve **service role** and **database** credentials from each project's Dashboard → Settings → API / Database. Never commit those values; use `.env.local` (see root `.env.example`).
