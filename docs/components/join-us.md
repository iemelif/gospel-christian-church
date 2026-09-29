# JoinUs

Source: `components/JoinUs.tsx` · Type: Server · Used by: `app/donate/page.tsx` (and `/`, which renders the Donate page)

Status: **implemented** (extracted from the Donate page 2026-09-29; the rendered HTML on `/donate` and `/` was
verified byte-for-byte identical before and after the refactor).

## 1. Purpose

**Verified:** invites visitors to worship services — a "Join us" heading, one intro sentence, and one card per
service from the church schedule. Reusable on any page.

## 2. Current Implementation

**Verified:** default export `JoinUs({ intro? })` renders `section#visit` → `wrap` → `h2` "Join us" → `p` intro →
grid of cards (`SCHEDULE.map`), each with the service title (`h3`), the day, a line break and the time in bold.

## 3. Props / Inputs

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `intro` | `string?` | "Come worship with us this week." | Sentence under the heading. The Donate page passes "Come worship with us this week, and see the place your gift is building." |

## 4. Data Dependencies

**Verified:** `SCHEDULE` (`lib/config.ts`) — service `title`, `day`, `time` (Sunday Worship Service, Wednesday
Worship Service, Morning Devotion today). Edit the schedule there; the footer's schedule line uses the same data.

## 5. Pages / Components Using It

**Verified:** `app/donate/page.tsx`, as the last section before the mobile give bar; therefore also on `/`
(temporary Home).

## 6. Layout and Structure

**Verified:** `<section id="visit" class="py-14">` → `div` `wrap` (1080px column) → `h2` → `p` → `div` `cards`
(grid) → `div` `card` per service.

## 7. Design System / CSS

**Verified:** Tailwind via shared strings from `lib/ui.ts`: `wrap`, `h2`, `sub`, `cards`
(`grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5`), `card`, `cardTitle`; section padding `py-14` (56px); the
time is bold (`b`), the paragraph has `m-0`. Unchanged from the former inline markup.

## 8. Responsive Behavior

**Verified:** the `cards` grid auto-fits columns of at least 260px — three services side by side on wide screens,
fewer per row as the width shrinks, one column on phones. No component-specific breakpoints.

## 9. Accessibility

**Verified:** a real `section` with an `h2` heading and `h3` per service; plain text, no interactive elements.

## 10. Client / Server Behavior

**Verified:** server component, no state, no browser APIs.

## 11. Reuse Guidelines

```tsx
import JoinUs from "@/components/JoinUs";

<JoinUs />                                   // general intro
<JoinUs intro="Your page-specific sentence." />
```

Place it inside `<main id="main">` like other sections. Don't copy the markup into pages; change the schedule in
`lib/config.ts`.

## 12. Modification Constraints

- It renders `id="visit"`: use it **at most once per page** (duplicate ids otherwise).
- It has **no links or actions**; the Donate page's CTAs point to `#give` / `#how`, not to `#visit`.
- Keep the look consistent with other sections (shared `lib/ui.ts` strings).

## 13. Known Issues / Technical Debt

None known.

## 14. Open Questions

None.

## 15. Implementation Notes

**Tests:** `components/JoinUs.test.ts` — section id and padding, heading, one card per `SCHEDULE` entry with title /
day / time, shared class strings, default and custom intro, no links or buttons.

## 16. References

`components/JoinUs.tsx`, `components/JoinUs.test.ts`, `lib/config.ts` (`SCHEDULE`), `lib/ui.ts`,
`app/donate/page.tsx`, `docs/pages/donate.md`.
