import ChurchProgress from "@/components/ChurchProgress";
import GiveForm from "@/components/GiveForm";
import { CHURCH, SCHEDULE, php } from "@/lib/config";
import { summary } from "@/lib/store";
import { pageMeta } from "@/lib/seo";
import { brandGradient, btn, card, cardBox, cardTitle, cards, h2, muted, sub, wrap } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Church Building Fund",
  "Help Gospel Christian Church IEMELIF raise ₱12,000,000 for our new church building in Frances, Calumpit, Bulacan.",
  "/support",
);

// Numbered step cards: the number is drawn by a CSS counter in ::before.
const step = "relative flex flex-col gap-1 rounded-xl border border-line bg-card py-5 pr-5 pl-16 [counter-increment:s] before:absolute before:top-[18px] before:left-[18px] before:grid before:size-[34px] before:place-items-center before:rounded-full before:bg-brand before:font-serif before:text-[17px] before:leading-[normal] before:font-normal before:text-white before:content-[counter(s)]";

export default async function SupportPage() {
  const { raised, wall, donors } = await summary();
  const pct = Math.min(100, (raised / CHURCH.goal) * 100);
  const pctText = pct.toFixed(1).replace(/\.0$/, "");
  const toGo = Math.max(0, CHURCH.goal - raised);
  return (
    <main id="main">
      <div className={`${brandGradient} text-onbrand [&_:focus-visible]:outline-gold`}>
        <div className={wrap}>
          <div className="grid grid-cols-[1.2fr_.8fr] items-center gap-10 pt-12 pb-[72px] max-md:grid-cols-[1fr]">
            <div>
              <h1 className="mb-4 text-[length:clamp(34px,5.5vw,56px)]">Help us build a home for every neighbor.</h1>
              <p className="mt-0 mb-6 max-w-[52ch] text-[#f4dbe1]">Gospel Christian Church is raising {php(CHURCH.goal)} for a new church building in Frances, Calumpit. It will be a place where our whole community can worship, learn, and serve together. We are {pctText}% of the way there, and your gift moves us closer.</p>
              <a className={`${btn.primaryLg} mr-1.5 mb-2`} href="#give">Give to the building fund</a>{" "}<a className={`${btn.ghostLgOnBrand} mr-1.5 mb-2`} href="#how">How giving works</a>
              <div className="mt-[22px] border-l-[3px] border-gold pl-3 text-[14px] text-[#f1c9d2]">“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7</div>
            </div>
            <div className="rounded-2xl border border-[rgba(222,185,66,.35)] bg-[rgba(255,255,255,.08)] px-5 pt-6 pb-5 text-center">
              <ChurchProgress pct={pct} />
              <div className="font-serif text-[44px] leading-none text-gold">{pctText}%</div>
              <small className="mt-1.5 block text-[#f1c9d2]">{php(raised)} of {php(CHURCH.goal)}</small>
              <div className="mt-4 flex justify-center gap-7 border-t border-[rgba(255,248,240,.2)] pt-3.5">
                <div className="flex flex-col"><b className="font-serif text-[20px] leading-[normal] font-normal text-white">{php(toGo)}</b><span className="text-[13px] text-[#f1c9d2]">still needed</span></div>
                {donors > 0 && <div className="flex flex-col"><b className="font-serif text-[20px] leading-[normal] font-normal text-white">{donors}</b><span className="text-[13px] text-[#f1c9d2]">confirmed gift{donors > 1 ? "s" : ""} online</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="progress" className="pt-14 pb-6"><div className={wrap}>
        <h2 className={h2}>{CHURCH.campaign}</h2>
        <p className={sub}>The total moves whenever our treasurer confirms a gift, so what you see here is money actually received.</p>
        <div className={card}>
          <div className="relative h-[18px] overflow-hidden rounded-lg bg-line" role="progressbar" aria-label="Building fund progress" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <i className="block h-full rounded-lg bg-gold" style={{ width: `${pct}%` }} />
            {[25, 50, 75].map((m) => <em key={m} style={{ left: `${m}%` }} className={`absolute inset-y-0 w-[2px] -translate-x-px ${pct >= m ? "bg-[rgba(255,255,255,.7)]" : "bg-[rgba(43,34,38,.25)]"}`} />)}
          </div>
          <div className="mt-1.5 flex justify-between text-[12px] text-mute" aria-hidden="true"><span>₱0</span><span>25%</span><span>50%</span><span>75%</span><span>{php(CHURCH.goal)}</span></div>
          <div className="mt-2.5 flex justify-between text-[15px] text-mute"><span><b className="text-ink">{php(raised)}</b> raised</span><span><b className="text-ink">{php(toGo)}</b> to go</span></div>
        </div>
      </div></section>

      <section id="how" className="py-14"><div className={wrap}>
        <h2 className={h2}>How your gift reaches the building</h2>
        <p className={sub}>Three steps, and you can see the result on this page.</p>
        <ol className="m-0 grid list-none grid-cols-[repeat(3,1fr)] gap-5 p-0 [counter-reset:s] max-md:grid-cols-[1fr]">
          <li className={step}><b className="text-[17px]">Record your pledge</b><span className="text-[15px] text-mute">Choose an amount and tell us who you are. You get a reference number right away.</span></li>
          <li className={step}><b className="text-[17px]">Send your gift</b><span className="text-[15px] text-mute">Use GCash, Maya, bank transfer, or give in person at church. Add your reference number.</span></li>
          <li className={step}><b className="text-[17px]">See it counted</b><span className="text-[15px] text-mute">Our treasurer confirms what was received, and your gift is added to the total above.</span></li>
        </ol>
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
            <div className={card}>
              <h3 className={cardTitle}>Giving wall</h3>
              {wall.length ? wall.map((g) => (
                <div className="flex justify-between gap-2.5 border-b border-line py-2.5 text-[14px] last-of-type:border-0" key={g.id}>
                  <div><b>{g.name}</b>{g.message && <em className="block text-[13px] text-mute not-italic">“{g.message.slice(0, 60)}”</em>}</div><b>{php(g.amount)}</b>
                </div>
              )) : <p className={muted}>No confirmed gifts yet. Be the first to give.</p>}
              {donors > 0 && <p className={`${muted} mt-3`}>{donors} confirmed gift{donors > 1 ? "s" : ""} on this site</p>}
            </div>
          </aside>
        </div>
      </div></section>

      <section id="visit" className="py-14"><div className={wrap}>
        <h2 className={h2}>Join us</h2>
        <p className={sub}>Come worship with us this week, and see the place your gift is building.</p>
        <div className={cards}>
          {SCHEDULE.map((s) => (
            <div className={card} key={s.title}><h3 className={cardTitle}>{s.title}</h3><p className="m-0">{s.day}<br /><b>{s.time}</b></p></div>
          ))}
        </div>
      </div></section>

      <a className="fixed inset-x-3 bottom-3 z-40 hidden rounded-[10px] bg-gold p-3.5 text-center font-semibold text-[#1b1404] no-underline shadow-[0_8px_24px_rgba(43,34,38,.3)] max-md:block print:hidden" href="#give">Give to the building fund</a>
    </main>
  );
}
