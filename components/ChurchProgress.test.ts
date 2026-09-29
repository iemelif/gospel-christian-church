import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ChurchProgress from "./ChurchProgress";

const render = (props: { pct: number; decorative?: boolean }) => renderToStaticMarkup(createElement(ChurchProgress, props));

describe("ChurchProgress", () => {
  it("is a labelled image by default (unchanged hero behaviour)", () => {
    const html = render({ pct: 22.5 });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Church illustration, 22.5% funded"');
    expect(html).toContain('id="cp"');
    expect(html).toContain('clip-path="url(#cp)"');
    expect(html).not.toContain("aria-hidden");
  });

  it("is hidden from assistive technology when decorative, with its own clip-path id", () => {
    const html = render({ pct: 22.5, decorative: true });
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("aria-label");
    expect(html).toContain('id="cp-decorative"');
    expect(html).toContain('clip-path="url(#cp-decorative)"');
  });
});
