"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS, LOGOS, SITE, type NavItem } from "@/content/site";
import { activeMenuKeys, menuKey, toggleMenu } from "@/lib/menu";
import { stripeAfter } from "@/lib/ui";

// Menu links and dropdown buttons share one look; padding is separate because "split" items adjust it.
const navItemBase = "flex cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent py-[9px] font-sans text-[15px] leading-[normal] font-medium whitespace-nowrap text-ink no-underline hover:bg-paper aria-expanded:bg-paper aria-[current=page]:shadow-[inset_0_-3px_0_var(--color-crimson)]";
const navItem = `${navItemBase} px-[11px]`;
// Every menu list: no bullets, 2px gap; stacked vertically in the mobile menu (≤1080px).
const menuList = "m-0 list-none gap-[2px] flex-col items-stretch";
// First-level dropdown: floating panel on desktop, indented list in the mobile menu.
const dropdown = `${menuList} absolute top-[calc(100%+8px)] right-0 min-w-[240px] rounded-[10px] border border-line bg-card p-1.5 shadow-[0_14px_32px_rgba(43,34,38,.18)] max-lg:static max-lg:border-0 max-lg:bg-transparent max-lg:py-0 max-lg:pr-0 max-lg:pl-3.5 max-lg:shadow-none`;
// Nested dropdown (Leadership History) opens in place inside its parent dropdown, at every width; it scrolls
// once it holds more terms than fit, so the menu stays short.
const nestedDropdown = `${menuList} static min-w-0 max-h-[min(300px,50vh)] overflow-y-auto overscroll-contain py-0 pr-0 pl-3.5`;

const Chevron = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
);

function NavLink({ item, pathname, className = navItem }: { item: NavItem; pathname: string; className?: string }) {
  const href = item.href ?? "#";
  if (item.external) return <a className={className} href={href}>{item.label}</a>;
  return <Link className={className} href={href} aria-current={pathname === href ? "page" : undefined}>{item.label}</Link>;
}

type Ctx = { pathname: string; openKeys: string[]; toggle: (key: string) => void };

function Item({ item, depth, parentKey, ctx }: { item: NavItem; depth: number; parentKey: string; ctx: Ctx }) {
  const key = menuKey(parentKey, item.label);
  if (!item.children?.length) return <li><NavLink item={item} pathname={ctx.pathname} /></li>;

  const open = ctx.openKeys.includes(key);
  const btn = (
    <button aria-expanded={open} aria-haspopup="true"
      className={`${navItemBase} ${item.href ? "pr-2 pl-1" : "px-[11px]"}${depth ? " w-full justify-between" : ""}`}
      aria-label={item.href ? `${item.label} submenu` : undefined}
      onClick={(e) => { e.stopPropagation(); ctx.toggle(key); }}>
      {!item.href && item.label}
      <Chevron />
    </button>
  );
  return (
    <li className="relative">
      {item.href ? <div className="flex items-center"><NavLink item={item} pathname={ctx.pathname} className={`${navItemBase} pl-[11px] pr-1`} />{btn}</div> : btn}
      <ul className={`${depth ? nestedDropdown : dropdown} ${open ? "flex" : "hidden"}`}>
        {item.children.map((c) => <Item key={c.label} item={c} depth={depth + 1} parentKey={key} ctx={ctx} />)}
      </ul>
    </li>
  );
}

export default function SiteHeader({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const ref = useRef<HTMLElement>(null);

  // close menus after navigating
  useEffect(() => { setOpen(false); setOpenKeys([]); }, [pathname]);

  // close dropdowns on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpenKeys([]); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpenKeys([]); setOpen(false); } };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  // Dropdowns containing the current page: opening a parent also expands these (e.g. Leadership History on /history/…).
  const active = useMemo(() => activeMenuKeys(nav, pathname), [nav, pathname]);
  const toggle = (key: string) => setOpenKeys((cur) => toggleMenu(cur, key, active));

  const ctx: Ctx = { pathname, openKeys, toggle };

  return (
    <header ref={ref} className={`sticky top-0 z-50 bg-[rgba(255,255,255,.94)] text-ink shadow-[0_1px_0_var(--color-line),0_6px_16px_rgba(43,34,38,.06)] [-webkit-backdrop-filter:saturate(1.4)_blur(10px)] [backdrop-filter:saturate(1.4)_blur(10px)] print:hidden ${stripeAfter}`}>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <a href={LINKS.iemelif} className="flex rounded-lg" aria-label="IEMELIF – official website" target="_blank" rel="noopener">
            <Image src={LOGOS.iemelif.src} alt={LOGOS.iemelif.alt} width={LOGOS.iemelif.width} height={LOGOS.iemelif.height} className="block h-[50px] w-auto shrink-0" priority />
          </a>
          <a href={LINKS.gcc} className="flex rounded-lg" aria-label={`${SITE.shortName} – home`}>
            <Image src={LOGOS.gcc.src} alt={LOGOS.gcc.alt} width={LOGOS.gcc.width} height={LOGOS.gcc.height} className="block h-[50px] w-auto shrink-0" priority />
          </a>
          <span className="ml-1 font-serif text-[19px] leading-[1.1] font-normal text-brand max-sm:hidden">{SITE.shortName}<small className="mt-[3px] block font-sans text-[11px] leading-[normal] font-bold tracking-[.16em] text-gold-dark">IEMELIF</small></span>
        </div>

        <button className="hidden cursor-pointer rounded-lg border-[1.5px] border-line bg-transparent p-1.5 text-brand max-lg:block" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav id="main-nav" aria-label="Main" className={`max-lg:absolute max-lg:inset-x-0 max-lg:top-full max-lg:max-h-[calc(100vh-70px)] max-lg:overflow-y-auto max-lg:border-t max-lg:border-line max-lg:bg-white max-lg:px-5 max-lg:pt-2 max-lg:pb-4 max-lg:shadow-[0_14px_24px_rgba(43,34,38,.12)] ${open ? "max-lg:block" : "max-lg:hidden"}`}>
          <ul className="m-0 flex list-none items-center gap-[2px] p-0 max-lg:flex-col max-lg:items-stretch">
            {nav.map((item) => <Item key={item.label} item={item} depth={0} parentKey="" ctx={ctx} />)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
