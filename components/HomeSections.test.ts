import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HeroShotCarousel, { AUTOPLAY_MS, wrapIndex } from "./HeroShotCarousel";
import VideoEmbed, { facebookEmbedSrc } from "./VideoEmbed";
import WelcomeSection from "./WelcomeSection";
import { NEHEMIAH_FEATURE, WELCOME_TEXT } from "@/content/home";
import { carouselSlides } from "@/lib/carousel";
import { ADDRESS, SITE } from "@/content/site";

describe("HeroShotCarousel", () => {
  const slides = carouselSlides();
  const html = renderToStaticMarkup(createElement(HeroShotCarousel, { slides }));
  it("shows every discovered carousel image, in alphabetical filename order, with alt text", () => {
    const srcs = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    expect(srcs.length).toBeGreaterThan(1);
    expect(srcs).toEqual(slides.map((s) => s.src));
    expect([...srcs].sort((a, b) => a.localeCompare(b, "en"))).toEqual(srcs);
    for (const s of slides) { expect(html).toContain(`alt="${s.alt}"`); expect(s.alt).not.toMatch(/\.(png|jpe?g|webp|avif)/i); }
  });
  it("keeps aspect ratios (object-contain in a 16:9 frame) and has no captions", () => {
    expect(html).toContain("aspect-video");
    expect(html).toContain("object-contain");
    expect(html).not.toContain("figcaption");
  });
  it("has labelled previous/next buttons and one dot per slide, first slide current", () => {
    expect(html).toContain('aria-label="Previous slide"');
    expect(html).toContain('aria-label="Next slide"');
    expect(html.match(/aria-label="Show slide \d+ of \d+"/g)).toHaveLength(slides.length);
    expect(html).toMatch(new RegExp(`aria-label="Show slide 1 of ${slides.length}" aria-current="true"`));
    expect(html).toContain('aria-roledescription="carousel"');
  });
  it("wraps around in both directions and autoplays every 5 seconds", () => {
    expect(wrapIndex(2, 1, 3)).toBe(0);
    expect(wrapIndex(0, -1, 3)).toBe(2);
    expect(AUTOPLAY_MS).toBe(5000);
  });
});

describe("VideoEmbed", () => {
  const video = NEHEMIAH_FEATURE.video;
  it("embeds the Facebook video responsively with an accessible title", () => {
    const html = renderToStaticMarkup(createElement(VideoEmbed, video));
    expect(html).toContain(`src="${facebookEmbedSrc(video.url).replace(/&/g, "&amp;")}"`);
    expect(facebookEmbedSrc(video.url)).toBe("https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fgcc1984%2Fvideos%2F1995167554627898%2F&show_text=false");
    expect(html).toContain(`title="${video.title}"`);
    expect(html).toContain("aspect-video");
    expect(html).toContain('loading="lazy"');
  });
  it("asks for muted autoplay and loads eagerly when autoplay is set", () => {
    expect(facebookEmbedSrc(video.url, true)).toBe(`${facebookEmbedSrc(video.url)}&autoplay=true&mute=true`);
    const html = renderToStaticMarkup(createElement(VideoEmbed, { ...video, autoplay: true }));
    expect(html).toContain('loading="eager"');
    expect(html).toContain("allowFullScreen");
  });
});

describe("WelcomeSection", () => {
  it("has the page's h1, one welcome paragraph, the address and no About link", () => {
    const html = renderToStaticMarkup(createElement(WelcomeSection));
    expect(html).toContain(`Welcome to ${SITE.name}</h1>`);
    expect(html).toContain(WELCOME_TEXT);
    expect(html.match(/<p /g)).toHaveLength(1);
    expect(html).toContain(ADDRESS.display);
    expect(html).not.toContain('href="/about"');
  });
});

describe("PersonCard link mode", async () => {
  const { default: PersonCard } = await import("./PersonCard");
  it("wraps the card in a link when href is given, and stays a plain card otherwise", () => {
    const person = { name: "Cruz, Ana", roles: ["Pastor"] };
    expect(renderToStaticMarkup(createElement(PersonCard, { person, href: "/officers" }))).toMatch(/^<li class="flex"><a [^>]*href="\/officers"/);
    expect(renderToStaticMarkup(createElement(PersonCard, { person }))).not.toContain("<a ");
  });
});
