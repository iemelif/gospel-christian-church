import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import OfficerBoard from "@/components/OfficerBoard";
import { CURRENT_TERM, HISTORY_TERMS } from "@/content/officers";
import { pageMeta } from "@/lib/seo";
import { pageBody, wrap } from "@/lib/ui";

const termLink = "inline-block rounded-lg border-[1.5px] border-line bg-card px-3.5 py-2 no-underline hover:border-crimson";

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
      <div className={`${wrap} ${pageBody}`}>
        <OfficerBoard term={term} />
        <nav className="mt-5 border-t border-line pt-6" aria-label="Other terms">
          <h2 className="mb-[18px] text-[22px]">Other terms</h2>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            <li><Link className={termLink} href="/officers">{CURRENT_TERM.label} (current)</Link></li>
            {HISTORY_TERMS.filter((t) => t.slug !== term.slug).map((t) => (
              <li key={t.slug}><Link className={termLink} href={`/history/${t.slug}`}>{t.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
