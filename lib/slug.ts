/** "Ocampo, Juanito Jr. S." → "ocampo-juanito-jr-s" (used for picture file names). */
export function slugify(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
