# Testing and quality gates

## 1. Tooling (verified)

| Tool | Config | Command | Notes |
| --- | --- | --- | --- |
| ESLint 9 + `eslint-config-next` 16.3.6 (core-web-vitals + typescript) | `eslint.config.mjs` | `npm run lint` | `react-hooks/set-state-in-effect` downgraded to `warn`. ESLint 10 not used: Next's plugins don't support it yet |
| TypeScript | `tsconfig.json` | `npm run typecheck` (`tsc --noEmit`) | Also run by `next build` |
| Vitest 5 | `vitest.config.mts` (node environment, `@/` alias, `**/*.test.ts`) | `npm test`, `npm run test:watch` | |
| Next.js build | — | `npm run build` | Compiles, type-checks, prerenders static pages |

No formatter (Prettier) is configured.

## 2. Current tests (verified, 82 tests in 15 files, all passing on 2026-09-29)

| File | Tests | Covers |
| --- | --- | --- |
| `app/api/gifts/route.test.ts` | 17 | `POST /api/gifts`: optional/valid/invalid email, name and amount validation unchanged, existing payment ids accepted (labels rejected), reCAPTCHA v3 cases (missing token, Google request failure, `success: false`, wrong action, low score, missing secret, success), gift saved only after verification, token not stored, secret never returned; `GET` public summary contains no email |
| `lib/recaptcha.test.ts` | 12 | `verifyRecaptcha()` (request format, all failure reasons, threshold boundary, secret never in the result) and `recaptchaMinScore()` |
| `lib/config.test.ts` | 8 | `php`, campaign "Project Nehemiah" and goal, `PAYMENT_METHODS` parsing, ids unchanged + labels, GCash/Maya QR paths and sizes matching the image files |
| `lib/auth.test.ts` | 6 | password check, session tampering/expiry/password change, cookie parsing |
| `lib/officers.test.ts` | 5 | `displayName`, `imageSrc`, `toPeople`, `boardRows`, `leadershipGroups` |
| `lib/progress.test.ts` | 4 | `fundedPercent()` normal, zero raised, capped at 100, no division by zero/negatives; `formatPercent()` |
| `lib/store.test.ts` | 4 | missing/corrupt file, concurrent `update()`, `summary()` totals and anonymity |
| `components/FundraisingPercent.test.ts` | 7 | rendered percentage and screen-reader sentence (normal, zero, capped); church illustration rendered first (left of the percentage and text), decorative, using the `ChurchProgress` drawing, with its size and layout classes |
| `components/PaymentDetails.test.ts` | 5 | GCash/Maya QR paths, intrinsic sizes, alt text, layout classes (no rounding); Bank Transfer / Cash at Church unchanged; no QR when not configured |
| `components/GiveForm.test.ts` | 4 | GCash QR above Record Gift (initial render); `MethodDetails` for all four methods before Record Gift; GCash and Maya QR on the receipt (500px box, side-by-side classes); Bank Transfer / Cash at Church without QR on the receipt |
| `components/ChurchProgress.test.ts` | 2 | default (labelled image) vs decorative (`aria-hidden`) accessibility |
| `components/JoinUs.test.ts` | 3 | section id, heading, one card per `SCHEDULE` entry, shared classes, default and custom intro, no links |
| `lib/nav.test.ts` | 2 | "Donate" → `/donate` internal, no "Support"; Leadership History submenu |
| `lib/slug.test.ts` | 2 | `slugify` |
| `app/sitemap.test.ts` | 1 | sitemap has `/donate`, not `/support` |

**Google is never contacted by the test suite:** `lib/recaptcha.test.ts` passes a mocked `fetch`, and the route
tests replace the global `fetch` with a mock of the `siteverify` response.

Tests stub environment variables with `vi.stubEnv` and re-import modules, because config and store read
`process.env` at import time. The store and route tests use a temporary `DATA_DIR`, never `./data`.

## 3. Current lint state (verified)

0 errors, 3 warnings: two `set-state-in-effect` (`components/SiteHeader.tsx`, `app/admin/page.tsx`), one
unused import (`scripts/generate-avatars.mjs`).

## 4. CI gates (verified)

- `ci.yml` (PRs and non-`main` pushes): lint → test → build.
- `deploy.yml` (`main`): **no** lint or tests; relies on CI having run on the branch.
- **Unknown:** whether branch protection requires CI before merging.

## 5. Coverage gaps (verified)

- `/api/gifts` is tested (above); **no** tests for `/api/admin` rules or the admin session / rate limit.
- Component rendering is tested with server-side rendering only (`FundraisingPercent`, `PaymentDetails`,
  `ChurchProgress`, `GiveForm` initial render / `MethodDetails`; no DOM or state changes); no React Testing
  Library / jsdom, no interaction tests, and no browser/E2E tests in the repository (browser checks during
  development were done with a temporary script outside the repo).
- No accessibility or visual regression checks.
- No test for the Docker image.

## 6. Proposed (not decided; new dependencies require approval)

- `/api/admin` and `/api/admin/session` tests can follow the pattern of `app/api/gifts/route.test.ts` (call the
  exported handlers with `Request` objects; no new dependency).
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
