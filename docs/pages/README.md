# Page documentation index

One specification per page. Each file follows the same 16-section structure and labels facts as
**Verified** (checked in code or rendered output), **Proposed**, **Unknown**, or **Owner input required**.

Verified against the working tree on branch `feat-ai-powered-integration`, 2026-09-29 (uncommitted changes
included: `/donate` is the Donate page for Project Nehemiah, `/support` returns 404, `/` is a temporary wrapper).

| Route | Documentation | Status | In header menu | In sitemap | Notes / discrepancies |
| --- | --- | --- | --- | --- | --- |
| `/` | [home.md](home.md) | **Complete** | "Home" – external link to `LINKS.home` | Yes (priority 1) | Home page: carousel → welcome → Project Nehemiah feature (inline video, CTA → `/donate`) → Our Pastor, Deacon, Chairman and Vice Chairman → Join Us. `<title>` has no site suffix (root segment) |
| `/donate` | [donate.md](donate.md) | **Complete** | "Donate" – internal link to `/donate` | Yes | Project Nehemiah. Same content as `/` for now. Canonical `/donate`. Gift recording protected by Google reCAPTCHA v3. `/support` returns 404 (not redirected, not in sitemap) |
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
  because their `openGraph` object replaces the root layout's. Rendered and confirmed for `/`, `/donate`,
  `/officers`, `/leadership`, `/about`, `/history/2024-2025`; `/ministries`, `/contact`, `/history/2025-2026`
  use the same helper (not individually rendered). `/admin` keeps the layout's `og:image`.
- **Technical findings** are recorded per page (not fixed): `leadership.md` (invalid `aria-labelledby` ids),
  `officers.md` (placeholder alt text), `admin.md` (PATCH input validation, rate-limit key), `home.md`
  (title suffix).
- **Header links:** "Home" is an external full URL (`LINKS.home`); "Donate" is internal (`/donate`). Both
  domains (`www.` and `support.gcciemelif.website`) point to the same Cloud Run service (owner-confirmed); no
  host-based redirect exists. The subdomain decision is tracked in [donate.md](donate.md) §14 and
  [home.md](home.md) §14.
- Shared frame for every page (header, footer, skip link, JSON-LD): `app/layout.tsx`. Global conventions:
  `CLAUDE.md`.
