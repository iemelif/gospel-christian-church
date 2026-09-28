import { NAV, type NavItem } from "@/content/site";
import { HISTORY_TERMS } from "@/content/officers";

const fill = (items: NavItem[]): NavItem[] =>
  items.map((item) =>
    item.label === "Leadership History"
      ? { ...item, children: HISTORY_TERMS.map((t) => ({ label: `${t.label} Officers`, href: `/history/${t.slug}` })) }
      : item.children
        ? { ...item, children: fill(item.children) }
        : item,
  );

/** Header menu with the Leadership History submenu generated from the officer data. */
export function buildNav(): NavItem[] {
  return fill(NAV);
}
