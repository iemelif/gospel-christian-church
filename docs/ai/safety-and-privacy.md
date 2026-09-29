# Safety and privacy

> **Status: PLANNED / NOT IMPLEMENTED.** Considerations to resolve before any AI capability is designed.

## 1. Relevant existing conditions (Repository facts)

- The site stores donor personal data (names, emails, messages) in `gifts.json` on a Cloud Storage bucket.
- `POST /api/gifts` is protected by Google reCAPTCHA v3 (the site's only runtime external service); other public
  endpoints have no bot protection. The only rate limiter (admin sign-in) is in-memory, keyed on a
  client-supplied header, and resets on restart (`docs/architecture/authentication.md`).
- Runtime limits: one Cloud Run instance, 512Mi memory, 60s request timeout, scale to zero
  (`docs/architecture/deployment.md`).
- No database for logs, caches or quotas (`docs/architecture/data-storage.md`).
- Only three runtime dependencies; adding an AI SDK would be a new dependency requiring approval (`CLAUDE.md`).

## 2. Risks and proposed mitigations

| Risk | Why it matters here | Proposed mitigation |
| --- | --- | --- |
| Inaccurate or invented answers | Church information pages are mostly empty; AI could fill gaps with fabrications | Answer only from approved sources; say "I don't know" and point to the church contact |
| Wrong payment details | Direct financial harm to donors and the church | Payment details only verbatim from `PAYMENT_METHODS` or link to `/donate` ([data-boundaries.md](data-boundaries.md)) |
| Donor privacy | Personal data; possible obligations under the Philippine Data Privacy Act (RA 10173) — **legal applicability not assessed** | Keep donor data out of AI entirely unless an explicit, reviewed decision says otherwise |
| Prompt injection | Public free-text input could attempt to extract instructions or data | Give public AI no tools and no access to private data; curated public context only |
| Cost abuse | Each AI call costs money; current rate limiting is insufficient | Robust per-client limits, spending cap, alerts |
| Conversation logs | Visitors may type personal information | Decide whether to log at all; retention and access rules first |
| Religious content | Answers on faith or doctrine represent the church | Only leadership-approved sources; hand off to the pastor for pastoral or doctrinal questions |
| Minors and vulnerable users | The church has youth organisations (officer roles include President of Youth) | Narrow scope, no collection of personal data, safe hand-offs |
| Transparency | Visitors should know they're talking to AI | Clear AI labelling; state that gifts count only after treasurer confirmation |
| Third-party processing | An external AI provider would receive user input | Provider choice, data-use terms and region are **Open decisions** |

## 3. Development-tool use (Repository facts + Proposed)

- **Fact:** AI (Claude Code) is used on this repository under `CLAUDE.md` rules (no secrets in output, no
  edits to `data/gifts.json`, no deploy-triggering pushes without approval).
- **Fact:** a GitHub access token was found embedded in a local git remote URL on 2026-09-29; the owner was
  advised to revoke it. No value is recorded anywhere in `docs/`.
- **Proposed:** keep secrets out of any files AI tools read routinely; prefer credential helpers.

## 4. Before any AI feature ships (Proposed checklist)

- Owner decisions recorded in [decisions.md](decisions.md) (use case, audience, provider, budget, logging,
  approvals).
- Approved knowledge content exists for the capability.
- Data boundaries implemented and tested.
- Rate limiting and spending cap in place.
- Privacy review, including whether RA 10173 obligations apply.
- AI labelling and a human contact path on the page.
