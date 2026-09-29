import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { CHURCH, php } from "./config";

/** Donate page title and description (also used by the temporary Home page, which renders the Donate page).
 *  The amount follows the configured goal (NEXT_PUBLIC_GOAL, default ₱12,000,000). */
export const DONATE_TITLE = `Donate to ${CHURCH.campaign}`;
export const DONATE_DESCRIPTION = `Help ${SITE.name} raise ${php(CHURCH.goal)} for ${CHURCH.campaign}, our new church building in Frances, Calumpit, Bulacan.`;

/** Per-page metadata: title, description, canonical URL, Open Graph. `path` is the page's own path, e.g. "/officers". */
export function pageMeta(title: string, description: string, path: string, opts: { index?: boolean } = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE.shortName}`, description, url: path, siteName: SITE.name, locale: SITE.locale, type: "website" },
    robots: opts.index === false ? { index: false, follow: true } : undefined,
  };
}
