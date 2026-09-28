import type { Metadata } from "next";
import { Young_Serif, Figtree } from "next/font/google";
import "./globals.css";

const serif = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Gospel Christian Church – Church Building Fund",
  description: "Help Gospel Christian Church raise ₱12,000,000 for our new church building.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
