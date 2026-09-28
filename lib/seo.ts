import type { Metadata } from "next";
import { SITE } from "@/content/site";

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
