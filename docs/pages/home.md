# Home

Route: `/` · File: `app/page.tsx` · Status: **Implemented 2026-09-29** (static page; verified in a browser)

| | Summary |
| --- | --- |
| **Current (verified)** | Hero Shot Carousel → Welcome / About → Project Nehemiah feature (inline video) → Our Pastor, Deacon, Chairman and Vice Chairman → Join Us, in `<main id="main">` (header/footer from the layout) |
| **Implementation** | `HeroShotCarousel`, `WelcomeSection`, `NehemiahFeature` (+ `VideoEmbed`), `PersonCard` (`href`) + `boardRows()`, `JoinUs`; content in `content/home.ts` |
| **Theme** | The Donate page's GCC/IEMELIF theme: `@theme` tokens and `lib/ui.ts` strings only (incl. new `section`, `eyebrow`) |
| **Owner input required** | Longer welcome copy, alt text / wording confirmation, subdomain/link decisions (§14) |

## 1. Purpose

**Owner decision:** `/` becomes the church's Home page for first-time visitors. Donations stay at `/donate`
([donate.md](donate.md)).

## 2. Current State

**Verified:** `app/page.tsx` renders the five sections in §8. Static (prerendered). Both `www.` and `support.`
hosts' `/` show this page. SEO, icons and the share image: §11.

## 3. Existing Layout

**Verified:** `app/layout.tsx` provides the skip link, `SiteHeader`, `SiteFooter` and JSON-LD. The Home page renders
only `<main id="main">` content — **never another header or footer**.

## 4. Existing Design System

**Verified:** Tailwind CSS v4 and the `lib/ui.ts` strings (`CLAUDE.md` §6), following the Donate page theme:
`wrap`, `h2`, `h2Size`, `sub`, `brandGradient`, `stripeBefore`, and two strings added for Home — `section`
(`py-14`) and `eyebrow` (small gold-dark uppercase label). Colours only from the tokens (brand, crimson, gold,
paper, line…); no new palette or dependency.

## 5. Existing Components to Reuse

**Verified:** `JoinUs`, `PersonCard` / `Avatar` (with the new optional `href`), `boardRows()` (`lib/officers.ts`).
`VideoEmbed` (Facebook iframe) is used inside `NehemiahFeature` with `autoplay`.

## 6. Existing Assets

**Verified:** the carousel shows **every image in `public/images/hershot-carousel/`** (folder name as-is). There is
**no manually maintained image list**: `carouselSlides()` (`lib/carousel.ts`, server-side) reads the folder and
`app/page.tsx` passes the slides to the client `HeroShotCarousel`.

- **Order:** alphabetical by filename (`localeCompare`, so number prefixes like `01-`, `02-` set the order).
- **File types:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` (any case). Other files, hidden files (`.…`) and
  subfolders are ignored.
- **Add / remove / rename a file → the carousel changes**, with no code change. Home is a static page, so in
  production the folder is read when the site is built (every deploy rebuilds); `npm run dev` reads it on each
  request. An empty or missing folder hides the carousel.
- **Alt text** comes from the filename: extension and leading number removed, `-`/`_` → spaces, first letter
  capitalised (`04-youth-choir.jpg` → "Youth choir"; a name with no words → "Church photo"). **Owner input
  required:** name files descriptively for better alt text — the current files give "Gcc nehemniah", "Gcc logo",
  "Gcc family".
- **URL:** `/images/hershot-carousel/<filename>` (URL-encoded).

Currently (2026-09-29) **3 images**: `01-gcc-nehemniah.png` (1907×1043), `02-gcc-logo.png` (1852×1078),
`03-gcc-family.png` (1841×1077). Separately, `01-gcc-nehemniah.png` is the Open Graph / Twitter image of `/`
(`SHARE_IMAGE` in `content/home.ts`, independent of the carousel), and the site icons in `public/icons/` were
downscaled from the earlier `02-gcc-logo.jpg`.

## 7. Content Requirements

- **Welcome — verified facts only** (`WELCOME_TEXT` in `content/home.ts`, from `SITE.description` and
  `ADDRESS`): "We are glad you are here. Gospel Christian Church IEMELIF gathers in Frances, Calumpit, Bulacan,
  and you are warmly invited to worship with us, meet our pastor, leaders and officers, and become part of our
  church family as we build together through Project Nehemiah, our church building project." No history,
  mission or statistics.
- **Project Nehemiah:** `NEHEMIAH_FEATURE` (eyebrow, text, CTA, `video.url`
  `https://www.facebook.com/gcc1984/videos/1995167554627898/`, `video.title` "Project Nehemiah video"); name and
  goal from `CHURCH`.
- **Leaders:** the current term's Pastor, Deacon, Chairman and Vice Chairman (`boardRows(CURRENT_TERM)` rows 1–2);
  labels as in `content/officers.ts` except "Deac", shown as "Deacon" (`LEADER_ROLE_LABELS`).
- **Join Us:** existing `SCHEDULE` via `JoinUs`.

## 8. Proposed Page Structure (approved order)

**Implemented (verified in the rendered page):**
1. **Hero Shot Carousel** — `components/HeroShotCarousel.tsx` (client, presentation only), slides from
   `carouselSlides()` (§6, folder discovery). 16:9 `bg-paper` frame with
   rounded corners and a soft shadow, `next/image` `fill` + `object-contain` (no crop/stretch). Round white prev/next buttons (gold on
   hover) and pill dots (active: wide, brand). **Autoplay 5s**, pause on hover, resume on leave; buttons/dots/swipe
   (≥40px) restart the timer; reduced motion: no autoplay, no fade. `aria-roledescription` carousel/slide.
2. **Welcome / About** — `components/WelcomeSection.tsx`: gold-bordered `bg-paper` card with the tri-colour stripe,
   eyebrow "Gospel Christian Church · IEMELIF", the page's only `h1` "Welcome to Gospel Christian Church IEMELIF",
   one paragraph (`WELCOME_TEXT`), and the address with a pin icon.
3. **Project Nehemiah feature** — `components/NehemiahFeature.tsx`. Crimson `brandGradient` card: the Project
   Nehemiah video **inline** (`VideoEmbed autoplay`, 16:9, rounded, full column width) | eyebrow, `h2` "Project
   Nehemiah", text, goal, gold CTA "Support Project Nehemiah →" → **`/donate`**. The video replaced the former image
   with a play button; there is **no play button and no "Watch … on Facebook" link of ours**, and nothing on our
   page opens Facebook in a new tab.
   - **Video:** Facebook's embedded player (`https://www.facebook.com/plugins/video.php?href=…&show_text=false&autoplay=true&mute=true`,
     `allow="autoplay; …"`, `allowFullScreen`, `loading="eager"`). The only video source is Facebook, so an HTML
     `<video autoPlay muted playsInline>` is not possible without a video file (**Owner input required**, §14).
   - **Autoplay:** the page **requests** muted autoplay; Facebook's player decides. **Verified (Chrome 2026-09-29,
     headless and headed, logged out):** the player honours the request by starting **muted**, but it did **not**
     start playing on its own — it shows Facebook's own play overlay until the visitor clicks. Autoplay with sound
     is never possible (browser policy); visitors unmute with the player's controls.
   - **Controls:** Facebook's normal controls (play/pause, seek, volume/unmute, fullscreen). Facebook's player also
     shows its own page name, "Share" and Facebook logo, which link to Facebook in a new tab; they are inside
     Facebook's cross-origin iframe and cannot be removed by the site.
   - **`/donate`:** the CTA link's `after:absolute after:inset-0` overlay stretches it over the text column and card
     padding (heading/text clicks → `/donate`). The video column sits above it (`relative z-10`), so clicks in the
     player never trigger `/donate`. The hover brightness is on an inner span, because a filter on the link would
     shrink that overlay to the button.
   - Keyboard: the player (Facebook's own focusable controls), then the CTA (Enter → `/donate`); gold focus ring on
     the CTA (`[&_:focus-visible]:outline-gold`).
4. **Our Pastor, Deacon, Chairman and Vice Chairman** — eyebrow = term label, `h2` "Our Pastor, Deacon, Chairman and Vice Chairman" (no sub line), four `PersonCard large href="/officers"`:
   **Pastor, Deacon, Chairman, Vice Chairman**. The data says "Deac"; Home shows "Deacon" through
   `LEADER_ROLE_LABELS` (`content/home.ts`) — officer data and the other pages are unchanged. Every card is a
   keyboard-focusable link to the existing `/officers` page; then "See all church officers →".
5. **Join Us** — `<JoinUs />` on a `bg-paper` band with a top border.

**Future enhancements (not implemented):** Recent Sermons, Upcoming Events.

## 9. Responsive Behavior

**Verified (browser, 2026-09-29):** no horizontal overflow at 375–1280px. Leaders: 4 in a row at ≥1100px, 2×2 at
480–800px, one column at ≤400px. At **320px** the page overflows (scrollWidth 364) because of the **footer**
("Follow us" column) — the same on every page, pre-existing; the Home sections themselves fit.

## 10. Accessibility

**Verified:** one `h1`, `h2` per section, `<main id="main">`; carousel buttons/dots labelled, keyboard-operable,
autoplay pauses on hover and is off with reduced motion; leader cards are single links to `/officers`; the Nehemiah
video iframe has `title="Project Nehemiah video"` and Facebook's keyboard-operable controls; the CTA → `/donate` has a
visible gold focus outline (Enter activates); no autoplay with sound; informative alt text on slides.

## 11. SEO / Metadata

**Verified (rendered `<head>`):**
- Title "Gospel Christian Church IEMELIF – Calumpit, Bulacan"; description "Gospel Christian Church IEMELIF (GCC
  IEMELIF) is a church in Frances, Calumpit, Bulacan. Join our worship services, meet our pastor and church
  leaders, and support Project Nehemiah, our church building project."; canonical `https://www.gcciemelif.website/`.
  No Donate metadata on `/`.
- **Share image:** `og:image` and `twitter:image` = `/images/hershot-carousel/01-gcc-nehemniah.png`, 1907×1043,
  `image/png` (`SHARE_IMAGE` in `content/home.ts` — set on its own, so it does not change with the carousel folder), `twitter:card` `summary_large_image` (via `pageMeta(…, { image })` in `lib/seo.ts`).
- **Icons** (site-wide, `app/layout.tsx`): `/icons/icon-48.png` (favicon/shortcut), `icon-192.png`,
  `icon-512.png`, `apple-touch-icon.png` (180×180) — downscaled from `02-gcc-logo.jpg`; `app/manifest.ts` →
  `/manifest.webmanifest` (192/512).
- **JSON-LD:** still exactly one `Church` object (layout), `logo` now `/icons/icon-512.png`, 2 `sameAs` profiles.
- Search engines decide themselves whether to show the favicon or image; not guaranteed.

## 12. Implementation Constraints

- Replace all of `app/page.tsx`; do not change `/donate`.
- Server Components by default; `"use client"` only for the carousel's interaction.
- Tailwind + `lib/ui.ts`; no new dependencies (carousel built without a library) unless approved.
- Reuse `JoinUs`; do not duplicate schedule markup. Keep image filenames and order unchanged.
- Verify with `npm run lint && npm test && npm run build` and a browser check at the widths in §9.

## 13. Data / Dependencies

`public/images/hershot-carousel/*` (read by `lib/carousel.ts`), `content/home.ts`, `content/site.ts` (`SITE`, `ADDRESS`, `SOCIAL`), `content/officers.ts`,
`lib/officers.ts`, `lib/config.ts` (`SCHEDULE`), `components/JoinUs.tsx`, `public/icons/`, `app/manifest.ts`, `lib/seo.ts`.

## 14. Open Questions / Owner Input

1. Welcome text beyond the verified facts; carousel alt text wording (comes from filenames — rename files, §6).
2. `support.gcciemelif.website/` shows Home — keep, redirect or retire? Make "Home" in the menu an internal link?
3. A dedicated small-size logo for the favicon (the full 02 graphic is hard to read at 48px).
4. **Project Nehemiah video autoplay:** Facebook's player does not start by itself (§8). Reliable muted autoplay needs
   the video as a file (e.g. MP4, self-hosted) played with `<video autoPlay muted playsInline controls>`. Provide the
   file, or accept Facebook's click-to-play. The video's first frame (Facebook's poster) is also what visitors see
   before playback.

## 15. Implementation Plan

**Done (2026-09-29).** Tests: `lib/carousel.test.ts` (folder discovery: supported extensions in any case, non-images /
hidden files / subfolders ignored, alphabetical order, URL encoding, alt text from filenames, the real folder matches
what is on disk, an image added to / removed from a temporary folder appears / disappears, missing folder → no
slides), `components/HomeSections.test.ts` (carousel renders every discovered image in order, welcome paragraph, `PersonCard` link
mode, `VideoEmbed` incl. `autoplay`), `app/page.test.ts` (section order, single `main`, no header/footer, exactly one
iframe with the autoplay URL, no play link / "Watch … on Facebook" / `target="_blank"` / Facebook video link,
CTA → `/donate`, no nested links, "Our Pastor, Deacon, Chairman and Vice Chairman" with four leader links to `/officers` and roles
Pastor/Deacon/Chairman/Vice Chairman, metadata incl. OG/Twitter image). Browser-verified earlier: carousel autoplay,
hover pause/resume, swipe, head tags, manifest and icon files, JSON-LD. **Browser-verified for the inline video
(2026-09-29, production build, Chrome):** iframe visible with the autoplay URL; video muted but not auto-started
(see §8); click in the player plays, second click pauses, page stays on `/`, no new tab/window; heading and CTA →
`/donate`; four leader cards → `/officers`; no horizontal overflow at 375/400/800/1100/1280px (video 285×160 at
375px, 539×303 at ≥1100px, two columns above 800px). **Browser-verified for folder discovery (2026-09-29, production
build, Chrome):** the carousel shows exactly the 3 files in the folder in filename order (all loaded, `object-fit:
contain`, image box = frame), 3 dots; autoplay 1→2 after 5s, paused 6.5s while hovered, resumed after leave; dots
show each image; next/prev wrap; reduced motion: no autoplay; touch swipe left/right; no horizontal overflow at
375/400/800/1100/1280px.

## 16. References

`app/page.tsx`, `app/layout.tsx`, `components/JoinUs.tsx`, `content/site.ts`, `content/officers.ts`,
`lib/config.ts`, `lib/ui.ts`, `public/images/hershot-carousel/`, [donate.md](donate.md),
[ministries.md](ministries.md), [../components/join-us.md](../components/join-us.md).
