import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FundraisingPercent from "./FundraisingPercent";
import { fundedPercent } from "@/lib/progress";

const render = (raised: number, goal = 12_000_000) =>
  renderToStaticMarkup(createElement(FundraisingPercent, { pct: fundedPercent(raised, goal), goal, campaign: "Project Nehemiah" }));
const spoken = (html: string) => html.replace(/<p[^>]*aria-hidden="true"[^>]*>.*?<\/p>/, "").replace(/<[^>]+>/g, "");

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
});
