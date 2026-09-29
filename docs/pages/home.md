# Home

Route: `/` · File: `app/page.tsx` · Status: **Temporary**

| | Summary |
| --- | --- |
| **Current (verified)** | `app/page.tsx` re-renders the Support/donation page with canonical `/` |
| **Intended (owner decision)** | A new Home page replaces `app/page.tsx`; donations stay at `/support` |
| **Owner input required** | All Home content, photos, sections, title/description, subdomain/link decisions (§14) |

## 1. Purpose

- **Verified (owner decision, 2026-09-29):** `/` will become the church's Home page. The donation page lives
  at `/support` ([support.md](support.md)).
- **Owner input required:** the Home page's actual purpose statement, audience and content. The owner will
  provide the content and photos later. Nothing in this document should be read as approved Home content.

## 2. Current State

- **Verified:** `app/page.tsx` is a temporary wrapper. It imports the default export of
  `app/support/page.tsx` and renders it unchanged, with its own metadata (canonical `/`) and
  `dynamic = "force-dynamic"`. The comment in the file marks it as temporary.
- **Verified:** visitors to `/` currently see the full building-fund donation page (identical markup to
  `/support`).
- **Verified:** `www.gcciemelif.website` and `support.gcciemelif.website` point to the same Cloud Run
  service (owner-confirmed), so today both hosts' `/` show this donation page.

## 3. Existing Layout

- **Verified:** the root layout `app/layout.tsx` supplies the skip link (`#main`), sticky `SiteHeader`,
  `SiteFooter`, fonts and Church JSON-LD. A Home page only renders the `<main id="main">` content.
- **Verified (current content):** the donation page layout, see [support.md](support.md) §3.

## 4. Existing Design System

- **Verified:** Tailwind CSS v4 — theme tokens, fonts, breakpoints and conventions in `CLAUDE.md` §6; shared class
  strings in `lib/ui.ts`. Patterns available from the Support page: crimson hero (`brandGradient`, 2-column grid
  that stacks ≤800px), `card` / `cards`, gold buttons (`btn.primaryLg`, `btn.ghostLgOnBrand` on crimson), the
  gold-bordered verse, section headings (`h2`) with intro (`sub`), `wrap` (1080px column), serif headings (Young
  Serif) and Figtree body.
- **Verified (owner instruction):** the existing Header, Footer and Support page are the visual references
  for the Home page.

## 5. Existing Components to Reuse

- **Verified available:** `PageHero` (inner-page banner), `ChurchProgress` (church SVG filled to %),
  `PersonCard` / `Avatar` (people cards), `SocialIcon`.
- **Proposed:** use the Support page's hero pattern (`brandGradient` banner) rather than `PageHero` for Home.
- **Verified available data helpers:** `summary()` (`lib/store.ts`) for raised/donors; `php()`, `CHURCH`,
  `SCHEDULE` (`lib/config.ts`); `SITE`, `LINKS`, `ADDRESS`, `SOCIAL`, `LOGOS` (`content/site.ts`);
  `CURRENT_TERM` + `boardRows()` / `leadershipGroups()` (`content/officers.ts`, `lib/officers.ts`).
- **Proposed:** if the Home page repeats a block from the Support page (e.g. the hero progress card or
  schedule cards), extract a shared component instead of copying JSX.

## 6. Existing Assets

- **Verified:** `public/images/gcc-logo.png` (54×98), `public/images/iemelif-logo.png` (274×269), generated
  avatar SVGs in `public/images/people/`. Originals of the logos in `design/original-logos/`.
- **Verified:** no church photos, building photos, or hero images exist in the repository.
- **Owner input required:** photos for the Home page (the owner said photos will be provided).

## 7. Content Requirements

- **Owner input required:** all Home page copy and section choices.
- **Unknown / not confirmed:** examples raised in discussion (welcome message, service times, pastor or
  leaders, building-fund teaser, map or contact details) were suggestions only, not requirements.
- **Verified content that already exists in code** and could be reused if the owner wants it: service
  schedule (`SCHEDULE`), address (`ADDRESS`), Facebook link (`SOCIAL`), current pastor/leaders
  (`CURRENT_TERM`), building-fund goal and live total (`CHURCH`, `summary()`).
- Do not invent church history, mission statements, ministries, people, schedules or photos.

## 8. Proposed Page Structure

- **Owner input required.** No structure is approved. Draft one only after the owner's content arrives,
  following the Support page's pattern (hero → `section`s with `h2` + `sub` → `card`/`cards`, all from
  `lib/ui.ts`).

## 9. Responsive Behavior

- **Verified (current):** as the Support page: hero grid stacks at ≤800px, mobile fixed give bar at ≤800px,
  header collapses to a menu button at ≤1080px.
- **Proposed:** the Home page should use the same Tailwind breakpoints (`max-lg:` ≤1080, `max-md:` ≤800,
  `max-sm:` ≤480, `max-xs:` ≤420) and be checked at 400, 800, 1100 and 1280px.

## 10. Accessibility

- **Verified (current):** inherited from the Support page ([support.md](support.md) §10).
- **Proposed:** keep one `h1`, `<main id="main">`, visible `:focus-visible` outlines, meaningful `alt` text
  on any owner-provided photos (owner may need to supply descriptions).

## 11. SEO / Metadata

- **Verified (rendered):** `<title>Church Building Fund</title>` — **without** the `| Gospel Christian Church`
  suffix. (Explanation, per Next.js metadata rules: a layout's `title.template` applies to child segments,
  not to the page in the same segment.)
  `og:title` is "Church Building Fund | Gospel Christian Church". Canonical `https://www.gcciemelif.website`.
- **Verified:** no `og:image` is rendered (see [README.md](README.md) cross-page findings); `twitter:image`
  is the IEMELIF logo.
- **Verified:** sitemap entry with priority 1, `changeFrequency: "monthly"`.
- **Verified:** `/` and `/support` currently have the same content under different canonicals (temporary).
- **Proposed:** the Home page gets its own title/description via `pageMeta(..., "/")` and should no longer
  use "Church Building Fund". Consider `title: { absolute: ... }` or the layout default so the site name is
  present. **Owner input required:** preferred page title/description.

## 12. Implementation Constraints

- Replace the whole of `app/page.tsx`; do **not** edit `app/support/page.tsx` as part of Home work.
- Server Component by default; `"use client"` only for interactive parts.
- Content belongs in `content/` or `lib/config.ts`, not hard-coded, so non-developers can edit it.
- No new dependencies without approval. Verify with `npm run lint && npm test && npm run build`.
- Style with Tailwind classes and `lib/ui.ts` strings; no new global CSS (see `CLAUDE.md` §6).

## 13. Data / Dependencies

- **Verified (current):** `app/support/page.tsx` (and everything it depends on), `lib/seo.ts`.
- **Verified:** header "Home" item = `LINKS.home` (external): `https://www.gcciemelif.website` in
  production, `http://localhost:3000` in development (`content/site.ts`).
- **Unknown:** which data the future Home page will use until content is provided.

## 14. Open Questions / Owner Input

1. Home page content, sections and photos (owner will send).
2. After Home replaces `/`, `support.gcciemelif.website/` will show the Home page. Should it redirect to
   `www.gcciemelif.website/support` (host-based redirect)?
3. Should the header "Home" / "Support" items become internal links (`/`, `/support`) instead of full URLs?
4. Page title and meta description for Home.
5. Should Home link to `/leadership` (currently not linked from anywhere)?

## 15. Implementation Plan

**Proposed**, blocked on owner content:
1. Receive content and photos; add photos to `public/images/`, text to `content/` (or a new content file).
2. Replace `app/page.tsx` with the Home page using existing layout classes and components.
3. Decide and implement the support-subdomain redirect and header link changes together (§14 Q2–Q3).
4. Update `pageMeta`, sitemap priority if needed, `docs/pages/home.md`, `docs/pages/README.md`.
5. Run lint, tests, build; review at 400 / 800 / 1080px.

## 16. References

`app/page.tsx`, `app/support/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/sitemap.ts`,
`lib/seo.ts`, `content/site.ts`, `lib/config.ts`, `CLAUDE.md` §7 and §9, [support.md](support.md).
