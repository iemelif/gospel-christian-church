import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage, { metadata } from "./page";
import { facebookEmbedSrc } from "@/components/VideoEmbed";
import { NEHEMIAH_FEATURE } from "@/content/home";
import { DONATE_DESCRIPTION, DONATE_TITLE } from "@/lib/seo";

describe("Home page", () => {
  const html = renderToStaticMarkup(createElement(HomePage));
  it("renders carousel → welcome → Project Nehemiah → Pastor, Deacon, Chairman and Vice Chairman → Join Us, in main#main only", () => {
    const order = ['aria-roledescription="carousel"', "Welcome to", ">Project Nehemiah</h2>", ">Our Pastor, Deacon, Chairman and Vice Chairman</h2>", 'id="visit"'].map((m) => html.indexOf(m));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html.split('<main id="main">').length - 1).toBe(1);
    expect(html).not.toMatch(/<header|<footer/);
  });
  it("plays the Project Nehemiah video inline (muted autoplay, no play button or Facebook link) and keeps the /donate CTA", () => {
    const feature = html.slice(html.indexOf(">Project Nehemiah</h2>") - 3000, html.indexOf(">Our Pastor, Deacon, Chairman and Vice Chairman</h2>"));
    expect(feature).toMatch(/<a [^>]*href="\/donate"[^>]*><span [^>]*>Support Project Nehemiah →<\/span><\/a>/);
    const iframe = feature.match(/<iframe [^>]*>/)?.[0] ?? "";
    expect(iframe).toContain(`src="${facebookEmbedSrc(NEHEMIAH_FEATURE.video.url, true).replace(/&/g, "&amp;")}"`);
    expect(iframe).toContain("autoplay=true");
    expect(iframe).toContain('allow="autoplay;');
    expect(html.match(/<iframe /g)).toHaveLength(1);
    expect(html).not.toMatch(/target="_blank"|aria-label="Play|Watch the Project Nehemiah video on Facebook|href="https:\/\/www\.facebook\.com\/gcc1984\/videos/);
    expect(feature).not.toMatch(/<a [^>]*href="\/donate"[^>]*>(?:(?!<\/a>)[\s\S])*<a /); // no link nested in the /donate link
  });
  it("shows exactly Pastor, Deacon, Chairman and Vice Chairman as cards linking to /officers", () => {
    const leaders = html.slice(html.indexOf("Our Pastor, Deacon, Chairman and Vice Chairman"), html.indexOf('id="visit"'));
    const cards = leaders.match(/<li class="flex"><a [^>]*href="\/officers"/g) ?? [];
    expect(cards).toHaveLength(4);
    const roles = [...leaders.matchAll(/<p class="mt-1\.5 mb-0 text-\[14px\] font-semibold text-crimson">([^<]+)<\/p>/g)].map((m) => m[1]);
    expect(roles).toEqual(["Pastor", "Deacon", "Chairman", "Vice Chairman"]);
    expect(html).not.toContain(">Ministries</h2>");
  });
  it("has Home metadata with the Nehemiah image as share preview, not the Donate metadata", () => {
    expect(metadata.title).toBe("Gospel Christian Church IEMELIF – Calumpit, Bulacan");
    expect(metadata.description).toMatch(/GCC IEMELIF.*Calumpit, Bulacan/);
    expect(metadata.title).not.toBe(DONATE_TITLE);
    expect(metadata.description).not.toBe(DONATE_DESCRIPTION);
    expect(metadata.alternates?.canonical).toBe("/");
    expect(JSON.stringify(metadata.openGraph)).toContain("/images/hershot-carousel/01-gcc-nehemniah.png");
    expect(JSON.stringify(metadata.twitter)).toContain("summary_large_image");
  });
});
