# FundraisingPercent

Source: `components/FundraisingPercent.tsx` · Type: Server · Used by: `app/donate/page.tsx` (and `/`)

Status: **implemented** — percentage card with a large church illustration on the **left** (final layout
2026-09-29; verified in the rendered Donate page at 113 widths from 320 to 1440px).

## 1. Purpose

**Verified:** shows the share of the Project Nehemiah goal raised, directly above the Giving Wall on the Donate
page, with a large decorative church illustration on the left.

## 2. Current Implementation

**Verified:** a card (`@container`) containing a flex row: the `ChurchProgress` SVG in `decorative` mode (left),
then a block with the percentage (large, `aria-hidden`) and the sentence ("of the ₱12,000,000 Project Nehemiah
goal raised", with a `sr-only` "22.5% " prefix). The block is a row (percentage | sentence) on wide cards and a
column (percentage above sentence) on narrower cards (§8).

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `pct` | `number` | From `fundedPercent()` (capped at 100); also drives the illustration's fill level |
| `goal` | `number` | `CHURCH.goal` |
| `campaign` | `string` | `CHURCH.campaign` ("Project Nehemiah") |

## 4. Data Dependencies

**Verified:** `lib/progress.ts` — `fundedPercent(raised, goal)` = `raised / goal × 100`, capped at 100, 0 when
nothing is raised; `formatPercent()`. The Donate page computes `pct` once from `summary().raised` and `CHURCH.goal`
and passes the same value to the hero. `php()` formats the goal. The calculation and data are unchanged.

## 5. Pages / Components Using It

**Verified:** `app/donate/page.tsx`, in the `aside` of `section#give`, between the "Give with confidence" card and
the Giving Wall; therefore also on `/` (temporary Home). Renders `ChurchProgress` (decorative).

## 6. Layout and Structure

**Verified:** **[church illustration] [percentage + sentence]**, vertically centred (the illustration's centre is
level with the card's centre at every checked width); no overlap.

## 7. Design System / CSS

**Verified:** Tailwind: card `rounded-xl border border-gold bg-card px-[22px] py-4`; row `flex items-center gap-4`;
percentage `font-serif text-[36px] leading-none text-brand` (unchanged); sentence `text-[14px] text-mute`
(unchanged). Illustration wrapper `hidden w-[76px] shrink-0 @min-[268px]:flex @min-[362px]:w-[54px]` around the
existing `ChurchProgress` SVG (no image asset; none exists). Block `flex min-w-0 items-center gap-4
@min-[268px]:flex-col @min-[268px]:items-start @min-[268px]:gap-1 @min-[362px]:flex-row @min-[362px]:items-center
@min-[362px]:gap-4`.

## 8. Responsive Behavior

**Why:** measured with the site font, the sentence needs ≥312px for one line and ≥173px for two; the percentage is
100px wide. In the ~310px desktop sidebar there is no room for a large church, the percentage and a two-line
sentence side by side, so the percentage moves above the sentence there.

**Verified behaviour** (container = card content width):

| Container width | Layout | Church size | Sentence |
| --- | --- | --- | --- |
| ≥362px | church \| percentage \| sentence (one row) | 54×57px (visually larger than the 36px percentage) | 1–2 lines |
| 268–361px (incl. the 310px desktop sidebar) | church \| [percentage above sentence] | 76×80px (about as tall as the block) | 2 lines |
| <268px | original percentage \| sentence row, **church hidden** | — | 3–4 lines |

**Verified at viewports** (rendered Donate page):

| Viewport | Card height (before → now) | Layout |
| --- | --- | --- |
| 320 | 124 → 124 | church hidden (4-line sentence) |
| 375 | 101 → 119 | church 76×80, stacked block |
| 400 | 79 → 119 | church 76×80, stacked block |
| 480 | 79 → 91 | church 54×57, one row (2-line sentence) |
| 600 | 70 → 91 | church 54×57, one row (1-line sentence) |
| 800 | 70 → 91 | church 54×57, one row |
| 1100 / 1280 | 79 → 119 | church 76×80, stacked block (desktop sidebar) |

Across all 113 widths (320–1440px): the sentence never exceeds two lines where the church is shown (at 520–580px it
goes from one line to two because the church takes width, without increasing the height beyond the church's).
The card is **taller than before** where the church is shown — by design of the larger illustration: 91px in the
one-row layout (was 70/79) and 119px in the stacked layout (was 79/101). The church is hidden at 320–350px and in
the narrow tablet sidebar (810–960px), where the card is unchanged.

## 9. Accessibility

**Verified:** screen readers get one sentence ("22.5% of the ₱12,000,000 Project Nehemiah goal raised"); the large
number and the illustration are hidden from them (`ChurchProgress decorative` → `aria-hidden="true"`,
`focusable="false"`, no `role`/`aria-label`). The hero's `ChurchProgress` keeps its label.

## 10. Client / Server Behavior

**Verified:** server component, no state; rendered on each request of the dynamic Donate page.

## 11. Reuse Guidelines

Always pass `pct` from `fundedPercent()` with the same `raised`/`goal` as the rest of the page.

## 12. Modification Constraints

- Keep it immediately above the Giving Wall; keep the accessible sentence and the percentage display.
- The 268px / 362px thresholds are tied to the current sentence, goal amount, font and church sizes. If any of these
  change, re-measure (the sentence must not reach a third line where the church is shown) and update them.

## 13. Known Issues / Technical Debt

- **Verified:** thresholds were measured in Chrome with the self-hosted Figtree font; other browsers were not
  measured (~2px safety margin is built in).
- The card is taller than before the illustration was added (see §8).

## 14. Open Questions

1. **Owner confirmation:** the sentence wording ("of the ₱X Project Nehemiah goal raised").
2. Is the taller card (119px in the desktop sidebar) acceptable?

## 15. Implementation Notes

**Tests:** `lib/progress.test.ts` (normal, zero, capped, no division by zero), `components/FundraisingPercent.test.ts`
(percentage and screen-reader sentence unchanged for normal / zero / capped; the `ChurchProgress` drawing is rendered
before the percentage and text; decorative; size and layout classes), `components/ChurchProgress.test.ts` (default vs
decorative accessibility).

## 16. References

`components/FundraisingPercent.tsx`, `components/FundraisingPercent.test.ts`, `components/ChurchProgress.tsx`,
`components/ChurchProgress.test.ts`, `lib/progress.ts`, `lib/progress.test.ts`, `app/donate/page.tsx`,
`docs/pages/donate.md`.
