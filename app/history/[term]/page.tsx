import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import OfficerBoard from "@/components/OfficerBoard";
import { CURRENT_TERM, HISTORY_TERMS } from "@/content/officers";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ term: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => HISTORY_TERMS.map((t) => ({ term: t.slug }));

export async function generateMetadata({ params }: Props) {
  const { term: slug } = await params;
  const term = HISTORY_TERMS.find((t) => t.slug === slug);
  if (!term) return {};
  return pageMeta(
    `${term.label} Officers`,
    `Church officers of Gospel Christian Church IEMELIF in Calumpit, Bulacan for ${term.label}.`,
    `/history/${term.slug}`,
  );
}

export default async function HistoryPage({ params }: Props) {
  const { term: slug } = await params;
  const term = HISTORY_TERMS.find((t) => t.slug === slug);
  if (!term) notFound();
  return (
    <main id="main">
      <PageHero title={`${term.label} Officers`} intro="Leadership history" />
      <div className="wrap page-body">
        <OfficerBoard term={term} />
        <nav className="term-links" aria-label="Other terms">
          <h2>Other terms</h2>
          <ul>
            <li><Link href="/officers">{CURRENT_TERM.label} (current)</Link></li>
            {HISTORY_TERMS.filter((t) => t.slug !== term.slug).map((t) => (
              <li key={t.slug}><Link href={`/history/${t.slug}`}>{t.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
