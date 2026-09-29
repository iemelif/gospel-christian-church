# SiteFooter

Source: `components/SiteFooter.tsx` · Type: Server · Rendered by: `app/layout.tsx`

## 1. Purpose

**Verified:** site-wide footer with small logos, church name and address, service schedule summary,
giving-questions email, social links and copyright.

## 2. Current Implementation

**Verified:** a single server component with no props; reads configuration modules directly and renders
`SocialIcon` for each social entry.

## 3. Props / Inputs

None.

## 4. Data Dependencies

**Verified:**
- `content/site.ts`: `LOGOS` (images), `LINKS.iemelif` / `LINKS.gcc` (logo links), `SITE.name`,
  `ADDRESS.display`, `SOCIAL` (Facebook only).
- `lib/config.ts`: `SCHEDULE` (each rendered as "<day without 'Every '> <time>", joined with " · ") and
  `CHURCH.email` (from the build-time variable `NEXT_PUBLIC_CHURCH_EMAIL`, with a code fallback).
- `new Date().getFullYear()` for the copyright year.

## 5. Pages / Components Using It

**Verified:** rendered once in `app/layout.tsx` after the page content, so on every route including
`/admin`.

## 6. Layout and Structure

**Verified:** `<footer>` → `wrap` + 3-column grid (`grid-cols-[auto_1fr_auto]`, gap 32px) with: (1) logo group
(IEMELIF logo link, new tab; GCC logo link); (2) bold church name, `address`, schedule paragraph, "Questions
about giving?" + mailto link; (3) only when `SOCIAL` is non-empty: bold "Follow us" + list of round social
links. Then a `wrap` copyright row "© <year> <SITE.name>" with a top border.

## 7. Design System / CSS

**Verified:** Tailwind classes in `components/SiteFooter.tsx`: `relative bg-paper pt-10 pb-5 text-[14px]
text-ink`, the 3px crimson/gold/blue stripe on top via `stripeBefore` (`lib/ui.ts`), logos `h-12 w-auto`,
column headings `text-brand` (local `heading` string), paragraphs `mt-0 mb-1.5 text-mute` (local `line`
string), links `text-blue`, social links `size-10 rounded-full bg-brand text-white hover:bg-gold
hover:text-ink`, copyright row `mt-[22px] border-t border-line pt-3.5 text-[13px] text-mute`.

## 8. Responsive Behavior

**Verified:** the three-column grid is kept at **every** width (see §13). Hidden when printing (`print:hidden`).
At ≤800px `<body>` has 70px bottom padding (`max-md:pb-[70px]` in `app/layout.tsx`), intended for the Donate
page's fixed give bar.

## 9. Accessibility

**Verified:** `address` element; logo links have `aria-label`s; social links have
`aria-label="<SITE.shortName> on <network>"` with an `aria-hidden` icon; external social links use
`target="_blank" rel="noopener noreferrer me"`; IEMELIF logo link uses `rel="noopener"`.

## 10. Client / Server Behavior

**Verified:** server component, no state or browser APIs. On statically prerendered routes it is rendered at
build time; on dynamic routes (`/`, `/donate`) on each request.

## 11. Reuse Guidelines

Edit address, social links and logos in `content/site.ts`; schedule and email in `lib/config.ts` /
environment. Don't render it in pages.

## 12. Modification Constraints

`ADDRESS.display` and the structured fields in `ADDRESS` (used by JSON-LD in `app/layout.tsx`) must be kept
in sync manually. Adding a social network requires `SocialIcon` changes (see `README.md`).

## 13. Known Issues / Technical Debt

**Verified, not fixed:**
- The copyright year is computed at render time, so on statically prerendered pages (e.g. `/officers`,
  `/about`) it is frozen at the last build and only updates on redeploy.
- The email line is labelled "Questions about giving?" on every page, including non-giving pages.
- The ≤800px body bottom padding (`max-md:pb-[70px]` on `<body>`) is global, so every page (not only the
  Donate page with its fixed give bar) gets extra space below the footer on mobile.
- **The footer does not stack on narrow screens.** The original CSS contained a ≤800px one-column rule, but it
  was defined before the base grid rule and never took effect. The Tailwind version deliberately reproduces
  the real (three-column) behaviour. Whether it should stack is an open design decision.

## 14. Open Questions

1. **Owner input required:** should the footer email be presented as a general contact address?
   (Related: `docs/pages/contact.md` §14.)

## 15. Implementation Notes

Uses `next/image` for logos without `priority` (below the fold).

## 16. References

`components/SiteFooter.tsx`, `components/SocialIcon.tsx`, `app/layout.tsx`, `content/site.ts`,
`lib/config.ts`, `lib/ui.ts`.
