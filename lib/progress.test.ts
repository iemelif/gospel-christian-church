import { describe, expect, it } from "vitest";
import { formatPercent, fundedPercent } from "./progress";

describe("fundedPercent", () => {
  it("returns the share of the goal raised", () => {
    expect(fundedPercent(2_700_000, 12_000_000)).toBe(22.5);
    expect(formatPercent(fundedPercent(2_700_000, 12_000_000))).toBe("22.5");
  });
  it("is 0 when nothing has been raised", () => {
    expect(fundedPercent(0, 12_000_000)).toBe(0);
    expect(formatPercent(0)).toBe("0");
  });
  it("is capped at 100 when the goal is exceeded", () => {
    expect(fundedPercent(15_000_000, 12_000_000)).toBe(100);
    expect(formatPercent(fundedPercent(15_000_000, 12_000_000))).toBe("100");
  });
  it("never divides by zero or goes negative", () => {
    expect(fundedPercent(1000, 0)).toBe(0);
    expect(fundedPercent(-5, 100)).toBe(0);
  });
});
