# GiveForm

Source: `components/GiveForm.tsx` · Type: **Client** · Used by: `app/donate/page.tsx`

## 1. Purpose

**Verified:** lets a donor record a pledge to **Project Nehemiah** (amount, frequency, details, payment
method), then shows a receipt with a reference number and payment instructions. **No money is taken on the
site**; the donor pays separately and the treasurer confirms in `/admin`. Gift recording is protected by
Google reCAPTCHA v3 (invisible).

## 2. Current Implementation

**Verified:** default export `GiveForm()` (no props), an internal `MethodDetails({ id, receipt? })` that looks
up the method and renders `PaymentDetails` in a dashed box (`receipt` centres it at max 500px, enough for the QR on
the left and the details on the right from ~600px viewports; it stacks on phones). For GCash and Maya
the box shows the **QR code** plus the account details — both **before Record Gift** (for the selected method) and
**on the receipt**; Bank Transfer and Cash at Church show details only (see [payment-details.md](payment-details.md)).
`MethodDetails` is exported for tests, and a module
uses the shared `recaptchaToken(RECAPTCHA_ACTION)` (`lib/recaptchaClient.ts`, also used by the Admin sign-in) to ask
reCAPTCHA v3 for a token. Two views: the form, or the receipt once a pledge
is recorded.

## 3. Props / Inputs

None. User inputs: preset amount (radio) or custom amount (number), frequency (One-time / Monthly), full
name, **email (optional)**, optional message/prayer request, "Anonymous" checkbox, payment method (radio).

## 4. Data Dependencies

**Verified (`lib/config.ts`):**
- `AMOUNTS` (500, 1,000, 2,500, 5,000, 10,000, 50,000), `AMOUNT_NOTES` (captions), `php()`.
- `PAYMENT_METHODS`: the chips show each method's `label` (GCash, Maya, Bank Transfer, Cash at Church); the
  submitted value is its unchanged `id` (`GCash`, `Maya`, `Bank transfer`, `Cash at church`). Details come
  from build-time `NEXT_PUBLIC_*` values (or "please email" text when unset/placeholder), rendered by
  `PaymentDetails`.
- `CHURCH.campaign` ("Project Nehemiah") in the receipt text.
- `RECAPTCHA_SITE_KEY` (from `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) and `RECAPTCHA_ACTION` (`"record_gift"`).

Defaults: ₱1,000, One-time, first method (GCash).

## 5. Pages / Components Using It

**Verified:** `app/donate/page.tsx` inside a card (`cardBox`, padding 28px / 20px ≤800px) in `section#give`;
therefore also on `/` (temporary Home). Renders `PaymentDetails` and `CopyButton`.

## 6. Layout and Structure

**Verified:** `form` (`noValidate`) with
three `fieldset`s, each with a numbered `legend`: 1 "Choose your gift" (amount radio cards, custom amount,
One-time / Monthly chips, monthly hint with the yearly total); 2 "Your details" (name and "Email (optional)"
in two columns, message `textarea`, "Anonymous" checkbox); 3 "How will you send it?" (payment-method chips +
`MethodDetails`). Then the error line, full-width submit button (label shows the amount), the fine print, and
`<RecaptchaNotice />` — when a site key is set, it loads Google reCAPTCHA v3 (`next/script`) and shows Google's
notice with links to Google's Privacy Policy and Terms of Service.
Receipt view: ✓ circle, "Thank you, <first name>.", "Your pledge of ₱X to Project Nehemiah is recorded.",
monospace reference, copy button, `MethodDetails`, "Give again" and "Print receipt".

## 7. Design System / CSS

**Verified:** Tailwind classes. Shared strings from `lib/ui.ts`: `input`, `label`, `errorText`, `muted`,
`cardTitle`, `btn.primaryFullLg`, `btn.ghost`. Local constants: `fieldset`, `legend`, `stepNo`, `radioInput`,
`amountSpan`, `chipLabel`, `chipSpan` (radio "cards" with `peer-checked:` / `peer-focus-visible:`). The
"(optional)" hint is `font-normal text-mute`. The reCAPTCHA notice is `text-[12px] text-mute`. The Google
badge is hidden by `.grecaptcha-badge { visibility: hidden }` in `app/globals.css` (allowed only together with
the notice).

## 8. Responsive Behavior

**Verified:** ≤800px: name/email stack; the parent card's padding shrinks to 20px. ≤420px: amount buttons in 2
columns. Print: buttons hidden, so the receipt prints cleanly.

## 9. Accessibility

**Verified:** `fieldset`/`legend` grouping; name, email and message have `label htmlFor` (the email label says
"(optional)"); custom amount has `aria-label`; radio inputs are visually hidden but focusable with a visible
outline on the styled span; error line `role="alert"`; receipt `aria-live="polite"`; submit disabled while
busy. reCAPTCHA v3 shows no challenge.

## 10. Client / Server Behavior

**Verified — why `"use client"`:** 11 `useState` values, event handlers, `useRouter().refresh()`, `fetch`,
`window.print()`, `window.grecaptcha`, `next/script`.

**Data flow:**
1. Submit → client check (amount > 0 only; email is never required client-side).
2. `recaptchaToken()`: waits for `grecaptcha.ready`, then `grecaptcha.execute(RECAPTCHA_SITE_KEY, { action:
   "record_gift" })`. If there is no site key, the script did not load, or execution fails, it returns `""`.
3. `POST /api/gifts` with `{ amount, freq, method, name, email, message, anon, recaptchaToken }`.
4. The server validates the fields, verifies the token with Google, and only then saves the gift as `pending`
   (details: [docs/pages/donate.md](../pages/donate.md) §13). Response `{ ref, amount, freq, method }`.
5. The client shows the receipt and calls `router.refresh()`.

**Error handling (verified):** a non-OK response shows `data.error` (e.g. "We couldn't verify your request.
Please reload the page and try again." for a missing/failed reCAPTCHA check); a thrown error (network failure
or a non-JSON response) shows "Could not reach the server…".

**Security-sensitive behaviour (verified):**
- No payment data is collected. Email is optional, stored only for the treasurer, never shown publicly.
- Only the **public** site key is in the browser; the secret key never reaches client code.
- The token is sent to the server once and is not stored; the server rejects gifts without a valid token.
- Name and message appear on the public Giving Wall only after treasurer confirmation ("Anonymous" if
  requested), rendered as text by React.

## 11. Reuse Guidelines

Use as-is inside a card; it owns its state, reCAPTCHA call and API call. Change amounts, captions, payment
methods and labels in `lib/config.ts`. Don't render two instances on one page (duplicate `id`s and radio
`name`s).

## 12. Modification Constraints

- Keep payload field names in sync with `app/api/gifts/route.ts` and the `Gift` type (`lib/store.ts`).
- Never change payment method **ids**; change `label` instead.
- Keep the action `record_gift` shared through `RECAPTCHA_ACTION` (the server requires the same value).
- If the reCAPTCHA notice is removed, the Google badge must be shown again (remove the CSS rule).
- Server validation is authoritative; don't rely on the client check.

## 13. Known Issues / Technical Debt

**Verified, not fixed:**
- Non-JSON error responses are reported as a connection problem.
- `router.refresh()` after a pledge changes nothing visible (new pledges are pending).
- Custom amounts with decimals are silently rounded by the server.
- The thank-you heading uses the first word of the typed name, even when "Anonymous" is chosen (only visible
  to the donor).
- Without `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (e.g. a local setup without keys) every submission is rejected by
  the server with the verification error.

## 14. Open Questions

1. **Unknown:** whether amount captions ("A brick" … "A foundation stone") reflect real building costs.
2. Keep the reCAPTCHA badge hidden (current) or show it? ([donate.md](../pages/donate.md) §14)

## 15. Implementation Notes

Selecting a preset clears the custom amount; typing a custom amount sets `amount` to `Number(value)` (empty →
0 → invalid). "Give again" resets the receipt and message but keeps name, email and amount. The reCAPTCHA
script is only rendered when `RECAPTCHA_SITE_KEY` is non-empty; `next/script` loads it once.

## 16. References

`components/GiveForm.tsx`, `components/PaymentDetails.tsx`, `components/CopyButton.tsx`, `lib/config.ts`,
`lib/recaptcha.ts`, `app/api/gifts/route.ts`, `app/api/gifts/route.test.ts`, `lib/store.ts`,
`app/donate/page.tsx`, `lib/ui.ts`, `app/globals.css`, `docs/pages/donate.md`.
