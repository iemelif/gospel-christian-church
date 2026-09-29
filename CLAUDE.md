# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.
Everything below was verified against the code on branch `feat-ai-powered-integration` (2026-09-29).
Where something could not be verified it is marked **Unknown** — do not guess; ask.

---

## 1. Project overview

Website for **Gospel Christian Church IEMELIF** (Zone 7 Frances, Calumpit, 3003 Bulacan, PH).

It currently does two things:

1. **Church Building Fund giving site**: donors record a pledge, get a reference number and payment
   instructions (GCash / Maya / Bank transfer / Cash at church). No payment is processed online. A treasurer
   confirms pledges in `/admin`; only confirmed gifts count toward the progress bar and giving wall.
   Goal ₱12,000,000; ₱2,700,000 was raised before the site went live (`NEXT_PUBLIC_BASE_RAISED`).
2. **Church information pages**: Church Officers, Leadership, Leadership History, plus empty placeholders
   for About Us, Ministries and Contact Us.

Production domains (from `content/site.ts`): main site `https://www.gcciemelif.website`, support/donation
site `https://support.gcciemelif.website`. **Both domains point to this same Cloud Run service** (confirmed
by the owner) — so any path works on either host, and `support.…/` serves the same `/` as `www.…/`.

> **Current state of `/`:** `/` shows *the donation page* (hero + progress + how-it-works + give
> form + giving wall + service schedule). A new Home page is planned; see §9.
>
> **Decided (2026-09-29):** the new Home page will replace `app/page.tsx`; the donation page lives at
> `/support`. **Done:** the full donation page now lives in `app/support/page.tsx`, and `app/page.tsx` is a
> temporary wrapper that renders it with canonical `/`. **Not done yet:** the Home page itself (content and
> photos will come from the owner).

---

## 2. Technology stack (verified)

| Area | What is actually used |
| --- | --- |
| Framework | **Next.js 16.3.6**, App Router (`app/`), `output: "standalone"` (`next.config.ts`) |
| UI | **React 19.3**, function components, TypeScript `.tsx` |
| Language | **TypeScript 5.9**, `strict: true`, path alias `@/*` → repo root |
| Runtime | **Node 24** everywhere: `package.json` engines `>=24 <25`, CI, and `Dockerfile` (`node:24-alpine`) |
| Package manager | **npm** (`package-lock.json`; CI/Docker use `npm ci`) |
| Styling | **One global plain-CSS file** `app/globals.css` with CSS custom properties. No Tailwind, no CSS Modules, no CSS-in-JS, no UI library |
| Fonts | `next/font/google`: **Young Serif** (400) → `--font-serif` (headings), **Figtree** → `--font-sans` (body). Set in `app/layout.tsx` |
| Images | `next/image` for logos; avatars are SVG files in `public/images/people/` |
| Data storage | **JSON file** `gifts.json` in `DATA_DIR` (default `./data`; `/data` on Cloud Run = mounted GCS bucket). No database |
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
npm run build        # production build; ALSO the only type-check (there is no separate lint/test)
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
  globals.css              ALL styles (tokens, layout, header, footer, donation, people cards)
  page.tsx                 "/"  – TEMPORARY wrapper: renders the Support page with canonical "/"; will become the Home page
  support/page.tsx         "/support" – THE donation page (force-dynamic, reads gifts) — see §7.3
  about/ ministries/ contact/  Empty placeholders (PageHero only, noindex)
  leadership/page.tsx      Leadership groups for the current term (not in the header menu, but in sitemap)
  officers/page.tsx        Current-term officer board
  history/[term]/page.tsx  Past terms, statically generated from HISTORY_TERMS
  admin/                   Treasurer dashboard (client component, noindex)
  api/gifts/route.ts       GET summary, POST new pledge (validation lives here)
  api/admin/route.ts       GET all gifts, PATCH confirm/unconfirm/delete (session required)
  api/admin/session/route.ts  POST sign-in (rate-limited 8/15min per IP), DELETE sign-out
  robots.ts, sitemap.ts    SEO
components/                Shared React components (default exports, PascalCase files)
content/                   EDITABLE SITE CONTENT (non-developer friendly)
  site.ts                  URLs per environment, SITE name, LINKS, LOGOS, ADDRESS, SOCIAL, NAV menu
  officers.ts              CURRENT_TERM, HISTORY_TERMS, BOARD_ROLES, LEADERSHIP_GROUPS
lib/
  config.ts                CHURCH (goal, email), SCHEDULE, PAYMENT_METHODS, AMOUNTS, php() formatter
  store.ts                 gifts.json read/write, serialized update(), summary()
  auth.ts                  password check, session cookie
  seo.ts                   pageMeta() helper for per-page metadata
  nav.ts                   buildNav(): fills "Leadership History" submenu from officers
  officers.ts              person merging, board rows, leadership groups, displayName()
  slug.ts                  slugify() for avatar file names
public/images/             gcc-logo.png (54×98), iemelif-logo.png (274×269), people/*.svg avatars
design/original-logos/     Untouched original logos (reference only; not served)
scripts/generate-avatars.mjs  Avatar generator (runs .ts imports directly under Node 24)
data/gifts.json            LIVE-LIKE PLEDGE DATA, gitignored — never edit, delete or commit
information.md             Original requirements + raw officer lists (CRLF line endings; payment details removed)
eslint.config.mjs          ESLint flat config
vitest.config.mts          Vitest config
lib/*.test.ts              Unit tests (slug, officers, config, auth, store)
.github/workflows/         ci.yml, deploy.yml
Dockerfile, .dockerignore  3-stage build (deps → build → run), standalone server
```

---

## 5. Architecture and coding conventions

**Server vs client**
- Components are **Server Components by default**. Add `"use client"` only when a component needs state,
  effects or browser APIs. Current client components: `SiteHeader`, `GiveForm`, `CopyButton`, `app/admin/page.tsx`.
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
- Inner pages use `<PageHero title intro? />` then `<div className="wrap page-body">`.

**Data / API safety**
- All writes to gifts go through `update()` in `lib/store.ts` (serialises read-modify-write). Never call
  `writeGifts` directly from new code.
- `readGifts()` deliberately throws on corrupt/unreadable data so a write can't wipe pledges — keep that behaviour.
- Confirmed gifts must never be deletable (enforced in `api/admin/route.ts`).
- Server-side validation of pledges lives in `api/gifts/route.ts`; keep client and server rules consistent.
- Cloud Run runs with `max-instances=1` because of the file store and the in-memory login rate limiter.

**Style of code (match it)**
- Default-exported components, PascalCase filenames in `components/`; helpers are named exports in `lib/`.
- Imports use the `@/` alias for cross-folder imports; `./X` inside `components/`.
- Compact style: short components, JSX often on one line, small JSDoc `/** ... */` comments explaining *why*.
- Double quotes, semicolons, 2-space indent, trailing commas in multi-line literals.
- Currency always via `php(n)` → `₱12,000,000` (`en-PH`).
- Inline `style={{...}}` is used sparingly for one-off spacing; prefer classes in `globals.css`.

---

## 6. UI and design conventions

**Design tokens** (top of `app/globals.css`, derived from the two logos):

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#fbf8f2` | page background (warm off-white) |
| `--card` | `#fff` | cards |
| `--paper` | `#f6efe1` | footer, hover fills, trust card |
| `--ink` / `--mute` | `#2b2226` / `#6b5f63` | text / secondary text |
| `--line` | `#e9dfd0` | borders |
| `--brand` / `--brand-2` | `#7f1f36` / `#a12842` | GCC crimson, hero gradient |
| `--crimson` (= `--red`) | `#b3304a` | accents, active nav underline, errors |
| `--gold` / `--gold-dark` | `#deb942` / `#8a6a10` | primary buttons, progress, highlights |
| `--blue` | `#2a6f9e` | IEMELIF blue, focus ring, footer links |
| `--onbrand` | `#fff8f0` | text on crimson |

- **Signature stripe:** 3px crimson | gold | blue gradient (thirds) under the header and on top of the footer.
- Headings `h1–h3` use the serif font, weight 400. Body 16px/1.6 Figtree.
- Layout container: `.wrap` (max-width 1080px, 20px side padding; header uses 1240px).
- Sections: `section { padding: 56px 0 }`, heading `h2` + intro `p.sub`.
- **Reusable classes:** `.hero` (crimson gradient, 2-col `.grid`), `.page-hero`, `.card`, `.cards`
  (auto-fit grid, min 260px), `.btn` (gold) + modifiers `.ghost .sm .lg .full`, `.steps` (numbered cards),
  `.bar` (progress), `.verse` (gold-bordered quote), `.muted`, `.sub`, `.people/.person` (avatar cards),
  `.sr` (screen-reader only).
- Breakpoints in use: **1080px** (header collapses to hamburger), **800px** (grids stack to 1 column,
  mobile sticky `.give-bar`), **480px** (brand name hidden), **420px** (amount grid 2 cols).
- **Accessibility is expected:** skip link, `:focus-visible` outline (blue; gold on crimson), `aria-*` on
  menus/progress bars, `role="alert"` for errors, `aria-live` for status, `prefers-reduced-motion`, print styles.
- CSS style in `globals.css` is **compact one-line rules**, grouped under `/* ---------- section ---------- */`
  comments. Add new rules in a new commented section rather than scattering them. Reuse tokens; don't
  introduce raw colors unless an existing rule does the same (e.g. hero text tints `#f4dbe1`, `#f1c9d2`).
- Brand language: English copy, warm and plain; Filipino role names are kept as-is (e.g. Predigador, Kalihim).

---

## 7. Reference components (use these as the model for new pages, incl. the Home page)

### 7.1 Header — `components/SiteHeader.tsx` (client)
- Rendered once in `app/layout.tsx` as `<SiteHeader nav={buildNav()} />`. **Do not render it inside pages.**
- Sticky, translucent white with blur, tri-colour stripe underneath (`.site-header`, `.site-header::after`).
- Left: IEMELIF logo (external, new tab) + GCC logo (→ `LINKS.gcc`) + brand name "Gospel Christian Church /
  IEMELIF". Right: nav from `NAV` in `content/site.ts`.
- Menu items: internal `Link` (with `aria-current="page"`), `external: true` → plain `<a>`, `children` →
  dropdown (nested allowed; item with both `href` and `children` renders a split link + arrow button).
- Closes on route change, outside click and Escape. Hamburger below 1080px.
- **To change the menu edit `NAV` in `content/site.ts`**, not the component. "Home" and "Support" are
  external links (`LINKS.home`, `LINKS.support`).

### 7.2 Footer — `components/SiteFooter.tsx` (server)
- Rendered once in `app/layout.tsx`. Background `--paper`, stripe on top.
- 3-column grid (`.foot-grid`): small logos | church name, `ADDRESS.display`, schedule line from `SCHEDULE`,
  giving email | "Follow us" `SOCIAL` icons (`SocialIcon`, currently Facebook only). Copyright row below.
- To add a social network: add an icon case in `components/SocialIcon.tsx` **and** an entry in `SOCIAL`.

### 7.3 Support / Donation page — `app/support/page.tsx`
- The full donation page (component `SupportPage`, `pageMeta` path `/support`, `force-dynamic`). `/` currently
  renders the same component via `app/page.tsx`. Structure:
  1. `.hero` 2-col: headline, intro, two `.btn lg` CTAs (`#give`, `#how`), `.verse` (2 Cor 9:7) |
     `.church` card with `ChurchProgress` SVG, % raised, `church-stats` (still needed, confirmed gifts).
  2. `section#progress` – `.card` with `.bar` (25/50/75% marks) and `.meta`.
  3. `section#how` – 3 `.steps`.
  4. `section#give` – `.form` grid: `.card.form-card` with `<GiveForm/>` | `aside.side` with trust card and
     giving wall.
  5. `section#visit` – schedule `.cards`.
  6. Mobile sticky `.give-bar` link.
- The older, simpler duplicate that used to be here was replaced (2026-09-29); `/support` is in the sitemap.
  In-page anchors (`#give`, `#how`, `#progress`) are relative, so they work on any URL.
- Supporting components: `GiveForm` (3-step fieldset form → POST `/api/gifts` → receipt with ref + copy +
  print), `CopyButton`, `ChurchProgress`.

### Component reuse guidelines
- Reuse before creating: `PageHero`, `PersonCard`/`OfficerBoard`/`Avatar`, `ChurchProgress`, `GiveForm`,
  `CopyButton`, `SocialIcon`, and the CSS classes in §6.
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
- Do not print or copy secrets (`ADMIN_PASSWORD`, `.env.local` values, GitHub secrets) into code, logs or chat.
- Don't edit `.github/workflows/*`, `Dockerfile` or `next.config.ts` unless the task is about deployment.
- Don't regenerate `package-lock.json` or install/upgrade packages without asking.

---

## 9. Guidelines for future development

- **Home page (planned, not yet implemented):** build it with the existing layout (header/footer come from
  `app/layout.tsx`), the design tokens and classes in §6, and the donation page structure in §7.3 as the
  visual reference (crimson `.hero`, `.card`/`.cards` sections, gold CTAs, `.verse`). Replace the whole of
  `app/page.tsx` (the donation page is safe in `app/support/page.tsx`). The Home page's own `pageMeta` path
  is `"/"`; it should no longer use the "Church Building Fund" title. Content and photos: **waiting on the owner**
  — don't invent copy, leaders' details or photos.
- **When the Home page ships, decide together with it (ask the owner):**
  - `support.gcciemelif.website/` will show the Home page (same deployment). Old donation links would need a
    host-based redirect `support.gcciemelif.website/*` → `www.gcciemelif.website/support` (e.g. `redirects()`
    with a `has: [{ type: "host" }]` condition in `next.config.ts`).
  - Whether `LINKS.support` / `LINKS.home` in `content/site.ts` should become internal (`/support`, `/`)
    instead of external full URLs (they are external today; dev links all use `localhost:3000`).
- New page checklist: `<main id="main">`, `pageMeta(...)`, `PageHero` (inner pages), add to `NAV` in
  `content/site.ts` if it belongs in the menu, add to `app/sitemap.ts` if indexable, remove `{ index: false }`
  when a placeholder gets real content.
- Keep content editable by non-developers: new text lists, links and settings go into `content/` or `lib/config.ts`.
- Mobile first: check 400px, 800px and 1080px breakpoints. Maintain keyboard access and visible focus.
- Verify with `npm run lint && npm test && npm run build`. Add or update `*.test.ts` when changing logic in
  `lib/` or API validation. For UI changes, also run `npm run dev` and look at the page.
- Component/browser tests (React Testing Library, Playwright) are not set up; ask before adding them.
- Keep this file up to date when the stack, commands, or conventions change.

---

## 10. Known inconsistencies / unknowns (do not silently "fix")

Resolved on 2026-09-29: Dockerfile now on Node 24; README matches `deploy.yml` (region `us-central1`,
repository `gospel-christian-church`, bucket `<project>-gospel-christian-church-data`, no `GCS_BUCKET`) and the
code (dev links all `:3000`, content lives in `content/`); duplicated support page replaced; payment details
removed from `information.md` (they remain in **git history**).

Still open:
- `/leadership` exists and is in the sitemap but not in the header menu.
- `.env.example` (committed) contains real GCash/Maya/bank values and account names. They are shown publicly
  on the donation page anyway, but ask before changing them.
- Header "Support" / "Home" are external links to the subdomains; see §9 for the redirect decision.
- `react-hooks/set-state-in-effect` warnings in `SiteHeader.tsx` and `app/admin/page.tsx` (refactor candidates).
- **Unknown:** any analytics, error monitoring, or DNS/domain-mapping setup (none found in the repo).
