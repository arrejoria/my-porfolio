# Personal Portfolio Website

A personal portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI, Lucide, Better Auth, Drizzle ORM, PostgreSQL, and pnpm.

## Stack

| Technology | Role |
| --- | --- |
| Next.js 16 | Application framework |
| React 19 | UI library |
| TypeScript | Type-safe application code |
| Tailwind CSS 4 | Styling |
| shadcn/Base UI | UI components and primitives |
| Lucide | Icons |
| Better Auth | Authentication |
| Drizzle ORM | Database access |
| PostgreSQL | Database |
| pnpm | Package manager |

## Getting started

Install dependencies with pnpm:

```sh
pnpm install
```

No environment-variable or additional setup commands are documented here because they are not confirmed in this README.

Before the first `pnpm dev` (or `docker compose up`) against a fresh/empty database, you must run the Payload migrations — see "Database migrations (Payload)" below. Payload's dev-mode schema auto-provisioning is disabled (`push: false`), so nothing creates the database tables automatically; skipping this step causes "relation does not exist" errors.

## Database migrations (Payload)

Payload's Postgres adapter is configured with `push: false` — schema changes are never auto-applied in dev. Every schema change must go through a committed migration.

**Fresh database (first-time setup):** any brand-new dev database — a fresh clone, a fresh `postgres_data` Docker volume, or a CI environment — starts out with no tables at all. Nothing in `Dockerfile` or `docker-compose.dev.yml` runs migrations automatically on first boot, so you must run them yourself before the app can query anything:

```sh
pnpm payload:migrate
```

or, when running via Docker Compose:

```sh
docker compose -f docker-compose.dev.yml exec app pnpm payload:migrate
```

After pulling changes that touch a Payload collection/global/plugin config, apply any new migrations the same way:

```sh
pnpm payload:migrate
```

Before generating a new migration for your own schema change, always check for drift first:

```sh
pnpm payload:migrate:status
```

If this reports anything beyond the already-applied migrations, resolve or explicitly reconcile that drift before running `payload migrate:create` — otherwise the new migration will silently bundle unrelated, previously-unmigrated schema changes together with your intended change. `payload:migrate:status` only compares the migration ledger (which files have run); it does **not** detect drift between the current collection config and the live database schema. That class of drift only surfaces when `payload migrate:create` actually runs its schema diff, so inspect the generated migration file by hand before committing it.

If you discover this kind of pre-existing, un-migrated drift (columns/types that already exist on every real database via old dev auto-push but were never captured in a migration), generate a small standalone migration for just that drift first, reviewed independently from your actual change. Because the generated `CREATE TYPE`/`ADD COLUMN` statements will already exist on any DB that has the drift, hand-edit that catch-up migration's `up()` to be idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE TYPE` wrapped in `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`) so it applies as a no-op where the drift already exists, while still being a real migration for any DB that doesn't have it. Apply and verify that migration cleanly before generating the migration for your actual schema change. See `migrations/20260908_213915_formalize_case_studies_status_result_columns.ts` for a worked example.

To generate a migration (positional name argument, not `--name`):

```sh
pnpm payload migrate:create <migration_name>
```

With `push: false`, Payload also stops auto-regenerating `lib/payload/payload-types.ts` on boot — before, dev-mode auto-push regenerated it as a side effect on nearly every request. After changing a collection/global/block's fields, regenerate types explicitly:

```sh
pnpm payload generate:types
```

## Current follow-up priorities

These priorities are not necessarily fixed; confirm scope before treating any item as committed work.

- Routes `/blog` and `/contact` are currently linked, but their pages are absent.
- TypeScript build errors are ignored in `next.config.mjs`.
- A test and CI baseline still needs to be established.
- Coverage exclusions for environment files need review.
- Production authentication must validate secrets, allowed origins, and rate limiting.

## End-to-end testing with Playwright

Playwright can validate the portfolio's critical browser journeys, such as navigation, linked routes, authentication flows, and responsive interaction. It is a suitable option when establishing the E2E baseline; this README does not claim Playwright is installed as an application dependency.

## Optional global AI skills

These tools are optional global AI-agent tools. They are not runtime dependencies and are not listed in `package.json`.

| Skill | Purpose | Install globally |
| --- | --- | --- |
| `vercel-react-best-practices` | React and Next.js performance guidance | `npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y` |
| `better-auth-security-best-practices` | Better Auth security guidance | `npx skills add better-auth/skills@better-auth-security-best-practices -g -y` |
| `web-design-guidelines` | UI design and accessibility review guidance | `npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y` |
| `playwright-skill` | Playwright E2E automation guidance | `npx skills add testdino-hq/playwright-skill@playwright-skill -g -y` |
| `code-review` | Standards- and specification-focused code review guidance | `npx skills add mattpocock/skills@code-review -g -y` |
