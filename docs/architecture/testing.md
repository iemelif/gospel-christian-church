# Testing and quality gates

## 1. Tooling (verified)

| Tool | Config | Command | Notes |
| --- | --- | --- | --- |
| ESLint 9 + `eslint-config-next` 16.3.6 (core-web-vitals + typescript) | `eslint.config.mjs` | `npm run lint` | `react-hooks/set-state-in-effect` downgraded to `warn`. ESLint 10 not used: Next's plugins don't support it yet |
| TypeScript | `tsconfig.json` | `npm run typecheck` (`tsc --noEmit`) | Also run by `next build` |
| Vitest 5 | `vitest.config.mts` (node environment, `@/` alias, `**/*.test.ts`) | `npm test`, `npm run test:watch` | |
| Next.js build | — | `npm run build` | Compiles, type-checks, prerenders static pages |

No formatter (Prettier) is configured.

## 2. Current tests (verified, 22 tests, all passing on 2026-09-29)

| File | Covers |
| --- | --- |
| `lib/slug.test.ts` | `slugify` |
| `lib/officers.test.ts` | `displayName`, `imageSrc`, `toPeople`, `boardRows`, `leadershipGroups` |
| `lib/config.test.ts` | `php`, `PAYMENT_METHODS` parsing (formats, plain numbers, placeholders) |
| `lib/auth.test.ts` | password check, session tampering/expiry/password change, cookie parsing |
| `lib/store.test.ts` | missing/corrupt file, concurrent `update()`, `summary()` totals and anonymity |

Tests stub environment variables with `vi.stubEnv` and re-import modules, because config and store read
`process.env` at import time. The store tests use a temporary `DATA_DIR`, never `./data`.

## 3. Current lint state (verified)

0 errors, 3 warnings: two `set-state-in-effect` (`components/SiteHeader.tsx`, `app/admin/page.tsx`), one
unused import (`scripts/generate-avatars.mjs`).

## 4. CI gates (verified)

- `ci.yml` (PRs and non-`main` pushes): lint → test → build.
- `deploy.yml` (`main`): **no** lint or tests; relies on CI having run on the branch.
- **Unknown:** whether branch protection requires CI before merging.

## 5. Coverage gaps (verified)

- No tests for API route handlers (`/api/gifts` validation, `/api/admin` rules, session/rate limit).
- No component tests (no React Testing Library / jsdom) and no browser/E2E tests.
- No accessibility or visual regression checks.
- No test for the Docker image.

## 6. Proposed (not decided; new dependencies require approval)

- Route-handler tests can be written with the existing Vitest setup by calling the exported handlers with
  `Request` objects (no new dependency).
- Component or E2E tests would need new dev dependencies — ask first (`CLAUDE.md`).
- AI features: mock provider calls in unit tests; never call paid APIs from CI.

## 7. Required checks before calling work done (verified, `CLAUDE.md` §3)

`npm run lint && npm test && npm run build`.

## 8. Owner input required

1. Is adding component/E2E test tooling acceptable?
2. Should `deploy.yml` also run lint/tests?

## 9. References

`package.json`, `eslint.config.mjs`, `vitest.config.mts`, `lib/*.test.ts`, `.github/workflows/ci.yml`,
`.github/workflows/deploy.yml`, `CLAUDE.md`.
