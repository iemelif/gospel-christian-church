# Architecture documentation index

System-level technical documentation for the Gospel Christian Church IEMELIF website. Page specs live in
`docs/pages/`, component specs in `docs/components/`, project rules in `CLAUDE.md`.

Every document separates **Verified** (checked in code, config or rendered output), **Proposed**,
**Unknown** and **Owner input required**. It describes the architecture **as it is**, not an ideal target.

Verified against the working tree on branch `feat-ai-powered-integration`, 2026-09-29 (including uncommitted
changes: `/support` holds the donation page, Node 24 Dockerfile, ESLint + Vitest).

| Document | Covers |
| --- | --- |
| [application.md](application.md) | Stack, layers, rendering model, Server vs Client Components, layout, AI-relevant considerations |
| [routing.md](routing.md) | Routes, rendering mode per route, navigation, sitemap/robots, domains |
| [data-storage.md](data-storage.md) | `gifts.json` store, data model, read/write paths, durability |
| [authentication.md](authentication.md) | Admin password, session cookie, rate limit, access boundaries |
| [configuration.md](configuration.md) | Content/config modules, environment variables, build-time vs runtime |
| [deployment.md](deployment.md) | Docker image, GitHub Actions, Cloud Run, domains |
| [testing.md](testing.md) | Lint, type-check, unit tests, CI gates, coverage gaps |

## One-paragraph summary (verified)

A single Next.js 16 App Router application (React 19, TypeScript, Node 24) with no database and no
external services. Content is compiled from TypeScript modules; the only mutable state is a JSON file of
donation pledges, stored on a Cloud Storage bucket mounted into a single Cloud Run instance. Donors record
pledges through a public API; a treasurer confirms them behind a shared-password admin page. GitHub
Actions builds a Docker image and deploys to Cloud Run on every push to `main`.

## Cross-cutting constraints (verified)

1. **Exactly one instance** (`--max-instances=1`): the write queue, file store and login rate limiter are all
   in-process.
2. **`NEXT_PUBLIC_*` values are baked in at build time** and are public.
3. **`main` deploys to production automatically** (except commits touching only `**.md` files).
4. **Only three runtime dependencies:** `next`, `react`, `react-dom`.

## AI status (verified)

No AI code, SDKs or configuration exist yet, despite the branch name. AI-relevant constraints are recorded in
[application.md](application.md) §7 and in the relevant documents. `docs/ai/` has not been created.
