# AI decisions

> **Status: PLANNED / NOT IMPLEMENTED.** This log records AI-related context and decisions. Add an entry
> whenever the owner decides something; move items from "Open" to "Recorded" with the date.

## Recorded

| ID | Date | Type | Record |
| --- | --- | --- | --- |
| AI-R1 | 2026-09-29 | Owner-provided | AI is a **future planned capability**, not a public feature. No AI is to be implemented at this stage. |
| AI-R2 | 2026-09-29 | Owner-provided | AI is currently used as a **development tool** only. |
| AI-R3 | 2026-09-29 | Owner-provided | **Project Nehemiah** is the church building project and the reason the fundraising/support page exists. The repository calls the campaign "Church Building Fund"; Project Nehemiah is not yet in the repository's public content. |
| AI-R4 | 2026-09-29 | Repository fact | No AI code, SDK, keys, endpoints or configuration exist in the repository. |
| AI-R5 | 2026-09-29 | Owner-provided | AI documentation limited to vision, knowledge sources, data boundaries, safety/privacy and this log; no AI architecture or prompt/behaviour documentation yet. |
| AI-R6 | 2026-09-29 | Repository fact | The Donate page (`/donate`) now names the campaign **Project Nehemiah** publicly (supersedes the "Church Building Fund" wording in AI-R3 and AI-D1). Gift recording uses Google reCAPTCHA v3 — the site's first runtime external service. |

## Open decisions (Owner input required)

| ID | Question |
| --- | --- |
| AI-D1 | Project Nehemiah: description, story, plans, milestones and timeline (the name is now used on the site — see AI-R6). |
| AI-D2 | Which future AI capabilities (see [vision.md](vision.md)) should be explored, if any? |
| AI-D3 | Audience and languages (e.g. English only, or also Tagalog). |
| AI-D4 | Will the church provide About, Ministries, Contact, history and FAQ content, and should AI wait for it? |
| AI-D5 | May AI answers mention officers by name? |
| AI-D6 | Should AI ever access donor data, even admin-only? (Proposed default: no.) |
| AI-D7 | May AI discuss faith or doctrine, or only practical information? Who approves wording? |
| AI-D8 | AI provider, data-use terms and processing region. |
| AI-D9 | Monthly budget / spending cap. Is adding an AI SDK dependency acceptable? |
| AI-D10 | Should conversations be logged? Retention period and who can access logs. |
| AI-D11 | Who in the church owns and approves AI decisions (pastor, officers, owner)? |
| AI-D12 | Is a privacy/legal review (e.g. RA 10173) required before launch, and who performs it? |
| AI-D13 | When may `docs/ai/architecture.md` and prompt/behaviour documentation be written? |
