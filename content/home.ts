// ─────────────────────────────────────────────────────────────────────────────
// Home page content. The carousel has no list here: it shows every image in public/images/hershot-carousel/
// (alphabetical by file name; see lib/carousel.ts). To change it, add, remove or rename files in that folder —
// the file name (without the leading number) becomes the image's alt text, e.g. "04-youth-choir.jpg" → "Youth choir".
// ─────────────────────────────────────────────────────────────────────────────

/** Share preview (Open Graph / Twitter) for Home. Set separately so the carousel folder can change freely. */
export const SHARE_IMAGE = { url: "/images/hershot-carousel/01-gcc-nehemniah.png", width: 1907, height: 1043, alt: "Illustration of the new Gospel Christian Church building", type: "image/png" };

/** Welcome paragraph (one paragraph; built only from verified facts in content/site.ts). */
export const WELCOME_TEXT =
  "We are glad you are here. Gospel Christian Church IEMELIF gathers in Frances, Calumpit, Bulacan, and you are warmly invited to worship with us, meet our pastor, leaders and officers, and become part of our church family as we build together through Project Nehemiah, our church building project.";

/** Project Nehemiah feature on the Home page: the Facebook video plays inline (muted autoplay); the CTA links to /donate. */
export const NEHEMIAH_FEATURE = {
  eyebrow: "Our church building project",
  text: "Project Nehemiah is building a new home for our church. Watch the video about the project and help us build.",
  cta: "Support Project Nehemiah",
  video: { url: "https://www.facebook.com/gcc1984/videos/1995167554627898/", title: "Project Nehemiah video" },
};

/** Display labels for the leader cards on Home; officer data (content/officers.ts) keeps its own spelling. */
export const LEADER_ROLE_LABELS: Record<string, string> = { Deac: "Deacon" };
