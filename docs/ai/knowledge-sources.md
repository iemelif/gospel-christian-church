# Knowledge sources

> **Status: PLANNED / NOT IMPLEMENTED.** No AI feature uses any of these sources today.

## 1. Existing public sources in the repository (Repository facts)

These are already published on the website and are candidates for grounding a future public AI feature
(subject to [decisions.md](decisions.md)).

| Source | Contains | Notes |
| --- | --- | --- |
| `content/site.ts` | Church name, address, IEMELIF link, Facebook link, menu, site URLs | Address has display and structured forms |
| `lib/config.ts` → `SCHEDULE` | Service names, days, times | |
| `lib/config.ts` → `CHURCH` | Campaign name ("Project Nehemiah"), goal, amount raised before the site, church email | Goal/base/email come from build-time public variables with code defaults |
| `lib/config.ts` → `PAYMENT_METHODS` | Payment method names, instruction rows, notes | Must be used **verbatim**; see [data-boundaries.md](data-boundaries.md) |
| `lib/config.ts` → `AMOUNTS`, `AMOUNT_NOTES` | Preset amounts and captions ("A brick" …) | Whether captions reflect real costs is **Unknown** |
| `content/officers.ts` | Current term (2026 - 2027) and past terms' officers and roles | Names of real people; published on the site. Use in AI is an open decision |
| `lib/store.ts` → `summary()` (public fields only) | Amount raised, confirmed gift count | Already public on `/donate`; must exclude personal fields (email is never part of it) |
| `app/donate/page.tsx` copy | How giving works (3 steps), ways to send a gift, trust statements, 2 Corinthians 9:7 quotation | Hard-coded page text |

## 2. Owner-provided context (not in the repository)

- **Project Nehemiah** is the church building project behind the fundraising page. No descriptive content
  has been provided yet; until it is, AI must not describe the project beyond this fact.

## 3. Content that does not exist yet (Owner input required)

- Church history, mission, beliefs and relationship to IEMELIF.
- Ministry descriptions, leaders and meeting times.
- Contact channels (phone, general vs giving email, office hours).
- Project Nehemiah details: story, building plans, milestones, timeline, public naming.
- Home page content.
- Approved FAQ and approved wording for sensitive topics.

AI must treat these as **unknown**, not fill them in.

## 4. Sources not to use (Proposed)

| Source | Reason |
| --- | --- |
| `information.md` | Officer lists are stale compared with `content/officers.ts` (see `docs/pages/officers.md`) |
| `data/gifts.json` / `DATA_DIR` | Donor personal data — see [data-boundaries.md](data-boundaries.md) |
| `.env.local`, environment variables, GitHub/GCP secrets | Secrets |
| `README.md`, `CLAUDE.md`, `docs/architecture/`, `docs/components/` | Developer documentation, not public church information |
| `docs/pages/` (raw) | Developer specs; may be used to understand page purpose, but public answers should come from published content |

## 5. Keeping sources current (Repository facts + Proposed)

- **Fact:** content in `content/` and `lib/config.ts` is compiled into the site and changes only on redeploy;
  `NEXT_PUBLIC_*` values change only on rebuild.
- **Fact:** officer terms change yearly by editing `content/officers.ts`.
- **Proposed:** any AI knowledge should be derived from the same modules the pages use, so the website and
  AI answers cannot disagree; content owners should not maintain a separate AI copy.
