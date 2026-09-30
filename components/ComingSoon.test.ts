import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ComingSoon from "./ComingSoon";
import { COMING_SOON } from "@/content/coming-soon";

describe("ComingSoon", () => {
  const html = renderToStaticMarkup(createElement(ComingSoon, COMING_SOON.about));
  it("shows the label, the page's title and text", () => {
    expect(html).toContain("Coming soon");
    expect(html).toContain(`${COMING_SOON.about.title}</h2>`);
    expect(html).toContain(COMING_SOON.about.text);
  });
  it("links to Donate internally and to Facebook in a new tab, and shows the address", () => {
    expect(html).toMatch(/href="\/donate"[^>]*>Support Project Nehemiah</);
    expect(html).toMatch(/href="https:\/\/www\.facebook\.com\/gcc1984" target="_blank" rel="noopener noreferrer"/);
    expect(html).toContain("Zone 7, Frances, Calumpit, 3003 Bulacan");
  });
  it("has text for every placeholder page", () => {
    for (const key of ["about", "ministries", "contact"] as const) expect(COMING_SOON[key].title).toBeTruthy();
  });
});
