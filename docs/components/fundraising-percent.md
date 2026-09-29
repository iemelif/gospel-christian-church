# FundraisingPercent

Source: `components/FundraisingPercent.tsx` · Type: Server · Used by: `app/donate/page.tsx`

## 1. Purpose

**Verified:** shows the share of the Project Nehemiah goal raised, directly above the Giving Wall on the Donate
page.

## 2. Current Implementation

**Verified:** renders a card with the percentage (large, `aria-hidden`) and a sentence for everyone, e.g.
"of the ₱12,000,000 Project Nehemiah goal raised". Screen readers get the full sentence through a `sr-only`
prefix: "22.5% of the ₱12,000,000 Project Nehemiah goal raised".

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `pct` | `number` | Must come from `fundedPercent()` (already capped at 100) |
| `goal` | `number` | `CHURCH.goal` |
| `campaign` | `string` | `CHURCH.campaign` ("Project Nehemiah") |

## 4. Data Dependencies

**Verified:** `lib/progress.ts` — `fundedPercent(raised, goal)` = `raised / goal × 100`, capped at 100, and 0
when nothing is raised or the goal is not positive; `formatPercent(pct)` = one decimal without a trailing
".0". The Donate page computes `pct` once from `summary().raised` and `CHURCH.goal` and passes the same value
to the hero, so both always show the same figure. `php()` formats the goal.

## 5. Pages / Components Using It

**Verified:** `app/donate/page.tsx`, in the `aside` of `section#give`, between the "Give with confidence" card
and the Giving Wall card. Therefore also on `/` (temporary Home).

## 6. Layout and Structure

**Verified:** `div` (flex, centred) → `p` percentage (`aria-hidden`) → `p` sentence with a `sr-only` span.

## 7. Design System / CSS

**Verified:** Tailwind: `rounded-xl border border-gold bg-card px-[22px] py-4`; percentage
`font-serif text-[36px] leading-none text-brand`; sentence `text-[14px] text-mute`.

## 8. Responsive Behavior

**Verified:** full width of the sidebar. On wide screens the sidebar is sticky, so the percentage stays in
view (floats) with the Giving Wall; at ≤800px the sidebar stacks under the form and the percentage stays
directly above the Giving Wall.

## 9. Accessibility

**Verified:** one readable sentence for screen readers; the decorative large number is hidden from them.

## 10. Client / Server Behavior

**Verified:** server component, no state; rendered on each request of the dynamic Donate page.

## 11. Reuse Guidelines

Always pass `pct` from `fundedPercent()` with the same `raised`/`goal` as the rest of the page.

## 12. Modification Constraints

Keep it immediately above the Giving Wall (owner requirement). Keep the accessible sentence.

## 13. Known Issues / Technical Debt

None known.

## 14. Open Questions

1. **Owner confirmation:** the sentence wording ("of the ₱X Project Nehemiah goal raised") was written during
   implementation.

## 15. Implementation Notes

**Tests:** `lib/progress.test.ts` (normal 22.5%, zero raised → 0, above the goal → capped at 100, no division by
zero or negatives) and `components/FundraisingPercent.test.ts` (rendered text and the screen-reader sentence
for normal, zero and capped cases).

## 16. References

`components/FundraisingPercent.tsx`, `components/FundraisingPercent.test.ts`, `lib/progress.ts`,
`lib/progress.test.ts`, `app/donate/page.tsx`, `docs/pages/donate.md`.
