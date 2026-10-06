# About Us

Route: `/about` · File: `app/about/page.tsx` · Status: **Implemented (2026-10-06)**, indexable, in the sitemap.

## Structure

`PageHero` (intro `ABOUT_INTRO`) → `wrap` + `pageBody`:

1. `PagePhoto` (default church family photo; also the share / search image).
2. **Our church** — `ABOUT_WELCOME` paragraphs (verified facts only: name, IEMELIF, address, Project Nehemiah).
3. **Our story** — the church's Facebook video "Muling balikan: kasaysayan ng pagkakatatag ng GCC-IEMELIF"
   (`FOUNDING_VIDEO`, `VideoEmbed`, no autoplay) in a card frame.
4. **Pastors through the years** — built from `content/officers.ts` by `pastorPeriods()` (`lib/officers.ts`): consecutive
   terms with the same Pastor and Deac merge into one row ("2024 – present", "2019 – 2024", …), each linking to that
   period's newest officers page.
5. **Our IEMELIF heritage** — `IEMELIF_HERITAGE` facts summarised from https://www.iemelifchurch.com/history/, with a link to it.

Then `JoinUs`. All text lives in `content/about.ts`.

## Open questions / owner input

- Founding year **1984** is shown in "Our church", from the 42nd-anniversary graphic (2026) and the `@gcc1984` Facebook
  handle — owner to confirm.
- The rest of GCC's founding story (founders, early pastors before 2008) is only in the video, in Filipino.
  If the owner provides a written summary, add it to `content/about.ts` under "Our story". Do not invent it.
- Photos specific to the About page (default church family photo is used).
