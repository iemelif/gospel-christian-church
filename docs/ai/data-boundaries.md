# Data boundaries

> **Status: PLANNED / NOT IMPLEMENTED.** These are proposed rules for any future AI capability, and also
> apply to AI used as a development tool on this repository.

## 1. Classification of existing data (Repository facts)

| Data | Location | Currently public? |
| --- | --- | --- |
| Church name, address, schedule, links | `content/site.ts`, `lib/config.ts` | Yes |
| Officer names and roles | `content/officers.ts` | Yes (officer/leadership pages) |
| Campaign totals (raised, still needed, confirmed count) | `summary()` | Yes (`/support`, `/`) |
| Payment instructions (GCash, Maya, bank details) | Build-time `NEXT_PUBLIC_*` → `PAYMENT_METHODS` | Yes (shown to donors) |
| Giving wall: name or "Anonymous", amount, message excerpt of the last 8 **confirmed** gifts | `summary()` | Yes |
| Donor name, email, amount, frequency, method, message, anonymity flag, reference, status, date | `DATA_DIR/gifts.json` | **No** — admin only |
| Pending pledges | `gifts.json` | **No** |
| Admin password, session cookie | Runtime env `ADMIN_PASSWORD`, browser cookie `gcc_admin` | **Secret** |
| Deployment secrets and identities | GitHub secrets, GCP | **Secret** |
| Local environment files | `.env.local` (gitignored) | **Secret / private** |

## 2. Proposed rules

### Donor data
- AI must **not** read `gifts.json` or call `/api/admin` on any public surface.
- AI must not reveal, infer or confirm whether a specific person gave, how much, or what they wrote.
- Anonymous gifts stay anonymous; AI must never attempt to de-anonymise.
- Prayer requests and messages are not to be processed in bulk by AI.
- Any admin-only use of donor data (e.g. treasurer summaries) is an **Open decision** and would require an
  explicit owner decision, a privacy review, and no transfer of personal data to a third party without
  approval.

### Payment information
- AI may only repeat payment details **exactly** as provided by `PAYMENT_METHODS`, or link to `/support`.
- AI must never generate, guess, reformat, "correct" or suggest alternative account numbers, wallet numbers
  or account names.
- AI must never state that a gift has been received or confirmed; only the treasurer confirms gifts.
- AI must not collect card numbers, bank credentials or payment PINs.

### Secrets
- No AI context, prompt, log or output may contain `ADMIN_PASSWORD`, session cookies, provider API keys,
  GitHub/GCP secrets, `.env.local` contents or credentials embedded in local git configuration.
- Future AI provider keys would be server-side runtime secrets, never `NEXT_PUBLIC_*`.

### Admin data and functions
- AI must not have tools or permissions to confirm, unconfirm or delete pledges, or to sign in to `/admin`.
- Admin-facing AI (if ever approved) must sit behind the existing admin session check, server-side.

### People
- Officer names/roles may only be repeated as published; AI must not infer personal details about them.
- Use of officers' names in AI answers is an **Open decision**.

## 3. For AI as a development tool (Repository facts + Proposed)

- **Fact:** `CLAUDE.md` already forbids printing or committing secrets and editing `data/gifts.json`.
- **Proposed:** development-time AI should never open `data/gifts.json` or `.env.local` contents unless the
  owner explicitly asks, and should never paste such data into documentation.
