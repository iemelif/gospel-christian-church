# Contact Us

Route: `/contact` · File: `app/contact/page.tsx` · Status: **Placeholder ("Coming soon")**

## 1. Purpose

- **Verified (`information.md` requirement):** "Contact Us – leave it blank for now".
- **Owner input required:** which contact channels to show.

## 2. Current State

**Current (2026-09-30):** `PageHero` → `<ComingSoon>` card (brand stripe, cross emblem, "Coming soon" label, title "Our contact page is on its way" and
text from `COMING_SOON.contact` in `content/coming-soon.ts`, Donate + Facebook buttons, address) → `JoinUs`. Still noindex.
When real content arrives, replace the card (and remove its `COMING_SOON` entry). The notes below describe the earlier empty page.

**Verified:** renders only `PageHero` with title "Contact Us" and an empty content container (`wrap` + `pageBody`); noindex.

## 3. Existing Layout

**Verified:** `<main id="main">` → `PageHero title="Contact Us"` (no intro) → empty
``<div className={`${wrap} ${pageBody}`} />``.

## 4. Existing Design System

**Verified:** Tailwind CSS v4 (see `CLAUDE.md` §6). `PageHero` banner (crimson gradient, `text-onbrand`), then
``<div className={`${wrap} ${pageBody}`}>`` (1080px column, `pt-10 pb-16`) from `lib/ui.ts`.
Shared strings available for future content: `card`, `cards`, `h2`, `sub`, `muted` (`lib/ui.ts`). The round
social-link style exists only inside `components/SiteFooter.tsx` (not a shared string), and there is no
general `address` style (the footer's `address` uses its own classes).

## 5. Existing Components to Reuse

**Verified available:** `PageHero`, `SocialIcon`, `CopyButton` (e.g. for an email address).

## 6. Existing Assets

**Verified:** no map image or embed. **Unknown:** whether a map is wanted (embeds from other sites would
need a CSP/privacy decision — none configured today).

## 7. Content Requirements

**Verified contact data already in code:**
- Address: `ADDRESS.display` "GOSPEL CHRISTIAN CHURCH IEMELIF, Zone 7 Frances, Calumpit, 3003 Bulacan"
  (`content/site.ts`).
- Email: `CHURCH.email` from `NEXT_PUBLIC_CHURCH_EMAIL` (`lib/config.ts`); the footer labels it
  "Questions about giving?".
- Facebook: `https://www.facebook.com/gcc1984` (`SOCIAL`).
- Service schedule: `SCHEDULE` (`lib/config.ts`).

**Owner input required:** phone number (none in code), whether the email above is the general contact
address, office hours, map, and whether a contact form is wanted (none exists; there is no email-sending
service in the project).

## 8. Proposed Page Structure

**Proposed (pattern only):** `PageHero` → `cards` with address, email, Facebook, service times → optional
map. Reuse existing data; don't duplicate values.

## 9. Responsive Behavior

**Verified:** site breakpoints apply; the shared `cards` grid auto-fits (min 260px).

## 10. Accessibility

Proposed: `address` element, descriptive link text, `aria-label` on icon-only social links (as the footer does).

## 11. SEO / Metadata

**Verified (rendered):** title "Contact Us | Gospel Christian Church", placeholder description, canonical
`/contact`, noindex; not in sitemap. Church address is already in the site-wide JSON-LD (`app/layout.tsx`).
**Proposed:** index + sitemap once content exists.

## 12. Implementation Constraints

No new dependencies or third-party embeds without approval; a contact form would need a backend decision.

## 13. Data / Dependencies

`content/site.ts` (`ADDRESS`, `SOCIAL`, `NAV`), `lib/config.ts` (`CHURCH.email`, `SCHEDULE`),
`components/PageHero.tsx`, `components/SocialIcon.tsx`, `lib/seo.ts`.

## 14. Open Questions / Owner Input

1. Which contact details to show; phone number?
2. Is `CHURCH.email` the general contact address or giving-only?
3. Map (static image, link, or embed)?
4. Contact form wanted?

## 15. Implementation Plan

Blocked on owner input.

## 16. References

`app/contact/page.tsx`, `content/site.ts`, `lib/config.ts`, `components/SiteFooter.tsx`,
`components/SocialIcon.tsx`, `app/layout.tsx`, `information.md`.
