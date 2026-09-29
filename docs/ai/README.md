# AI documentation

> **Status: PLANNED / NOT IMPLEMENTED.**
> The website has no AI features. No AI code, SDK, API key, endpoint or configuration exists in the
> repository. Nothing in `docs/ai/` is a commitment to build anything.

## How AI is used today

**Repository fact:** AI is currently used only as a **development tool** — Claude Code assists with
maintaining this repository, guided by `CLAUDE.md` and the documentation in `docs/`. Visitors, donors and
the treasurer do not interact with any AI.

## Purpose of this folder

To record, before any implementation, how AI *could* eventually fit the Gospel Christian Church IEMELIF
website: possible capabilities, which information it may and may not use, and the safety, privacy and
decision framework. Architecture and prompt/behaviour documents will only be written after the owner
approves a specific capability.

## Labels used in these documents

| Label | Meaning |
| --- | --- |
| **Repository fact** | Verified in the code, configuration or existing docs (2026-09-29) |
| **Owner-provided** | Stated by the owner; not (yet) present in the repository |
| **Proposed** | An idea for discussion; not decided, not built |
| **Open decision** | Requires an owner decision; tracked in [decisions.md](decisions.md) |

## Documents

| File | Contents |
| --- | --- |
| [vision.md](vision.md) | Context (incl. Project Nehemiah), possible future capabilities, non-goals |
| [knowledge-sources.md](knowledge-sources.md) | Existing sources, missing content, sources not to use |
| [data-boundaries.md](data-boundaries.md) | What AI may / must not access: donor data, payment info, secrets, admin data |
| [safety-and-privacy.md](safety-and-privacy.md) | Risks, privacy, security, religious content, cost/abuse |
| [decisions.md](decisions.md) | Recorded context and open AI decisions |

## Related documentation

- `docs/architecture/application.md` §7 — technical constraints relevant to AI (single Cloud Run instance,
  512Mi, 60s timeout, no database).
- `docs/architecture/authentication.md`, `data-storage.md`, `configuration.md` — AI-relevant notes.
- `docs/pages/` — what each page currently contains (several are empty placeholders).

## Principles (Proposed)

1. Ground answers only in approved, public church information.
2. Never expose donor data, secrets or admin data through AI.
3. Never generate or alter payment details.
4. Keep humans (church leadership, treasurer) responsible for content, money and pastoral matters.
5. No AI feature ships without an explicit owner decision recorded in [decisions.md](decisions.md).
