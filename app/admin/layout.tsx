import type { Metadata } from "next";

export const metadata: Metadata = { title: "Treasurer dashboard", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main id="main">{children}</main>;
}
