# Donate (Project Nehemiah)

Route: **`/donate`** · File: `app/donate/page.tsx` (component `DonatePage`) · Status: **Complete**

The Donate page exists specifically to support **Project Nehemiah**, the church building project
(owner-provided, 2026-09-29). Implemented 2026-09-29: route `/donate`, header label "Donate", Project
Nehemiah naming, prominent payment methods, optional donor email, fundraising percentage above the Giving
Wall, and Google reCAPTCHA v3 on gift recording. `/support` no longer exists (404).

## 1. Purpose

- **Owner-provided:** Project Nehemiah is the church building project; this page exists to support it. Goal
  ₱12,000,000 (configured default).
- **Verified:** donors record a pledge, receive a reference number and payment instructions, then send money
  outside the site (GCash, Maya, Bank Transfer, Cash at Church). No payment is processed online. The treasurer
  confirms received gifts in `/admin` ([admin.md](admin.md)); only confirmed gifts count toward the totals.
- No Project Nehemiah history, construction details, timeline or financial breakdown has been provided; do
  not add any.

## 2. Current State

**Verified:**
- `app/donate/page.tsx`, `export const dynamic = "force-dynamic"` (totals read on every request).
- `/` (temporary Home) renders the same `DonatePage` with canonical `/` ([home.md](home.md)).
- **`/support` returns 404**: `app/support/page.tsx` was removed; there is no redirect and no compatibility
  page. `LINKS.support` (`support.gcciemelif.website`) still exists in `content/site.ts` but is not used by the
  menu; that host serves the same app (see §14).
- Campaign name `CHURCH.campaign = "Project Nehemiah"`; goal `CHURCH.goal` (default 12,000,000, overridable by
  `NEXT_PUBLIC_GOAL`); base raised ₱2,700,000 (`NEXT_PUBLIC_BASE_RAISED`) — `lib/config.ts`.
- Header item "Donate" → `/donate` (internal link) — [site-header.md](../components/site-header.md).

## 3. Existing Layout

**Verified**, top to bottom inside `<main id="main">`:
1. Hero (crimson gradient), 2-column grid:
   - left: `h1` "Help us build a home for every neighbor.", intro "Gospel Christian Church is raising
     ₱12,000,000 for Project Nehemiah, our new church building in Frances, Calumpit. …", CTAs **"Give to Project
     Nehemiah"** (`#give`) and "How giving works" (`#how`), gold-bordered verse (2 Corinthians 9:7);
   - right: translucent card with `ChurchProgress` SVG, % raised, "₱X of ₱Y", stats row (still needed;
     confirmed gifts online, shown only when > 0).
2. `section#progress` – `h2` "Project Nehemiah", intro, card with the progress bar (label "Project Nehemiah
   progress", 25/50/75% tick marks) and the raised / to-go row.
3. `section#how` – "How your gift reaches the building", 3 numbered step cards (step 2: "Use GCash, Maya, Bank
   Transfer, or Cash at Church. …").
4. **`section#ways` – "Ways to send your gift"**: one card per payment method (GCash, Maya, Bank Transfer, Cash
   at Church) with its details, a copy button where a number exists, and its note. Two columns on wide
   screens, one on narrow screens. Shown **before** the form.
5. `section#give` – 2-column grid: card containing `GiveForm` | sticky `aside` with, in order: "Give with
   confidence" trust card, **`FundraisingPercent`**, "Giving wall".
6. `section#visit` – "Join us", schedule cards from `SCHEDULE`.
7. Mobile-only fixed **"Give to Project Nehemiah"** link to `#give`.

## 4. Existing Design System

**Verified:** Tailwind classes in `app/donate/page.tsx` plus shared strings from `lib/ui.ts`: `wrap`,
`brandGradient` (hero), `h2`, `sub`, `muted`, `card`, `cardBox`, `cardTitle`, `cards`, `btn.primaryLg`,
`btn.ghostLgOnBrand`. A local `step` string draws the numbered step cards (CSS counter). The payment cards use
`card` + `cardTitle` in a `grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))]` grid. The `aside` is
`sticky top-24` (96px). Exact tints from the original design are kept as arbitrary values. The only
page-related hand-written CSS is `.grecaptcha-badge { visibility: hidden }` in the base layer of
`app/globals.css` (see §12).

## 5. Existing Components to Reuse

**Verified:** `ChurchProgress` (`pct`), `GiveForm` (client; form + receipt + reCAPTCHA),
`PaymentDetails` (detail rows, copy button and note for one payment method; used by the `#ways` cards and by
`GiveForm`), `FundraisingPercent` ([fundraising-percent.md](../components/fundraising-percent.md)),
`CopyButton`. Percentage helpers `fundedPercent()` / `formatPercent()` in `lib/progress.ts`.

## 6. Existing Assets

- **Verified:** no images; the church illustration is inline SVG (`components/ChurchProgress.tsx`). Logos come
  from the shared header/footer.
- **Owner input required:** any Project Nehemiah imagery (none provided).

## 7. Content Requirements

**Verified content sources:**
- Campaign name, goal, base amount, church email: `CHURCH` in `lib/config.ts`.
- Payment methods: `PAYMENT_METHODS` in `lib/config.ts`. Ids (stored with pledges, validated by the server)
  and donor-facing labels:

  | id (stored, unchanged) | label (shown) | Details from |
  | --- | --- | --- |
  | `GCash` | GCash | `NEXT_PUBLIC_GCASH_NUMBER` |
  | `Maya` | Maya | `NEXT_PUBLIC_MAYA_NUMBER` |
  | `Bank transfer` | Bank Transfer | `NEXT_PUBLIC_BANK_DETAILS` |
  | `Cash at church` | Cash at Church | fixed text in `lib/config.ts` ("Church treasurer or offering envelope") |

  Details use the format `Label: value · Label: value`; an empty or `XXX` placeholder value shows "Please
  email … for the details". No account details are written in components.
- `SCHEDULE`, `AMOUNTS` + `AMOUNT_NOTES` (₱500 "A brick" … ₱50,000 "A foundation stone") — `lib/config.ts`.
- Other copy (headings, steps, trust bullets, verse, section intros) is in `app/donate/page.tsx` and
  `components/GiveForm.tsx`.
- Giving Wall: last 8 confirmed gifts, "Anonymous" when requested, message truncated to 60 characters; built
  by `summary()` from id, name, amount and message only — **never email**.
- Donor email is **optional** (see §13).

**Owner confirmation requested:** see §14 item 5 for wording introduced during implementation.

## 8. Proposed Page Structure

No change proposed; §3 is the implemented structure.

## 9. Responsive Behavior

**Verified:** ≤800px (`max-md:`): hero grid, the give grid and name/email stack; steps become 1 column; the
`aside` stops being sticky (the percentage then sits directly above the Giving Wall under the form); the fixed
give bar appears and `<body>` gets 70px bottom padding. Payment cards go from 2 columns to 1 below a 900px viewport (two 420px columns + gap need 860px of content).
≤420px (`max-xs:`): amount buttons 2 columns. Print: header, footer, buttons and the give bar are hidden.

## 10. Accessibility

**Verified:** progress bar `role="progressbar"` with `aria-label="Project Nehemiah progress"` and
`aria-valuenow/min/max`; `ChurchProgress` SVG `role="img"` + label; form uses `fieldset`/`legend`, labelled
inputs ("Email (optional)"), visually hidden radio inputs with focus outlines, `role="alert"` error,
`aria-live` receipt and copy buttons. `FundraisingPercent` gives screen readers one sentence
("22.5% of the ₱12,000,000 Project Nehemiah goal raised"); the large number is `aria-hidden`. reCAPTCHA v3
adds no challenge or widget to interact with.

## 11. SEO / Metadata

**Verified (rendered):**
- Title **"Donate to Project Nehemiah | Gospel Christian Church"** (`DONATE_TITLE` in `lib/seo.ts`).
- Description **"Help Gospel Christian Church IEMELIF raise ₱12,000,000 for Project Nehemiah, our new church
  building in Frances, Calumpit, Bulacan."** (`DONATE_DESCRIPTION`; the amount comes from `CHURCH.goal`, so it
  follows `NEXT_PUBLIC_GOAL`).
- Canonical **`/donate`**; `/donate` is in the sitemap (priority 0.7); `/support` is not (it returns 404).
- The temporary Home (`/`) uses the same title/description with canonical `/`.
- No `og:image` (see [README.md](README.md)).

## 12. Implementation Constraints

- Keep the current visual design; styling is Tailwind (`CLAUDE.md` §6).
- **Payment details** only from `PAYMENT_METHODS` / `NEXT_PUBLIC_*`; never hard-coded or invented.
- **Payment method ids must not change** (`GCash`, `Maya`, `Bank transfer`, `Cash at church`): they are stored
  in existing pledges, validated by the server, shown in `/admin`, and compared in `PaymentDetails`
  (`id === "Bank transfer"` selects "Copy account number"). Change the `label` for display instead.
- **Email** is optional; never show it publicly (Giving Wall, public API, page output).
- **Google reCAPTCHA v3** (invisible, score-based; no checkbox):
  - Action `record_gift` (`RECAPTCHA_ACTION`, `lib/config.ts`), minimum score `DEFAULT_RECAPTCHA_MIN_SCORE =
    0.5` (`lib/recaptcha.ts`), overridable with `RECAPTCHA_MIN_SCORE` (0–1).
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is public (browser); `RECAPTCHA_SECRET_KEY` is **server-only**, read at
    runtime, never logged, returned, committed or included in client code. No real key belongs in the repo
    or docs.
  - Without the secret the server rejects every gift (fails closed); without the site key the browser sends
    no token and the server rejects the gift.
  - The reCAPTCHA badge is hidden with `.grecaptcha-badge { visibility: hidden }`; Google allows this only if
    the form shows its notice ("This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of
    Service apply."), which `GiveForm` renders when a site key is set. Keep both together.
- Server validation in `app/api/gifts/route.ts` is authoritative; client validation stays minimal.
- `NEXT_PUBLIC_*` values are build-time; changing them requires a redeploy.

## 13. Data / Dependencies

**Verified:**
- **Read:** `summary()` (`lib/store.ts`) → `{ raised, wall, donors, pledged }` (raised = base + confirmed).
  `pct = fundedPercent(raised, CHURCH.goal)` (`lib/progress.ts`: `raised / goal × 100`, capped at 100, 0 when
  nothing is raised) feeds both the hero and `FundraisingPercent`, displayed with `formatPercent()`.
- **Write:** `GiveForm` → gets a reCAPTCHA v3 token (`grecaptcha.execute(siteKey, { action: "record_gift" })`)
  → `POST /api/gifts` with `{ amount, freq, method, name, email, message, anon, recaptchaToken }`.
- **Server (`app/api/gifts/route.ts`), in order:**
  1. Field validation: name required (trimmed, truncated to 100); email **optional** — if non-empty after
     trimming/truncating to 120 it must match `^\S+@\S+\.\S+$`; amount rounded, ₱1–₱12,000,000; method must be
     one of `PAYMENT_IDS`; `freq` "Monthly" or "One-time"; message truncated to 300. Invalid → 400, and Google is
     not contacted.
  2. `verifyRecaptcha(recaptchaToken)` (`lib/recaptcha.ts`): posts the secret and token to Google's
     `siteverify`; requires `success: true`, action `record_gift`, score ≥ threshold. Missing token → 400;
     failed / wrong action / low score → 403; secret missing or Google unreachable → 503 (server logs only the
     failure type). Nothing is saved on any failure.
  3. Save as `pending` via `update()`; response `{ ref, amount, freq, method }` (no email, token or secret).
- The stored gift never contains the token; an omitted email is stored as `""`.
- `GET /api/gifts` returns `summary()` (no email); no page calls it.
- Storage: `DATA_DIR/gifts.json` (Cloud Run: bucket at `/data`, max 1 instance).
- **External service:** Google reCAPTCHA (browser script `https://www.google.com/recaptcha/api.js` and server
  call to `https://www.google.com/recaptcha/api/siteverify`).

**Tests (Google always mocked; no real requests):** `app/api/gifts/route.test.ts` (optional/valid/invalid
email, validation unchanged, payment ids, reCAPTCHA cases, token not stored, secret never returned, no email
in public data), `lib/recaptcha.test.ts`, `lib/progress.test.ts`, `components/FundraisingPercent.test.ts`,
`lib/config.test.ts` (campaign, ids/labels), `lib/nav.test.ts`, `app/sitemap.test.ts`.

## 14. Open Questions / Owner Input

1. **`support.gcciemelif.website`:** it serves the same app (so `support.…/` shows `/`, and `support.…/support`
   is 404). `LINKS.support` is unused. Keep, redirect or retire the subdomain? (Not implemented.)
2. **reCAPTCHA setup (owner action):** add real keys to `.env.local` and GitHub (`vars` / `secrets`), register
   the site's domains in the reCAPTCHA console, and rotate the previously exposed secret. Until then gifts
   cannot be recorded in that environment.
3. **Badge:** keep it hidden with the notice (current), or show Google's badge?
4. **Privacy:** Google now processes visitor signals on the Donate page and on `/`; should the site add a
   privacy notice?
5. **Wording introduced during implementation (please confirm):** "Donate to Project Nehemiah" (title);
   "…for Project Nehemiah, our new church building in Frances, Calumpit…" (hero and description — combines the
   original "new church building in Frances, Calumpit" copy with the owner's statement that Project Nehemiah is
   the church building project); "Give to Project Nehemiah" (CTAs); "Ways to send your gift" and its intro;
   "… of the ₱12,000,000 Project Nehemiah goal raised" (percentage).
6. `/admin` still shows the stored method id (e.g. "Bank transfer"), not the label. Change?

## 15. Implementation Plan

Done (2026-09-29): steps for `/donate`, header, Project Nehemiah naming, payment methods, optional email,
fundraising percentage, reCAPTCHA v3, `/support` removal, sitemap/metadata, site description.
Remaining: the owner actions in §14.

## 16. References

`app/donate/page.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/api/gifts/route.ts`, `components/GiveForm.tsx`,
`components/PaymentDetails.tsx`, `components/FundraisingPercent.tsx`, `components/ChurchProgress.tsx`,
`components/CopyButton.tsx`, `content/site.ts`, `lib/config.ts`, `lib/progress.ts`, `lib/recaptcha.ts`,
`lib/seo.ts`, `lib/store.ts`, `app/globals.css`, `.env.example`, `Dockerfile`, `.github/workflows/deploy.yml`,
tests listed in §13.
