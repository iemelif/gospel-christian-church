# CopyButton

Source: `components/CopyButton.tsx` · Type: **Client** · Used by: `GiveForm`, `PaymentDetails`

## 1. Purpose

**Verified:** a small button that copies a value (reference number, wallet number, account number) to the
clipboard and briefly shows "Copied".

## 2. Current Implementation

**Verified:** local `done` state; on click calls `navigator.clipboard.writeText(value)`, sets `done` for
2 seconds, then reverts. Clipboard failures are swallowed (the value is visible on screen to copy by hand).

## 3. Props / Inputs

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string` | required — text to copy |
| `label` | `string` | `"Copy"` |

## 4. Data Dependencies

None.

## 5. Pages / Components Using It

**Verified:** `GiveForm` ("Copy reference" on the receipt) and `PaymentDetails` ("Copy number" / "Copy account
number" when a method has a `copy` value), which is rendered both inside `GiveForm` and in the "Ways to send your
gift" cards on the Donate page.

## 6. Layout and Structure

**Verified:** a single `button type="button"`.

## 7. Design System / CSS

**Verified:** Tailwind classes on the button: small crimson-outlined button (`border-[1.5px] border-brand
bg-card text-brand text-[13px] font-semibold rounded-md px-3 py-[5px] leading-[normal]`), filled on hover
(`hover:bg-brand hover:text-white`). It does not use the `btn.*` strings, so it is **not** hidden when printing.

## 8. Responsive Behavior

No specific rules.

## 9. Accessibility

**Verified:** `aria-live="polite"` on the button so the "Copied" text change is announced; real `button`
element. The label change is the only feedback (no toast).

## 10. Client / Server Behavior

**Verified — why `"use client"`:** `useState`, click handler, `navigator.clipboard`, `setTimeout`. No
network calls. The Clipboard API requires a secure context (HTTPS or localhost).

## 11. Reuse Guidelines

Reusable anywhere a value should be copyable; pass a clear `label`. Keep `type="button"` so it never
submits a surrounding form.

## 12. Modification Constraints

None beyond keeping `type="button"`.

## 13. Known Issues / Technical Debt

**Verified, not fixed:** the 2-second timer is not cleared on unmount (harmless state update on an
unmounted component); failures give no feedback. The hover fill applies only on devices that support hover
(Tailwind v4 `hover:`).

## 14. Open Questions

None.

## 15. Implementation Notes

—

## 16. References

`components/CopyButton.tsx`, `components/GiveForm.tsx`, `components/PaymentDetails.tsx`.
