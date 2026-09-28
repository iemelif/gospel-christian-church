import PageHero from "@/components/PageHero";
import { pageMeta } from "@/lib/seo";

// Placeholder: kept out of search results until real content is added.
export const metadata = pageMeta("Contact Us", "Contact Us – Gospel Christian Church IEMELIF, Calumpit, Bulacan.", "/contact", { index: false });

export default function Page() {
  return (
    <main id="main">
      <PageHero title="Contact Us" />
      <div className="wrap page-body" />
    </main>
  );
}
