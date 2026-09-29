import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FundraisingPercent from "./FundraisingPercent";
import { fundedPercent } from "@/lib/progress";

const render = (raised: number, goal = 12_000_000) =>
  renderToStaticMarkup(createElement(FundraisingPercent, { pct: fundedPercent(raised, goal), goal, campaign: "Project Nehemiah" }));
// What a screen reader announces: drop everything aria-hidden (the large number and the illustration), then tags.
const spoken = (html: string) =>
  html.replace(/<p[^>]*aria-hidden="true"[^>]*>.*?<\/p>/, "").replace(/<svg[^>]*aria-hidden="true"[\s\S]*?<\/svg>/, "").replace(/<[^>]+>/g, "");

describe("FundraisingPercent", () => {
  it("shows the percentage raised and a full sentence for screen readers", () => {
    const html = render(2_700_000);
    expect(html).toContain("22.5%");
    expect(spoken(html)).toBe("22.5% of the ₱12,000,000 Project Nehemiah goal raised");
  });
  it("shows 0% when nothing has been raised", () => {
    expect(spoken(render(0))).toBe("0% of the ₱12,000,000 Project Nehemiah goal raised");
  });
  it("caps the percentage at 100%", () => {
    const html = render(20_000_000);
    expect(spoken(html)).toBe("100% of the ₱12,000,000 Project Nehemiah goal raised");
    expect(html).not.toContain("166");
  });

  describe("church illustration", () => {
    it("renders the ChurchProgress drawing as the left-side element, before the percentage and text", () => {
      const html = render(2_700_000);
      expect(html).toContain('viewBox="0 0 200 210"'); // the existing ChurchProgress SVG
      expect(html).toContain('d="M75 200V85L100 55L125 85V200Z"');
      expect(html.indexOf("<svg")).toBeLessThan(html.indexOf("22.5%"));
      expect(html.indexOf("<svg")).toBeLessThan(html.indexOf("goal raised"));
    });
    it("is decorative: hidden from screen readers, no role or label, its own clip-path id", () => {
      const svg = render(2_700_000).match(/<svg[^>]*>/)?.[0] ?? "";
      expect(svg).toContain('aria-hidden="true"');
      expect(svg).not.toContain('role="img"');
      expect(svg).not.toContain("aria-label");
      expect(render(2_700_000)).toContain('id="cp-decorative"');
    });
    it("is large (76px, or 54px in the one-row layout) and hidden only in very narrow cards", () => {
      const html = render(2_700_000);
      const span = html.match(/<span class="([^"]*)"><svg/)?.[1] ?? "";
      for (const c of ["hidden", "w-[76px]", "@min-[268px]:flex", "@min-[362px]:w-[54px]"]) expect(span.split(" ")).toContain(c);
      // percentage + sentence: stacked next to the church from 268px, one row again from 362px
      for (const c of ["@min-[268px]:flex-col", "@min-[362px]:flex-row"]) expect(html).toContain(c);
    });
    it("adds nothing for screen readers", () => {
      expect(spoken(render(2_700_000))).toBe("22.5% of the ₱12,000,000 Project Nehemiah goal raised");
    });
  });
});
