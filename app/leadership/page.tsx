import PageHero from "@/components/PageHero";
import PersonCard from "@/components/PersonCard";
import { CURRENT_TERM } from "@/content/officers";
import { leadershipGroups } from "@/lib/officers";
import { pageMeta } from "@/lib/seo";

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
      <div className="wrap page-body">
        {groups.map((g) => (
          <section key={g.title} aria-labelledby={`g-${g.title}`}>
            <h2 id={`g-${g.title}`}>{g.title}</h2>
            <ul className="people row-rest">{g.people.map((p) => <PersonCard key={p.name} person={p} />)}</ul>
          </section>
        ))}
      </div>
    </main>
  );
}
