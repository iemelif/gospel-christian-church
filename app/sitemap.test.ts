import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists /donate and no longer lists /support", () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls).toContain("/donate");
    expect(urls).not.toContain("/support");
  });
});
