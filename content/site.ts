// ─────────────────────────────────────────────────────────────────────────────
// Site-wide settings. Edit this file to change links, address, social media,
// and the navigation menu. No other file needs to change.
// ─────────────────────────────────────────────────────────────────────────────

// ── Environment-based URLs ───────────────────────────────────────────────────
// `npm run dev`  → NODE_ENV=development → the "development" block (localhost)
// `npm run build` / `npm start` → NODE_ENV=production → the "production" block
// Change the addresses/ports here if your local setup differs.
const ENVIRONMENTS = {
  development: {
    siteUrl: "http://localhost:3000",     // this app
    home: "http://localhost:3000",
    gcc: "http://localhost:3000",
    support: "http://localhost:3000",     // the support site, if you run it locally
  },
  production: {
    siteUrl: "https://www.gcciemelif.website",
    home: "https://www.gcciemelif.website",
    gcc: "https://www.gcciemelif.website",
    support: "https://support.gcciemelif.website", // not used by the menu since Donate moved to /donate (subdomain decision pending)
  },
};
const ENV = process.env.NODE_ENV === "development" ? ENVIRONMENTS.development : ENVIRONMENTS.production;

/** Public URL of THIS site (used for SEO: canonical links, sitemap, Open Graph). */
export const SITE_URL = ENV.siteUrl;

export const SITE = {
  name: "Gospel Christian Church IEMELIF",
  shortName: "Gospel Christian Church",
  description:
    "Gospel Christian Church IEMELIF in Frances, Calumpit, Bulacan. Meet our pastor, leaders and officers, join our worship services, and support Project Nehemiah, our church building project.",
  locale: "en_PH",
};

/** Links used by the header and footer. Home / GCC / Support follow the environment above. */
export const LINKS = {
  home: ENV.home,
  support: ENV.support,
  gcc: ENV.gcc,
  iemelif: "https://www.iemelifchurch.com/", // same in every environment
};

/** Logos (files live in /public/images). */
export const LOGOS = {
  gcc: { src: "/images/gcc-logo.png", alt: "Gospel Christian Church logo", width: 54, height: 98 },
  iemelif: { src: "/images/iemelif-logo.png", alt: "IEMELIF logo", width: 274, height: 269 },
};

/** Share / search-result pictures (files in /public/images/search-results-thumbs). Used for link previews
 *  (Facebook, Messenger, X) and as the picture Google may show beside the Home and Donate results.
 *  If you replace a file, update its width and height here too. */
export const SHARE_IMAGES = {
  home: { url: "/images/search-results-thumbs/home.png", width: 1066, height: 1072, alt: "Gospel Christian Church IEMELIF – Equipped to Serve with Excellence, 42nd Church Founding Anniversary", type: "image/png" },
  donate: { url: "/images/search-results-thumbs/donate.png", width: 1907, height: 1043, alt: "Illustration of the new Gospel Christian Church building", type: "image/png" },
};

/** Church address – shown in the footer and in structured data. */
export const ADDRESS = {
  /** Text shown in the footer. */
  display: "GOSPEL CHRISTIAN CHURCH IEMELIF, Zone 7 Frances, Calumpit, 3003 Bulacan",
  // Used for structured data (SEO). Keep in sync with the text above.
  street: "Zone 7, Frances",
  city: "Calumpit",
  region: "Bulacan",
  postalCode: "3003",
  country: "PH",
};

/** Social media. Add, remove or reorder entries; `icon` must be a key in components/SocialIcon.tsx. */
export const SOCIAL: { label: string; href: string; icon: "facebook" }[] = [
  { label: "Facebook", href: "https://www.facebook.com/gcc1984", icon: "facebook" },
];

/**
 * Header menu. `href` may be an internal path ("/officers") or a full URL.
 * Items with `children` render as a dropdown. Set `external: true` for other-site links.
 * Items with `children` render as a dropdown (nesting is allowed). If an item has both `href` and `children`,
 * the label is a link and the arrow opens the dropdown.
 * The Leadership History submenu is generated automatically from content/officers.ts.
 */
export type NavItem = { label: string; href?: string; external?: boolean; children?: NavItem[] };

export const NAV: NavItem[] = [
  { label: "Home", href: LINKS.home, external: true },
  { label: "About Us", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  {
    // No href: clicking the label just opens the dropdown.
    label: "Church Leadership",
    children: [
      { label: "Church Officers", href: "/officers" },
      { label: "Leadership History", children: [] }, // filled from HISTORY_TERMS
    ],
  },
  { label: "Donate", href: "/donate" }, // internal page for Project Nehemiah (was "Support" → LINKS.support)
  { label: "Contact Us", href: "/contact" },
];
