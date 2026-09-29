# Configuration

Values are intentionally **not** reproduced here; see `.env.example` for names and format.

## 1. Code-level configuration (verified)

| File | Holds | Changed by |
| --- | --- | --- |
| `content/site.ts` | `ENVIRONMENTS` (dev/prod URLs), `SITE_URL`, `SITE`, `LINKS`, `LOGOS`, `ADDRESS`, `SOCIAL`, `NAV` | Edit + redeploy |
| `content/officers.ts` | `BOARD_ROLES`, `LEADERSHIP_GROUPS`, `CURRENT_TERM`, `HISTORY_TERMS` | Edit + redeploy |
| `lib/config.ts` | `CHURCH` (name, email, goal, baseRaised, `campaign: "Project Nehemiah"`), `SCHEDULE`, `PAYMENT_METHODS` (each with a stored `id` and a donor-facing `label`), `PAYMENT_IDS`, `AMOUNTS`, `AMOUNT_NOTES`, `php()`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_ACTION = "record_gift"`, `RECAPTCHA_ADMIN_ACTION = "admin_sign_in"` | Edit and/or env vars + rebuild |
| `lib/recaptcha.ts` | Server-only reCAPTCHA v3 verification (`verifyRecaptcha(token, fetch, action)`, `recaptchaError()`); `DEFAULT_RECAPTCHA_MIN_SCORE = 0.5`, `recaptchaMinScore()` | Edit + redeploy |
| `lib/progress.ts` | `fundedPercent()` (raised / goal × 100, capped at 100) and `formatPercent()` | Edit + redeploy |
| `lib/seo.ts` | `pageMeta()`, `DONATE_TITLE` ("Donate to Project Nehemiah"), `DONATE_DESCRIPTION` (uses `CHURCH.goal`) | Edit + redeploy |
| `next.config.ts` | `output: "standalone"` only | — |
| `postcss.config.mjs` | Registers the `@tailwindcss/postcss` plugin | — |
| `app/globals.css` | Tailwind configuration (CSS-based, no `tailwind.config` file): imports of `tailwindcss/theme.css` and `tailwindcss/utilities.css` only (**no Preflight**); `@source` limits class scanning to `app/`, `components/`, `lib/ui.ts`; `@theme static` colour tokens; `@theme inline` font mapping (`--font-figtree`, `--font-young-serif`); custom breakpoints `xs` 421px, `sm` 481px, `md` 801px, `lg` 1081px; a small `@layer base` of element defaults | Edit + rebuild; see `CLAUDE.md` §6 |
| `lib/ui.ts` | Shared Tailwind class strings (buttons, cards, headings, inputs, layout) | Edit + rebuild |
| `tsconfig.json` | strict TS, `@/*` alias | — |
| `eslint.config.mjs`, `vitest.config.mts` | Lint and test config ([testing.md](testing.md)) | — |

## 2. Environment variables (verified by `process.env` usage)

| Variable | Read by | When | Public | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_CHURCH_EMAIL` | `lib/config.ts` | **Build time** (inlined) | Yes | Code fallback exists |
| `NEXT_PUBLIC_GOAL` | `lib/config.ts` | Build | Yes | Default 12,000,000 |
| `NEXT_PUBLIC_BASE_RAISED` | `lib/config.ts` | Build | Yes | Default 2,700,000 |
| `NEXT_PUBLIC_GCASH_NUMBER` | `lib/config.ts` | Build | Yes | `Label: value · …` or plain number |
| `NEXT_PUBLIC_MAYA_NUMBER` | `lib/config.ts` | Build | Yes | Same format |
| `NEXT_PUBLIC_BANK_DETAILS` | `lib/config.ts` | Build | Yes | Empty or `XXX` placeholder → "email the church" |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `lib/config.ts` | Build | Yes | Google reCAPTCHA v3 site key (browser). Empty → no token → gifts rejected |
| `RECAPTCHA_SECRET_KEY` | `lib/recaptcha.ts` | **Runtime** | **Secret** | Server-only; never `NEXT_PUBLIC_`, logged, returned or committed. Missing → gifts rejected (503) |
| `RECAPTCHA_MIN_SCORE` | `lib/recaptcha.ts` | Runtime | No | Optional, 0–1; invalid/unset → 0.5 |
| `ADMIN_PASSWORD` | `lib/auth.ts` | **Runtime** | **Secret** | Never `NEXT_PUBLIC_` |
| `DATA_DIR` | `lib/store.ts` | Runtime | No | Default `./data`; `/data` on Cloud Run |
| `NODE_ENV` | `content/site.ts`, `lib/auth.ts` | Build/runtime | No | `development` → localhost links; `production` → secure cookie |

- `NEXT_PUBLIC_*` must be read as literal `process.env.NEXT_PUBLIC_X` for inlining (comment in `lib/config.ts`).
- Adding a `NEXT_PUBLIC_*` variable requires changes in `.env.example`, `Dockerfile` (ARG + ENV) and
  `deploy.yml` (env + `--build-arg`).
- Where values come from: local `.env.local` (gitignored); CI uses a dummy `ADMIN_PASSWORD`; production uses
  GitHub repository **variables** (public values, incl. `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) and **secrets**
  (`ADMIN_PASSWORD`, `RECAPTCHA_SECRET_KEY`, GCP identity). `.env.example` lists the reCAPTCHA variables
  with empty values; real keys never go in the repository or docs.

## 3. Environment switching (verified)

`content/site.ts` picks `ENVIRONMENTS.development` when `NODE_ENV === "development"` (i.e. `npm run dev`),
otherwise production. So `npm run build && npm start` locally still uses production URLs for links,
canonicals and the sitemap.

## 4. Findings (verified)

- `.env.example` is committed and contains real-looking public payment details (they are displayed on the
  public site anyway). Not changed.
- Changing any build-time value requires a rebuild/redeploy; changing content files also requires a redeploy.

## 5. AI-relevant notes

**Proposed:** AI provider keys would be runtime secrets (like `ADMIN_PASSWORD`, ideally via Secret Manager),
added to `deploy.yml` runtime env, never `NEXT_PUBLIC_*`. Model names/limits could live in `lib/config.ts`.

## 6. Unknown / Owner input required

- Should `.env.example` use placeholders instead of real payment details? (**Owner input required**)
- Should admin/AI secrets move to Secret Manager? (**Owner input required**)

## 7. References

`content/site.ts`, `content/officers.ts`, `lib/config.ts`, `lib/auth.ts`, `lib/store.ts`, `.env.example`,
`Dockerfile`, `.github/workflows/deploy.yml`, `README.md`.
