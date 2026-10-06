import Link from "next/link";
import JoinUs from "@/components/JoinUs";
import PageHero from "@/components/PageHero";
import PageJsonLd from "@/components/PageJsonLd";
import PagePhoto from "@/components/PagePhoto";
import VideoEmbed from "@/components/VideoEmbed";
import { ABOUT_INTRO, ABOUT_WELCOME, FOUNDING_VIDEO, IEMELIF_HERITAGE, PASTORS_SECTION } from "@/content/about";
import { CURRENT_TERM, HISTORY_TERMS } from "@/content/officers";
import { displayName, pastorPeriods, periodLabel } from "@/lib/officers";
import { pageMeta } from "@/lib/seo";
import { btn, cardBox, h2, pageBody, sub, wrap } from "@/lib/ui";

export const metadata = pageMeta(
  "About Us",
  "The story of Gospel Christian Church IEMELIF in Frances, Calumpit, Bulacan, founded in 1984: our pastors through the years and our IEMELIF heritage.",
  "/about",
);

const sectionGap = "pt-12";
const yearBadge = "shrink-0 rounded-lg bg-paper px-3 py-1.5 font-serif text-[18px] leading-[normal] text-brand";

/** Officers page of a period's newest term (current term → /officers). */
const periodHref = (current: boolean, to: number) => (current ? "/officers" : `/history/${to - 1}-${to}`);

export default function AboutPage() {
  const periods = pastorPeriods([CURRENT_TERM, ...HISTORY_TERMS]);
  return (
    <main id="main">
      <PageHero title="About Us" intro={ABOUT_INTRO} />
      <div className={`${wrap} ${pageBody}`}>
        <PagePhoto />

        <section aria-labelledby="our-church">
          <h2 className={h2} id="our-church">{ABOUT_WELCOME.heading}</h2>
          {ABOUT_WELCOME.paragraphs.map((p) => <p className="mt-0 mb-4 max-w-[70ch]" key={p}>{p}</p>)}
        </section>

        <section className={sectionGap} aria-labelledby="our-story">
          <h2 className={h2} id="our-story">{FOUNDING_VIDEO.heading}</h2>
          <p className={`${sub} mb-5`}>{FOUNDING_VIDEO.caption}</p>
          <div className={`${cardBox} mx-auto max-w-[960px] p-2.5`}><VideoEmbed url={FOUNDING_VIDEO.url} title={FOUNDING_VIDEO.title} /></div>
        </section>

        <section className={sectionGap} aria-labelledby="pastors">
          <h2 className={h2} id="pastors">{PASTORS_SECTION.heading}</h2>
          <p className={sub}>{PASTORS_SECTION.intro}</p>
          <ol className="m-0 grid list-none gap-3 p-0">
            {periods.map((p) => (
              <li className={`${cardBox} flex items-center gap-5 px-5 py-4 max-md:flex-col max-md:items-start max-md:gap-3`} key={`${p.from}-${p.to}`}>
                <span className={yearBadge}>{periodLabel(p)}</span>
                <p className="m-0 flex-1">
                  {p.pastors.map((n) => <span className="block" key={n}><b>{displayName(n)}</b> · Pastor</span>)}
                  {p.deacs.map((n) => <span className="block text-mute" key={n}>{displayName(n)} · Deac</span>)}
                </p>
                <Link className="text-[14px] font-semibold text-gold-dark" href={periodHref(p.current, p.to)}>See officers</Link>
              </li>
            ))}
          </ol>
        </section>

        <section className={sectionGap} aria-labelledby="heritage">
          <h2 className={h2} id="heritage">{IEMELIF_HERITAGE.heading}</h2>
          <p className={sub}>{IEMELIF_HERITAGE.intro}</p>
          <ol className="m-0 mb-7 grid list-none gap-4 border-l-[3px] border-gold py-1 pr-0 pl-6">
            {IEMELIF_HERITAGE.facts.map((f) => (
              <li className="max-w-[75ch]" key={f.year}><b className="mb-0.5 block font-serif text-[20px] font-normal text-brand">{f.year}</b>{f.text}</li>
            ))}
          </ol>
          <a className={btn.ghost} href={IEMELIF_HERITAGE.source.href} target="_blank" rel="noopener">{IEMELIF_HERITAGE.source.label}</a>
        </section>
      </div>
      <JoinUs />
      <PageJsonLd title="About Us" path="/about" />
    </main>
  );
}
