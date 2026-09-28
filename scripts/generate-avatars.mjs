// Creates a placeholder SVG avatar for everyone listed in content/officers.ts.
//   npm run avatars
// - File name = the entry's `image` slug → public/images/people/<slug>.svg
// - Existing files (including real photos you have added) are never overwritten.
// - Entries without an `image` are reported with a suggested slug.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { CURRENT_TERM, HISTORY_TERMS } from "../content/officers.ts";
import { slugify } from "../lib/slug.ts";

const DIR = new URL("../public/images/people/", import.meta.url);
mkdirSync(DIR, { recursive: true });
const existing = new Set(readdirSync(DIR).map((f) => f.replace(/\.[^.]+$/, "")));

// Soft brand-tinted palettes (background, silhouette), picked by name so each person keeps the same one.
const PALETTES = [
  ["#f3ead6", "#c9b27a"], // gold
  ["#e4ecf4", "#93aec8"], // blue
  ["#f4e4e7", "#c99aa4"], // crimson
];
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pretty = (n) => (n.includes(",") ? `${n.split(",").slice(1).join(",").trim()} ${n.split(",")[0].trim()}` : n);

const svg = (name, slug) => {
  const [bg, fg] = PALETTES[hash(slug) % PALETTES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-labelledby="t">
  <title id="t">${esc(pretty(name))} (no photo yet)</title>
  <rect width="200" height="200" fill="${bg}"/>
  <circle cx="100" cy="78" r="36" fill="${fg}"/>
  <path d="M28 200c0-46 32-78 72-78s72 32 72 78z" fill="${fg}"/>
</svg>
`;
};

let created = 0, kept = 0;
const seen = new Set();
for (const term of [CURRENT_TERM, ...HISTORY_TERMS]) {
  for (const e of term.entries) {
    if (!e.image) { console.warn(`! ${term.label} · ${e.name}: no image – add  image: "${slugify(e.name)}"`); continue; }
    if (/[/.]/.test(e.image) || seen.has(e.image)) continue; // custom path/URL, or already handled
    seen.add(e.image);
    if (existing.has(e.image)) { kept++; continue; }
    writeFileSync(new URL(`${e.image}.svg`, DIR), svg(e.name, e.image));
    created++;
  }
}
console.log(`Avatars: ${created} created, ${kept} already existed → public/images/people/`);
