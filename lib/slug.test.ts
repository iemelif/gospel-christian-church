import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("turns a 'Last, First' name into a file-name slug", () => {
    expect(slugify("Ocampo, Juanito Jr. S.")).toBe("ocampo-juanito-jr-s");
    expect(slugify("Dela Cruz, Rio B.")).toBe("dela-cruz-rio-b");
  });
  it("strips accents and stray separators", () => {
    expect(slugify("  Peña, José  ")).toBe("pena-jose");
  });
});
