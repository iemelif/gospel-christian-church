import ComingSoon from "@/components/ComingSoon";
import JoinUs from "@/components/JoinUs";
import PageHero from "@/components/PageHero";
import { COMING_SOON, COMING_SOON_JOIN_INTRO } from "@/content/coming-soon";
import { pageMeta } from "@/lib/seo";
import { wrap } from "@/lib/ui";

// Placeholder ("Coming soon"): kept out of search results until real content is added.
export const metadata = pageMeta("Ministries", "Ministries – Gospel Christian Church IEMELIF, Calumpit, Bulacan.", "/ministries", { index: false });

export default function Page() {
  return (
    <main id="main">
      <PageHero title="Ministries" />
      <div className={`${wrap} pt-10`}><ComingSoon {...COMING_SOON.ministries} /></div>
      <JoinUs intro={COMING_SOON_JOIN_INTRO} />
    </main>
  );
}
