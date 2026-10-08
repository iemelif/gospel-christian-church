# Data storage

## 1. What is stored where (verified)

| Data | Storage | Mutable at runtime |
| --- | --- | --- |
| Donation pledges ("gifts") | `DATA_DIR/gifts.json` | **Yes** — the only runtime state |
| Site content, menu, address, links | `content/site.ts` (compiled) | No (redeploy) |
| Officers and terms | `content/officers.ts` (compiled) | No (redeploy) |
| Goal, schedule, payment methods, amounts | `lib/config.ts` + build-time `NEXT_PUBLIC_*` | No (rebuild) |
| Admin session | Signed cookie in the browser (no server-side session store) | — |
| Login rate-limit counters | In-memory `Map` in the server process | Lost on restart |

`DATA_DIR` defaults to `./data` (local; `data/gifts.json` is gitignored and excluded from Docker builds) and
is `/data` on Cloud Run, where a Cloud Storage bucket is mounted as a volume (see [deployment.md](deployment.md)).

## 2. Data model (verified, `lib/store.ts`)

`Gift = { id (UUID), ref ("GCC-" + 6 hex chars), name, email (optional; "" when not given), amount (integer pesos), freq ("One-time" |
"Monthly"), method (payment method id), message, anon (boolean), status ("pending" | "confirmed"),
createdAt (ISO string) }`. The file is a pretty-printed JSON array.

## 3. Access API (verified, `lib/store.ts`)

- `readGifts()`: missing file or empty content → `[]`; any other read error or invalid JSON **throws** (on
  purpose, so a later write cannot overwrite existing pledges with an empty list).
- `writeGifts(g)`: `mkdir -p DATA_DIR`, then `fs.writeFile` of the whole array.
- `update(fn)`: serialises read-modify-write operations through an in-process promise chain, so concurrent
  requests in the same process can't lose updates (covered by `lib/store.test.ts`).
- `summary()`: `raised = CHURCH.baseRaised + sum(confirmed amounts)`; `wall` = last 8 confirmed, newest first,
  name replaced by "Anonymous" when `anon`; `donors` = confirmed count; `pledged` = pending count. On read
  failure it logs and falls back to no gifts.

## 4. Data flows (verified)

- **Pledge:** `GiveForm` → reCAPTCHA v3 token → `POST /api/gifts` → field validation/normalisation → Google
  reCAPTCHA verification (`lib/recaptcha.ts`) → `update(all => [...all, gift])` (status `pending`) →
  `{ ref, amount, freq, method }`. Nothing is saved when validation or verification fails. The reCAPTCHA
  token is **not** stored in the gift.
- **Public read:** `/`, `/donate` call `summary()` on every request. `GET /api/gifts` also returns
  `summary()` but has no caller.
- **Admin:** `GET /api/admin` → all gifts newest first; `PATCH /api/admin` → confirm / unconfirm / delete
  via `update()`; deleting a confirmed gift is refused (409).
- Personal data (email, name, message) leaves the server only to the authenticated admin; the public wall
  shows name (or "Anonymous"), amount and message of **confirmed** gifts only.

## 5. Consistency and durability

**Verified:**
- Correctness relies on **one process**: the `update()` queue is in memory, so Cloud Run is pinned to
  `--max-instances=1`. Multiple instances could overwrite each other's writes.
- Writes are **not atomic** (no temp file + rename). An interrupted or partial write could leave invalid
  JSON; afterwards pledges and admin reads fail with 500 and public totals silently show only
  `baseRaised`.
- No backup, export or migration mechanism exists in the repository.

**Unknown:** Cloud Storage bucket settings (object versioning, retention, backups, location) — not in the repo.
How Cloud Storage FUSE handles concurrent reads during a rewrite is not documented here or tested.

**Proposed (not decided):** atomic write (temp + rename), bucket object versioning or scheduled backups, and
moving to a managed database if multiple instances or more data types (e.g. AI logs) are needed.

## 6. AI-relevant notes

**Verified:** there is no general-purpose data store; adding persistent AI data (conversation logs, caches,
usage quotas) to this file store would inherit the single-instance and non-atomic-write limits.
**Proposed:** keep `gifts.json` personal data out of any AI context unless the owner approves.

## 7. Owner input required

1. Is bucket versioning/backup configured, and who can access the bucket?
2. Data retention policy for donor emails and messages (none implemented).
3. Is moving to a database acceptable if requirements grow?

## 8. References

`lib/store.ts`, `lib/store.test.ts`, `app/api/gifts/route.ts`, `app/api/admin/route.ts`, `lib/config.ts`,
`.github/workflows/deploy-prod.yml` / `deploy-staging.yml`, `.gitignore`, `.dockerignore`.
