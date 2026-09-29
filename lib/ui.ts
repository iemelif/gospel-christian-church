// Shared Tailwind class strings for UI patterns used in more than one place.
// Tailwind scans lib/, so every class written here is generated. Keep full class names in the strings
// (no string concatenation of partial class names), otherwise Tailwind cannot detect them.
// Values are exact (arbitrary values like text-[14px]) to match the pre-Tailwind design pixel for pixel:
// Tailwind's named text sizes also set a line-height, which would change the layout.

/** Centered page column: max 1080px wide, 20px side padding (was `.wrap`). */
export const wrap = "mx-auto max-w-[1080px] px-5";

/** Body area of inner pages, used together with `wrap` (was `.page-body`). */
export const pageBody = "pt-10 pb-16";

/** Crimson diagonal gradient used by the page banners (was `.hero` / `.page-hero` background). */
export const brandGradient = "bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-2))]";

/** 3px crimson | gold | blue brand stripe drawn by a pseudo-element: under the header, on top of the footer.
 *  The element using it must be positioned (relative/sticky). */
export const stripeAfter = "after:absolute after:inset-x-0 after:-bottom-[3px] after:h-[3px] after:bg-[linear-gradient(90deg,var(--color-crimson)_0_34%,var(--color-gold)_34%_67%,var(--color-blue)_67%)] after:content-['']";
export const stripeBefore = "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-[linear-gradient(90deg,var(--color-crimson)_0_34%,var(--color-gold)_34%_67%,var(--color-blue)_67%)] before:content-['']";

/** Standard vertical rhythm for a page section (as on the Donate page). */
export const section = "py-14";
/** Small uppercase label above a heading, in the IEMELIF gold used under the brand name in the header. */
export const eyebrow = "mb-2 block font-sans text-[12px] leading-[normal] font-bold tracking-[.16em] text-gold-dark uppercase";

/** Section heading size (was the global `h2` rule); `h2` adds the default 8px bottom margin. */
export const h2Size = "text-[length:clamp(26px,4vw,36px)]";
export const h2 = `${h2Size} mb-2`;

/** Intro paragraph under a section heading (was `.sub`). */
export const sub = "mt-0 mb-7 max-w-[60ch] text-mute";

/** Small secondary text (was `.muted`). */
export const muted = "text-[14px] text-mute";

/** Card surface without padding (was `.card`); add padding per use, or use `card`. */
export const cardBox = "rounded-xl border border-line bg-card";
export const card = `${cardBox} p-[22px]`;
/** Heading inside a card (was `.card h3`). */
export const cardTitle = "mb-2 text-[21px]";
/** Responsive grid of cards (was `.cards`). */
export const cards = "grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5";

/** Text inputs, email, number, password and textarea (was the global input rule). */
export const input = "w-full rounded-lg border-[1.5px] border-line bg-bg px-3 py-[11px] text-ink [font:inherit]";
/** Form field label (was the global `label` rule). */
export const label = "mb-1.5 block text-[14px] font-semibold";
/** Form error line, kept 20px tall even when empty (was `.err`). */
export const errorText = "my-2 min-h-5 text-[14px] text-crimson";

// Buttons (was `.btn` + modifiers). One complete string per variant, so no two utilities on the same
// element ever set the same property. Hidden when printing, like before.
const btnBase = "inline-block cursor-pointer rounded-lg font-sans font-semibold leading-[normal] no-underline hover:brightness-[1.08] disabled:cursor-wait disabled:opacity-60 print:hidden";
const btnSolid = `${btnBase} border-0 bg-gold text-[#1b1404]`;
const btnGhost = `${btnBase} border-[1.5px] border-gold bg-transparent`;
export const btn = {
  /** Gold button (`.btn`). */
  primary: `${btnSolid} px-6 py-[13px] text-[16px]`,
  /** Large gold button (`.btn.lg`). */
  primaryLg: `${btnSolid} px-7 py-[15px] text-[17px]`,
  /** Full-width gold button (`.btn.full`). */
  primaryFull: `${btnSolid} w-full px-6 py-[13px] text-[16px]`,
  /** Full-width large gold button (`.btn.full.lg`). */
  primaryFullLg: `${btnSolid} w-full p-4 text-[18px]`,
  /** Small gold button (`.btn.sm`). */
  primarySm: `${btnSolid} px-3 py-1.5 text-[14px]`,
  /** Outlined button on light backgrounds (`.btn.ghost`). */
  ghost: `${btnGhost} px-6 py-[13px] text-[16px] text-gold-dark`,
  /** Small outlined button (`.btn.sm.ghost`). */
  ghostSm: `${btnGhost} px-3 py-1.5 text-[14px] text-gold-dark`,
  /** Large outlined button on the crimson hero (`.hero .btn.ghost.lg`). */
  ghostLgOnBrand: `${btnGhost} px-7 py-[15px] text-[17px] text-gold`,
};

/** List of PersonCards laid out as a grid (was `.people`). Combine with a row layout below. */
export const peopleGrid = "m-0 grid list-none gap-5 p-0";

/** Officer board rows 1–2: centred columns of up to 240px (was `.row-top`). */
export const peopleRowTop = "grid-cols-[repeat(auto-fit,minmax(min(100%,200px),240px))] justify-center";

/** Everyone else: as many columns of at least 190px as fit (was `.row-rest`). */
export const peopleRowRest = "grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))]";
