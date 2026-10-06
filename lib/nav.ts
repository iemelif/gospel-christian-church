import { NAV, type NavItem } from "@/content/site";
import { CURRENT_TERM, HISTORY_TERMS } from "@/content/officers";
import { pastorPeriods, periodLabel } from "./officers";

/** Leadership History: past terms grouped by pastor period ("2024 – present", "2019 – 2024", …), newest first.
 *  The current term is left out (it is "Church Officers"); a period with no past terms gets no group. */
function historyGroups(): NavItem[] {
  return pastorPeriods([CURRENT_TERM, ...HISTORY_TERMS])
    .map((p) => ({ label: periodLabel(p), children: HISTORY_TERMS.filter((t) => p.slugs.includes(t.slug)).map((t) => ({ label: t.label, href: `/history/${t.slug}` })) }))
    .filter((g) => g.children.length);
}

const fill = (items: NavItem[]): NavItem[] =>
  items.map((item) =>
    item.label === "Leadership History"
      ? { ...item, children: historyGroups() }
      : item.children
        ? { ...item, children: fill(item.children) }
        : item,
  );

/** Header menu with the Leadership History submenu generated from the officer data (grouped by pastor period). */
export function buildNav(): NavItem[] {
  return fill(NAV);
}
