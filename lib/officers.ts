import { BOARD_ROLES, LEADERSHIP_GROUPS, type Entry, type Term } from "@/content/officers";

export type Person = { name: string; roles: string[]; photo?: string };

/** Turns an entry's `image` into a URL. A plain slug → /images/people/<slug>.svg; a path or URL is used as-is. */
export function imageSrc(image?: string): string | undefined {
  if (!image) return undefined;
  return /[/.]/.test(image) ? image : `/images/people/${image}.svg`;
}

/** "Ocampo, Juanito Jr. S." → "Juanito Jr. S. Ocampo" */
export function displayName(name: string) {
  const i = name.indexOf(",");
  return i === -1 ? name.trim() : `${name.slice(i + 1).trim()} ${name.slice(0, i).trim()}`;
}

/** Merge entries so one person holding several roles becomes one card. `featured` roles are listed first. */
export function toPeople(entries: Entry[], featured: string[] = []): Person[] {
  const map = new Map<string, Person>();
  for (const e of entries) {
    const p = map.get(e.name) ?? { name: e.name, roles: [] };
    if (!p.roles.includes(e.role)) p.roles.push(e.role);
    if (e.image) p.photo = imageSrc(e.image);
    map.set(e.name, p);
  }
  return [...map.values()].map((p) => ({
    ...p,
    roles: [...p.roles.filter((r) => featured.includes(r)), ...p.roles.filter((r) => !featured.includes(r))],
  }));
}

/** Row 1: pastor & deac · Row 2: chairman & vice · then everyone else. */
export function boardRows(term: Term) {
  const featured = [...BOARD_ROLES.row1, ...BOARD_ROLES.row2];
  const people = toPeople(term.entries, featured);
  const has = (p: Person, roles: string[]) => roles.some((r) => p.roles.includes(r));
  const rank = (p: Person, roles: string[]) => Math.min(...roles.map((r) => (p.roles.includes(r) ? roles.indexOf(r) : 99)));
  const row1 = people.filter((p) => has(p, BOARD_ROLES.row1)).sort((a, b) => rank(a, BOARD_ROLES.row1) - rank(b, BOARD_ROLES.row1));
  const row2 = people.filter((p) => !row1.includes(p) && has(p, BOARD_ROLES.row2)).sort((a, b) => rank(a, BOARD_ROLES.row2) - rank(b, BOARD_ROLES.row2));
  const rest = people.filter((p) => !row1.includes(p) && !row2.includes(p));
  return { row1, row2, rest };
}

/** Groups for the Church Leadership page. Only the roles listed for each group are shown on the card. */
export function leadershipGroups(term: Term) {
  return LEADERSHIP_GROUPS.map((g) => {
    const entries = term.entries.filter((e) => g.roles.includes(e.role));
    return { title: g.title, people: toPeople(entries, g.roles) };
  }).filter((g) => g.people.length);
}

/** Consecutive terms with the same Pastor and Deac. `slugs` are its terms, newest first. */
export type PastorPeriod = { pastors: string[]; deacs: string[]; from: number; to: number; current: boolean; slugs: string[] };

/** First and last year of a term slug: "2008-2009" → [2008, 2009]. */
const termYears = (slug: string) => slug.split("-").map(Number) as [number, number];

/** About Us "Pastors through the years": terms (newest first) merged into periods with the same Pastor and Deac. */
export function pastorPeriods(terms: Term[]): PastorPeriod[] {
  const names = (t: Term, role: string) => t.entries.filter((e) => e.role === role).map((e) => e.name);
  const periods: PastorPeriod[] = [];
  terms.forEach((t, i) => {
    const pastors = names(t, "Pastor"), deacs = names(t, "Deac");
    if (!pastors.length) return;
    const [from, to] = termYears(t.slug);
    const last = periods.at(-1);
    if (last && last.from === to && last.pastors.join("|") === pastors.join("|") && last.deacs.join("|") === deacs.join("|")) {
      last.from = from;
      last.slugs.push(t.slug);
    } else periods.push({ pastors, deacs, from, to, current: i === 0, slugs: [t.slug] });
  });
  return periods;
}

/** "2024 – present" for the current period, otherwise "2019 – 2024". */
export const periodLabel = (p: PastorPeriod) => `${p.from} – ${p.current ? "present" : p.to}`;
