import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import JoinUs from "./JoinUs";
import { SCHEDULE } from "@/lib/config";
import { card, cardTitle, cards, h2, sub, wrap } from "@/lib/ui";

const render = (props: { intro?: string } = {}) => renderToStaticMarkup(createElement(JoinUs, props));

describe("JoinUs", () => {
  it("renders section#visit with the heading and one card per service from SCHEDULE", () => {
    const html = render();
    expect(html).toMatch(/^<section id="visit" class="py-14">/);
    expect(html).toContain(`<h2 class="${h2}">Join us</h2>`);
    for (const s of SCHEDULE) expect(html).toContain(`<div class="${card}"><h3 class="${cardTitle}">${s.title}</h3><p class="m-0">${s.day}<br/><b>${s.time}</b></p></div>`);
    expect(html.split(`class="${card}"`).length - 1).toBe(SCHEDULE.length);
    expect(html).toContain(`<div class="${wrap}">`);
    expect(html).toContain(`<div class="${cards}">`);
  });
  it("uses a general intro by default and accepts a page-specific one", () => {
    expect(render()).toContain(`<p class="${sub}">Come worship with us this week.</p>`);
    expect(render({ intro: "Come worship with us this week, and see the place your gift is building." }))
      .toContain(`<p class="${sub}">Come worship with us this week, and see the place your gift is building.</p>`);
  });
  it("has no links or buttons", () => {
    expect(render()).not.toMatch(/<a |<button/);
  });
});
