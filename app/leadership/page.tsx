import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { CURRENT_TERM } from "@/content/officers";
import { leadershipGroups } from "@/lib/officers";
import { pageMeta } from "@/lib/seo";
import { h2Size, pageBody, peopleGrid, peopleRowRest, wrap } from "@/lib/ui";

export const metadata = pageMeta(
  "Church Leadership",
  `Meet the pastor, deac, preachers and ministry leaders of Gospel Christian Church IEMELIF in Calumpit, Bulacan (${CURRENT_TERM.label}).`,
  "/leadership",
);

export default function LeadershipPage() {
  const groups = leadershipGroups(CURRENT_TERM);
  return (
    <main id="main">
      <PageHero title="Church Leadership" intro={`Those who shepherd and serve our congregation, ${CURRENT_TERM.label}.`} />
      <div className={`${wrap} ${pageBody}`}>
        {groups.map((g) => (
          <section className="pb-9" key={g.title} aria-labelledby={`g-${g.title}`}>
            <h2 className={`${h2Size} mb-[18px]`} id={`g-${g.title}`}>{g.title}</h2>
            <ul className={`${peopleGrid} ${peopleRowRest}`}>{g.people.map((p) => <PersonCard key={p.name} person={p} />)}</ul>
          </section>
        ))}
      </div>
    </main>
  );
}
