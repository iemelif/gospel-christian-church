# Authentication and access control

## 1. Scope (verified)

- The only protected area is the treasurer dashboard: `/admin` UI data via `/api/admin` (`GET`, `PATCH`).
- There are no user accounts, roles, sign-ups or third-party identity providers.
- Everything else is public, including `POST /api/gifts` (anyone can record a pledge).
- The `/admin` page code itself (a static client shell) is served to anyone; data is protected by the API.

## 2. Credentials (verified)

- One shared password: runtime environment variable `ADMIN_PASSWORD` (server-only; never `NEXT_PUBLIC_*`).
- In production it comes from the GitHub secret `ADMIN_PASSWORD`, passed by `deploy.yml` as a plain Cloud
  Run environment variable (not Secret Manager).
- If `ADMIN_PASSWORD` is unset or empty, sign-in always fails and all sessions are invalid.

## 3. Sign-in flow (verified, `app/api/admin/session/route.ts`, `lib/auth.ts`)

1. Admin page loads → `GET /api/admin` (`cache: "no-store"`). 401 → password form.
2. `POST /api/admin/session { password }`.
3. Rate-limit check (§5); then `passwordOk()`: HMAC-SHA256 of input and of `ADMIN_PASSWORD` (fixed key),
   compared with `timingSafeEqual`.
4. Success → cookie set; failure → 401 "Wrong password, or ADMIN_PASSWORD is not set on the server."
5. Page reloads data with the cookie.

## 4. Session (verified)

- Cookie `gcc_admin` = `<expiry ms>.<HMAC-SHA256(expiry)>`, key derived from `ADMIN_PASSWORD`, so changing
  the password invalidates all sessions.
- Attributes: `httpOnly`, `sameSite: "strict"`, `secure` when `NODE_ENV === "production"`, `path: "/"`,
  `maxAge` 1 day. Stateless: no server-side session store, no revocation list.
- Sign-out: `DELETE /api/admin/session` sets an empty cookie with `maxAge` 0.
- Validation: `sessionValid()` checks format, signature (constant-time) and expiry on every admin API call.
- Covered by `lib/auth.test.ts` (password check, tampering, expiry, password change, cookie parsing).

## 5. Rate limiting (verified)

- In-memory `Map` keyed by the first value of `x-forwarded-for` (or `"unknown"`).
- After 8 failures, further attempts return 429 until 15 minutes after the last failure; success clears it.
- Resets on process restart / scale-to-zero; only meaningful with one instance.
- **Finding (not tested):** the first `x-forwarded-for` entry is normally client-controllable, so the limit
  may be bypassable.

## 6. Other protections (verified)

- CSRF: relies on `sameSite: "strict"`; no CSRF token.
- No audit log of who confirmed/deleted what (single shared identity anyway).
- `PATCH /api/admin` does not validate its body (unknown `action` → treated as "unconfirm"; unknown `id` →
  `ok`; malformed JSON → unhandled error).
- `/admin` is `noindex, nofollow` and disallowed in `robots.txt` (not a security control).

## 7. AI-relevant notes

**Proposed:** any AI admin tooling should reuse this session check server-side; public AI endpoints need a
rate limit that does not trust client headers and survives restarts.

## 8. Proposed (not decided)

Secret Manager for `ADMIN_PASSWORD`; validate the `PATCH` body; rate-limit key based on a trusted client
address; audit trail; individual accounts if more than one person administers.

## 9. Unknown / Owner input required

- Who holds the password, how it is shared and rotated (**Unknown**).
- Is a single shared password acceptable long-term (**Owner input required**)?

## 10. References

`lib/auth.ts`, `lib/auth.test.ts`, `app/api/admin/route.ts`, `app/api/admin/session/route.ts`,
`app/admin/page.tsx`, `app/robots.ts`, `.github/workflows/deploy.yml`, `docs/pages/admin.md`.
