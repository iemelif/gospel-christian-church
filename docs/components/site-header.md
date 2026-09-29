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

**Verified:** `header.site-header` → `div.wrap.bar-row` containing: `div.brand` (IEMELIF logo link opening in
a new tab, GCC logo link to `LINKS.gcc`, `span.brand-name` with "IEMELIF" in `small`), `button.menu-btn`
(hamburger/close icon), and `nav#main-nav` with a `ul` of items.

## 7. Design System / CSS

**Verified:** "header (sticky)" section of `app/globals.css`: `.site-header` (sticky, translucent white, blur,
shadow), `.site-header::after` (3px crimson/gold/blue stripe), `.bar-row`, `.brand`, `.logo-link`, `.logo`
(50px high), `.brand-name`, `.dd-btn`, `.has-dd`, `.dd` / `.dd.show`, `.nested`, `.split`, `.menu-btn`.
Active link: `aria-current=page` → inset crimson underline. `.site-header .wrap` widens to 1240px.
`html { scroll-padding-top: 90px }` compensates for the sticky header on in-page anchors.
The `iemelif` / `gcc` classes on the logo images have no CSS rules (hooks only).

## 8. Responsive Behavior

**Verified:** >1080px: horizontal menu, dropdowns absolutely positioned. ≤1080px: `.menu-btn` shown, `nav`
hidden until `.open`, then shown as a full-width panel (scrollable, max-height viewport − 70px) with
dropdowns inline and indented. ≤480px: `.brand-name` hidden (logos only). Print: header hidden.

## 9. Accessibility

**Verified:** `nav aria-label="Main"`; menu button has `aria-expanded`, `aria-controls="main-nav"` and
visually hidden text "Menu"; dropdown buttons have `aria-expanded` and `aria-haspopup="true"`; split items'
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
`lib/nav.ts`, `content/officers.ts` (`HISTORY_TERMS`), `app/globals.css`, `eslint.config.mjs`,
`docs/pages/README.md`.
