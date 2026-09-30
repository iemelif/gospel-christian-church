import Link from "next/link";
import { ADDRESS, SOCIAL } from "@/content/site";
import { CHURCH } from "@/lib/config";
import { btn, h2Size, stripeBefore } from "@/lib/ui";

/**
 * Prominent "Coming soon" card for pages without content yet: brand stripe, crimson cross emblem, title and text
 * (from content/coming-soon.ts), a Donate CTA, Facebook for updates, and the church address.
 */
export default function ComingSoon({ title, text }: { title: string; text: string }) {
  const facebook = SOCIAL.find((s) => s.icon === "facebook");
  return (
    <div className={`relative mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-line bg-card px-10 pt-14 pb-10 text-center shadow-[0_24px_48px_-24px_rgba(127,31,54,.45)] max-md:px-5 max-md:pt-10 max-md:pb-8 ${stripeBefore}`}>
      <div className="mx-auto mb-6 grid size-[76px] place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-2))] text-gold shadow-[0_0_0_7px_color-mix(in_srgb,var(--color-gold)_22%,transparent)]" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v18M6.5 8.5h11" /></svg>
      </div>
      <p className="mt-0 mb-3 flex items-center justify-center gap-3 text-[12px] leading-[normal] font-bold tracking-[.16em] text-gold-dark uppercase">
        <i className="block h-px w-10 bg-gold" aria-hidden="true" />Coming soon<i className="block h-px w-10 bg-gold" aria-hidden="true" />
      </p>
      <h2 className={`${h2Size} mb-3`}>{title}</h2>
      <p className="mx-auto mt-0 mb-8 max-w-[52ch] text-mute">{text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className={btn.primary} href="/donate">Support {CHURCH.campaign}</Link>
        {facebook && <a className={btn.ghost} href={facebook.href} target="_blank" rel="noopener noreferrer">Follow us on {facebook.label}</a>}
      </div>
      <p className="mx-auto mt-10 mb-0 border-t border-line pt-6 text-[14px] text-mute">Visit us at <b className="text-ink">{ADDRESS.street}, {ADDRESS.city}, {ADDRESS.postalCode} {ADDRESS.region}</b></p>
    </div>
  );
}
