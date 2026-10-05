import type { Metadata } from "next";
import { SHARE_IMAGES, SITE, SITE_URL } from "@/content/site";
import { CHURCH, php } from "./config";

/** Donate page title and description (also used by the temporary Home page, which renders the Donate page).
 *  The amount follows the configured goal (NEXT_PUBLIC_GOAL, default ₱12,000,000). */
export const DONATE_TITLE = `Donate to ${CHURCH.campaign}`;
export const DONATE_DESCRIPTION = `Help ${SITE.name} raise ${php(CHURCH.goal)} for ${CHURCH.campaign}, our new church building in Frances, Calumpit, Bulacan.`;

export type ShareImage = { url: string; width: number; height: number; alt: string; type?: string };

/** Robots for indexable pages: allow Google to show large image thumbnails. Also set in app/layout.tsx. */
export const INDEX_ROBOTS = { index: true, follow: true, "max-image-preview": "large" } as const;

/** Per-page metadata: title, description, canonical URL, Open Graph. `path` is the page's own path, e.g. "/officers".
 *  `image` is the Open Graph / Twitter (X) large-card preview image; indexable pages default to the church family photo
 *  (shown on those pages by <PagePhoto/>), because a page's `openGraph` replaces the layout's, image included. */
export function pageMeta(title: string, description: string, path: string, opts: { index?: boolean; image?: ShareImage } = {}): Metadata {
  const image = opts.image ?? (opts.index === false ? undefined : SHARE_IMAGES.family);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE.shortName}`, description, url: path, siteName: SITE.name, locale: SITE.locale, type: "website", ...(image && { images: [image] }) },
    ...(image && { twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] } }),
    // "max-image-preview: large" lets Google show a large image (the share image) beside the result.
    robots: opts.index === false ? { index: false, follow: true } : INDEX_ROBOTS,
  };
}

/** schema.org WebPage with `primaryImageOfPage`: tells Google which picture to show beside this page's result. */
export function webPageJsonLd(title: string, path: string, image: ShareImage = SHARE_IMAGES.family) {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: title,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE_URL },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${image.url}`, width: image.width, height: image.height, caption: image.alt },
  };
}
