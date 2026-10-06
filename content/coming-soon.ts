// ─────────────────────────────────────────────────────────────────────────────
// "Coming soon" text for pages that don't have their content yet (Ministries, Contact Us).
// Edit the title and text freely. When a page gets its real content, remove its entry here and the
// <ComingSoon> from the page (see docs/pages/<page>.md).
// ─────────────────────────────────────────────────────────────────────────────

export type ComingSoonText = { title: string; text: string };

export const COMING_SOON = {
  ministries: {
    title: "Our ministries page is on its way",
    text: "Soon you will find the ministries of our church here, and how you can take part. Until then, we would love to meet you at a worship service.",
  },
  contact: {
    title: "Our contact page is on its way",
    text: "While we prepare this page, you can message us on Facebook or visit us at one of our worship services in Frances, Calumpit.",
  },
} satisfies Record<string, ComingSoonText>;

/** Sentence under "Join us" on the coming-soon pages. */
export const COMING_SOON_JOIN_INTRO = "While this page is being prepared, come and worship with us.";
