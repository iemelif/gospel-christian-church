import DonatePage from "./donate/page";
import { DONATE_DESCRIPTION, DONATE_TITLE, pageMeta } from "@/lib/seo";

// Temporary: "/" shows the Donate page (Project Nehemiah, /donate) until the new Home page replaces this file.
export const dynamic = "force-dynamic";

export const metadata = pageMeta(DONATE_TITLE, DONATE_DESCRIPTION, "/");

export default DonatePage;
