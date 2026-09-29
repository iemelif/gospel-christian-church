import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { CHURCH, php } from "./config";

/** Donate page title and description (also used by the temporary Home page, which renders the Donate page).
 *  The amount follows the configured goal (NEXT_PUBLIC_GOAL, default ₱12,000,000). */
export const DONATE_TITLE = `Donate to ${CHURCH.campaign}`;
export const DONATE_DESCRIPTION = `Help ${SITE.name} raise ${php(CHURCH.goal)} for ${CHURCH.campaign}, our new church building in Frances, Calumpit, Bulacan.`;

/** Per-page metadata: title, description, canonical URL, Open Graph. `path` is the page's own path, e.g. "/officers". */
export type ShareImage = { url: string; width: number; height: number; alt: string; type?: string };

/** Per-page metadata: title, description, canonical URL, Open Graph. `path` is the page's own path, e.g. "/officers".
 *  `image` adds an Open Graph / Twitter (X) large-card preview image. */
export function pageMeta(title: string, description: string, path: string, opts: { index?: boolean; image?: ShareImage } = {}): Metadata {
  const { image } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE.shortName}`, description, url: path, siteName: SITE.name, locale: SITE.locale, type: "website", ...(image && { images: [image] }) },
    ...(image && { twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] } }),
    robots: opts.index === false ? { index: false, follow: true } : undefined,
  };
}
