# Support (Church Building Fund)

Route: `/support` · File: `app/support/page.tsx` (component `SupportPage`) · Status: **Complete**

## 1. Purpose

**Verified:** the giving page for the Church Building Fund. Donors record a pledge, receive a reference
number and payment instructions, then send money outside the site (GCash, Maya, bank transfer, cash at
church). No payment is processed online. The treasurer confirms received gifts in `/admin`
([admin.md](admin.md)); only confirmed gifts count toward the displayed total.

## 2. Current State

- **Verified:** fully implemented; `export const dynamic = "force-dynamic"` so totals are read on every request.
- **Verified:** moved here from `app/page.tsx` on 2026-09-29 (uncommitted at time of writing), replacing an
  older, simpler copy. `/` currently renders this same component ([home.md](home.md)).
- **Verified:** goal ₱12,000,000 and base raised ₱2,700,000 are defaults in `lib/config.ts`, overridable by
  `NEXT_PUBLIC_GOAL` / `NEXT_PUBLIC_BASE_RAISED` at build time.

## 3. Existing Layout

**Verified**, top to bottom inside `<main id="main">`:
1. `.hero` (crimson gradient), `.grid` 2 columns:
   - left: `h1` "Help us build a home for every neighbor.", intro paragraph with goal and %, CTAs
     "Give to the building fund" (`#give`) and "How giving works" (`#how`), `.verse` (2 Corinthians 9:7);
   - right: `.church` card with `ChurchProgress` SVG, % raised, "₱X of ₱Y", `.church-stats` (still needed;
     confirmed gifts online, shown only when > 0).
2. `section#progress` – `h2` = campaign name, `.sub`, `.card` with `.bar` (progressbar, 25/50/75% marks) and
   `.meta` (raised / to go).
3. `section#how` – "How your gift reaches the building", 3 numbered `.steps`.
4. `section#give` – `.form` grid: `.card.form-card` containing `GiveForm` | `aside.side` with "Give with
   confidence" trust card (church email) and "Giving wall".
5. `section#visit` – "Join us", `.cards` from `SCHEDULE`.
6. `a.give-bar` – mobile-only sticky "Give to the building fund" link to `#give`.

## 4. Existing Design System

**Verified** classes (all in `app/globals.css`, "donation redesign" section plus base rules): `.hero`,
`.grid`, `.verse`, `.btn .lg .ghost .full`, `.church`, `.pct`, `.church-stats`, `.bar`, `.marks`, `.meta`,
`.steps`, `.form`, `.form-card`, `.side` (sticky at top 96px), `.trust`, `.gift`, `.amounts`, `.chips`,
`.how`, `.receipt`, `.give-bar`. Gold for CTAs/progress, crimson for step numbers and selected states.

## 5. Existing Components to Reuse

- **Verified:** `ChurchProgress` (`pct` prop), `GiveForm` (client; self-contained 3-step form + receipt),
  `CopyButton` (used by `GiveForm`).
- **Proposed:** the hero progress card, giving wall and schedule cards are inline JSX; extract them if another
  page needs them (e.g. a Home teaser) rather than copying.

## 6. Existing Assets

- **Verified:** no images; the church illustration is inline SVG (`components/ChurchProgress.tsx`, colours
  hard-coded `#deb942` / `#7f1f36`). Logos come from the shared header/footer.

## 7. Content Requirements

**Verified content sources:**
- Copy (headings, steps, trust bullets, verse) is hard-coded in `app/support/page.tsx`.
- `CHURCH` (name, email, goal, baseRaised, campaign), `SCHEDULE`, `AMOUNTS` + `AMOUNT_NOTES`
  (₱500 "A brick" … ₱50,000 "A foundation stone"), `PAYMENT_METHODS` — `lib/config.ts`.
- Payment details come from `NEXT_PUBLIC_GCASH_NUMBER`, `NEXT_PUBLIC_MAYA_NUMBER`, `NEXT_PUBLIC_BANK_DETAILS`
  (format `Label: value · Label: value`); empty or `XXX` placeholder → "Please email … for the details".
- Giving wall: last 8 confirmed gifts, "Anonymous" when requested, message truncated to 60 characters.

## 8. Proposed Page Structure

No change proposed. The current structure (§3) is the reference for other pages.

## 9. Responsive Behavior

**Verified (CSS):** ≤800px: hero grid, `.form` and `.two` stack; `.steps` become 1 column; `.side` stops being
sticky; `.give-bar` appears fixed at the bottom and `body` gets 70px bottom padding. ≤420px: amount buttons
2 columns. Print: header, footer, buttons and `.give-bar` hidden (receipt printing).

## 10. Accessibility

**Verified:** progress bar has `role="progressbar"`, `aria-label`, `aria-valuenow/min/max`; decorative marks
`aria-hidden`; `ChurchProgress` SVG has `role="img"` + label; form uses `fieldset`/`legend`, labelled inputs,
visually-hidden radio inputs with `:focus-visible` outlines, `role="alert"` error, `aria-live` receipt and
copy buttons; gold focus outline inside the hero.

## 11. SEO / Metadata

**Verified (rendered):** title "Church Building Fund | Gospel Christian Church"; description "Help Gospel
Christian Church IEMELIF raise ₱12,000,000…" (amount hard-coded in the string, not from `CHURCH.goal`);
canonical `/support`; in sitemap (priority 0.7); no `og:image` (see [README.md](README.md)).

## 12. Implementation Constraints

- Treat as stable reference; don't change markup/behaviour as a side effect of other work.
- Server validation in `app/api/gifts/route.ts` is authoritative; client validation is intentionally minimal
  (see §13). Keep error messages consistent if either side changes.
- `NEXT_PUBLIC_*` values are build-time; changing them requires a redeploy.

## 13. Data / Dependencies

**Verified:**
- Read: `summary()` in `lib/store.ts` → `{ raised, wall, donors, pledged }` (raised = base + confirmed).
- Write: `GiveForm` → `POST /api/gifts` → saved as `pending` in `gifts.json` via `update()`; returns ref
  `GCC-` + 6 uppercase hex characters; client then calls `router.refresh()`.
- Server rules (`app/api/gifts/route.ts`): name required (trimmed, **truncated** to 100 chars); email must
  match `^\S+@\S+\.\S+$` after truncation to 120 chars; amount rounded, must be ₱1–₱12,000,000; method must be
  one of `PAYMENT_IDS`; `freq` is "Monthly" or else "One-time"; message truncated to 300 chars. Errors are
  returned as `{ error }` with status 400 (500 if saving fails).
- Client rules (`GiveForm`): only checks amount > 0; name/email errors come back from the server and are
  shown in the `role="alert"` line. Defaults: ₱1,000, One-time, first payment method (GCash).
- `GET /api/gifts` also exists and returns `summary()`, but **no page calls it** (pages call `summary()`
  directly).
- Storage: `DATA_DIR/gifts.json` (Cloud Run: GCS bucket mounted at `/data`, max 1 instance).

## 14. Open Questions / Owner Input

1. Will `support.gcciemelif.website` redirect to `/support` once Home replaces `/`? ([home.md](home.md))
2. Meta description hard-codes ₱12,000,000; should it follow `NEXT_PUBLIC_GOAL`? (**Unknown** whether the goal
   will change.)

## 15. Implementation Plan

None required for this phase. Future: tie meta description to `CHURCH.goal` if approved.

## 16. References

`app/support/page.tsx`, `app/page.tsx`, `components/GiveForm.tsx`, `components/ChurchProgress.tsx`,
`components/CopyButton.tsx`, `lib/config.ts`, `lib/store.ts`, `app/api/gifts/route.ts`, `app/globals.css`,
`.env.example`, `README.md`.
