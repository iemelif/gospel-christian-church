import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/** Web app manifest (site name and icons; icons are made from the GCC logo image, see app/layout.tsx). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "GCC IEMELIF",
    description: SITE.description,
    start_url: "/",
    display: "browser",
    background_color: "#fbf8f2",
    theme_color: "#7f1f36",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
