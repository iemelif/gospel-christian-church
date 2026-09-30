import { describe, expect, it } from "vitest";
import { activeMenuKeys, toggleMenu } from "./menu";
import { buildNav } from "./nav";
import { HISTORY_TERMS } from "@/content/officers";

const LEADERSHIP = "Church Leadership";
const HISTORY = "Church Leadership/Leadership History";

describe("activeMenuKeys", () => {
  const nav = buildNav();
  it("finds Church Leadership and Leadership History for every past-term page", () => {
    for (const t of HISTORY_TERMS) expect(activeMenuKeys(nav, `/history/${t.slug}`)).toEqual([LEADERSHIP, HISTORY]);
  });
  it("finds only Church Leadership on /officers, and nothing on pages outside dropdowns", () => {
    expect(activeMenuKeys(nav, "/officers")).toEqual([LEADERSHIP]);
    expect(activeMenuKeys(nav, "/donate")).toEqual([]);
    expect(activeMenuKeys(nav, "/")).toEqual([]);
  });
});

describe("toggleMenu", () => {
  it("opening a dropdown also expands the submenu that holds the current page", () => {
    expect(toggleMenu([], LEADERSHIP, [LEADERSHIP, HISTORY])).toEqual([LEADERSHIP, HISTORY]);
  });
  it("does not expand submenus when the current page is elsewhere", () => {
    expect(toggleMenu([], LEADERSHIP, [])).toEqual([LEADERSHIP]);
    expect(toggleMenu([], LEADERSHIP, [LEADERSHIP])).toEqual([LEADERSHIP]);
  });
  it("closing a dropdown closes its submenus; the submenu can still be collapsed on its own", () => {
    expect(toggleMenu([LEADERSHIP, HISTORY], LEADERSHIP, [LEADERSHIP, HISTORY])).toEqual([]);
    expect(toggleMenu([LEADERSHIP, HISTORY], HISTORY, [LEADERSHIP, HISTORY])).toEqual([LEADERSHIP]);
    expect(toggleMenu([LEADERSHIP], HISTORY, [])).toEqual([LEADERSHIP, HISTORY]);
  });
  it("opening another top-level dropdown closes the first", () => {
    expect(toggleMenu([LEADERSHIP, HISTORY], "Other", [])).toEqual(["Other"]);
  });
});
