// ─────────────────────────────────────────────────────────────────────────────
// Church leaders & officers. Edit this file each new term.
//
// TO START A NEW TERM
//   1. Copy the current term's block into HISTORY_TERMS (top of the list).
//   2. Replace CURRENT_TERM with the new term's people.
// A person who holds several roles simply appears on several lines – the
// website merges them into one card. Names are written "Last, First".
// `image` is the slug of the person's name → /images/people/<slug>.svg (see `npm run avatars`).
// `photo` (optional) picks the church photo shown at the top of the term's page, from SHARE_IMAGES in
// content/site.ts ("family2", "family3", …); without it the page shows the default "family" photo.
// ─────────────────────────────────────────────────────────────────────────────

export type Entry = {
  role: string;
  /** "Last, First" */
  name: string;
  /**
   * Picture for this person. Normally the slug of the name, e.g. "ocampo-juanito-jr-s",
   * which resolves to /images/people/ocampo-juanito-jr-s.svg (the generated avatar).
   * To use a real photo, drop the file in /public/images/people/ and set the full path,
   * e.g. image: "/images/people/ocampo-juanito-jr-s.jpg".
   */
  image?: string;
};
import type { SHARE_IMAGES } from "./site";

export type Term = {
  /** URL-safe id, e.g. "2025-2026" → /history/2025-2026 */
  slug: string;
  /** Label shown on the site, e.g. "2025 - 2026" */
  label: string;
  /** Church photo at the top of the page (key of SHARE_IMAGES in content/site.ts). Default: "family". */
  photo?: keyof typeof SHARE_IMAGES;
  entries: Entry[];
};

/** Roles used to build the board layout (must match the `role` text below). */
export const BOARD_ROLES = {
  row1: ["Pastor", "Deac"],
  row2: ["Chairman", "Vice Chairman"],
};

/** Church Leadership page: which roles appear in which group (current term). */
export const LEADERSHIP_GROUPS: { title: string; roles: string[] }[] = [
  { title: "Pastoral Leadership", roles: ["Pastor", "Deac"] },
  { title: "Preachers (Predigador)", roles: ["Predigador"] },
  {
    title: "Ministry & Organization Leaders",
    roles: [
      "President of Young Adult",
      "President of Youth",
      "President of Kababaihan",
      "President of Kalalakihan",
    ],
  },
];

export const CURRENT_TERM: Term = {
  slug: "2026-2027",
  label: "2026 - 2027",
  photo: "family2",
  entries: [
    { role: "Pastor", name: "Ocampo, Juanito Jr. S.", image: "ocampo-juanito-jr-s" },
    { role: "Deac", name: "Ocampo, Zenaida F.", image: "ocampo-zenaida-f" },
    { role: "Predigador", name: "Daluz, Sonia", image: "daluz-sonia" },
    { role: "Predigador", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
    { role: "Predigador", name: "Sunga, Victor R.", image: "sunga-victor-r" },
    { role: "Predigador", name: "Victor, Marvin", image: "victor-marvin" },
    { role: "Predigador", name: "Arnedo, Michelle A.", image: "arnedo-michelle-a" },
    { role: "Predigador", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
    { role: "Predigador", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
    { role: "Predigador", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
    { role: "Predigador", name: "Alberto, Geraldine", image: "alberto-geraldine" },
    { role: "Predigador", name: "Victor, Karissa Swing", image: "victor-karissa-swing" },
    { role: "Predigador", name: "Abesamis, Wilson Lising", image: "abesamis-wilson-lising" },
    { role: "Predigador", name: "Cruz, Eduardo D.", image: "cruz-eduardo-d" },
    { role: "Chairman", name: "Daluz, Sonia", image: "daluz-sonia" },
    { role: "Vice Chairman", name: "Victor, Marvin", image: "victor-marvin" },
    { role: "Kalihim", name: "Abesamis, Kaycie Yumul", image: "abesamis-kaycie-yumul" },
    { role: "Ingat Yaman", name: "Cabral, Lean Rose", image: "cabral-lean-rose" },
    { role: "Tagasuri", name: "Abesamis, Wilson Lising", image: "abesamis-wilson-lising" },
    { role: "Pananalapi", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
    { role: "Programa", name: "Soriano, Genevieve", image: "soriano-genevieve" },
    { role: "PMK", name: "Ocampo, Jeeya", image: "ocampo-jeeya" },
    { role: "Ugnayan", name: "Daluz, Sonia", image: "daluz-sonia" },
    { role: "Kumperensya", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
    { role: "Misyon", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
    { role: "Kaanib", name: "Izon, Maricel T.", image: "izon-maricel-t" },
    { role: "Nominasyon", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
    { role: "Nominasyon", name: "Arnedo, Michelle A.", image: "arnedo-michelle-a" },
    { role: "Nominasyon", name: "Domingo, Connie S.", image: "domingo-connie-s" },
    { role: "Nominasyon", name: "Cano, Christine Joy", image: "cano-christine-joy" },
    { role: "Pangkabuhayan", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
    { role: "Pagawain", name: "Alberto, Geraldine", image: "alberto-geraldine" },
    { role: "Edukasyong Kristiyana", name: "Victor, Marvin", image: "victor-marvin" },
    { role: "President of Young Adult", name: "Ocampo, Jeeya", image: "ocampo-jeeya" },
    { role: "President of Youth", name: "Esmeralda, Gideon Francis C.", image: "esmeralda-gideon-francis-c" },
    { role: "President of Kababaihan", name: "Lugtu, Clarita", image: "lugtu-clarita" },
    { role: "President of Kalalakihan", name: "Arnedo, Mariano", image: "arnedo-mariano" },
  ],
};

/** Past terms, newest first. Each one gets its own page and a Leadership History menu entry. */
export const HISTORY_TERMS: Term[] = [
  {
    slug: "2025-2026",
    label: "2025 - 2026",
    photo: "family2",
    entries: [
      { role: "Pastor", name: "Ocampo, Juanito Jr. S.", image: "ocampo-juanito-jr-s" },
      { role: "Deac", name: "Ocampo, Zenaida F.", image: "ocampo-zenaida-f" },
      { role: "Predigador", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Predigador", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Predigador", name: "Sunga, Victor R.", image: "sunga-victor-r" },
      { role: "Predigador", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
      { role: "Predigador", name: "Estrella, Evelynda", image: "estrella-evelynda" },
      { role: "Predigador", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
      { role: "Predigador", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
      { role: "Predigador", name: "Arnedo, Michelle A.", image: "arnedo-michelle-a" },
      { role: "Predigador", name: "Swing, Karissa", image: "swing-karissa" },
      { role: "Predigador", name: "Daluz, Joseph", image: "daluz-joseph" },
      { role: "Predigador", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
      { role: "Predigador", name: "Alberto, Geraldine", image: "alberto-geraldine" },
      { role: "Chairman", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Vice Chairman", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Kalihim", name: "Abesamis, Kaycie Yumul", image: "abesamis-kaycie-yumul" },
      { role: "Ingat Yaman", name: "Cabral, Lean Rose", image: "cabral-lean-rose" },
      { role: "Tagasuri", name: "Abesamis, Wilson Lising", image: "abesamis-wilson-lising" },
      { role: "Pananalapi", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
      { role: "Programa", name: "Swing, Karissa", image: "swing-karissa" },
      { role: "PMK", name: "Dela Cruz, Rio B.", image: "dela-cruz-rio-b" },
      { role: "Ugnayan", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Kumperensya", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
      { role: "Misyon", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
      { role: "Kaanib", name: "Izon, Maricel T.", image: "izon-maricel-t" },
      { role: "Nominasyon", name: "Estrella, Evelynda", image: "estrella-evelynda" },
      { role: "Nominasyon", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Nominasyon", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Nominasyon", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
      { role: "Pangkabuhayan", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
      { role: "Pagawain", name: "Daluz, Joseph", image: "daluz-joseph" },
      { role: "Edukasyong Kristiyana", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "President of Young Adult", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "President of Youth", name: "Cano, Christine Joy", image: "cano-christine-joy" },
      { role: "President of Kababaihan", name: "Lugtu, Clarita", image: "lugtu-clarita" },
      { role: "President of Kalalakihan", name: "Arnedo, Mariano", image: "arnedo-mariano" },
    ],
  },
  {
    slug: "2024-2025",
    label: "2024 - 2025",
    photo: "family2",
    entries: [
      { role: "Pastor", name: "Ocampo, Juanito Jr. S.", image: "ocampo-juanito-jr-s" },
      { role: "Deac", name: "Ocampo, Zenaida F.", image: "ocampo-zenaida-f" },
      { role: "Predigador", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Predigador", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Predigador", name: "Sunga, Victor R.", image: "sunga-victor-r" },
      { role: "Predigador", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
      { role: "Predigador", name: "Estrella, Evelynda", image: "estrella-evelynda" },
      { role: "Predigador", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
      { role: "Predigador", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
      { role: "Predigador", name: "Arnedo, Michelle A.", image: "arnedo-michelle-a" },
      { role: "Predigador", name: "Swing, Karissa", image: "swing-karissa" },
      { role: "Predigador", name: "Daluz, Joseph", image: "daluz-joseph" },
      { role: "Predigador", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
      { role: "Predigador", name: "Alberto, Geraldine", image: "alberto-geraldine" },
      { role: "Chairman", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Vice Chairman", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Kalihim", name: "Tongol, Michael", image: "tongol-michael" },
      { role: "Ingat Yaman", name: "Cabral, Lean Rose", image: "cabral-lean-rose" },
      { role: "Tagasuri", name: "Abesamis, Wilson Lising", image: "abesamis-wilson-lising" },
      { role: "Pananalapi", name: "Alarcon, Shirley J.", image: "alarcon-shirley-j" },
      { role: "Programa", name: "Swing, Karissa", image: "swing-karissa" },
      { role: "PMK", name: "Dela Cruz, Rio B.", image: "dela-cruz-rio-b" },
      { role: "Ugnayan", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Kumperensya", name: "Tolentino, Marilou S.", image: "tolentino-marilou-s" },
      { role: "Misyon", name: "Manapat, Mylene A.", image: "manapat-mylene-a" },
      { role: "Kaanib", name: "Izon, Maricel T.", image: "izon-maricel-t" },
      { role: "Kaanib", name: "Cruz, Lolita B.", image: "cruz-lolita-b" },
      { role: "Kaanib", name: "Domingo, Connie S.", image: "domingo-connie-s" },
      { role: "Kaanib", name: "Arnedo, Rosalinda", image: "arnedo-rosalinda" },
      { role: "Nominasyon", name: "Estrella, Evelynda", image: "estrella-evelynda" },
      { role: "Nominasyon", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "Nominasyon", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Nominasyon", name: "Arnedo, Michelle A.", image: "arnedo-michelle-a" },
      { role: "Pangkabuhayan", name: "Sunga, Teresita L.", image: "sunga-teresita-l" },
      { role: "Pagawain", name: "Daluz, Joseph", image: "daluz-joseph" },
      { role: "Edukasyong Kristiyana", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "President of Young Adult", name: "Victor, Marvin", image: "victor-marvin" },
      { role: "President of Youth", name: "Cano, Christine Joy", image: "cano-christine-joy" },
      { role: "President of Kababaihan", name: "Lugtu, Clarita", image: "lugtu-clarita" },
      { role: "President of Kalalakihan", name: "Arnedo, Mariano", image: "arnedo-mariano" },
    ],
  },
  {
    slug: "2023-2024",
    label: "2023 - 2024",
    photo: "family3",
    entries: [
      { role: "Pastor", name: "Cortez, Arnel", image: "cortez-arnel" },
      { role: "Deac", name: "Cortez, Celia", image: "cortez-celia" },
      { role: "Predigador", name: "Daluz, Sonia", image: "daluz-sonia" },
      { role: "Predigador", name: "Victor, Marvin", image: "victor-marvin" },
    ],
  },
  {
    slug: "2022-2023",
    label: "2022 - 2023",
    photo: "family3",
    entries: [
      { role: "Pastor", name: "Cortez, Arnel", image: "cortez-arnel" },
      { role: "Deac", name: "Cortez, Celia", image: "cortez-celia" },
    ],
  },
  {
    slug: "2021-2022",
    label: "2021 - 2022",
    photo: "family3",
    entries: [
      { role: "Pastor", name: "Cortez, Arnel", image: "cortez-arnel" },
      { role: "Deac", name: "Cortez, Celia", image: "cortez-celia" },
    ],
  },
  {
    slug: "2020-2021",
    label: "2020 - 2021",
    photo: "family3",
    entries: [
      { role: "Pastor", name: "Cortez, Arnel", image: "cortez-arnel" },
      { role: "Deac", name: "Cortez, Celia", image: "cortez-celia" },
    ],
  },
  {
    slug: "2019-2020",
    label: "2019 - 2020",
    photo: "family3",
    entries: [
      { role: "Pastor", name: "Cortez, Arnel", image: "cortez-arnel" },
      { role: "Deac", name: "Cortez, Celia", image: "cortez-celia" },
    ],
  },
  {
    slug: "2018-2019",
    label: "2018 - 2019",
    photo: "family4",
    entries: [
      { role: "Pastor", name: "Luna, Mumar", image: "luna-mumar" },
      { role: "Deac", name: "Luna, Marites", image: "luna-marites" },
    ],
  },
  {
    slug: "2017-2018",
    label: "2017 - 2018",
    photo: "family4",
    entries: [
      { role: "Pastor", name: "Luna, Mumar", image: "luna-mumar" },
      { role: "Deac", name: "Luna, Marites", image: "luna-marites" },
    ],
  },
  {
    slug: "2016-2017",
    label: "2016 - 2017",
    entries: [
      { role: "Pastor", name: "de Mesa, Jonathan", image: "de-mesa-jonathan" },
      { role: "Deac", name: "de Mesa, Yolly", image: "de-mesa-yolly" },
    ],
  },
];
