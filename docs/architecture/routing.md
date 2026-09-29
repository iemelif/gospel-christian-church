# Routing

## 1. Route table (verified: `app/` tree + `next build` output + HTTP checks)

| Route | File | Kind | Rendering | Menu | Sitemap | Indexing |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `app/page.tsx` | Page (temporary wrapper of Support) | Dynamic | "Home" (external URL) | Yes, priority 1 | Index |
| `/support` | `app/support/page.tsx` | Page | Dynamic | "Support" (external URL) | Yes | Index |
| `/officers` | `app/officers/page.tsx` | Page | Static | Yes | Yes | Index |
| `/leadership` | `app/leadership/page.tsx` | Page | Static | **No** | Yes | Index |
| `/history/[term]` | `app/history/[term]/page.tsx` | Dynamic segment | SSG: `2025-2026`, `2024-2025` | Yes (generated) | Yes | Index |
| `/about`, `/ministries`, `/contact` | `app/<name>/page.tsx` | Placeholder pages | Static | Yes | No | `noindex, follow` |
| `/admin` | `app/admin/{layout,page}.tsx` | Internal page (client) | Static shell | No | No | `noindex, nofollow`; robots disallow |
| `/api/gifts` | `app/api/gifts/route.ts` | Route handler `GET`, `POST` | Dynamic | — | — | robots disallow `/api/` |
| `/api/admin` | `app/api/admin/route.ts` | `GET`, `PATCH` (session) | Dynamic | — | — | disallowed |
| `/api/admin/session` | `app/api/admin/session/route.ts` | `POST`, `DELETE` | Dynamic | — | — | disallowed |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Metadata routes | Static | — | — | — |

**Verified 404s:** `/history` (no index), `/history/2026-2027` (current term is `/officers`), unknown slugs.
Next.js default 404 page (no custom `not-found`).

## 2. Navigation (verified)

- Source: `NAV` in `content/site.ts`, expanded by `buildNav()` (`lib/nav.ts`), which fills
  "Leadership History" with `HISTORY_TERMS` → `/history/<slug>` (matched by that exact label).
- Rendered by the client `SiteHeader`; internal items use `next/link`, `external: true` items use `<a>`.
- "Home" → `LINKS.home`, "Support" → `LINKS.support`: full URLs from the `ENVIRONMENTS` block
  (production `https://www.gcciemelif.website` and `https://support.gcciemelif.website`; development all
  `http://localhost:3000`).

## 3. Sitemap and robots (verified)

- `app/sitemap.ts`: `/`, `/support`, `/leadership`, `/officers`, each history term; `changeFrequency:
  "monthly"`; priority 1 for `/`, 0.7 otherwise; URLs built from `SITE_URL`; no `lastModified`.
- `app/robots.ts`: allow `/`, disallow `/admin` and `/api/`, sitemap at `SITE_URL/sitemap.xml`.
- Canonicals via `pageMeta(title, description, path)` relative to `metadataBase = SITE_URL`.

## 4. Domains and hosts

**Verified (owner-confirmed):** `www.gcciemelif.website` and `support.gcciemelif.website` are served by the
same Cloud Run service. The app does no host-based routing (no middleware, no `redirects()`), so both hosts
serve identical paths. `SITE_URL` (canonicals, sitemap) is always the `www` host in production.

**Consequence (verified by reasoning from the above):** once the Home page replaces `app/page.tsx`,
`support.gcciemelif.website/` will show the Home page, not the donation page.

**Proposed (not decided):** a host-based redirect `support.…/*` → `www.…/support` (e.g. `redirects()` with a
`has: [{ type: "host" }]` condition), and internal menu links for Home/Support.

## 5. Discrepancies (verified)

- `/` and `/support` currently render identical content (different canonicals).
- `/leadership` is reachable only by URL/sitemap.
- In development, "Support" links to `localhost:3000/`, not `/support`.
- External Home/Support links never get `aria-current` and trigger full page loads.

## 6. Unknown / Owner input required

- Redirect behaviour for the support subdomain; internal vs external menu links (see `docs/pages/home.md`).
- Whether `/leadership` should be in the menu; whether a `/history` index is wanted.
- **Unknown:** DNS / Cloud Run domain-mapping configuration (not in the repository).

## 7. References

`app/**`, `content/site.ts`, `lib/nav.ts`, `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`,
`docs/pages/README.md`.
