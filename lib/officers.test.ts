import { describe, expect, it } from "vitest";
import { boardRows, displayName, imageSrc, leadershipGroups, toPeople } from "./officers";
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
