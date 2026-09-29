import SupportPage from "./support/page";
import { pageMeta } from "@/lib/seo";

// Temporary: "/" shows the donation page (which now lives at /support) until the new Home page replaces this file.
export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Church Building Fund",
  "Help Gospel Christian Church IEMELIF raise ₱12,000,000 for our new church building in Frances, Calumpit, Bulacan.",
  "/",
);

export default SupportPage;
