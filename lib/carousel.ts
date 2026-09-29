import { readdirSync } from "node:fs";
import { join } from "node:path";

/** One carousel image: public URL and alt text. */
export type Slide = { src: string; alt: string };

/** Folder (inside `public/`) whose images make up the Home carousel, and its public URL. */
export const CAROUSEL_DIR = join(process.cwd(), "public", "images", "hershot-carousel");
export const CAROUSEL_URL = "/images/hershot-carousel";

/** File types the carousel shows (case-insensitive); everything else in the folder is ignored. */
export const CAROUSEL_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

const isImage = (name: string) => !name.startsWith(".") && CAROUSEL_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

/** Alt text from a file name: "01-new_church-building.png" → "New church building" (order prefix and extension dropped). */
export function altFromFilename(name: string) {
  const words = name.replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Church photo";
}

/** Image file names → slides, sorted alphabetically by file name so the order is deterministic. */
export function toSlides(names: string[]): Slide[] {
  return names.filter(isImage).sort((a, b) => a.localeCompare(b, "en")).map((name) => ({ src: `${CAROUSEL_URL}/${encodeURIComponent(name)}`, alt: altFromFilename(name) }));
}

/**
 * Server-only: every image currently in the carousel folder, so adding or removing a file changes the carousel
 * with no code change. Home is static, so production reads the folder at build time (each deploy rebuilds);
 * `npm run dev` reads it on every request. A missing folder gives an empty carousel instead of a failed build.
 */
export function carouselSlides(dir = CAROUSEL_DIR): Slide[] {
  try {
    return toSlides(readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
