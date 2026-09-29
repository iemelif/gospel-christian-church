# OfficerBoard

Source: `components/OfficerBoard.tsx` · Type: Server · Used by: `/officers`, `/history/[term]`

## 1. Purpose

**Verified:** renders one term's officers as a board: row 1 pastor and deac, row 2 chairman and vice
chairman, then everyone else in as many columns as fit (the layout required in `information.md`).

## 2. Current Implementation

**Verified:** calls `boardRows(term)` (`lib/officers.ts`) and renders up to three `ul` lists of `PersonCard`s;
an empty row is omitted. Cards in rows 1–2 get `large` (124px avatar).

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `term` | `Term` (`content/officers.ts`) | `{ slug, label, entries: { role, name, image? }[] }` |

## 4. Data Dependencies

**Verified:** `BOARD_ROLES` (`row1: ["Pastor","Deac"]`, `row2: ["Chairman","Vice Chairman"]`) via
`boardRows()`, which merges entries per person (`toPeople`), lists featured roles first, orders rows by the
role order above, and keeps the remaining people in data order. Role strings must match exactly.

## 5. Pages / Components Using It

**Verified:** `app/officers/page.tsx` (`CURRENT_TERM`) and `app/history/[term]/page.tsx` (each `HISTORY_TERMS`
entry). Renders `PersonCard`.

## 6. Layout and Structure

**Verified:** `div` (grid, gap 24px) → `ul` row 1 → `ul` row 2 → `ul` everyone else.

## 7. Design System / CSS

**Verified:** Tailwind classes plus shared strings from `lib/ui.ts`: wrapper `grid gap-6`; each list
`peopleGrid` (no bullets, grid, gap 20px) combined with `peopleRowTop` (rows 1–2: centred columns up to
240px) or `peopleRowRest` (as many columns of at least 190px as fit).

## 8. Responsive Behavior

**Verified:** both row types reflow down to one column (`min(100%, …)` in the column sizes).

## 9. Accessibility

**Verified:** lists have `aria-label`s "Pastor and Deac", "Chairman and Vice Chairman", "Other officers and
leaders". These labels are fixed strings and would be inaccurate if `BOARD_ROLES` changed.

## 10. Client / Server Behavior

**Verified:** server component; prerendered at build on both pages.

## 11. Reuse Guidelines

Pass any `Term`. For grouped-by-function layouts use `leadershipGroups()` + `PersonCard` instead (as
`/leadership` does).

## 12. Modification Constraints

Board placement depends on exact role text in `content/officers.ts`; don't change officer data without owner
confirmation.

## 13. Known Issues / Technical Debt

**Verified, not fixed:** hard-coded `aria-label`s are coupled to `BOARD_ROLES`; `PersonCard` keys use the raw
name (two different people with the identical name string would be merged into one card by `toPeople`).

## 14. Open Questions

None beyond `docs/pages/officers.md` §14.

## 15. Implementation Notes

A person holding a board role and other roles (e.g. Chairman + Predigador + Ugnayan) appears once, in the
board row, with the board role shown first.

## 16. References

`components/OfficerBoard.tsx`, `lib/officers.ts`, `content/officers.ts`, `components/PersonCard.tsx`,
`lib/officers.test.ts`, `docs/pages/officers.md`, `docs/pages/leadership-history.md`.
