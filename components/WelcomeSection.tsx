import { WELCOME_TEXT } from "@/content/home";
import { ADDRESS, SITE } from "@/content/site";
import { eyebrow, h2Size, section, wrap } from "@/lib/ui";

/** Welcome for first-time visitors: the page's h1, one welcoming paragraph (content/home.ts) and the address. */
export default function WelcomeSection() {
  return (
    <section className={section}><div className={wrap}>
      <div className="relative overflow-hidden rounded-2xl border border-gold bg-paper px-6 py-10 text-center md:px-12">
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-crimson)_0_34%,var(--color-gold)_34%_67%,var(--color-blue)_67%)]" aria-hidden="true" />
        <span className={eyebrow}>{SITE.shortName} · IEMELIF</span>
        <h1 className={`${h2Size} mb-4 text-brand`}>Welcome to {SITE.name}</h1>
        <p className="mx-auto mt-0 mb-5 max-w-[62ch] text-[17px] leading-[1.7] text-ink">{WELCOME_TEXT}</p>
        <address className="inline-flex items-center gap-2 text-[14px] text-mute not-italic">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" className="text-crimson"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" /></svg>
          {ADDRESS.display}
        </address>
      </div>
    </div></section>
  );
}
