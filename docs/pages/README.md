# Page documentation index

One specification per page. Each file follows the same 16-section structure and labels facts as
**Verified** (checked in code or rendered output), **Proposed**, **Unknown**, or **Owner input required**.

Verified against the working tree on branch `feat-ai-powered-integration`, 2026-09-29 (uncommitted changes
included: `/support` now holds the donation page, `/` is a temporary wrapper).

| Route | Documentation | Status | In header menu | In sitemap | Notes / discrepancies |
| --- | --- | --- | --- | --- | --- |
| `/` | [home.md](home.md) | **Temporary** | "Home" – external link to `LINKS.home` | Yes (priority 1) | Renders the Support page with canonical `/`. Will be replaced by the Home page (content pending from owner). `<title>` has no site suffix |
| `/support` | [support.md](support.md) | **Complete** | "Support" – external link to `LINKS.support` (`support.gcciemelif.website`) | Yes | Same content as `/` for now. Dev `LINKS.support` is `localhost:3000/`, not `/support` |
| `/officers` | [officers.md](officers.md) | **Complete** | Church Leadership → Church Officers | Yes | Current term 2026 - 2027 |
| `/leadership` | [leadership.md](leadership.md) | **Complete** | **No** | Yes | Only reachable by URL / sitemap. Two configured roles match nobody |
| `/history/[term]` | [leadership-history.md](leadership-history.md) | **Complete** | Church Leadership → Leadership History → one item per past term | Yes (each term) | Generates `/history/2025-2026`, `/history/2024-2025`. No `/history` index (404) |
| `/about` | [about.md](about.md) | **Placeholder** | Yes | No (noindex) | Empty body |
| `/ministries` | [ministries.md](ministries.md) | **Placeholder** | Yes | No (noindex) | Empty body |
| `/contact` | [contact.md](contact.md) | **Placeholder** | Yes | No (noindex) | Empty body |
| `/admin` | [admin.md](admin.md) | **Complete** (internal) | No (intentional) | No; `robots.txt` disallows it | Password-protected treasurer dashboard |

Not documented as pages (not user-facing pages): `/api/gifts`, `/api/admin`, `/api/admin/session`,
`/sitemap.xml`, `/robots.txt`, and Next.js's default 404 (there is no custom `app/not-found.tsx`).

## Cross-page findings

- **Stale source document:** `information.md` officer lists no longer match `content/officers.ts` (see
  [officers.md](officers.md) §14). The code is the verified source for officer data.
- **Open Graph image:** pages using `pageMeta()` (`lib/seo.ts`) render **no `og:image`** (only `twitter:image`),
  because their `openGraph` object replaces the root layout's. Rendered and confirmed for `/`, `/support`,
  `/officers`, `/leadership`, `/about`, `/history/2024-2025`; `/ministries`, `/contact`, `/history/2025-2026`
  use the same helper (not individually rendered). `/admin` keeps the layout's `og:image`.
- **Technical findings** are recorded per page (not fixed): `leadership.md` (invalid `aria-labelledby` ids),
  `officers.md` (placeholder alt text), `admin.md` (PATCH input validation, rate-limit key), `home.md`
  (title suffix).
- **Home / Support links:** both header items are external full URLs. Both domains point to the same
  Cloud Run service (owner-confirmed); the future routing decision is tracked in [home.md](home.md).
- Shared frame for every page (header, footer, skip link, JSON-LD): `app/layout.tsx`. Global conventions:
  `CLAUDE.md`.
