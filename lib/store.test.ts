import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Gift } from "./store";

// store.ts reads DATA_DIR on import, so every test gets a fresh temp dir and a fresh module.
let dir: string;
beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "gcc-store-"));
  vi.stubEnv("DATA_DIR", dir);
  vi.stubEnv("NEXT_PUBLIC_BASE_RAISED", "1000");
  vi.resetModules();
});
afterEach(() => { vi.unstubAllEnvs(); rmSync(dir, { recursive: true, force: true }); });

const gift = (over: Partial<Gift>): Gift => ({
  id: over.id ?? Math.random().toString(36), ref: "GCC-TEST", name: "Ana", email: "a@b.co", amount: 100,
  freq: "One-time", method: "GCash", message: "", anon: false, status: "pending", createdAt: new Date(0).toISOString(), ...over,
});

describe("store", () => {
  it("treats a missing file as no gifts", async () => {
    const { readGifts } = await import("./store");
    expect(await readGifts()).toEqual([]);
  });

  it("throws on corrupt data instead of returning [] (so a write can't wipe saved pledges)", async () => {
    writeFileSync(path.join(dir, "gifts.json"), "{not json");
    const { readGifts } = await import("./store");
    await expect(readGifts()).rejects.toThrow();
  });

  it("serialises concurrent updates so none are lost", async () => {
    const { readGifts, update } = await import("./store");
    await Promise.all(Array.from({ length: 10 }, (_, i) => update((all) => [...all, gift({ id: String(i) })])));
    expect(await readGifts()).toHaveLength(10);
  });

  it("summary counts only confirmed gifts on top of the base amount and hides anonymous names", async () => {
    const { update, summary } = await import("./store");
    await update(() => [
      gift({ id: "1", amount: 500, status: "confirmed" }),
      gift({ id: "2", amount: 300, status: "confirmed", anon: true, name: "Secret" }),
      gift({ id: "3", amount: 9999 }),
    ]);
    const s = await summary();
    expect(s.raised).toBe(1000 + 500 + 300);
    expect(s.donors).toBe(2);
    expect(s.pledged).toBe(1);
    expect(s.wall.map((w) => w.name)).toEqual(["Anonymous", "Ana"]);
  });

  it("summary adds centavos exactly (no floating-point drift)", async () => {
    const { update, summary } = await import("./store");
    await update(() => [gift({ id: "1", amount: 0.1 + 1, status: "confirmed" }), gift({ id: "2", amount: 0.2 + 1, status: "confirmed" })]);
    const s = await summary();
    expect(s.raised).toBe(1000 + 2.3);
    expect(s.wall.map((w) => w.amount)).toEqual([1.2, 1.1]);
  });
});
