import { describe, expect, it } from "vitest";
import { boardRows, displayName, imageSrc, leadershipGroups, pastorPeriods, periodLabel, toPeople } from "./officers";
import type { Term } from "@/content/officers";

const term: Term = {
  slug: "t",
  label: "T",
  entries: [
    { role: "Kalihim", name: "Cruz, Ana" },
    { role: "Vice Chairman", name: "Reyes, Ben", image: "reyes-ben" },
    { role: "Deac", name: "Santos, Carla" },
    { role: "Chairman", name: "Lopez, Dan" },
    { role: "Pastor", name: "Santos, Eli" },
    { role: "Predigador", name: "Lopez, Dan" },
  ],
};

describe("displayName", () => {
  it("reorders 'Last, First' to 'First Last'", () => {
    expect(displayName("Ocampo, Juanito Jr. S.")).toBe("Juanito Jr. S. Ocampo");
    expect(displayName("CareTakers")).toBe("CareTakers");
  });
});

describe("imageSrc", () => {
  it("maps a slug to the generated avatar and keeps paths/URLs as-is", () => {
    expect(imageSrc("reyes-ben")).toBe("/images/people/reyes-ben.svg");
    expect(imageSrc("/images/people/x.jpg")).toBe("/images/people/x.jpg");
    expect(imageSrc(undefined)).toBeUndefined();
  });
});

describe("toPeople", () => {
  it("merges one person's roles into one entry, featured roles first", () => {
    const dan = toPeople(term.entries, ["Chairman"]).find((p) => p.name === "Lopez, Dan");
    expect(dan?.roles).toEqual(["Chairman", "Predigador"]);
  });
});

describe("boardRows", () => {
  it("puts pastor & deac first, chairman & vice second, everyone else after", () => {
    const { row1, row2, rest } = boardRows(term);
    expect(row1.map((p) => p.name)).toEqual(["Santos, Eli", "Santos, Carla"]);
    expect(row2.map((p) => p.name)).toEqual(["Lopez, Dan", "Reyes, Ben"]);
    expect(rest.map((p) => p.name)).toEqual(["Cruz, Ana"]);
    expect(row2[1].photo).toBe("/images/people/reyes-ben.svg");
  });
});

describe("leadershipGroups", () => {
  it("only returns groups that have people, with only that group's roles", () => {
    const groups = leadershipGroups(term);
    expect(groups.map((g) => g.title)).toEqual(["Pastoral Leadership", "Preachers (Predigador)"]);
    expect(groups[1].people[0].roles).toEqual(["Predigador"]);
  });
});

describe("pastorPeriods", () => {
  const t = (slug: string, pastor?: string, deac?: string): Term => ({
    slug, label: slug,
    entries: [...(pastor ? [{ role: "Pastor", name: pastor }] : []), ...(deac ? [{ role: "Deac", name: deac }] : []), { role: "Kalihim", name: "Cruz, Ana" }],
  });

  it("merges consecutive terms with the same pastor and deac, newest first", () => {
    const periods = pastorPeriods([t("2026-2027", "A", "B"), t("2025-2026", "A", "B"), t("2024-2025", "C", "D"), t("2023-2024", "E")]);
    expect(periods).toEqual([
      { pastors: ["A"], deacs: ["B"], from: 2025, to: 2027, current: true, slugs: ["2026-2027", "2025-2026"] },
      { pastors: ["C"], deacs: ["D"], from: 2024, to: 2025, current: false, slugs: ["2024-2025"] },
      { pastors: ["E"], deacs: [], from: 2023, to: 2024, current: false, slugs: ["2023-2024"] },
    ]);
  });

  it("starts a new period when the deac changes or years are not consecutive", () => {
    expect(pastorPeriods([t("2025-2026", "A", "B"), t("2024-2025", "A", "X"), t("2020-2021", "A", "X")]).map((p) => [p.from, p.to])).toEqual([[2025, 2026], [2024, 2025], [2020, 2021]]);
  });

  it("skips terms without a pastor", () => {
    expect(pastorPeriods([t("2025-2026"), t("2024-2025", "A")])).toEqual([{ pastors: ["A"], deacs: [], from: 2024, to: 2025, current: false, slugs: ["2024-2025"] }]);
  });
});

describe("periodLabel", () => {
  it("says 'present' for the current period", () => {
    const p = { pastors: [], deacs: [], slugs: [], from: 2024, to: 2027 };
    expect(periodLabel({ ...p, current: true })).toBe("2024 – present");
    expect(periodLabel({ ...p, current: false })).toBe("2024 – 2027");
  });
});
