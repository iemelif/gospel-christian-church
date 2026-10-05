import { describe, expect, it } from "vitest";
import { SHARE_IMAGES } from "@/content/site";
import { pageMeta } from "./seo";

describe("pageMeta", () => {
  it("gives indexable pages the Home share image by default", () => {
    const m = pageMeta("Church Officers", "d", "/officers");
    expect(m.openGraph?.images).toEqual([SHARE_IMAGES.home]);
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
