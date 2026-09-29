# ChurchProgress

Source: `components/ChurchProgress.tsx` · Type: Server · Used by: `app/support/page.tsx`

## 1. Purpose

**Verified:** an illustration of a church (three building shapes, cross, door) whose interior fills with
gold from the bottom up to show the building-fund percentage.

## 2. Current Implementation

**Verified:** pure function of `pct`: fill height = `170 × min(100, pct) / 100` within a 200×210 viewBox.
Outlines are stroked in gold; the fill is a gold rectangle clipped to the building shapes; the door is crimson.

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `pct` | `number` | Percentage 0–100. Values above 100 are capped for drawing; values below 0 are not clamped |

## 4. Data Dependencies

None directly. The Support page computes `pct` from `summary().raised` and `CHURCH.goal`, already capped at 100.

## 5. Pages / Components Using It

**Verified:** `app/support/page.tsx` (translucent card in the hero), and therefore `/`.

## 6. Layout and Structure

**Verified:** one `svg` (`role="img"`, `className="w-full max-w-[280px]"`) with a `clipPath`, a fill `rect`, a
stroked outline group, and a door path.

## 7. Design System / CSS

**Verified:** the SVG sizes itself with Tailwind classes `w-full max-w-[280px]` (full width of its container,
at most 280px). Colours are **hard-coded** in the SVG (`#deb942` = theme `gold`, `#7f1f36` = theme `brand`),
not theme variables.

## 8. Responsive Behavior

Scales with its container (max 280px wide).

## 9. Accessibility

**Verified:** `role="img"` with `aria-label="Church illustration, <pct to 1 decimal>% funded"`.

## 10. Client / Server Behavior

**Verified:** no directive, no state; renders on the server (per request on the dynamic Support page).

## 11. Reuse Guidelines

Suitable for a building-fund teaser elsewhere (e.g. a future Home section — **Proposed**, pending owner
content). Pass the same capped `pct` calculation as the Support page.

## 12. Modification Constraints

If brand colours change, update this file too (it doesn't follow the CSS tokens).

## 13. Known Issues / Technical Debt

**Verified, not fixed:**
- The `clipPath` uses a fixed `id="cp"`. Two instances on the same page would share/duplicate the id
  (invalid HTML; the second may clip against the first).
- Negative `pct` is not clamped.

## 14. Open Questions

None.

## 15. Implementation Notes

—

## 16. References

`components/ChurchProgress.tsx`, `app/support/page.tsx`, `app/globals.css` (theme tokens).
