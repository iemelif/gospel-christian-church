# PersonCard

Source: `components/PersonCard.tsx` · Type: Server · Used by: `OfficerBoard`, `/leadership`, `/` (Home leaders)

## 1. Purpose

**Verified:** one card for one person: avatar, display name, main role, and any other roles.

## 2. Current Implementation

**Verified:** renders `li` → `Avatar` → `h3` (display name) → `p` (first role) → `p` (other roles joined with
" · ", only if any).

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `person` | `Person` (`lib/officers.ts`) | `{ name: "Last, First"; roles: string[]; photo?: string }` — produced by `toPeople()` |
| `large` | `boolean?` (default `false`) | Passes on to `Avatar` for the 124px size (officer board rows 1–2) |
| `href` | `string?` | Makes the whole card a `next/link` (`<li class="flex">` → block link, crimson border on hover/focus, visible focus ring, no transition with reduced motion). Used on Home with `/officers` |

## 4. Data Dependencies

**Verified:** `displayName()` converts "Last, First" to "First Last". Role order is decided by the caller
(`toPeople` featured roles).

## 5. Pages / Components Using It

**Verified:** `OfficerBoard` (all three rows) and `app/leadership/page.tsx` (each group).

## 6. Layout and Structure

**Verified:** the root element is an `<li>`, so it **must** be placed inside a `ul`/`ol` (callers use a `ul`
with `peopleGrid` from `lib/ui.ts`).

## 7. Design System / CSS

**Verified:** Tailwind classes: card `rounded-xl border border-line bg-card px-4 py-5 text-center`; name
`text-[18px] leading-[1.25]` (serif from the base heading rule); main role `mt-1.5 mb-0 text-[14px]
font-semibold text-crimson`; other roles `mt-1 mb-0 text-[13px] text-mute`.

## 8. Responsive Behavior

Width is controlled by the parent grid (`peopleRowTop` / `peopleRowRest` in `lib/ui.ts`).

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
`app/leadership/page.tsx`, `lib/ui.ts`.
