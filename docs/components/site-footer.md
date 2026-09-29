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

**Verified:** `footer.site-footer` → `div.wrap.foot-grid` with three columns: (1) `div.foot-logos` (IEMELIF
logo link, new tab; GCC logo link); (2) `b` church name, `address`, `p.sched` schedule, `p` "Questions about
giving?" + mailto link; (3) only when `SOCIAL` is non-empty: `b` "Follow us" + `ul.social`. Then
`div.wrap.copy` "© <year> <SITE.name>".

## 7. Design System / CSS

**Verified:** "footer" section of `app/globals.css`: `.site-footer` (`--paper` background),
`.site-footer::before` (tri-colour stripe), `.foot-grid` (`auto 1fr auto`), `.foot-logos`, `.logo-sm`
(48px high), `.social` (40px round `--brand` buttons, gold on hover), `.copy`. Links in the footer are
`--blue`. `.sched`, `.iemelif`, `.gcc` classes have no CSS rules (hooks only).

## 8. Responsive Behavior

**Verified:** ≤800px `.foot-grid` becomes one column. Hidden when printing. At ≤800px `body` gets 70px
bottom padding (rule in the "donation redesign" media query, meant for the Support page's fixed `.give-bar`).

## 9. Accessibility

**Verified:** `address` element; logo links have `aria-label`s; social links have
`aria-label="<SITE.shortName> on <network>"` with an `aria-hidden` icon; external social links use
`target="_blank" rel="noopener noreferrer me"`; IEMELIF logo link uses `rel="noopener"`.

## 10. Client / Server Behavior

**Verified:** server component, no state or browser APIs. On statically prerendered routes it is rendered at
build time; on dynamic routes (`/`, `/support`) on each request.

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
- The ≤800px `body { padding-bottom: 70px }` is global, so every page (not only those with `.give-bar`)
  gets extra space below the footer on mobile.

## 14. Open Questions

1. **Owner input required:** should the footer email be presented as a general contact address?
   (Related: `docs/pages/contact.md` §14.)

## 15. Implementation Notes

Uses `next/image` for logos without `priority` (below the fold).

## 16. References

`components/SiteFooter.tsx`, `components/SocialIcon.tsx`, `app/layout.tsx`, `content/site.ts`,
`lib/config.ts`, `app/globals.css`.
