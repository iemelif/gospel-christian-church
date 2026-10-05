import Image from "next/image";
import ChurchProgress from "@/components/ChurchProgress";
import FundraisingPercent from "@/components/FundraisingPercent";
import GiveForm from "@/components/GiveForm";
import JoinUs from "@/components/JoinUs";
import PageJsonLd from "@/components/PageJsonLd";
import PaymentDetails from "@/components/PaymentDetails";
import VideoEmbed from "@/components/VideoEmbed";
import { ADDRESS, SHARE_IMAGES } from "@/content/site";
import { CHURCH, NEHEMIAH_PICTURE, NEHEMIAH_VIDEO, PAYMENT_METHODS, php, phpCents, toCentavos } from "@/lib/config";
import { summary } from "@/lib/store";
import { DONATE_DESCRIPTION, DONATE_TITLE, pageMeta } from "@/lib/seo";
import { formatPercent, fundedPercent } from "@/lib/progress";
import { brandGradient, btn, card, cardBox, cardTitle, h2, muted, stripeBefore, sub, wrap } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(DONATE_TITLE, DONATE_DESCRIPTION, "/donate", { image: SHARE_IMAGES.donate });

// Numbered step cards: the number is drawn by a CSS counter in ::before.
const step = "relative flex flex-col gap-1 rounded-xl border border-line bg-card py-5 pr-5 pl-16 [counter-increment:s] before:absolute before:top-[18px] before:left-[18px] before:grid before:size-[34px] before:place-items-center before:rounded-full before:bg-brand before:font-serif before:text-[17px] before:leading-[normal] before:font-normal before:text-white before:content-[counter(s)]";

/** Donate page: supports Project Nehemiah, the church building project (docs/pages/donate.md). */
export default async function DonatePage() {
  const { raised, wall, donors } = await summary();
  const pct = fundedPercent(raised, CHURCH.goal); // same figure for the hero and the percentage above the Giving Wall
  const pctText = formatPercent(pct);
  const toGo = Math.max(0, toCentavos(CHURCH.goal) - toCentavos(raised)) / 100;
  return (
    <main id="main">
      <div className={`${brandGradient} text-onbrand [&_:focus-visible]:outline-gold`}>
        <div className={wrap}>
          <div className="grid grid-cols-[1.2fr_.8fr] items-center gap-10 pt-12 max-md:grid-cols-[1fr]">
            <div>
              <h1 className="mb-4 text-[length:clamp(34px,5.5vw,56px)]">Help us build a home for every neighbor.</h1>
              <p className="mt-0 mb-6 max-w-[52ch] text-[#f4dbe1]">Gospel Christian Church is raising {php(CHURCH.goal)} for {CHURCH.campaign}, our new church building in Frances, Calumpit. It will be a place where our whole community can worship, learn, and serve together. We are {pctText}% of the way there, and your gift moves us closer.</p>
              <a className={`${btn.primaryLg} mr-1.5 mb-2`} href="#give">Give to {CHURCH.campaign}</a>{" "}<a className={`${btn.ghostLgOnBrand} mr-1.5 mb-2`} href="#how">How giving works</a>
              <div className="mt-[22px] border-l-[3px] border-gold pl-3 text-[14px] text-[#f1c9d2]">“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7</div>
            </div>
            <div className="rounded-2xl border border-[rgba(222,185,66,.35)] bg-[rgba(255,255,255,.08)] px-5 pt-6 pb-5 text-center">
              <ChurchProgress pct={pct} />
              <div className="font-serif text-[44px] leading-none text-gold">{pctText}%</div>
              <small className="mt-1.5 block text-[#f1c9d2]">{phpCents(raised)} of {phpCents(CHURCH.goal)}</small>
              <div className="mt-4 flex justify-center gap-7 border-t border-[rgba(255,248,240,.2)] pt-3.5">
                <div className="flex flex-col"><b className="font-serif text-[20px] leading-[normal] font-normal text-white">{phpCents(toGo)}</b><span className="text-[13px] text-[#f1c9d2]">still needed</span></div>
                {donors > 0 && <div className="flex flex-col"><b className="font-serif text-[20px] leading-[normal] font-normal text-white">{donors}</b><span className="text-[13px] text-[#f1c9d2]">confirmed gift{donors > 1 ? "s" : ""} online</span></div>}
              </div>
            </div>
          </div>
          {/* Full-width video row under the two columns; the frame matches the progress card. */}
          <div className="mx-auto mt-10 max-w-[960px] pb-[72px] text-center">
            <h2 className={h2}>{NEHEMIAH_VIDEO.heading}</h2>
            <p className="mt-0 mb-5 text-[#f4dbe1]">{NEHEMIAH_VIDEO.caption}</p>
            <div className="rounded-2xl border border-[rgba(222,185,66,.35)] bg-[rgba(255,255,255,.08)] p-2.5">
              <VideoEmbed url={NEHEMIAH_VIDEO.url} title={NEHEMIAH_VIDEO.title} autoplay />
            </div>
          </div>
        </div>
      </div>

      <section id="progress" className="pt-14 pb-6"><div className={wrap}>
        <h2 className={h2}>{CHURCH.campaign}</h2>
        <p className={sub}>The total moves whenever our treasurer confirms a gift, so what you see here is money actually received.</p>
        {/* Building picture (also the share / search-result image): white frame with the brand stripe, caption over a dark
            fade on wide screens, below the picture on narrow ones. */}
        <figure className={`relative m-0 mb-6 overflow-hidden rounded-2xl border border-line bg-card px-2.5 pt-[13px] pb-2.5 shadow-[0_24px_48px_-24px_rgba(127,31,54,.45)] ${stripeBefore}`}>
          <div className="relative overflow-hidden rounded-xl bg-paper">
            <Image src={SHARE_IMAGES.donate.url} alt={SHARE_IMAGES.donate.alt} width={SHARE_IMAGES.donate.width} height={SHARE_IMAGES.donate.height} sizes="(max-width: 1080px) 100vw, 1080px" unoptimized className="block h-auto w-full" />
            <span className="absolute top-4 left-4 rounded-full bg-gold px-3.5 py-1.5 text-[13px] leading-[normal] font-bold text-[#1b1404] shadow-[0_2px_8px_rgba(43,34,38,.25)]">{pctText}% raised</span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(43,34,38,.92)_0%,rgba(43,34,38,.65)_55%,rgba(43,34,38,0)_100%)] px-7 pt-20 pb-6 text-white max-md:static max-md:bg-brand max-md:bg-none max-md:px-5 max-md:pt-4 max-md:pb-4">
              <span className="mb-1.5 block text-[12px] leading-[normal] font-bold tracking-[.16em] text-gold uppercase">{NEHEMIAH_PICTURE.eyebrow}</span>
              <span className="block font-serif text-[length:clamp(22px,3vw,32px)] leading-[1.15]">{NEHEMIAH_PICTURE.title}</span>
              <span className="mt-1 block text-[14px] text-[#f1c9d2]">{ADDRESS.street}, {ADDRESS.city}, {ADDRESS.region}</span>
            </figcaption>
          </div>
        </figure>
        <div className={card}>
          <div className="relative h-[18px] overflow-hidden rounded-lg bg-line" role="progressbar" aria-label={`${CHURCH.campaign} progress`} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <i className="block h-full rounded-lg bg-gold" style={{ width: `${pct}%` }} />
            {[25, 50, 75].map((m) => <em key={m} style={{ left: `${m}%` }} className={`absolute inset-y-0 w-[2px] -translate-x-px ${pct >= m ? "bg-[rgba(255,255,255,.7)]" : "bg-[rgba(43,34,38,.25)]"}`} />)}
          </div>
          <div className="mt-1.5 flex justify-between text-[12px] text-mute" aria-hidden="true"><span>₱0</span><span>25%</span><span>50%</span><span>75%</span><span>{php(CHURCH.goal)}</span></div>
          <div className="mt-2.5 flex justify-between text-[15px] text-mute"><span><b className="text-ink">{phpCents(raised)}</b> raised</span><span><b className="text-ink">{phpCents(toGo)}</b> to go</span></div>
        </div>
      </div></section>

      <section id="how" className="py-14"><div className={wrap}>
        <h2 className={h2}>How your gift reaches the building</h2>
        <p className={sub}>Three steps, and you can see the result on this page.</p>
        <ol className="m-0 grid list-none grid-cols-[repeat(3,1fr)] gap-5 p-0 [counter-reset:s] max-md:grid-cols-[1fr]">
          <li className={step}><b className="text-[17px]">Record your pledge</b><span className="text-[15px] text-mute">Choose an amount and tell us who you are. You get a reference number right away.</span></li>
          <li className={step}><b className="text-[17px]">Send your gift</b><span className="text-[15px] text-mute">Use GCash, Maya, Bank Transfer, or Cash at Church. Add your reference number.</span></li>
          <li className={step}><b className="text-[17px]">See it counted</b><span className="text-[15px] text-mute">Our treasurer confirms what was received, and your gift is added to the total above.</span></li>
        </ol>
      </div></section>

      <section id="ways" className="pt-0 pb-6"><div className={wrap}>
        <h2 className={h2}>Ways to send your gift</h2>
        <p className={sub}>Record your pledge below to get a reference number, then send it using one of these methods.</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
          {PAYMENT_METHODS.map((m) => (
            <div className={card} key={m.id}>
              <h3 className={cardTitle}>{m.label}</h3>
              <PaymentDetails method={m} className="text-left text-[14px] text-mute" />
            </div>
          ))}
        </div>
      </div></section>

      <section id="give" className="pt-6 pb-14"><div className={wrap}>
        <h2 className={h2}>Give to {CHURCH.name}</h2>
        <p className={sub}>It takes about a minute. Give once, or every month until the building is finished.</p>
        <div className="grid grid-cols-[1.3fr_.7fr] items-start gap-6 max-md:grid-cols-[1fr]">
          <div className={`${cardBox} p-7 max-md:p-5`}><GiveForm /></div>
          <aside className="sticky top-24 grid gap-5 max-md:static">
            <div className="rounded-xl border border-gold bg-paper p-[22px]">
              <h3 className={cardTitle}>Give with confidence</h3>
              <ul className="mt-0 mb-3 pl-[18px] text-[14px]">
                <li className="mb-1.5">Every pledge gets a reference number you can keep.</li>
                <li className="mb-1.5">Only gifts confirmed by the treasurer count toward the total.</li>
                <li className="mb-1.5">Your email is never shown. Choose “Anonymous” to hide your name on the wall.</li>
              </ul>
              <p className={muted}>Questions? <a href={`mailto:${CHURCH.email}`}>{CHURCH.email}</a></p>
            </div>
            <FundraisingPercent pct={pct} goal={CHURCH.goal} campaign={CHURCH.campaign} />
            <div className={card}>
              <h3 className={cardTitle}>Giving wall</h3>
              {wall.length ? wall.map((g) => (
                <div className="flex justify-between gap-2.5 border-b border-line py-2.5 text-[14px] last-of-type:border-0" key={g.id}>
                  <div><b>{g.name}</b>{g.message && <em className="block text-[13px] text-mute not-italic">“{g.message.slice(0, 60)}”</em>}</div><b className="whitespace-nowrap">{phpCents(g.amount)}</b>
                </div>
              )) : <p className={muted}>No confirmed gifts yet. Be the first to give.</p>}
              {donors > 0 && <p className={`${muted} mt-3`}>{donors} confirmed gift{donors > 1 ? "s" : ""} on this site</p>}
            </div>
          </aside>
        </div>
      </div></section>

      <JoinUs intro="Come worship with us this week, and see the place your gift is building." />

      <a className="fixed inset-x-3 bottom-3 z-40 hidden rounded-[10px] bg-gold p-3.5 text-center font-semibold text-[#1b1404] no-underline shadow-[0_8px_24px_rgba(43,34,38,.3)] max-md:block print:hidden" href="#give">Give to {CHURCH.campaign}</a>
      <PageJsonLd title={DONATE_TITLE} path="/donate" image={SHARE_IMAGES.donate} />
    </main>
  );
}
