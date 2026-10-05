import Link from "next/link";
import HeroShotCarousel from "@/components/HeroShotCarousel";
import JoinUs from "@/components/JoinUs";
import NehemiahFeature from "@/components/NehemiahFeature";
import PageJsonLd from "@/components/PageJsonLd";
import PersonCard from "@/components/PersonCard";
import WelcomeSection from "@/components/WelcomeSection";
import { LEADER_ROLE_LABELS } from "@/content/home";
import { CURRENT_TERM } from "@/content/officers";
import { SHARE_IMAGES } from "@/content/site";
import { carouselSlides } from "@/lib/carousel";
import { boardRows } from "@/lib/officers";
import { pageMeta } from "@/lib/seo";
import { eyebrow, h2Size, wrap } from "@/lib/ui";

export const metadata = pageMeta(
  "Gospel Christian Church IEMELIF – Calumpit, Bulacan",
  "Gospel Christian Church IEMELIF (GCC IEMELIF) is a church in Frances, Calumpit, Bulacan. Join our worship services, meet our pastor and church leaders, and support Project Nehemiah, our church building project.",
  "/",
  { image: SHARE_IMAGES.home },
);

// Pastor, Deacon ("Deac" in the data), Chairman and Vice Chairman of the current term — the officer board's first two rows.
const { row1, row2 } = boardRows(CURRENT_TERM);
const leaders = [...row1, ...row2].map((p) => ({ ...p, roles: p.roles.map((r) => LEADER_ROLE_LABELS[r] ?? r) }));

/** Home page: carousel → welcome → Project Nehemiah (inline video) → Pastor, Deacon, Chairman and Vice Chairman → Join Us (docs/pages/home.md). */
export default function HomePage() {
  const slides = carouselSlides();
  return (
    <main id="main">
      {slides.length > 0 && <div className={`${wrap} pt-6`}><HeroShotCarousel slides={slides} /></div>}

      <WelcomeSection />

      <section className="pb-14"><div className={wrap}><NehemiahFeature /></div></section>

      <section className="pb-14"><div className={wrap}>
        <span className={eyebrow}>{CURRENT_TERM.label}</span>
        <h2 className={`${h2Size} mb-7`}>Our Pastor, Deacon, Chairman and Vice Chairman</h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-5 p-0">
          {leaders.map((p) => <PersonCard key={p.name} person={p} large href="/officers" />)}
        </ul>
        <p className="mt-5 mb-0 text-center"><Link className="font-semibold text-brand" href="/officers">See all church officers →</Link></p>
      </div></section>

      <div className="border-t border-line bg-paper"><JoinUs /></div>
      <PageJsonLd title="Gospel Christian Church IEMELIF – Calumpit, Bulacan" path="/" image={SHARE_IMAGES.home} />
    </main>
  );
}
