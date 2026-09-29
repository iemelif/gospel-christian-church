# Ministries

Route: `/ministries` · File: `app/ministries/page.tsx` · Status: **Placeholder**

## 1. Purpose

- **Verified (`information.md` requirement):** "Ministries – leave it blank for now".
- **Owner input required:** which ministries to present and how.

## 2. Current State

**Verified:** renders only `PageHero` with title "Ministries" and an empty content container (`wrap` + `pageBody`); noindex.

## 3. Existing Layout

**Verified:** `<main id="main">` → `PageHero title="Ministries"` (no intro) → empty
``<div className={`${wrap} ${pageBody}`} />``.

## 4. Existing Design System

**Verified:** Tailwind CSS v4 (see `CLAUDE.md` §6). `PageHero` banner (crimson gradient, `text-onbrand`), then
``<div className={`${wrap} ${pageBody}`}>`` (1080px column, `pt-10 pb-16`) from `lib/ui.ts`.
Shared strings available for future content: `card` / `cards` grid, `h2`, `sub` (`lib/ui.ts`).

## 5. Existing Components to Reuse

**Verified available:** `PageHero`, `PersonCard` / `Avatar` (for ministry leaders).

## 6. Existing Assets

**Verified:** none specific. **Owner input required** for photos.

## 7. Content Requirements

- **Owner input required:** ministry names, descriptions, meeting times, leaders.
- **Verified related data (not a ministry list):** `LEADERSHIP_GROUPS` "Ministry & Organization Leaders" and
  role names in `content/officers.ts` (e.g. President of Young Adult / Youth / Kababaihan / Kalalakihan).
  These show that such groups exist in the officer data, but the owner must confirm what the Ministries page
  should say. Do not derive ministry descriptions from role names.

## 8. Proposed Page Structure

**Proposed (pattern only):** `PageHero` with intro → `cards` grid, one card per ministry → optional leaders
using `PersonCard`.

## 9. Responsive Behavior

**Verified:** the shared `cards` grid is `grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`; site breakpoints apply.

## 10. Accessibility

**Verified:** single `h1`. Proposed: `h2` per ministry or section.

## 11. SEO / Metadata

**Verified (rendered):** title "Ministries | Gospel Christian Church", placeholder description, canonical
`/ministries`, noindex; not in sitemap. **Proposed:** index + sitemap once content exists.

## 12. Implementation Constraints

Content in `content/`; reuse officer data rather than duplicating names; no new dependencies.

## 13. Data / Dependencies

`components/PageHero.tsx`, `lib/seo.ts`, `content/site.ts` (`NAV` item "Ministries"); possibly
`content/officers.ts` if leaders are shown (**Proposed**).

## 14. Open Questions / Owner Input

1. List of ministries and their descriptions, schedules and leaders.
2. Should ministry leaders be pulled from the officer data?

## 15. Implementation Plan

Blocked on owner content.

## 16. References

`app/ministries/page.tsx`, `content/officers.ts` (`LEADERSHIP_GROUPS`), `components/PageHero.tsx`,
`lib/seo.ts`, `information.md`.
