# CopyButton

Source: `components/CopyButton.tsx` · Type: **Client** · Used by: `GiveForm`

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

**Verified:** only `GiveForm` — "Copy reference" on the receipt, and "Copy number" / "Copy account number"
inside `MethodDetails` when a method has a `copy` value.

## 6. Layout and Structure

**Verified:** a single `button type="button" class="copy-btn"`.

## 7. Design System / CSS

**Verified:** `.copy-btn` in the "donation redesign" section of `app/globals.css` (small crimson-outlined
button, filled on hover). It does **not** use `.btn`, so it is not hidden by the print rule.

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
unmounted component); failures give no feedback.

## 14. Open Questions

None.

## 15. Implementation Notes

—

## 16. References

`components/CopyButton.tsx`, `components/GiveForm.tsx`, `app/globals.css`.
