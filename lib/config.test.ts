import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

/** Width/height from a JPEG's SOF header (no image library needed). */
function jpegSize(buf: Buffer) {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    i += 2 + len;
  }
  throw new Error("not a JPEG");
}

// config.ts reads NEXT_PUBLIC_* when it is first imported, so each test stubs env and re-imports it.
async function load(env: Record<string, string>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  vi.resetModules();
  return import("./config");
}
afterEach(() => vi.unstubAllEnvs());

describe("php", () => {
  it("formats pesos with thousands separators", async () => {
    const { php } = await load({});
    expect(php(12_000_000)).toBe("₱12,000,000");
  });
});

describe("CHURCH", () => {
  it("names the campaign Project Nehemiah with the ₱12,000,000 default goal", async () => {
    const { CHURCH } = await load({ NEXT_PUBLIC_GOAL: "" });
    expect(CHURCH.campaign).toBe("Project Nehemiah");
    expect(CHURCH.goal).toBe(12_000_000);
  });
});

describe("PAYMENT_METHODS", () => {
  it("always lists all four methods", async () => {
    const { PAYMENT_IDS } = await load({});
    expect(PAYMENT_IDS).toEqual(["GCash", "Maya", "Bank transfer", "Cash at church"]);
  });

  it("adds QR codes to GCash and Maya only (when configured), pointing to real files with their true size", async () => {
    const { PAYMENT_METHODS } = await load({
      NEXT_PUBLIC_GCASH_NUMBER: "GCash Number: +639000000000 · Account name: A",
      NEXT_PUBLIC_MAYA_NUMBER: "Maya Number: +639000000001 · Account name: A",
      NEXT_PUBLIC_BANK_DETAILS: "Bank: B · Account name: A · Account no.: 1",
    });
    const qr = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.qr]));
    expect(qr["GCash"]?.src).toBe("/images/payments/qrcode-gcash.jpg");
    expect(qr["Maya"]?.src).toBe("/images/payments/qrcode-maya.jpg");
    expect(qr["Bank transfer"]).toBeUndefined();
    expect(qr["Cash at church"]).toBeUndefined();
    for (const q of [qr["GCash"]!, qr["Maya"]!]) {
      expect(q.alt).toMatch(/QR code for sending your gift$/);
      expect(jpegSize(readFileSync(path.join(process.cwd(), "public", q.src)))).toEqual({ width: q.width, height: q.height });
    }
  });

  it("keeps the stored ids unchanged and shows the donor-facing labels", async () => {
    const { PAYMENT_METHODS } = await load({});
    expect(PAYMENT_METHODS.map((m) => [m.id, m.label])).toEqual([
      ["GCash", "GCash"], ["Maya", "Maya"], ["Bank transfer", "Bank Transfer"], ["Cash at church", "Cash at Church"],
    ]);
  });

  it("parses 'Label: value · Label: value' and picks the number to copy", async () => {
    const { PAYMENT_METHODS } = await load({
      NEXT_PUBLIC_GCASH_NUMBER: "GCash Number: +639000000000 · Account name: Juan",
      NEXT_PUBLIC_BANK_DETAILS: "Bank: Test Bank · Account name: Ana · Account no.: 123456",
    });
    const gcash = PAYMENT_METHODS.find((m) => m.id === "GCash")!;
    expect(gcash.rows).toEqual([["GCash Number", "+639000000000"], ["Account name", "Juan"]]);
    expect(gcash.copy).toBe("+639000000000");
    expect(PAYMENT_METHODS.find((m) => m.id === "Bank transfer")!.copy).toBe("123456");
  });

  it("accepts a plain wallet number and defaults the account name to the church", async () => {
    const { PAYMENT_METHODS } = await load({ NEXT_PUBLIC_MAYA_NUMBER: "+639111111111" });
    expect(PAYMENT_METHODS.find((m) => m.id === "Maya")!.rows).toEqual([
      ["Maya number", "+639111111111"],
      ["Account name", "Gospel Christian Church"],
    ]);
  });

  it("tells donors to email the church when a value is empty or still an XXXX placeholder", async () => {
    const { PAYMENT_METHODS } = await load({
      NEXT_PUBLIC_CHURCH_EMAIL: "church@example.com",
      NEXT_PUBLIC_GCASH_NUMBER: "0917XXXXXXX",
      NEXT_PUBLIC_BANK_DETAILS: "",
    });
    const gcash = PAYMENT_METHODS.find((m) => m.id === "GCash")!;
    expect(gcash.rows[0][1]).toContain("church@example.com");
    expect(gcash.copy).toBeUndefined();
    expect(PAYMENT_METHODS.find((m) => m.id === "Bank transfer")!.copy).toBeUndefined();
  });
});
