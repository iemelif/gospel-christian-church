# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.
Everything below was verified against the code on branch `feat-ai-powered-integration` (2026-09-29).
Where something could not be verified it is marked **Unknown** — do not guess; ask.

---

## 1. Project overview

Website for **Gospel Christian Church IEMELIF** (Zone 7 Frances, Calumpit, 3003 Bulacan, PH).

It currently does two things:

1. **Donate page for Project Nehemiah** (`/donate`): Project Nehemiah is the church building project
   (owner-provided). Donors record a pledge, get a reference number and payment instructions (GCash / Maya /
   Bank Transfer / Cash at Church). No payment is processed online; gift recording is protected by Google
   reCAPTCHA v3. A treasurer confirms pledges in `/admin`; only confirmed gifts count toward the progress
   figures and Giving Wall. Goal ₱12,000,000 (`NEXT_PUBLIC_GOAL`); ₱2,700,000 was raised before the site went
   live (`NEXT_PUBLIC_BASE_RAISED`).
2. **Church information pages**: Church Officers, Leadership, Leadership History, plus "Coming soon"
   placeholders for About Us, Ministries and Contact Us.

Production domains: main site `https://www.gcciemelif.website`; `https://support.gcciemelif.website` (still
defined as `LINKS.support`, no longer used by the menu). **Both domains point to this same Cloud Run service**
(confirmed by the owner) — so any path works on either host, and `support.…/` serves the same `/` as `www.…/`.
No redirect exists; the subdomain's future is an open owner question.

> **Home (implemented 2026-09-29):** `/` (`app/page.tsx`) is the Home page: carousel → welcome → Project
> Nehemiah feature (inline Facebook video, muted autoplay requested; CTA → `/donate`) → "Our Pastor, Deacon,
> Chairman and Vice Chairman" → Join Us. Spec: `docs/pages/home.md`.
>
> **Donate (implemented 2026-09-29):** `/donate` (`app/donate/page.tsx`) is the only Donate route. **`/support`
> returns 404** (removed; no redirect, not in the sitemap). Spec: `docs/pages/donate.md`.

---

## 2. Technology stack (verified)

| Area | What is actually used |
| --- | --- |
| Framework | **Next.js 16.3.6**, App Router (`app/`), `output: "standalone"` (`next.config.ts`) |
| UI | **React 19.3**, function components, TypeScript `.tsx` |
| Language | **TypeScript 5.9**, `strict: true`, path alias `@/*` → repo root |
| Runtime | **Node 24** everywhere: `package.json` engines `>=24 <25`, CI, and `Dockerfile` (`node:24-alpine`) |
| Package manager | **npm** (`package-lock.json`; CI/Docker use `npm ci`) |
| Styling | **Tailwind CSS v4** (dev dependencies `tailwindcss`, `@tailwindcss/postcss`), run through `postcss.config.mjs`. Configured in CSS (`app/globals.css`: `@theme` tokens, breakpoints); **no `tailwind.config` file**. **Preflight is not enabled.** Repeated patterns are shared class strings in `lib/ui.ts`. No CSS Modules, no CSS-in-JS, no UI component library — see §6 |
| Fonts | `next/font/google` in `app/layout.tsx`: **Young Serif** (400) → CSS variable `--font-young-serif` → Tailwind `font-serif` (headings); **Figtree** → `--font-figtree` → `font-sans` (body) |
| Images | `next/image` for logos; avatars are SVG files in `public/images/people/` |
| Data storage | **JSON file** `gifts.json` in `DATA_DIR` (default `./data`; `/data` on Cloud Run = mounted GCS bucket). No database |
| Bot protection | **Google reCAPTCHA v3** (invisible, score-based) on `POST /api/gifts` (action `record_gift`) and the Admin sign-in `POST /api/admin/session` (action `admin_sign_in`), min score 0.5 (`RECAPTCHA_MIN_SCORE`). Keys: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (public), `RECAPTCHA_SECRET_KEY` (server-only). The only server-side external service (Home also embeds Facebook's video player iframe in the browser) |
| Auth | Single shared **`ADMIN_PASSWORD`** → HMAC-signed, httpOnly, 1-day cookie `gcc_admin` (`lib/auth.ts`). No user accounts |
| Runtime deps | Only `next`, `react`, `react-dom`. Do not add dependencies without asking |
| Lint | **ESLint 9** flat config `eslint.config.mjs` using `eslint-config-next` (core-web-vitals + typescript). ESLint 10 is not used because Next's plugins don't support it yet (peer conflicts) |
| Format | **None** (no Prettier). Match the existing compact style by hand |
| Tests | **Vitest 5**, `vitest.config.mts` (node environment, `@/` alias). Tests are `*.test.ts` next to the code (currently `lib/*.test.ts`). No component/browser tests yet |
| CI | GitHub Actions `ci.yml`: `npm ci` → `npm run lint` → `npm test` → `npm run build` on PRs and non-main pushes. `deploy.yml` does not run lint/tests |
| Deploy | GitHub Actions `deploy.yml` → Docker → Artifact Registry → **Google Cloud Run** (`us-central1`) on push to `main` |

---

## 3. Commands

```bash
npm install          # first-time setup (ask before running — changes node_modules)
npm run dev          # dev server, http://localhost:3000
npm run build        # production build (also type-checks)
npm start            # serve the production build
npm run avatars      # generate placeholder SVGs for officers in content/officers.ts (never overwrites)
npm run lint         # ESLint (must have 0 errors; CI fails on errors)
npm run typecheck    # tsc --noEmit
npm test             # Vitest, single run
npm run test:watch   # Vitest, watch mode
```

- **Before proposing a change as done run: `npm run lint && npm test && npm run build`** (same as CI).
- Lint currently shows 3 known warnings (2× `react-hooks/set-state-in-effect` in `SiteHeader.tsx` and
  `app/admin/page.tsx`, 1 unused import in `scripts/generate-avatars.mjs`). That rule is downgraded to
  `warn` in `eslint.config.mjs` on purpose; don't add new warnings.
- Local env: copy `.env.example` → `.env.local` and set `ADMIN_PASSWORD`. **Never read out, print, or commit
  `.env.local`.**
- `npm run build` needs `ADMIN_PASSWORD` only at runtime, not at build time (CI sets a dummy value).

---

## 4. Important directories and files

```
app/                       App Router
  layout.tsx               Root layout: fonts, global metadata, JSON-LD (Church), skip link, SiteHeader, SiteFooter
  globals.css              Tailwind setup: imports (no Preflight), @theme tokens, breakpoints, a few element defaults
  page.tsx                 "/"  – Home page (static) — see docs/pages/home.md
  manifest.ts              Web app manifest (icons in public/icons/, made from 02-gcc-logo.jpg)
  donate/page.tsx          "/donate" – THE Donate page for Project Nehemiah (force-dynamic, reads gifts) — see §7.3
  about/ ministries/ contact/  Placeholders: PageHero + <ComingSoon> card + JoinUs (noindex); text in content/coming-soon.ts
  leadership/page.tsx      Leadership groups for the current term (not in the header menu, but in sitemap)
  officers/page.tsx        Current-term officer board
  history/[term]/page.tsx  Past terms, statically generated from HISTORY_TERMS
  admin/                   Treasurer dashboard (client component, noindex)
  api/gifts/route.ts       GET summary, POST new pledge (validation lives here)
  api/admin/route.ts       GET all gifts, PATCH confirm/unconfirm/delete (session required)
  api/admin/session/route.ts  POST sign-in (reCAPTCHA v3 first, then password; rate-limited 8/15min per IP), DELETE sign-out
  robots.ts, sitemap.ts    SEO
components/                Shared React components (default exports, PascalCase files)
content/                   EDITABLE SITE CONTENT (non-developer friendly)
  site.ts                  URLs per environment, SITE name, LINKS, LOGOS, SHARE_IMAGES (search/share thumbnails), ADDRESS, SOCIAL, NAV menu
  officers.ts              CURRENT_TERM, HISTORY_TERMS, BOARD_ROLES, LEADERSHIP_GROUPS
  coming-soon.ts           COMING_SOON title/text per placeholder page, COMING_SOON_JOIN_INTRO
lib/
  config.ts                CHURCH (campaign "Project Nehemiah", goal, email), SCHEDULE, PAYMENT_METHODS (id + label),
                           AMOUNTS, php(), RECAPTCHA_SITE_KEY, RECAPTCHA_ACTION ("record_gift")
  recaptcha.ts             Server-only Google reCAPTCHA v3 verification (DEFAULT_RECAPTCHA_MIN_SCORE = 0.5), recaptchaError()
  recaptchaClient.ts       Browser recaptchaToken(action), shared by GiveForm and the Admin sign-in
  adminSignIn.ts           Admin Sign in: reCAPTCHA token first, then POST /api/admin/session
  progress.ts              fundedPercent() (capped at 100) / formatPercent() for the Donate page
  store.ts                 gifts.json read/write, serialized update(), summary()
  auth.ts                  password check, session cookie
  seo.ts                   pageMeta() helper for per-page metadata
  carousel.ts              carouselSlides(): server-side discovery of the Home carousel images (every image in
                           public/images/hershot-carousel/, alphabetical; no manual list)
  nav.ts                   buildNav(): fills "Leadership History" submenu from officers
  menu.ts                  Header dropdown state: activeMenuKeys() / toggleMenu() (auto-expands the current page's submenu)
  officers.ts              person merging, board rows, leadership groups, displayName()
  slug.ts                  slugify() for avatar file names
  ui.ts                    Shared Tailwind class strings (wrap, buttons, cards, headings, inputs, …) — see §6
public/images/             gcc-logo.png (54×98), iemelif-logo.png (274×269), people/*.svg avatars
design/original-logos/     Untouched original logos (reference only; not served)
scripts/generate-avatars.mjs  Avatar generator (runs .ts imports directly under Node 24)
data/gifts.json            LIVE-LIKE PLEDGE DATA, gitignored — never edit, delete or commit
information.md             Original requirements + raw officer lists (CRLF line endings; payment details removed)
postcss.config.mjs         Registers the @tailwindcss/postcss plugin (Tailwind has no other config file)
eslint.config.mjs          ESLint flat config
vitest.config.mts          Vitest config
lib/*.test.ts              Unit tests (slug, officers, config, auth, store, carousel)
.github/workflows/         ci.yml, deploy.yml
Dockerfile, .dockerignore  3-stage build (deps → build → run), standalone server
```

---

## 5. Architecture and coding conventions

**Server vs client**
- Components are **Server Components by default**. Add `"use client"` only when a component needs state,
  effects or browser APIs. Current client components: `SiteHeader`, `GiveForm`, `CopyButton`, `HeroShotCarousel`, `VideoEmbed`,
  `app/admin/page.tsx`.
- Pages that show live gift totals use `export const dynamic = "force-dynamic"` and call `summary()` from
  `lib/store.ts` directly (no fetch to own API from server components).
- Client components talk to the server via `fetch("/api/...")` and call `router.refresh()` after mutations.

**Content vs code**
- Editable content (links, address, menu, social, officers) lives in `content/*.ts`. Business settings
  (goal, schedule, payment methods, preset amounts) live in `lib/config.ts`. **Put new copy/config there,
  not hard-coded in components**, and keep the explanatory header comments those files use for non-developers.
- `NEXT_PUBLIC_*` must be read as literal `process.env.NEXT_PUBLIC_X` (no destructuring) so Next inlines them.
  They are **public** and **baked in at build time** — never put secrets in them. Adding one requires updating
  `.env.example`, `Dockerfile` (ARG + ENV) and `deploy.yml` (env + `--build-arg`).
- Environment-dependent URLs come from the `ENVIRONMENTS` block in `content/site.ts` (switches on `NODE_ENV`).
  Use `LINKS.*` / `SITE_URL`, never hard-code domains.

**Pages**
- Every page returns `<main id="main">` (the skip link targets `#main`).
- Metadata: use `pageMeta(title, description, path, { index?: false })` from `lib/seo.ts`. Placeholders use
  `{ index: false }`. Add new indexable pages to `app/sitemap.ts`.
- Inner pages use `<PageHero title intro? />` then ``<div className={`${wrap} ${pageBody}`}>`` (from `lib/ui.ts`).

**Data / API safety**
- All writes to gifts go through `update()` in `lib/store.ts` (serialises read-modify-write). Never call
  `writeGifts` directly from new code.
- `readGifts()` deliberately throws on corrupt/unreadable data so a write can't wipe pledges — keep that behaviour.
- Confirmed gifts must never be deletable (enforced in `api/admin/route.ts`).
- Server-side validation of pledges lives in `api/gifts/route.ts`; keep client and server rules consistent.
  After field validation it verifies **Google reCAPTCHA v3** (`lib/recaptcha.ts`) and saves nothing on failure.
  Never store the reCAPTCHA token; never log, return or expose `RECAPTCHA_SECRET_KEY`. The Admin sign-in reuses the
  same verifier (action `admin_sign_in`) before checking the password; other admin actions use only the session.
- Donor email is **optional**; if given it is validated. Email must never appear in public output (Giving
  Wall, `GET /api/gifts`, pages).
- Payment method **ids** (`GCash`, `Maya`, `Bank transfer`, `Cash at church`) are stored with pledges — never
  rename them; change the donor-facing `label` instead.
- Cloud Run runs with `max-instances=1` because of the file store and the in-memory login rate limiter.

**Style of code (match it)**
- Default-exported components, PascalCase filenames in `components/`; helpers are named exports in `lib/`.
- Imports use the `@/` alias for cross-folder imports; `./X` inside `components/`.
- Compact style: short components, JSX often on one line, small JSDoc `/** ... */` comments explaining *why*.
- Double quotes, semicolons, 2-space indent, trailing commas in multi-line literals.
- Currency always via `lib/config.ts`: `php(n)` → `₱12,000,000` for the goal and preset amounts; `phpCents(n)` →
  `₱2,701,248.50` for gift amounts, total raised, amount still needed, Giving Wall, receipt and admin. Gifts accept
  centavos (`isGiftAmount`: ₱1–₱12,000,000, max 2 decimals, same rule in `GiveForm` and `POST /api/gifts`); add money
  with `sumPesos()` / `toCentavos()`, never raw `+` on floats.
- Style with Tailwind classes in the markup (§6). Inline `style={{...}}` only for values computed at runtime
  (e.g. progress-bar width/left); not for fixed styling.

---

## 6. UI and design conventions (Tailwind CSS v4)

The visual design was carried over **pixel-for-pixel** from the earlier plain-CSS version (verified with
before/after screenshots, 2026-09-29). Preserve it; don't restyle as a side effect of other work.

**Setup (`app/globals.css`, `postcss.config.mjs`)**
- Imports only `tailwindcss/theme.css` and `tailwindcss/utilities.css`. **Preflight (Tailwind's reset) is
  intentionally not imported**, so browser defaults still apply: paragraphs and lists keep their default
  margins, `ul` keeps bullets, headings/buttons/`dl` keep UA styles. Set margins/list styles explicitly
  (`mt-0 mb-6`, `list-none p-0`, …) where the design needs them.
- Tailwind only scans `app/`, `components/` and `lib/ui.ts` (`@source`). Classes written anywhere else are not
  generated. Write complete class names literally — never build them by concatenating fragments.
- `@layer base` holds the only hand-written CSS: `color-scheme`, `* { box-sizing }`, `html` smooth scroll with
  `scroll-padding-top: 90px` (sticky header), `h1–h3` serif / weight 400 / line-height 1.15 / margin 0,
  `a { color: inherit }`, the blue `:focus-visible` outline, and the reduced-motion override. Add custom CSS
  only when a utility genuinely cannot express it (none was needed for the stripe, counters or tick marks).

**Theme tokens** (`@theme static` in `app/globals.css`, derived from the two logos) → utilities such as
`bg-brand`, `text-mute`, `border-line`; also available as `var(--color-*)` inside arbitrary values:

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#fbf8f2` | page background (warm off-white) |
| `card` | `#fff` | cards |
| `paper` | `#f6efe1` | footer, hover fills, trust card |
| `ink` / `mute` | `#2b2226` / `#6b5f63` | text / secondary text |
| `line` | `#e9dfd0` | borders |
| `brand` / `brand-2` | `#7f1f36` / `#a12842` | GCC crimson, hero gradient |
| `crimson` | `#b3304a` | accents, active nav underline, errors |
| `gold` / `gold-dark` | `#deb942` / `#8a6a10` | primary buttons, progress, highlights |
| `blue` | `#2a6f9e` | IEMELIF blue, focus ring, footer links |
| `onbrand` | `#fff8f0` | text on crimson |

Tailwind's default palette is still loaded; only its `white` is used (`text-white`, `bg-white`,
`border-white`). Otherwise stick to these tokens plus the few existing exact tints such as `text-[#f4dbe1]`,
`text-[#f1c9d2]`, `text-[#1b1404]`.

**Fonts:** `font-sans` = Figtree (`--font-figtree`), `font-serif` = Young Serif (`--font-young-serif`). Body is
set on `<body>` in `app/layout.tsx`: `font-sans text-[16px] leading-[1.6]`.

**Breakpoints** (custom; Tailwind's defaults are removed). They reproduce the original `max-width` media queries:

| Name | Min width | Original rule | Used for |
| --- | --- | --- | --- |
| `xs` | 421px | ≤420px | amount buttons 3 → 2 columns (`max-xs:`) |
| `sm` | 481px | ≤480px | header brand name hidden (`max-sm:hidden`) |
| `md` | 801px | ≤800px | grids stack to one column, mobile give bar, body bottom padding (`max-md:`) |
| `lg` | 1081px | ≤1080px | header collapses to the menu button (`max-lg:`) |

The design is desktop-first, so it mostly uses `max-*:` variants. There is no `xl`/`2xl`.

**Shared class strings — `lib/ui.ts`** (plain strings, not components; combine with template literals):
`wrap` (1080px column), `pageBody`, `brandGradient`, `stripeAfter` / `stripeBefore` (3px crimson|gold|blue
stripe), `h2` / `h2Size`, `sub`, `muted`, `card` / `cardBox` / `cardTitle` / `cards`, `input`, `label`,
`errorText`, `btn.*` (`primary`, `primaryLg`, `primaryFull`, `primaryFullLg`, `primarySm`, `ghost`, `ghostSm`,
`ghostLgOnBrand`), `peopleGrid` / `peopleRowTop` / `peopleRowRest`, `section` (`py-14` section rhythm),
`eyebrow` (small gold uppercase label above a heading). Styles used by only one component stay as
constants in that file (e.g. the radio-card strings in `GiveForm`, the menu strings in `SiteHeader`).

**Writing classes (conventions that keep the design exact)**
- Prefer exact arbitrary values from the design (`text-[14px]`, `p-[22px]`, `rounded-[10px]`) over Tailwind's
  named scale when they differ. Named font sizes like `text-sm` also set a line-height, and `leading-normal`
  is 1.5 (use `leading-[normal]` for the CSS keyword). Colour gradients are written as
  `bg-[linear-gradient(…)]` because Tailwind's gradient utilities interpolate differently.
- Never put two unprefixed utilities that set the same property on one element (e.g. `p-0` and `p-1.5`);
  which one wins is not obvious. `lib/ui.ts` has one complete string per button variant for this reason.
- Radio "cards" use `peer` + `peer-checked:` / `peer-focus-visible:`; pseudo-elements use `before:`/`after:`
  (the step numbers use a CSS counter via `[counter-reset:s]` / `before:content-[counter(s)]`).
- Print: `print:hidden` on header, footer, buttons and the give bar (receipt printing).
- `hover:` utilities only apply on devices that support hover (Tailwind v4 behaviour).

**Theme rule:** the Donate page (§7.3) is the visual reference for the GCC/IEMELIF theme. New pages and
components use only the `@theme` tokens and `lib/ui.ts` strings — no new palette, no UI libraries.

**Other conventions**
- Headings `h1–h3` are serif, weight 400 (base layer); set sizes per element (`h2` string for section headings).
- Signature 3px crimson | gold | blue stripe under the header and on top of the footer.
- **Accessibility is expected:** skip link, `:focus-visible` outline (blue; gold inside crimson areas via
  `[&_:focus-visible]:outline-gold`), `aria-*` on menus/progress bars, `role="alert"` for errors, `aria-live`
  for status, reduced motion, print styles, `sr-only` for visually hidden text.
- Brand language: English copy, warm and plain; Filipino role names are kept as-is (e.g. Predigador, Kalihim).

---

## 7. Reference components (use these as the model for new pages, incl. the Home page)

### 7.1 Header — `components/SiteHeader.tsx` (client)
- Rendered once in `app/layout.tsx` as `<SiteHeader nav={buildNav()} />`. **Do not render it inside pages.**
- Sticky, translucent white with backdrop blur, tri-colour stripe underneath (`stripeAfter` from `lib/ui.ts`).
- Left: IEMELIF logo (external, new tab) + GCC logo (→ `LINKS.gcc`) + brand name "Gospel Christian Church /
  IEMELIF". Right: nav from `NAV` in `content/site.ts`.
- Menu items: internal `Link` (with `aria-current="page"`), `external: true` → plain `<a>`, `children` →
  dropdown (nested allowed; item with both `href` and `children` renders a split link + arrow button).
- Closes on route change, outside click and Escape. Hamburger below 1080px.
- Opening a dropdown also expands the submenu that contains the current page (e.g. Leadership History on
  `/history/…`); logic in `lib/menu.ts` (`activeMenuKeys`, `toggleMenu`), tested in `lib/menu.test.ts`.
- **To change the menu edit `NAV` in `content/site.ts`**, not the component. "Home" is an external link
  (`LINKS.home`); **"Donate" is internal (`/donate`)**.

### 7.2 Footer — `components/SiteFooter.tsx` (server)
- Rendered once in `app/layout.tsx`. Background `bg-paper`, stripe on top (`stripeBefore`).
- 3-column grid at **every** width: small logos | church name, `ADDRESS.display`, schedule line from
  `SCHEDULE`, giving email | "Follow us" `SOCIAL` icons (`SocialIcon`, currently Facebook only). Copyright row
  below. (The original CSS intended a one-column layout at ≤800px, but it never took effect; the migration
  kept the actual behaviour — see §10.)
- To add a social network: add an icon case in `components/SocialIcon.tsx` **and** an entry in `SOCIAL`.

### 7.3 Donate page (Project Nehemiah) — `app/donate/page.tsx`
- Component `DonatePage`, metadata `DONATE_TITLE` / `DONATE_DESCRIPTION` (`lib/seo.ts`), canonical `/donate`,
  `force-dynamic`. `/` currently renders the same component via `app/page.tsx`. Structure:
  1. Hero (`brandGradient`, 2-column grid, one column ≤800px): headline, intro, two CTAs (`btn.primaryLg`
     → `#give`, `btn.ghostLgOnBrand` → `#how`), gold-bordered verse (2 Cor 9:7) | translucent card with
     `ChurchProgress` SVG, % raised, stats row (still needed, confirmed gifts). Below both columns, a centred
     full-width row (max 960px): `h2` "See what we're building", caption, and the Project Nehemiah video
     (`VideoEmbed autoplay`, `NEHEMIAH_VIDEO` in `lib/config.ts`) in a frame styled like the progress card.
  2. `section#progress` – framed building picture (`SHARE_IMAGES.donate`, brand stripe, "% raised" badge, caption from
     `NEHEMIAH_PICTURE` in `lib/config.ts`), then a `card` with the progress bar (25/50/75% tick marks) and raised / to-go row.
  3. `section#how` – 3 numbered step cards (CSS counter).
  4. `section#ways` – "Ways to send your gift": one `PaymentDetails` card per payment method (before the form).
  5. `section#give` – 2-column grid: `cardBox` with `<GiveForm/>` | sticky `aside` with the trust card,
     `FundraisingPercent` (directly above the Giving Wall) and the Giving Wall.
  6. `section#visit` – "Join us" schedule cards, rendered by the reusable `JoinUs` component.
  7. Mobile-only fixed "Give to Project Nehemiah" bar (≤800px, hidden in print).
- One percentage for the whole page: `fundedPercent(summary().raised, CHURCH.goal)` (capped at 100).
- Supporting components: `GiveForm` (3-step form → reCAPTCHA v3 token → POST `/api/gifts` → receipt with ref +
  copy + print), `PaymentDetails`, `FundraisingPercent`, `JoinUs`, `CopyButton`, `ChurchProgress`.

### Component reuse guidelines
- Reuse before creating: `PageHero`, `PagePhoto` (church family photo on Officers/Leadership/History — also their search-result picture), `PageJsonLd` (WebPage `primaryImageOfPage`), `ComingSoon` (placeholder pages), `PersonCard`/`OfficerBoard`/`Avatar`, `ChurchProgress`, `GiveForm`,
  `CopyButton`, `SocialIcon`, and the shared class strings in `lib/ui.ts` (§6).
- Reuse data sources instead of duplicating values: `CHURCH`, `SCHEDULE`, `php` (`lib/config.ts`);
  `SITE`, `LINKS`, `LOGOS`, `ADDRESS`, `SOCIAL` (`content/site.ts`); `summary()` (`lib/store.ts`);
  `CURRENT_TERM` + `lib/officers.ts` helpers.
- If a block of JSX appears in two pages (e.g. hero progress card, giving wall, schedule cards), extract it
  into `components/` rather than copying it a third time — but only when asked to refactor, and without
  changing the rendered output of existing pages.
- Keep new components small, typed with inline prop types (`{ title: string; intro?: string }`), default export.

---

## 8. Git safety rules

- Work on a feature branch; `main` auto-deploys to production Cloud Run on every push (except `**.md`-only changes).
- **Never** push, force-push, merge to `main`, rebase shared branches, or delete branches without explicit request.
- Commit only when asked. Keep commits focused; run `npm run build` before proposing a commit.
- **Never commit** `.env.local`, `data/gifts.json`, `.next/`, `node_modules/` (all gitignored — keep it that way).
- Do not print or copy secrets (`ADMIN_PASSWORD`, `RECAPTCHA_SECRET_KEY`, `.env.local` values, GitHub secrets)
  into code, docs, logs or chat. `.env.example` keeps empty placeholders only.
- Don't edit `.github/workflows/*`, `Dockerfile` or `next.config.ts` unless the task is about deployment.
- Don't regenerate `package-lock.json` or install/upgrade packages without asking.

---

## 9. Guidelines for future development

- **Home page (implemented):** keep it on the Donate page theme; welcome copy only from verified data
  (`content/home.ts`). Open owner questions: keep, redirect or retire `support.gcciemelif.website/` (it shows
  Home); whether `LINKS.home` should become an internal `/` link.
- New page checklist: `<main id="main">`, `pageMeta(...)`, `PageHero` (inner pages), add to `NAV` in
  `content/site.ts` if it belongs in the menu, add to `app/sitemap.ts` if indexable, remove `{ index: false }`
  when a placeholder gets real content.
- Keep content editable by non-developers: new text lists, links and settings go into `content/` or `lib/config.ts`.
- Check layouts at 400, 800, 1100 and 1280px (around the `md`/`lg` breakpoints in §6). Maintain keyboard access
  and visible focus.
- Verify with `npm run lint && npm test && npm run build`. Add or update `*.test.ts` when changing logic in
  `lib/` or API validation. For UI changes, also run `npm run dev` and look at the page.
- Component/browser tests (React Testing Library, Playwright) are not set up; ask before adding them.
- Keep this file up to date when the stack, commands, or conventions change.

---

## 10. Known inconsistencies / unknowns (do not silently "fix")

Resolved on 2026-09-29: Dockerfile now on Node 24; README matches `deploy.yml` (region `us-central1`,
repository `gospel-christian-church`, bucket `<project>-gospel-christian-church-data`, no `GCS_BUCKET`) and the
code (dev links all `:3000`, content lives in `content/`); payment details removed from `information.md` (they
remain in **git history**); Donate page implemented at `/donate` with `/support` removed (404).

Still open:
- `/leadership` exists and is in the sitemap but not in the header menu.
- `.env.example` (committed) contains real GCash/Maya/bank values and account names. They are shown publicly
  on the Donate page anyway, but ask before changing them.
- Header "Home" is an external link; `LINKS.support` is unused; see §9 for the subdomain decision.
- reCAPTCHA keys are not configured yet (owner action: add them locally and in GitHub, register domains, rotate
  the previously exposed secret). Until then gifts cannot be recorded and nobody can sign in to `/admin` in that
  environment.
- The reCAPTCHA badge is hidden via `.grecaptcha-badge` in `app/globals.css` (with Google's notice in the form) —
  the one piece of hand-written CSS for a third-party element; owner may prefer the visible badge.
- `react-hooks/set-state-in-effect` warnings in `SiteHeader.tsx` and `app/admin/page.tsx` (refactor candidates).
- The footer stays three columns on narrow screens: the original CSS meant to stack it at ≤800px, but a
  source-order bug stopped that rule from applying. The Tailwind migration preserved the real behaviour on
  purpose; whether it should stack is an owner/design decision.
- Tailwind Preflight is off on purpose (§6). Turning it on would change spacing, lists and headings site-wide.
- **Unknown:** any analytics, error monitoring, or DNS/domain-mapping setup (none found in the repo).
