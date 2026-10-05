import PageHero from "@/components/PageHero";
import PageJsonLd from "@/components/PageJsonLd";
import PagePhoto from "@/components/PagePhoto";
import OfficerBoard from "@/components/OfficerBoard";
import { CURRENT_TERM } from "@/content/officers";
import { SHARE_IMAGES } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { pageBody, wrap } from "@/lib/ui";

const photo = SHARE_IMAGES[CURRENT_TERM.photo ?? "family"];

export const metadata = pageMeta(
  "Church Officers",
  `Church officers of Gospel Christian Church IEMELIF in Calumpit, Bulacan for ${CURRENT_TERM.label}: pastor, deac, chairman, vice chairman and committee officers.`,
  "/officers",
  { image: photo },
);

export default function OfficersPage() {
  return (
    <main id="main">
      <PageHero title="Church Officers" intro={`Our officers for ${CURRENT_TERM.label}.`} />
      <div className={`${wrap} ${pageBody}`}>
        <PagePhoto img={photo} />
        <OfficerBoard term={CURRENT_TERM} />
      </div>
      <PageJsonLd title={"Church Officers"} path={"/officers"} image={photo} />
    </main>
  );
}
