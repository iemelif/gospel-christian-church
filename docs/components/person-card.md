# PersonCard

Source: `components/PersonCard.tsx` · Type: Server · Used by: `OfficerBoard`, `/leadership`

## 1. Purpose

**Verified:** one card for one person: avatar, display name, main role, and any other roles.

## 2. Current Implementation

**Verified:** renders `li.person` → `Avatar` → `h3` (display name) → `p.role` (first role) → `p.also` (other
roles joined with " · ", only if any).

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `person` | `Person` (`lib/officers.ts`) | `{ name: "Last, First"; roles: string[]; photo?: string }` — produced by `toPeople()` |

## 4. Data Dependencies

**Verified:** `displayName()` converts "Last, First" to "First Last". Role order is decided by the caller
(`toPeople` featured roles).

## 5. Pages / Components Using It

**Verified:** `OfficerBoard` (all three rows) and `app/leadership/page.tsx` (each group).

## 6. Layout and Structure

**Verified:** the root element is an `<li>`, so it **must** be placed inside a `ul`/`ol` (callers use
`ul.people`).

## 7. Design System / CSS

**Verified:** `.person` (white card, border, radius 12px, centred), `.person h3` (18px), `.person .role`
(bold crimson), `.person .also` (muted 13px) in the "inner pages & people" section of `app/globals.css`.

## 8. Responsive Behavior

Width is controlled by the parent grid (`.row-top` / `.row-rest`).

## 9. Accessibility

**Verified:** name is an `h3` (pages provide the `h1`/`h2` above). Image alt text comes from `Avatar`.

## 10. Client / Server Behavior

**Verified:** server component, no state.

## 11. Reuse Guidelines

Use for any list of people; build `Person` objects with `toPeople()` so multiple roles merge correctly.

## 12. Modification Constraints

Keep the `<li>` root or update all callers' list markup.

## 13. Known Issues / Technical Debt

None specific to this component (see [avatar.md](avatar.md) for alt text).

## 14. Open Questions

None.

## 15. Implementation Notes

—

## 16. References

`components/PersonCard.tsx`, `components/Avatar.tsx`, `lib/officers.ts`, `components/OfficerBoard.tsx`,
`app/leadership/page.tsx`, `app/globals.css`.
