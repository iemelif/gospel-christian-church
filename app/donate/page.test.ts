import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { facebookEmbedSrc } from "@/components/VideoEmbed";
import { NEHEMIAH_VIDEO } from "@/lib/config";

// GiveForm (a client component) calls useRouter(), which needs the App Router outside of Next.
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh() {}, push() {} }) }));

// The page reads gifts through lib/store.ts, which reads DATA_DIR on import: use an empty temp dir.
const dir = mkdtempSync(path.join(tmpdir(), "gcc-donate-"));
vi.stubEnv("DATA_DIR", dir);
afterAll(() => { vi.unstubAllEnvs(); rmSync(dir, { recursive: true, force: true }); });

describe("Donate page hero", async () => {
  const { default: DonatePage } = await import("./page");
  const html = renderToStaticMarkup(await DonatePage());
  const hero = html.slice(0, html.indexOf('id="progress"'));
  it("keeps the two hero columns and adds the video row below them, before #progress", () => {
    const at = (m: string) => hero.indexOf(m.replace(/'/g, "&#x27;")); // React escapes apostrophes
    expect(at("Help us build a home for every neighbor.</h1>")).toBeGreaterThanOrEqual(0);
    expect(at("2 Corinthians 9:7")).toBeLessThan(at('aria-label="Church illustration'));
    expect(at(`>${NEHEMIAH_VIDEO.heading}</h2>`)).toBeGreaterThan(at('aria-label="Church illustration'));
    expect(at(NEHEMIAH_VIDEO.caption)).toBeGreaterThan(at(`>${NEHEMIAH_VIDEO.heading}</h2>`));
    expect(at("<iframe")).toBeGreaterThan(at(NEHEMIAH_VIDEO.caption));
    expect(hero).toContain("max-w-[960px]");
    expect(hero).toContain(`src="${facebookEmbedSrc(NEHEMIAH_VIDEO.url, true).replace(/&/g, "&amp;")}"`);
    expect(hero).toContain(`title="${NEHEMIAH_VIDEO.title}"`);
    expect(hero).toContain("aspect-video");
    expect(html.match(/<iframe /g)).toHaveLength(1);
  });
  it("keeps the hero CTAs and opens nothing in a new tab", () => {
    expect(hero).toMatch(/href="#give"[^>]*>Give to Project Nehemiah</);
    expect(hero).toMatch(/href="#how"[^>]*>How giving works</);
    expect(hero).not.toContain('target="_blank"');
  });
});
