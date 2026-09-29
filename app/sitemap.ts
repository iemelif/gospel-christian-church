import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { HISTORY_TERMS } from "@/content/officers";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/donate", "/leadership", "/officers", ...HISTORY_TERMS.map((t) => `/history/${t.slug}`)];
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
