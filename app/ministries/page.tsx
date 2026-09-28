import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

// Placeholder: kept out of search results until real content is added.
export const metadata = pageMeta("Ministries", "Ministries – Gospel Christian Church IEMELIF, Calumpit, Bulacan.", "/ministries", { index: false });

export default function Page() {
  return (
    <main id="main">
      <PageHero title="Ministries" />
      <div className="wrap page-body" />
    </main>
  );
}
