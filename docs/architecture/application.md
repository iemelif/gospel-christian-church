# Application architecture

## 1. Stack (verified)

| Layer | Technology |
| --- | --- |
| Framework | Next.js **16.3.6**, App Router, `output: "standalone"` (only option in `next.config.ts`) |
| UI | React **19.3**, function components |
| Language | TypeScript 5.9, `strict`, alias `@/*` → repo root |
| Runtime | Node 24 (`engines`, CI, `node:24-alpine`) |
| Styling | **Tailwind CSS v4**, compiled at build time by `@tailwindcss/postcss` (`postcss.config.mjs`); configured in `app/globals.css` (`@theme` tokens, custom breakpoints, `@source`), no `tailwind.config` file, **Preflight not enabled**. Utility classes in the markup; shared class strings in `lib/ui.ts`. Design rules: `CLAUDE.md` §6 |
| Fonts | `next/font/google`: Young Serif → `--font-young-serif` → `font-serif` (headings); Figtree → `--font-figtree` → `font-sans` (body) |
| Runtime deps | `next`, `react`, `react-dom` only (`tailwindcss` and `@tailwindcss/postcss` are dev dependencies, used only during the build) |
| Storage | JSON file (see [data-storage.md](data-storage.md)) |
| External services | **Google reCAPTCHA v3** only: the browser loads `https://www.google.com/recaptcha/api.js` on the Donate page (and `/`), and `/admin`, and `POST /api/gifts` and `POST /api/admin/session` (sign-in) call Google's `siteverify` endpoint. Google Fonts are downloaded at build time by `next/font` |

**Verified absent:** no `middleware`/`proxy` file, no `instrumentation`, no custom `not-found`, `error` or
`global-error` files, no database, no CMS, no analytics or error-monitoring SDK, no AI SDK, no redirects.

## 2. Layers (verified)

```
app/            routes: pages, route handlers (app/api), layout, robots, sitemap
components/     React components (see docs/components/)
content/        editable site content: site.ts (links, menu, address), officers.ts (terms)
lib/            logic: config (settings, payment methods), store (gifts.json), auth, seo, nav, officers, slug;
                ui.ts = shared Tailwind class strings
public/         static assets (logos, avatar SVGs)
scripts/        generate-avatars.mjs (dev tool)
```

Dependencies flow `app/` → `components/` → `lib/` → `content/`. `lib/store.ts` and `lib/auth.ts` use Node
APIs (`fs`, `crypto`) and are imported only by server code.

## 3. Rendering model (verified)

| Mode | Routes | Why |
| --- | --- | --- |
| Dynamic per request (`force-dynamic`) | `/`, `/donate`, all `/api/*` | Read/write `gifts.json` |
| Static, prerendered at build | `/about`, `/ministries`, `/contact`, `/leadership`, `/officers`, `/admin` (client shell) | Data is compiled in |
| SSG with params (`generateStaticParams`, `dynamicParams = false`) | `/history/[term]` | One page per past term |

- No `revalidate` or ISR anywhere; static pages change only on redeploy.
- Server pages call `summary()` directly; they never fetch their own API.
- Details per route: [routing.md](routing.md).

## 4. Server vs Client Components (verified)

- **Client** (`"use client"`): `components/SiteHeader.tsx`, `components/GiveForm.tsx`,
  `components/CopyButton.tsx`, `app/admin/page.tsx`.
- Everything else is a Server Component.
- Client → server communication is only `fetch` to same-origin `/api/*` routes:
  `GiveForm` → `/api/gifts`; admin page → `/api/admin`, `/api/admin/session`.
- The root layout passes serialisable nav data (`buildNav()`) into the client `SiteHeader`.

## 5. Root layout (verified)

`app/layout.tsx`: imports `globals.css`; font CSS variables on `<html>`; body typography/background classes
(and the ≤800px bottom padding for the mobile give bar) on `<body>`; site-wide metadata (title template, icons, Open Graph,
Twitter), `themeColor`, skip link, `SiteHeader`, page content, `SiteFooter`, and a Church JSON-LD script.
`app/admin/layout.tsx` only adds `<main id="main">` and admin metadata (noindex).

## 6. Conventions (verified)

Covered in `CLAUDE.md` §5–§6: content in `content/` / `lib/config.ts`; `pageMeta()` for metadata;
`<main id="main">` per page; all gift writes through `update()`.

## 7. AI-relevant considerations

**Verified:**
- No AI code, SDKs, keys or configuration exist.
- Any server-side AI call would run in a route handler or server code on the single Cloud Run instance
  (512Mi memory, 1 CPU, 60s request timeout, concurrency 80 — see [deployment.md](deployment.md)).
- Structured, typed knowledge already exists in `content/site.ts`, `content/officers.ts`, `lib/config.ts`
  and `docs/`.
- `gifts.json` contains personal data (names, emails, messages).

**Proposed (not decided):**
- AI calls server-side only; API keys as runtime secrets, never `NEXT_PUBLIC_*`.
- Stream or raise the timeout for long responses; 60s would cut them off.
- Keep donor personal data out of AI prompts unless explicitly approved.
- Public AI endpoints need real rate limiting (the current limiter is in-memory and header-keyed; see
  [authentication.md](authentication.md)) because each call costs money.
- Any AI state (logs, caches, quotas) would inherit the single-instance/file-storage limits.

**Unknown / Owner input required:** what the "AI-powered integration" should do, for whom, with which
knowledge sources, and with what budget and privacy rules. Needed before `docs/ai/` is written.

## 8. References

`package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/admin/layout.tsx`, `lib/*.ts`,
`content/*.ts`, `CLAUDE.md`.
