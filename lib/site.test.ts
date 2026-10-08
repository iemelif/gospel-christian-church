import { afterEach, describe, expect, it, vi } from "vitest";

// content/site.ts reads NODE_ENV / NEXT_PUBLIC_SITE_ENV when first imported, so each test stubs env and re-imports.
async function load(env: Record<string, string>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  vi.resetModules();
  return { site: await import("@/content/site"), robots: (await import("@/app/robots")).default };
}

afterEach(() => vi.unstubAllEnvs());

describe("deploy environments", () => {
  it("staging uses gcciemelif.website and blocks all crawlers", async () => {
    const { site, robots } = await load({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "staging" });
    expect(site.SITE_URL).toBe("https://www.gcciemelif.website");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("production uses gcciemelif.com and allows crawlers with a sitemap", async () => {
    const { site, robots } = await load({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "production" });
    expect(site.SITE_URL).toBe("https://www.gcciemelif.com");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      sitemap: "https://www.gcciemelif.com/sitemap.xml",
    });
  });

  it("defaults to production when NEXT_PUBLIC_SITE_ENV is unset", async () => {
    const { site } = await load({ NODE_ENV: "production", NEXT_PUBLIC_SITE_ENV: "" });
    expect(site.IS_STAGING).toBe(false);
    expect(site.SITE_URL).toBe("https://www.gcciemelif.com");
  });

  it("development stays on localhost", async () => {
    const { site } = await load({ NODE_ENV: "development", NEXT_PUBLIC_SITE_ENV: "staging" });
    expect(site.IS_STAGING).toBe(false);
    expect(site.SITE_URL).toBe("http://localhost:3000");
  });
});
