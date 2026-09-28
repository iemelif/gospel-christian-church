"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS, LOGOS, SITE, type NavItem } from "@/content/site";

const Chevron = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
);

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const href = item.href ?? "#";
  if (item.external) return <a href={href}>{item.label}</a>;
  return <Link href={href} aria-current={pathname === href ? "page" : undefined}>{item.label}</Link>;
}

type Ctx = { pathname: string; openKeys: string[]; toggle: (key: string) => void };

function Item({ item, depth, parentKey, ctx }: { item: NavItem; depth: number; parentKey: string; ctx: Ctx }) {
  const key = parentKey ? `${parentKey}/${item.label}` : item.label;
  if (!item.children?.length) return <li><NavLink item={item} pathname={ctx.pathname} /></li>;

  const open = ctx.openKeys.includes(key);
  const btn = (
    <button className="dd-btn" aria-expanded={open} aria-haspopup="true"
      aria-label={item.href ? `${item.label} submenu` : undefined}
      onClick={(e) => { e.stopPropagation(); ctx.toggle(key); }}>
      {!item.href && item.label}
      <Chevron />
    </button>
  );
  return (
    <li className={`has-dd${depth ? " nested" : ""}`}>
      {item.href ? <div className="split"><NavLink item={item} pathname={ctx.pathname} />{btn}</div> : btn}
      <ul className={`dd${open ? " show" : ""}`}>
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

  const toggle = (key: string) =>
    setOpenKeys((cur) =>
      cur.includes(key)
        ? cur.filter((k) => k !== key && !k.startsWith(`${key}/`)) // close it and its submenus
        : [...cur.filter((k) => key.startsWith(`${k}/`)), key],    // open it, closing siblings but keeping ancestors
    );

  const ctx: Ctx = { pathname, openKeys, toggle };

  return (
    <header className="site-header" ref={ref}>
      <div className="wrap bar-row">
        <div className="brand">
          <a href={LINKS.iemelif} className="logo-link" aria-label="IEMELIF – official website" target="_blank" rel="noopener">
            <Image src={LOGOS.iemelif.src} alt={LOGOS.iemelif.alt} width={LOGOS.iemelif.width} height={LOGOS.iemelif.height} className="logo iemelif" priority />
          </a>
          <a href={LINKS.gcc} className="logo-link" aria-label={`${SITE.shortName} – home`}>
            <Image src={LOGOS.gcc.src} alt={LOGOS.gcc.alt} width={LOGOS.gcc.width} height={LOGOS.gcc.height} className="logo gcc" priority />
          </a>
          <span className="brand-name">{SITE.shortName}<small>IEMELIF</small></span>
        </div>

        <button className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          <span className="sr">Menu</span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav id="main-nav" aria-label="Main" className={open ? "open" : ""}>
          <ul>
            {nav.map((item) => <Item key={item.label} item={item} depth={0} parentKey="" ctx={ctx} />)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
