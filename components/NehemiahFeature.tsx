import Link from "next/link";
import VideoEmbed from "./VideoEmbed";
import { CHURCH, php } from "@/lib/config";
import { NEHEMIAH_FEATURE } from "@/content/home";
import { brandGradient, eyebrow } from "@/lib/ui";

/**
 * Project Nehemiah feature card: the Facebook video plays inline (muted autoplay, Facebook's own controls) | text and
 * the gold "Support Project Nehemiah" CTA → /donate. The CTA's `after:` overlay stretches that link over the card;
 * the video column sits above it (`z-10`) so the player's controls stay usable and never trigger /donate.
 */
export default function NehemiahFeature() {
  const f = NEHEMIAH_FEATURE;
  return (
    <div className={`group relative grid overflow-hidden rounded-2xl border border-line text-onbrand md:grid-cols-[1.1fr_.9fr] [&_:focus-visible]:outline-gold ${brandGradient}`}>
      <div className="relative z-10 self-center px-6 pt-6 md:p-8 md:pr-0"><VideoEmbed url={f.video.url} title={f.video.title} autoplay /></div>
      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <span className={`${eyebrow} text-gold`}>{f.eyebrow}</span>
        <h2 className="m-0 text-[length:clamp(26px,4vw,36px)]">{CHURCH.campaign}</h2>
        <p className="m-0 text-[#f4dbe1]">{f.text} Our goal is {php(CHURCH.goal)}.</p>
        {/* The hover filter sits on the inner span: a filter on the link itself would shrink its after: overlay to the button. */}
        <Link href="/donate" className="mt-1 inline-block self-start rounded-lg no-underline after:absolute after:inset-0 after:content-['']">
          <span className="block rounded-lg bg-gold px-6 py-[13px] font-semibold text-[#1b1404] group-hover:brightness-[1.08]">{f.cta} →</span>
        </Link>
      </div>
    </div>
  );
}
