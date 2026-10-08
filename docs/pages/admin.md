# Treasurer Dashboard (Admin)

Route: `/admin` · Files: `app/admin/layout.tsx`, `app/admin/page.tsx` · Status: **Complete** (internal)

## 1. Purpose

**Verified:** lets the treasurer review pledges recorded on `/donate`, **confirm** them once money is
received (only confirmed gifts count toward the public total and giving wall), **undo** a confirmation, and
**delete** pending pledges.

## 2. Current State

**Verified:** fully implemented as a client component. Not linked from anywhere; hidden from search engines.

## 3. Existing Layout

**Verified:** `app/admin/layout.tsx` wraps content in `<main id="main">`; the site header and footer still
appear (root layout). Inside a `wrap` with `py-10`:
- Loading: "Loading…" while checking for an existing session.
- Signed out: card form (max 380px) with "Admin password", error line, "Sign in" button ("Signing in…" and
  disabled while reCAPTCHA and the request run), note about one-day sign-in, then Google's reCAPTCHA notice
  (`RecaptchaNotice`, only when a site key is set).
- Signed in: heading row (`h2` "Treasurer dashboard" + "Log out"), summary line (confirmed total through this
  site, pending count), error line, card with a horizontally scrollable `table`: Date, Ref, Donor (name +
  email — blank when the donor gave none, since email is optional), Amount (+ frequency), Method (the stored
  id, e.g. `Bank transfer`, not the donor-facing label), Status, actions.

## 4. Existing Design System

**Verified:** Tailwind classes and `lib/ui.ts` strings: `wrap`, `h2`, `card`, `label`, `input`,
`errorText`, `muted`, `sub`, `btn.primaryFull` (Sign in), `btn.primarySm` (Confirm), `btn.ghostSm` (Delete,
Undo, Log out). Table cells use a local `cell` string (bottom border, `px-2 py-2.5`, left-aligned, top-aligned);
the actions cell adds `whitespace-nowrap`. No inline styles.

## 5. Existing Components to Reuse

**Verified:** `RecaptchaNotice` (loads Google reCAPTCHA v3 + shows Google's notice; shared with `GiveForm`),
`signInWithRecaptcha()` (`lib/adminSignIn.ts`), `php()` and the `Gift` type; the rest of the UI is inline in
`app/admin/page.tsx`.

## 6. Existing Assets

None.

## 7. Content Requirements

**Verified:** UI copy is hard-coded in `app/admin/page.tsx`. Amounts formatted with `php()`; dates with
`toLocaleDateString("en-PH")`.

## 8. Proposed Page Structure

No change proposed.

## 9. Responsive Behavior

**Verified:** the table's card has `overflow-x-auto`; no admin-specific breakpoints.

## 10. Accessibility

**Verified:** labelled password input, `role="alert"` error lines (reCAPTCHA failures appear there too).
reCAPTCHA v3 is invisible (no puzzle or checkbox). Delete uses the browser `confirm()` dialog.
Heading is `h2` (no `h1` on this page).

## 11. SEO / Metadata

**Verified (rendered):** title "Treasurer dashboard | Gospel Christian Church", `robots: noindex, nofollow`;
`robots.txt` disallows `/admin` and `/api/`; not in sitemap or navigation. (Unlike pages using `pageMeta`,
it keeps the layout's `og:image`.)

## 12. Implementation Constraints

**Authentication and access (verified, `lib/auth.ts` + API routes):**
- Single shared password from the runtime env var `ADMIN_PASSWORD` (Cloud Run secret; never `NEXT_PUBLIC_`).
  If unset, sign-in always fails and existing sessions are invalid.
- The page shell (`app/admin/page.tsx`, a client component) is served to anyone; protection is enforced by
  the API routes, which return no data without a valid session.
- **reCAPTCHA on Sign in (added 2026-09-29)** — the same Google reCAPTCHA v3 setup as the Donate page's
  **Record** button ([donate.md](donate.md) §12–13), with its own action:
  1. **Browser** (`app/admin/page.tsx` → `signInWithRecaptcha()` in `lib/adminSignIn.ts`): Sign in first asks
     reCAPTCHA for a token with `recaptchaToken(RECAPTCHA_ADMIN_ACTION)` (`lib/recaptchaClient.ts`, the helper
     `GiveForm` uses; action `"admin_sign_in"` in `lib/config.ts`). **No token → the password is never sent**;
     the form shows "Unable to sign in. Please try again." With a token, it
     posts `{ password, recaptchaToken }` to `/api/admin/session`. A `signingIn` flag ignores further submits and
     disables the button until reCAPTCHA and the request finish.
  2. **Server** (`app/api/admin/session/route.ts`): after the rate-limit check, `verifyRecaptcha(token, fetch,
     RECAPTCHA_ADMIN_ACTION)` (`lib/recaptcha.ts`, the Donate verifier) posts the secret and token to Google
     and requires `success`, action `admin_sign_in` (a `record_gift` token is refused) and score ≥
     `RECAPTCHA_MIN_SCORE` (default 0.5). Failure → status from `recaptchaError()` (shared with `/api/gifts`):
     missing token 400, failed check 403, secret missing or Google unreachable 503 (logged without token or
     secret), with the generic sign-in message (below). The
     password is **not checked** and no cookie is set on any failure, and a failed check doesn't count toward the
     wrong-password limit. Only then is the password checked as before.
  3. Keys: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (browser) and `RECAPTCHA_SECRET_KEY` (server-only, never sent to the
     browser, logged or returned) — the Donate page's keys. **Without them nobody can sign in** (fails closed,
     like gift recording); the key's domain list must include every host that serves `/admin`.
  - Not protected by reCAPTCHA (unchanged): Log out (`DELETE /api/admin/session`), `GET /api/admin`, Confirm /
    Undo / Delete (`PATCH /api/admin`) — they require the session cookie.
- **Sign-in error message:** every sign-in failure — no reCAPTCHA token, failed or unavailable reCAPTCHA, wrong
  password, `ADMIN_PASSWORD` not set, unexpected server reply — shows only **"Unable to sign in. Please try
  again."** (`SIGN_IN_FAILED` in `lib/adminSignIn.ts`, used by the page and `/api/admin/session`), so the
  message never says which part failed. Unchanged: the rate-limit message (429 "Too many attempts. Try again in a
  few minutes.") and "Could not reach the server. Check your connection and try again." (network error).
- Password check: `POST /api/admin/session` compares HMACs with `timingSafeEqual`. Rate limit: after 8 failed attempts
  from the same key, further attempts get 429 until 15 minutes after the **last** failure (each failure
  extends the window); a success clears the counter. The key is the first entry of `x-forwarded-for`
  (or "unknown"). The counter is **in memory** (per instance, reset on restart) — relies on Cloud Run
  `max-instances=1`.
- **Finding (not tested):** the first `x-forwarded-for` entry can normally be set by the client, so the
  rate limit may be bypassable by varying that header. Documented only; not changed.
- Session: cookie `gcc_admin` = `<expiry>.<HMAC>` keyed by the password; `httpOnly`, `sameSite: strict`,
  `secure` in production, path `/`, max-age 1 day. Changing the password signs everyone out.
- Sign-out: `DELETE /api/admin/session` clears the cookie.
- All admin data calls (`GET`/`PATCH /api/admin`) return 401 without a valid session.
- There are no user accounts, roles, audit log or CSRF token (protection relies on the `sameSite=strict` cookie).

**Business rules (verified, `app/api/admin/route.ts`):** confirmed pledges cannot be deleted (409) — undo
first. All writes go through the serialised `update()` in `lib/store.ts`. `GET` returns all gifts newest
first; a read failure returns 500 ("Could not read the saved pledges…").

**Findings / technical debt (verified in code, not changed):**
- `PATCH` does not validate its body: any `action` other than `"confirm"` or `"delete"` is treated as
  "unconfirm"; an unknown `id` still returns `{ ok: true }`; malformed JSON is not caught (unhandled error).
- The UI only sends valid actions, so this is not reachable through normal use.

## 13. Data / Dependencies

`app/api/admin/route.ts`, `app/api/admin/session/route.ts`, `lib/auth.ts`, `lib/adminSignIn.ts`,
`lib/recaptcha.ts`, `lib/recaptchaClient.ts`, `components/RecaptchaNotice.tsx`, `lib/store.ts` (`gifts.json` in
`DATA_DIR`), `lib/config.ts` (`php`). The dashboard total counts **only gifts confirmed through the site**;
the public total additionally includes `CHURCH.baseRaised`.

Data flow: page load → `GET /api/admin` (401 → sign-in form) → Sign in → reCAPTCHA token (`admin_sign_in`) →
`POST /api/admin/session { password, recaptchaToken }` → Google `siteverify` → password check → sets cookie → `GET` again → action buttons `PATCH /api/admin` → list reloaded. Confirming/undoing changes the
public totals on `/donate` and `/` on their next request (both are `force-dynamic`).

## 14. Open Questions / Owner Input

1. **Unknown:** who besides the treasurer has the password, and how it is rotated.
2. Is a single shared password sufficient long-term (vs individual accounts / audit trail)?

## 15. Implementation Plan

Done: reCAPTCHA v3 on Sign in (2026-09-29). Tests: `lib/adminSignIn.test.ts` (token requested before the request;
password + token sent to `/api/admin/session`; no token → nothing sent; server and network errors shown),
`app/api/admin/session/route.test.ts` (valid token + right password → session cookie; missing token 400,
failed / wrong-action (gift token) / low score 403, unavailable 503 — never a cookie, token and secret not logged;
wrong password 401; 8 wrong passwords → 429 while failed reCAPTCHA checks don't count; Log out clears the cookie
without reCAPTCHA), `lib/recaptcha.test.ts` (action parameter, `recaptchaError`). Browser-verified (production
build, 2026-09-29): with Google's real script the right password signs in and a wrong one shows the usual error;
with a stubbed script the token is requested for `admin_sign_in` and a token Google rejects is refused before the
password; a double-click sends one request.

## 16. References

`app/admin/layout.tsx`, `app/admin/page.tsx`, `app/api/admin/route.ts`, `app/api/admin/session/route.ts`,
`lib/auth.ts`, `lib/auth.test.ts`, `lib/adminSignIn.ts`, `lib/recaptcha.ts`, `lib/recaptchaClient.ts`,
`components/RecaptchaNotice.tsx`, `lib/store.ts`, `app/robots.ts`, `.github/workflows/deploy-prod.yml` / `deploy-staging.yml`,
`README.md`, [donate.md](donate.md).
