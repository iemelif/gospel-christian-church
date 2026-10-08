import type { MetadataRoute } from "next";
import { IS_STAGING, SITE_URL } from "@/content/site";

/** Staging (gcciemelif.website) blocks every crawler; production (gcciemelif.com) is crawlable. */
export default function robots(): MetadataRoute.Robots {
  if (IS_STAGING) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
