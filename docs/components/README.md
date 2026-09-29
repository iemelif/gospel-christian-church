# Component documentation index

All components live in `components/` (flat folder, one default export per file, PascalCase). Styling is
**Tailwind CSS v4** utility classes in the markup; repeated patterns come from the shared class strings in
`lib/ui.ts`, and styles used by one component only are local string constants in that file (see `CLAUDE.md`
§6). There are no component-specific CSS files. Facts are labelled **Verified**, **Proposed**, **Unknown** or
**Owner input required**, as in `docs/pages/`.

Verified against the working tree on branch `feat-ai-powered-integration`, 2026-09-29.

| Component | Source | Type | Primary purpose | Used by (pages) | Documentation |
| --- | --- | --- | --- | --- | --- |
| `SiteHeader` | `components/SiteHeader.tsx` | **Client** | Sticky site header: logos, brand, dropdown nav, mobile menu | Every page, via `app/layout.tsx` | [site-header.md](site-header.md) |
| `SiteFooter` | `components/SiteFooter.tsx` | Server | Footer: logos, address, schedule, email, social links | Every page, via `app/layout.tsx` | [site-footer.md](site-footer.md) |
| `GiveForm` | `components/GiveForm.tsx` | **Client** | 3-step pledge form + receipt; reCAPTCHA v3; posts to `/api/gifts` | `/donate` (and `/`, which renders the Donate page) | [give-form.md](give-form.md) |
| `PaymentDetails` | `components/PaymentDetails.tsx` | Server* | Detail rows, copy button and note for one payment method (from `PAYMENT_METHODS`) | `/donate` "Ways to send your gift" cards; inside `GiveForm` | This file (below) |
| `FundraisingPercent` | `components/FundraisingPercent.tsx` | Server | Share of the Project Nehemiah goal raised, above the Giving Wall | `/donate` (and `/`) | [fundraising-percent.md](fundraising-percent.md) |
| `CopyButton` | `components/CopyButton.tsx` | **Client** | Copies a string to the clipboard, shows "Copied" | Inside `GiveForm` and `PaymentDetails` | [copy-button.md](copy-button.md) |
| `ChurchProgress` | `components/ChurchProgress.tsx` | Server | Church outline SVG filled to a percentage | `/donate` (and `/`) | [church-progress.md](church-progress.md) |
| `OfficerBoard` | `components/OfficerBoard.tsx` | Server | Officer board in 3 rows for one term | `/officers`, `/history/[term]` | [officer-board.md](officer-board.md) |
| `PersonCard` | `components/PersonCard.tsx` | Server | One person card (`<li>`): avatar, name, roles | `/leadership`; inside `OfficerBoard` | [person-card.md](person-card.md) |
| `Avatar` | `components/Avatar.tsx` | Server | Person image, or built-in gray silhouette | Inside `PersonCard` only | [avatar.md](avatar.md) |
| `PageHero` | `components/PageHero.tsx` | Server | Crimson inner-page banner with `h1` + optional intro | `/about`, `/ministries`, `/contact`, `/leadership`, `/officers`, `/history/[term]` | This file (below) |
| `SocialIcon` | `components/SocialIcon.tsx` | Server | Inline SVG icon for a social network | Inside `SiteFooter` only | This file (below) |

\* `PaymentDetails` has no directive: it is a Server Component on the Donate page and part of the client tree
inside `GiveForm`.

"Server" = no `"use client"` directive, so it renders as a React Server Component. It can still be rendered
inside a client component tree (`CopyButton` is only ever rendered by the client `GiveForm`).

Categories:
- **Shared layout:** `SiteHeader`, `SiteFooter` (rendered once in `app/layout.tsx`; never render them in pages).
- **Giving / donation:** `GiveForm`, `PaymentDetails`, `FundraisingPercent`, `CopyButton`, `ChurchProgress`.
- **People / officers:** `OfficerBoard` → `PersonCard` → `Avatar`.
- **Generic building blocks:** `PageHero`, `SocialIcon`.
- **Data-coupled:** `SiteHeader` / `SiteFooter` (`content/site.ts`, `lib/config.ts`), `GiveForm`
  (`lib/config.ts`, `/api/gifts`), `OfficerBoard` / `PersonCard` (`content/officers.ts`, `lib/officers.ts`).

Not components but page-level UI that could become components if reused (**Proposed**, only on request):
the Donate page's hero progress card, giving wall and schedule cards (inline in `app/donate/page.tsx`), and
the admin dashboard UI (inline in `app/admin/page.tsx`).

## PageHero (no dedicated file)

- **Verified:** `PageHero({ title: string; intro?: string })` renders a banner `div` → `wrap` → `h1` and an
  optional `p`. It provides the page's only `h1`. Tailwind classes: crimson diagonal gradient
  (`bg-[linear-gradient(135deg,…brand,…brand-2)]`, same as `brandGradient` in `lib/ui.ts`), `text-onbrand`,
  `pt-9 pb-10`; heading `text-[length:clamp(30px,5vw,46px)]`; intro `mt-2.5 mb-0 text-[#f4dbe1]`; focus outline
  turns gold inside it (`[&_:focus-visible]:outline-gold`).
- **Verified:** used by every inner page; the Donate page has its own larger hero markup instead.
- **Reuse:** standard opening for any new inner page, followed by ``<div className={`${wrap} ${pageBody}`}>``.

## PaymentDetails (no dedicated file)

- **Verified:** `PaymentDetails({ method, className })` renders one payment method from `PAYMENT_METHODS`: a
  `dl` of `[label, value]` rows (`dt` muted, 118px min width; `dd` bold, wraps long values), a `CopyButton`
  when `method.copy` is set ("Copy account number" for id `Bank transfer`, otherwise "Copy number"), and the
  method's note. Every value comes from configuration (`lib/config.ts`, `NEXT_PUBLIC_*`); nothing is hard-coded.
- **Verified:** used by the Donate page's "Ways to send your gift" cards (heading = `method.label`) and by
  `GiveForm`'s `MethodDetails` (dashed box under the chips and on the receipt). The caller supplies the wrapper
  classes.
- **Constraint:** the copy-label choice compares the **id** `Bank transfer`; ids must not change.

## SocialIcon (no dedicated file)

- **Verified:** `SocialIcon({ icon: "facebook" })` returns a 22×22 `aria-hidden` SVG (sized by its `width`/`height`
  attributes, no classes; colour comes from the link via `currentColor`); any other value
  returns `null` (unreachable because the prop type only allows `"facebook"`). The accessible name comes from
  the surrounding link's `aria-label` in `SiteFooter`.
- **Adding a network:** add a case here, widen the `icon` type, and add an entry to `SOCIAL` in
  `content/site.ts` (whose type is also `"facebook"` only).

## Cross-component findings

See each file's §13. Summary: `SiteHeader` has two lint-flagged effects and incomplete menu keyboard
support; `SiteFooter`'s copyright year is frozen at build time on static pages; `ChurchProgress` uses a
fixed SVG id `cp`; `Avatar` alt text says "Photo of" for placeholder images; `GiveForm` shows a
misleading error for non-JSON server responses; `SiteFooter` keeps three columns on narrow screens (a
pre-migration quirk preserved on purpose). Tailwind `hover:` styles apply only on devices that support hover.
