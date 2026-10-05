import { describe, expect, it } from "vitest";
import { SHARE_IMAGES } from "@/content/site";
import { pageMeta, webPageJsonLd } from "./seo";

describe("pageMeta", () => {
  it("gives indexable pages the church family photo by default", () => {
    const m = pageMeta("Church Officers", "d", "/officers");
    expect(m.openGraph?.images).toEqual([SHARE_IMAGES.family]);
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("uses the page's own image when given", () => {
    expect(pageMeta("Donate", "d", "/donate", { image: SHARE_IMAGES.donate }).openGraph?.images).toEqual([SHARE_IMAGES.donate]);
  });

  it("adds no image to noindex pages", () => {
    const m = pageMeta("About Us", "d", "/about", { index: false });
    expect(m.openGraph?.images).toBeUndefined();
    expect(m.twitter).toBeUndefined();
  });
});

describe("webPageJsonLd", () => {
  it("points primaryImageOfPage at an absolute image URL", () => {
    const ld = webPageJsonLd("Church Officers", "/officers");
    expect(ld.url).toMatch(/\/officers$/);
    expect(ld.primaryImageOfPage.url).toMatch(/^https?:\/\/.+\/church-family\.jpg$/);
  });
});
