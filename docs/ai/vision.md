# AI vision

> **Status: PLANNED / NOT IMPLEMENTED.** Nothing here is approved or scheduled.

## 1. Website context

**Repository facts:**
- The site serves Gospel Christian Church IEMELIF, Zone 7 Frances, Calumpit, Bulacan (`content/site.ts`).
- Current features: a Donate page for Project Nehemiah (`/donate`) where donors record pledges and receive payment
  instructions (no online payment); a password-protected treasurer dashboard (`/admin`) that confirms
  pledges; officer, leadership and past-term pages; service schedule in the footer.
- The fundraising campaign is named **"Project Nehemiah"** in code (`CHURCH.campaign`, `lib/config.ts`), with a
  default goal of ₱12,000,000 and ₱2,700,000 raised before the site went live.
- About Us, Ministries and Contact Us are **empty placeholders**. The repository contains no church history,
  mission, beliefs or ministry descriptions.
- A new Home page is planned; its content has not been provided yet (`docs/pages/home.md`).

**Owner-provided context:**
- **Project Nehemiah** is the church building project, and it is the reason the Donate page exists. Since
  2026-09-29 the site uses the name publicly (Donate page, metadata, site description); no further project
  details have been provided.
- Details of Project Nehemiah (story, plans, milestones, timeline, how the name should appear publicly) have
  not been provided. See [decisions.md](decisions.md).

## 2. Current use of AI

**Repository fact:** AI is a development tool only (Claude Code working on this repository). There is no
public or admin-facing AI feature.

## 3. Possible future capabilities (Proposed, unordered, not committed)

Listed without ranking. Each would require an owner decision before any design work.

| Capability | Possible audience | Depends on |
| --- | --- | --- |
| Visitor Q&A about practical church information (services, location, how to visit, who leads the church) | Visitors | Approved public content; see [knowledge-sources.md](knowledge-sources.md) |
| Giving guidance: explaining how pledging works, the payment methods and reference numbers, and Project Nehemiah | Donors | Approved Project Nehemiah content; strict payment rules in [data-boundaries.md](data-boundaries.md) |
| Drafting help for church content (e.g. page text, announcements, thank-you notes) reviewed by a person before use | Owner / church leadership | Admin-only access; human review |
| Converting officer lists into the `content/officers.ts` format for a developer to review | Maintainer | Could remain a development-time task |
| Language support (e.g. English and Tagalog) for any visitor-facing capability | Visitors | Owner decision on languages |
| Summaries for the treasurer (e.g. pledge activity) | Treasurer | Donor-data decision; see [data-boundaries.md](data-boundaries.md) |
| Scripture or devotional content | Visitors | Church leadership approval |

## 4. Non-goals (Proposed)

AI would **not**:
- take, process or confirm payments, or change pledge status;
- create, modify or "correct" payment account details;
- answer questions about individual donors or pledges on public surfaces;
- provide pastoral counselling or speak for church leadership on doctrine without approved sources;
- invent church history, beliefs, ministries, people, schedules or events.

## 5. Preconditions (Proposed)

- Real content for Home, About Us, Ministries and Contact Us, and for Project Nehemiah.
- Decisions on audience, languages, provider, budget, logging and approvals ([decisions.md](decisions.md)).
- Resolution of the relevant technical constraints (`docs/architecture/`).
