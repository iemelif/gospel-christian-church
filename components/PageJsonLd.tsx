import { webPageJsonLd, type ShareImage } from "@/lib/seo";

/** WebPage structured data naming the page's preferred search-result picture (`primaryImageOfPage`). */
export default function PageJsonLd({ title, path, image }: { title: string; path: string; image?: ShareImage }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd(title, path, image)).replace(/</g, "\\u003c") }} />;
}
