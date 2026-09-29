# Church Leadership

Route: `/leadership` · File: `app/leadership/page.tsx` · Status: **Complete** (not in navigation)

## 1. Purpose

**Verified:** show the current term's leaders grouped by function (pastoral leadership, preachers, ministry
and organization leaders), as opposed to the full officer board on `/officers`.

## 2. Current State

- **Verified:** implemented, static, in the sitemap, but **not in the header menu** and not linked from any
  page — reachable only by URL or search engines.
- **Verified (rendered groups for 2026 - 2027):**
  - Pastoral Leadership – 2 people (Pastor, Deac)
  - Preachers (Predigador) – 12 people
  - Ministry & Organization Leaders – 4 people (the four "President of …" roles)
- **Verified:** groups with no matching people are hidden. `LEADERSHIP_GROUPS` still lists
  "Music Director" and "Sound System Operator", which match **no** current entries (see §14).

## 3. Existing Layout

**Verified:** `PageHero` (title "Church Leadership", intro "Those who shepherd and serve our congregation,
2026 - 2027.") → ``${wrap} ${pageBody}`` → one `section` per group with `h2` and a `ul` (`peopleGrid` +
`peopleRowRest`) of `PersonCard`s.

## 4. Existing Design System

Same as [officers.md](officers.md) §4 (`PersonCard`, `Avatar`, `peopleGrid` / `peopleRowRest`). Each group
`section` has `pb-9` (36px); its `h2` uses `h2Size` with an 18px bottom margin (`mb-[18px]`).

## 5. Existing Components to Reuse

**Verified:** `PageHero`, `PersonCard`, `Avatar`; `leadershipGroups()` and `toPeople()` in `lib/officers.ts`.
On this page each card shows only the roles belonging to that group.

## 6. Existing Assets

**Verified:** generated avatar SVGs in `public/images/people/` (no real photos).

## 7. Content Requirements

**Verified:** groups and their roles are configured in `LEADERSHIP_GROUPS` (`content/officers.ts`); people
come from `CURRENT_TERM`. Role strings must match exactly.

## 8. Proposed Page Structure

No change proposed. **Owner input required:** whether this page should appear in the menu (§14).

## 9. Responsive Behavior

**Verified:** the `peopleRowRest` auto-fill grid (min 190px) reflows to one column on narrow screens.

## 10. Accessibility

- **Verified:** each `section` uses `aria-labelledby={"g-" + title}` pointing at its `h2` `id`.
- **Verified finding:** the ids contain spaces and punctuation (e.g. `g-Pastoral Leadership`,
  `g-Preachers (Predigador)`). `aria-labelledby` treats spaces as separators between multiple ids, so the
  section labels do not resolve as intended, and ids with spaces are invalid HTML.
- Same placeholder alt-text note as [officers.md](officers.md) §10.

## 11. SEO / Metadata

**Verified (rendered):** title "Church Leadership | Gospel Christian Church"; description "Meet the pastor,
deac, preachers and ministry leaders … (2026 - 2027)"; canonical `/leadership`; in sitemap; no `og:image`.

## 12. Implementation Constraints

Don't change officer data or `LEADERSHIP_GROUPS` without owner confirmation. Adding the page to the menu
means editing `NAV` in `content/site.ts` (owner decision).

## 13. Data / Dependencies

`content/officers.ts` (`CURRENT_TERM`, `LEADERSHIP_GROUPS`), `lib/officers.ts`, `components/PersonCard.tsx`,
`components/Avatar.tsx`, `components/PageHero.tsx`, `lib/seo.ts`, `app/sitemap.ts`.

## 14. Open Questions / Owner Input

1. Should `/leadership` be added to the header menu (e.g. under Church Leadership)? Or linked from Home?
2. "Music Director" and "Sound System Operator" are configured in `LEADERSHIP_GROUPS` but were removed from
   the officer data in commit `edbecdd`. `information.md` (stale) still lists them (Sunga, Victor R.;
   Estrella, Jason Ray). Should those roles return to the data, or be dropped from the group config?
3. Fixing the `aria-labelledby` ids is a code change — approve separately.

## 15. Implementation Plan

None for this phase.

## 16. References

`app/leadership/page.tsx`, `content/officers.ts`, `lib/officers.ts`, `components/PersonCard.tsx`,
`content/site.ts` (`NAV`), `app/sitemap.ts`, `information.md` (stale), [officers.md](officers.md).
