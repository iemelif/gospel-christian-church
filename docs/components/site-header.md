# SiteHeader

Source: `components/SiteHeader.tsx` · Type: **Client** · Rendered by: `app/layout.tsx`

## 1. Purpose

**Verified:** the sticky header on every page: IEMELIF and GCC logos, brand name, and the main navigation
with dropdowns (desktop) or a toggle menu (≤1080px).

## 2. Current Implementation

**Verified:** default export `SiteHeader({ nav })` plus internal helpers `Chevron` (SVG), `NavLink`
(internal `next/link` vs external `<a>`), and recursive `Item` (plain link, dropdown, or split link+arrow).
Open dropdowns are tracked as a list of path keys (e.g. `"Church Leadership/Leadership History"`), so
nested menus can stay open with their parents while siblings close.

## 3. Props / Inputs

| Prop | Type | Notes |
| --- | --- | --- |
| `nav` | `NavItem[]` (`content/site.ts`) | Built on the server by `buildNav()` (`lib/nav.ts`) and passed from the layout |

`NavItem = { label; href?; external?; children? }`. `external: true` → plain `<a>`; `children` → dropdown;
`href` + `children` → "split" item (label link + arrow button; no current menu item uses this).

## 4. Data Dependencies

**Verified:**
- `NAV` (`content/site.ts`): Home (external, `LINKS.home`), About Us `/about`, Ministries `/ministries`,
  Church Leadership (dropdown: Church Officers `/officers`, Leadership History), Support (external,
  `LINKS.support`), Contact Us `/contact`.
- `buildNav()` fills the item whose label is exactly "Leadership History" with one link per
  `HISTORY_TERMS` entry: "<label> Officers" → `/history/<slug>`.
- `LINKS` (environment-dependent): production `www.gcciemelif.website` / `support.gcciemelif.website`;
  development all `http://localhost:3000`. `LINKS.iemelif` = `https://www.iemelifchurch.com/`.
- `LOGOS` (paths, alt text, intrinsic sizes) and `SITE.shortName` (`content/site.ts`).
- `usePathname()` for the active link and closing menus on navigation.

## 5. Pages / Components Using It

**Verified:** rendered once in `app/layout.tsx` (`<SiteHeader nav={buildNav()} />`) after the skip link,
so it appears on every route including `/admin`. Not imported anywhere else.

## 6. Layout and Structure

**Verified:** `<header>` (sticky) → centred row (max 1240px, `px-5 py-2`, flex, space-between) containing: brand
group (IEMELIF logo link opening in a new tab, GCC logo link to `LINKS.gcc`, brand name "Gospel Christian
Church" with "IEMELIF" in a `small`), the menu button (hamburger/close icon), and `nav#main-nav` with a `ul` of
items.

## 7. Design System / CSS

**Verified:** Tailwind classes in `components/SiteHeader.tsx`, with a few local class-string constants:
- Header: `sticky top-0 z-50`, translucent white `bg-[rgba(255,255,255,.94)]`, backdrop `saturate(1.4) blur(10px)`
  (arbitrary `[backdrop-filter:…]` to keep the original filter order), two-part shadow, and the 3px
  crimson/gold/blue stripe underneath via `stripeAfter` from `lib/ui.ts`.
- Logos `h-[50px] w-auto`; brand name `font-serif text-[19px] leading-[1.1] text-brand`, "IEMELIF" in bold
  11px `tracking-[.16em] text-gold-dark`.
- `navItemBase` / `navItem`: menu links and dropdown buttons (`text-[15px] font-medium`, `px-[11px] py-[9px]`,
  `rounded-lg`, `hover:bg-paper`, `aria-expanded:bg-paper`, active link
  `aria-[current=page]:shadow-[inset_0_-3px_0_var(--color-crimson)]`).
- `menuList` (all menu lists: no bullets, 2px gap), `dropdown` (first level: floating white panel, 240px
  min-width, 10px radius, shadow), `nestedDropdown` (Leadership History: in place, indented 14px). Open state
  toggles `flex` / `hidden`.
- The centred row is 1240px wide (wider than the 1080px `wrap` used by pages).
- `html { scroll-padding-top: 90px }` in the base layer of `app/globals.css` compensates for the sticky header on
  in-page anchors.

## 8. Responsive Behavior

**Verified:** ≥1081px: horizontal menu, first-level dropdowns absolutely positioned. ≤1080px (`max-lg:`): the
menu button is shown; `nav` is hidden until opened, then shown as a full-width white panel under the header
(scrollable, `max-h-[calc(100vh-70px)]`), with dropdowns shown in place and indented. ≤480px (`max-sm:`):
brand name hidden (logos only). Print: header hidden (`print:hidden`).

## 9. Accessibility

**Verified:** `nav aria-label="Main"`; menu button has `aria-expanded`, `aria-controls="main-nav"` and
visually hidden text "Menu" (`sr-only`); dropdown buttons have `aria-expanded` and `aria-haspopup="true"`; split items'
arrow gets `aria-label="<label> submenu"`; logo links have `aria-label`s; Escape closes menus; outside click
closes dropdowns; focus ring `:focus-visible` (blue). Skip link lives in the layout, not here.
See §13 for gaps.

## 10. Client / Server Behavior

**Verified — why `"use client"`:** `useState` (menu open, open dropdown keys), `useRef` (outside-click check),
`useEffect` (document `click` and `keydown` listeners; reset on route change), `usePathname`, and click
handlers. No API calls, no storage, no cookies. Receives only serialisable nav data from the server layout.
Security: no user input; the only external link opened in a new tab uses `rel="noopener"`.

## 11. Reuse Guidelines

- Change the menu by editing `NAV` in `content/site.ts`, not this component.
- Don't render it in pages; the layout already does.
- Internal routes: omit `external`. Other domains (or full URLs): `external: true`.

## 12. Modification Constraints

- Keep the literal "Leadership History" label or update `lib/nav.ts` with it.
- Keep `id="main-nav"` in sync with `aria-controls`.
- `NavLink` accepts an optional `className` (default `navItem`); "split" items pass a variant with smaller right
  padding. Keep padding out of `navItemBase` so no element gets two conflicting padding utilities.
- Changing Home/Support links is an owner decision (see `docs/pages/home.md` §14).

## 13. Known Issues / Technical Debt

**Verified, not fixed:**
- ESLint `react-hooks/set-state-in-effect` warning: the effect that resets state on `pathname` change
  (rule downgraded to `warn` in `eslint.config.mjs`).
- Home and Support are external links: they never receive `aria-current`, cause full page loads, and in
  development Support points to `localhost:3000/` rather than `/support`.
- `aria-haspopup="true"` announces a menu, but the ARIA menu keyboard pattern (arrow keys, focus moving
  into the menu) is not implemented; it behaves as a disclosure. Escape does not return focus to the button.
- A `NavItem` with neither `href` nor `children` would render a link to `#`.
- `hover:` styles apply only on devices that support hover (Tailwind v4); on touch screens a tapped item no
  longer keeps its hover background.

## 14. Open Questions

1. **Owner input required:** should Home/Support become internal links, and should `/leadership` be added?
2. **Proposed:** switch dropdowns to the disclosure pattern (drop `aria-haspopup`) — needs approval.

## 15. Implementation Notes

- Logos use `next/image` with `priority`.
- Opening one top-level dropdown closes siblings but keeps ancestors (see `toggle`).
- Dropdown buttons call `stopPropagation`; the document click handler only closes dropdowns for clicks
  outside the header element.

## 16. References

`components/SiteHeader.tsx`, `app/layout.tsx`, `content/site.ts` (`NAV`, `LINKS`, `LOGOS`, `SITE`),
`lib/nav.ts`, `content/officers.ts` (`HISTORY_TERMS`), `lib/ui.ts`, `app/globals.css`, `eslint.config.mjs`,
`docs/pages/README.md`.
