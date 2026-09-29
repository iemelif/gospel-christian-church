# GiveForm

Source: `components/GiveForm.tsx` · Type: **Client** · Used by: `app/support/page.tsx`

## 1. Purpose

**Verified:** lets a donor record a pledge to the Church Building Fund (amount, frequency, details, payment
method), then shows a receipt with a reference number and payment instructions. **No money is taken on
the site**; the donor pays separately and the treasurer confirms in `/admin`.

## 2. Current Implementation

**Verified:** default export `GiveForm()` (no props) plus internal `MethodDetails({ id, receipt? })`, which renders
the selected payment method's detail rows, an optional `CopyButton`, and a note (`receipt` centres and narrows
the box on the receipt view). Two views: the form, or the
receipt once a pledge is recorded.

## 3. Props / Inputs

None. User inputs: preset amount (radio) or custom amount (number), frequency (One-time / Monthly), full
name, email, optional message/prayer request, "Anonymous" checkbox, payment method (radio).

## 4. Data Dependencies

**Verified (`lib/config.ts`):** `AMOUNTS` (500, 1,000, 2,500, 5,000, 10,000, 50,000), `AMOUNT_NOTES`
(captions), `PAYMENT_METHODS` (GCash, Maya, Bank transfer, Cash at church — rows built from build-time
`NEXT_PUBLIC_*` values, or "please email" text when unset/placeholder), `php()` formatter.
Defaults: ₱1,000, One-time, first method (GCash).

## 5. Pages / Components Using It

**Verified:** `app/support/page.tsx` inside a card (`cardBox`, padding 28px / 20px ≤800px) in `section#give`; therefore also on `/`
(temporary wrapper). Renders `CopyButton`.

## 6. Layout and Structure

**Verified:** `form` (`noValidate`) with three `fieldset`s, each with a numbered `legend` (crimson number
circle): 1 "Choose your gift" (grid of amount radio cards, custom amount input, One-time / Monthly chips,
monthly hint showing the yearly total); 2 "Your details" (name/email in two columns, message `textarea`,
"Anonymous" checkbox); 3 "How will you send it?" (payment-method chips + `MethodDetails`). Then the error
line, full-width submit button (label shows the amount), and fine print. Receipt view: crimson ✓ circle,
thank-you `h3` using the first word of the name, pledge summary, monospace reference, copy button,
`MethodDetails`, "Give again" and "Print receipt" buttons.

## 7. Design System / CSS

**Verified:** Tailwind classes. Shared strings from `lib/ui.ts`: `input`, `label`, `errorText`, `muted`,
`cardTitle`, `btn.primaryFullLg` (submit), `btn.ghost` (receipt buttons). Local constants in
`components/GiveForm.tsx`: `fieldset`, `legend`, `stepNo`, `radioInput`, `amountSpan`, `chipLabel`, `chipSpan`.
Radio cards: the real radio is transparent (`peer absolute opacity-0`) and the following `span` shows the state
with `peer-checked:` (crimson border + 1px crimson ring + gold tint, via `color-mix`) and
`peer-focus-visible:` (3px blue outline).

## 8. Responsive Behavior

**Verified:** ≤800px (`max-md:`): name/email stack; the parent card's padding shrinks to 20px. ≤420px
(`max-xs:`): amount buttons in 2 columns. Print: buttons are hidden (`print:hidden` in `btn.*`), so the receipt
prints cleanly; header and footer are hidden too.

## 9. Accessibility

**Verified:** `fieldset`/`legend` grouping; name, email and message have `label htmlFor`; custom amount has
`aria-label`; radio inputs are visually hidden but focusable with a visible `:focus-visible` outline on the
styled span; error line `role="alert"`; receipt container `aria-live="polite"`; submit disabled while busy.

## 10. Client / Server Behavior

**Verified — why `"use client"`:** 11 `useState` values, event handlers, `useRouter().refresh()`,
`fetch`, `window.print()`.

**Data flow:**
1. Submit → client check (amount > 0 only).
2. `POST /api/gifts` with JSON `{ amount, freq, method, name, email, message, anon }`.
3. Server (`app/api/gifts/route.ts`) validates and normalises (name required and truncated to 100 chars;
   email pattern after truncation to 120; amount rounded, ₱1–₱12,000,000; method in `PAYMENT_IDS`; freq
   normalised; message truncated to 300), stores the gift as `pending` via `update()` (`lib/store.ts`), and
   returns `{ ref, amount, freq, method }`.
4. Client shows the receipt and calls `router.refresh()`.

**Error handling (verified):** a non-OK response shows `data.error` (or a generic message); a thrown error
(network failure *or* a response that is not JSON) shows "Could not reach the server…".

**Security-sensitive behaviour (verified):** no payment data is collected; email is stored but never shown
publicly; name and message appear on the public giving wall only after treasurer confirmation (name replaced
by "Anonymous" if requested; rendered as text by React, not HTML). `POST /api/gifts` needs no
authentication and has no rate limit or bot protection.

## 11. Reuse Guidelines

Use as-is inside a card (`card`/`cardBox` from `lib/ui.ts`); it owns its state and API call. Change amounts, captions and payment methods in
`lib/config.ts`, not here. Don't render two instances on one page (duplicate `id`s: `name`, `email`, `msg`,
and shared radio `name`s).

## 12. Modification Constraints

- Keep payload field names in sync with `app/api/gifts/route.ts` and the `Gift` type (`lib/store.ts`).
- Method ids are matched as strings (e.g. the bank copy label checks `id === "Bank transfer"`).
- Server validation is authoritative; don't rely on the client check.

## 13. Known Issues / Technical Debt

**Verified, not fixed:**
- Non-JSON error responses (e.g. an HTML 500 page) are reported as a connection problem.
- `router.refresh()` after a pledge changes nothing visible: new pledges are `pending` and the page shows
  only confirmed totals.
- Custom amount accepts decimals client-side; the server silently rounds them.
- Public endpoint without rate limiting → spam pledges are possible (the treasurer can delete pending ones).
- The thank-you heading uses the first word of the typed name, even when "Anonymous" is chosen (only
  visible to the donor).

## 14. Open Questions

1. **Owner input required:** is spam/abuse protection on pledges wanted?
2. **Unknown:** whether amount captions ("A brick" … "A foundation stone") reflect real building costs
   (the config comment suggests they may be replaced).

## 15. Implementation Notes

Selecting a preset clears the custom amount; typing a custom amount sets `amount` to `Number(value)`
(empty → 0 → invalid). "Give again" resets the receipt and message but keeps name, email and amount.

## 16. References

`components/GiveForm.tsx`, `components/CopyButton.tsx`, `lib/config.ts`, `app/api/gifts/route.ts`,
`lib/store.ts`, `app/support/page.tsx`, `lib/ui.ts`, `docs/pages/support.md`.
