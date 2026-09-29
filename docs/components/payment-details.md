# PaymentDetails

Source: `components/PaymentDetails.tsx` · Type: no directive (Server Component on the Donate page, part of the
client tree inside `GiveForm`) · Used by: `app/donate/page.tsx`, `GiveForm` (`MethodDetails`)

Status: **implemented** (QR codes added 2026-09-29; behaviour verified in a browser at 400–1280px).

## 1. Purpose

**Verified:** shows how to send a gift with one payment method: for GCash and Maya a QR code plus the account
details; for every method the detail rows, a copy button where a number exists, and the instruction note.

## 2. Current Implementation

**Verified:** `PaymentDetails({ method, className })`.
- Methods **without** a QR (Bank Transfer, Cash at Church): wrapper `div` (classes from the caller) → `dl` of
  `[label, value]` rows → `CopyButton` when `method.copy` is set ("Copy account number" for id `Bank transfer`,
  otherwise "Copy number") → `p` with the note. Unchanged from before the QR work.
- Methods **with** a QR (GCash, Maya): the same wrapper plus `@container`, containing a flex row: the QR image
  (`next/image`, `unoptimized`, intrinsic width/height) on the **left**, and the same details block on the
  **right**; stacked when the container is narrow (§8).

Every value comes from `PAYMENT_METHODS` (`lib/config.ts`, built from `NEXT_PUBLIC_GCASH_NUMBER`,
`NEXT_PUBLIC_MAYA_NUMBER`, `NEXT_PUBLIC_BANK_DETAILS`); nothing is hard-coded in the component.

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `method` | `PaymentMethod` (`lib/config.ts`) | `{ id, label, rows, copy?, note, qr? }` |
| `className` | `string` | Wrapper classes supplied by the caller |

`qr` is `PaymentQr = { src, width, height, alt }` in `lib/config.ts`. It is set for GCash and Maya **only when that
method's details are configured** (the same `isSet` rule as the rows), so a QR never appears next to the
"please email the church" fallback. Payment method ids and payment details are unchanged.

## 4. Data Dependencies

**Verified** QR files in `public/images/payments/` (QR-only square codes; the config sizes are checked against
the files by `lib/config.test.ts`):

| Method (id) | File / URL | Intrinsic size | QR modules | Alt text |
| --- | --- | --- | --- | --- |
| `GCash` | `qrcode-gcash.jpg` → `/images/payments/qrcode-gcash.jpg` | 441×442 | ~70 | "GCash QR code for sending your gift" |
| `Maya` | `qrcode-maya.jpg` → `/images/payments/qrcode-maya.jpg` | 663×663 | ~66 | "Maya QR code for sending your gift" |
| `Bank transfer` | — (no QR yet) | — | — | — |
| `Cash at church` | — | — | — | — |

The two images were replaced by the owner on 2026-09-29 (earlier versions were full app screenshots). The
`*:Zone.Identifier` files that used to sit next to them are gone.

## 5. Pages / Components Using It

**Verified:**
- Donate page "Ways to send your gift" cards (`section#ways`), heading = `method.label`.
- `GiveForm` → `MethodDetails`: the dashed details box **above the Record Gift button** (for the selected method)
  and the same box **on the receipt** (centred, max 500px — wide enough for QR-left / details-right). The QR
  appears in both places for GCash and Maya.

## 6. Layout and Structure

**Verified (rendered):** GCash and Maya — QR on the left, account number / account name / copy button / note on
the right when the container is ≥460px; QR stacked above the details below that. Bank Transfer and Cash at Church
— single column as before.

## 7. Design System / CSS

**Verified:** Tailwind only. QR image `block h-auto w-full max-w-[240px] shrink-0 @min-[460px]:w-[180px]`; row
`flex flex-col items-start gap-4 @min-[460px]:flex-row @min-[460px]:gap-5`. **No rounded corners on the QR**: the
codes have almost no built-in quiet zone (≈0.6 module), so rounding would clip the corner squares; the white or
off-white box around them provides the quiet zone. `dt` muted (118px min width), `dd` bold and wrapping.

## 8. Responsive Behavior

**Verified (browser measurements, 2026-09-29):**

| Where | Viewport | Layout | QR size | CSS px per module |
| --- | --- | --- | --- | --- |
| `#ways` cards | 750–1280 | side by side | 180px | ≈2.5 (GCash) / 2.7 (Maya) |
| `#ways` cards | 400 | stacked | 240px | ≈3.4 / 3.6 |
| Form box (before Record Gift) | 1280 | side by side | 180px | ≈2.5 / 2.7 |
| Form box (before Record Gift) | 400 | stacked | 240px | ≈3.4 / 3.6 |
| Receipt box | 600–1280 | side by side (box 500px) | 180px | ≈2.5 / 2.7 |
| Receipt box | 375–480 | stacked | 240px | ≈3.4 / 3.6 |
| Receipt box | 320 | stacked | 212px | ≈3.0 / 3.1 |

No element overflowed its card at any width checked. Rule: the QR is never shrunk below 180px to stay beside the
text; it stacks instead.

## 9. Accessibility

**Verified:** each QR `img` has the alt text in §4. The account number and copy button stay available as text,
so donors who cannot scan have everything they need.

## 10. Client / Server Behavior

**Verified:** no state of its own; `CopyButton` is the only client part. QR images are static files served as-is
(`unoptimized`) with intrinsic dimensions, so the aspect ratio is kept and there is no layout shift.

## 11. Reuse Guidelines

Pass a `PaymentMethod` from `PAYMENT_METHODS`; never pass hand-written details. A new QR belongs in the method's
`qr` entry in `lib/config.ts` (with the file's real size).

## 12. Modification Constraints

- Never change payment method ids (`GCash`, `Maya`, `Bank transfer`, `Cash at church`) or payment details; the
  copy-label choice compares the id `Bank transfer`.
- Do not rename or move the QR files. If an image is replaced, update its `width`/`height` in `lib/config.ts`
  (`lib/config.test.ts` fails otherwise).
- Keep the QR ≥180px and unrounded; keep it stacking rather than shrinking.

## 13. Known Issues / Technical Debt

- **Verified:** the QR images belong to the accounts shown in the configured details only if the owner keeps them
  in sync; the code cannot check that.
- **Verified:** scanning was not tested with a real phone during development; sizes follow the ≥2.5 CSS px per
  module rule.

## 14. Open Questions

1. Confirm by scanning with the GCash and Maya apps that both codes open the right accounts.
2. Alt text wording ("… QR code for sending your gift") — confirm.
3. Bank Transfer (Security Bank): add a QR later?

## 15. Implementation Notes

**Tests:** `components/PaymentDetails.test.ts` (GCash/Maya paths, intrinsic sizes, alt text, layout classes, no
rounding, Bank Transfer / Cash at Church unchanged, no QR when not configured), `components/GiveForm.test.ts`
(QR before Record Gift and on the receipt), `lib/config.test.ts` (QR only for GCash/Maya; sizes match the files).

## 16. References

`components/PaymentDetails.tsx`, `components/GiveForm.tsx`, `components/CopyButton.tsx`, `lib/config.ts`,
`app/donate/page.tsx`, `public/images/payments/`, `docs/pages/donate.md`, `docs/components/give-form.md`.
