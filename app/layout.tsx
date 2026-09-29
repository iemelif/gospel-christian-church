import type { Metadata, Viewport } from "next";
import { Young_Serif, Figtree } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ADDRESS, LOGOS, SITE, SITE_URL, SOCIAL, LINKS } from "@/content/site";
import { buildNav } from "@/lib/nav";

// Variable names must not be --font-sans / --font-serif: those are Tailwind theme variables (mapped in globals.css).
const serif = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-young-serif" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const viewport: Viewport = { themeColor: "#ffffff" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} – Calumpit, Bulacan`, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.name,
  // Browser tab icon from the church logo → <link rel="icon"> and <link rel="shortcut icon">
  icons: {
    icon: [{ url: LOGOS.gcc.src, type: "image/png" }],
    shortcut: [{ url: LOGOS.gcc.src, type: "image/png" }],
    apple: [{ url: LOGOS.gcc.src, type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} – Calumpit, Bulacan`,
    description: SITE.description,
    url: "/",
    locale: SITE.locale,
    images: [{ url: LOGOS.iemelif.src, width: LOGOS.iemelif.width, height: LOGOS.iemelif.height, alt: LOGOS.iemelif.alt }],
  },
  twitter: { card: "summary", title: SITE.name, description: SITE.description, images: [LOGOS.iemelif.src] },
};

// Structured data so search engines understand this is a church and where it is.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}${LOGOS.gcc.src}`,
  image: `${SITE_URL}${LOGOS.iemelif.src}`,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    postalCode: ADDRESS.postalCode,
    addressCountry: ADDRESS.country,
  },
  sameAs: [...SOCIAL.map((s) => s.href), LINKS.iemelif],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="m-0 bg-bg font-sans text-[16px] leading-[1.6] font-normal text-ink max-md:pb-[70px]">
        <a className="absolute top-[-60px] left-3 z-[100] rounded-lg bg-gold px-4 py-2.5 font-semibold text-[#1b1404] focus:top-3" href="#main">Skip to content</a>
        <SiteHeader nav={buildNav()} />
        {children}
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
