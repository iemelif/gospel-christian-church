# About Us

Route: `/about` · File: `app/about/page.tsx` · Status: **Placeholder**

## 1. Purpose

- **Verified (`information.md` requirement):** "About Us – leave it blank for now".
- **Owner input required:** what the page should cover.

## 2. Current State

**Verified:** renders only `PageHero` with title "About Us" and an empty `.wrap.page-body`. Marked noindex
until it has content.

## 3. Existing Layout

**Verified:** `<main id="main">` → `PageHero title="About Us"` (no intro) → empty `div.wrap.page-body`.

## 4. Existing Design System

**Verified:** `.page-hero`, `.page-body`, plus shared classes (`.card`, `.cards`, `.sub`, `.btn`) in
`app/globals.css`; see `CLAUDE.md` §6.

## 5. Existing Components to Reuse

**Verified available:** `PageHero` (supports `intro`), `PersonCard` / `Avatar`, `SocialIcon`.

## 6. Existing Assets

**Verified:** logos only; no About-specific images. **Owner input required** for any photos.

## 7. Content Requirements

**Owner input required:** all content. Do not invent church history, beliefs, mission or founding details.
**Verified facts already in code** (usable if the owner wants): name `SITE.name`, address `ADDRESS`,
affiliation link `LINKS.iemelif`, Facebook `SOCIAL`.

## 8. Proposed Page Structure

**Proposed (pattern only, pending content):** `PageHero` with intro → `section`s with `h2` + text/cards inside
`.page-body`, like the other inner pages.

## 9. Responsive Behavior

**Verified:** `PageHero` title scales with `clamp(30px,5vw,46px)`; shared breakpoints apply.

## 10. Accessibility

**Verified:** single `h1` from `PageHero`, `<main id="main">`. Proposed: keep heading order `h1` → `h2`.

## 11. SEO / Metadata

**Verified (rendered):** title "About Us | Gospel Christian Church", description "About Us – Gospel Christian
Church IEMELIF, Calumpit, Bulacan.", canonical `/about`, `robots: noindex, follow`; not in sitemap.
**Proposed:** when content is added, remove `{ index: false }`, write a real description, add to
`app/sitemap.ts`.

## 12. Implementation Constraints

Content in `content/` (not hard-coded); server component; no new dependencies.

## 13. Data / Dependencies

`components/PageHero.tsx`, `lib/seo.ts`. Menu item "About Us" in `NAV` (`content/site.ts`).

## 14. Open Questions / Owner Input

1. Page content and any photos.

## 15. Implementation Plan

Blocked on owner content; then follow §8 and §11.

## 16. References

`app/about/page.tsx`, `components/PageHero.tsx`, `lib/seo.ts`, `content/site.ts`, `information.md`.
