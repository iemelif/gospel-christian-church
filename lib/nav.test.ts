import { describe, expect, it } from "vitest";
import { buildNav } from "./nav";
import { HISTORY_TERMS } from "@/content/officers";

describe("buildNav", () => {
  it("has an internal Donate item pointing to /donate, and no Support item", () => {
    const nav = buildNav();
    const donate = nav.find((i) => i.label === "Donate");
    expect(donate?.href).toBe("/donate");
    expect(donate?.external).toBeFalsy();
    expect(nav.some((i) => i.label === "Support")).toBe(false);
  });

  it("fills Leadership History with one link per past term", () => {
    const history = buildNav().find((i) => i.label === "Church Leadership")?.children?.find((c) => c.label === "Leadership History");
    expect(history?.children?.map((c) => c.href)).toEqual(HISTORY_TERMS.map((t) => `/history/${t.slug}`));
  });
});
