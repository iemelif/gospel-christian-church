import type { NavItem } from "@/content/site";

/** Key of a menu item: its label path, e.g. "Church Leadership/Leadership History". */
export const menuKey = (parentKey: string, label: string) => (parentKey ? `${parentKey}/${label}` : label);

/** Keys of the dropdowns that contain the current page, outermost first ([] when the page isn't in a dropdown). */
export function activeMenuKeys(items: NavItem[], pathname: string, parentKey = ""): string[] {
  for (const item of items) {
    if (!item.children?.length) continue;
    const key = menuKey(parentKey, item.label);
    const inner = activeMenuKeys(item.children, pathname, key);
    if (inner.length || item.children.some((c) => !c.external && c.href === pathname)) return [key, ...inner];
  }
  return [];
}

/**
 * Next list of open dropdown keys after clicking `key`. Closing also closes its submenus. Opening closes siblings but
 * keeps ancestors, and also opens the submenus leading to the current page (`active`, from activeMenuKeys), so e.g.
 * on /history/2024-2025 opening "Church Leadership" shows "Leadership History" already expanded.
 */
export function toggleMenu(open: string[], key: string, active: string[]): string[] {
  if (open.includes(key)) return open.filter((k) => k !== key && !k.startsWith(`${key}/`));
  return [...open.filter((k) => key.startsWith(`${k}/`)), key, ...active.filter((k) => k.startsWith(`${key}/`))];
}
