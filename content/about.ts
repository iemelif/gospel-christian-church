// ─────────────────────────────────────────────────────────────────────────────
// About Us page text. Edit freely; keep facts verified (church history must come from the church or from
// IEMELIF's official history page, not guesses).
// "Pastors through the years" has no list here: it is built from content/officers.ts (each term's Pastor and Deac).
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT_INTRO = "Who we are, where we come from, and the pastors who have shepherded our church.";

/** Opening section: who we are. Founding year 1984: the 2026 anniversary graphic says "42nd Church Founding
 *  Anniversary" (SHARE_IMAGES.home) and the Facebook page is @gcc1984. Owner to confirm. */
export const ABOUT_WELCOME = {
  heading: "Our church",
  paragraphs: [
    "Founded in 1984, Gospel Christian Church IEMELIF is a congregation of the Iglesia Evangelica Metodista En Las Islas Filipinas (IEMELIF), gathering for worship in Zone 7 Frances, Calumpit, Bulacan.",
    "Today we are building a new home for our church through Project Nehemiah, and you are warmly invited to worship with us.",
  ],
};

/** The church's own video about how GCC-IEMELIF was founded (Filipino), embedded from Facebook. */
export const FOUNDING_VIDEO = {
  url: "https://www.facebook.com/gcc1984/videos/3180486242048662/",
  title: "Muling balikan: Ang kasaysayan ng pagkakatatag ng GCC-IEMELIF",
  heading: "Our story",
  caption: "Look back with us at how Gospel Christian Church IEMELIF was founded (video in Filipino).",
};

/** Section introducing the pastors list built from content/officers.ts. */
export const PASTORS_SECTION = {
  heading: "Pastors through the years",
  intro: "The pastors and deacs who have served our congregation, from our officer records.",
};

/** IEMELIF background, summarised from IEMELIF's official history page (`source`). */
export const IEMELIF_HERITAGE = {
  heading: "Our IEMELIF heritage",
  intro: "Our church belongs to the IEMELIF, founded in 1909 by Filipino ministers who chose to lead their own church.",
  facts: [
    { year: "1909", text: "On February 28, the IEMELIF was established under Rev. Nicolas V. Zamora, the first Filipino ordained pastor of the Methodist Episcopal Church, as a self-governing, self-sustaining and self-propagating church." },
    { year: "1932", text: "The Central Cathedral was completed. It was destroyed in 1941 and rebuilt after the Second World War." },
    { year: "1947", text: "The Instituto Ministerial was founded, which later became the IEMELIF Bible College." },
    { year: "1948", text: "The church's Discipline placed its leadership in a collegial Consistory of Elders instead of a single General Superintendent." },
  ],
  source: { label: "Read the full IEMELIF history", href: "https://www.iemelifchurch.com/history/" },
};
