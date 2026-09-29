import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The store reads DATA_DIR on import, so each test gets a temp dir and fresh modules. ./data is never touched.
// Google reCAPTCHA is never called: the global fetch is replaced with a mock of the siteverify response.
const SECRET = "test-secret-do-not-use";
const TOKEN = "browser-token-abc123";
let dir: string;
let googleReply: { status: number; body: unknown } | "network-error";
const fetchMock = vi.fn(async () => {
  if (googleReply === "network-error") throw new TypeError("fetch failed");
  return new Response(JSON.stringify(googleReply.body), { status: googleReply.status, headers: { "Content-Type": "application/json" } });
});

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "gcc-gifts-api-"));
  vi.stubEnv("DATA_DIR", dir);
  vi.stubEnv("RECAPTCHA_SECRET_KEY", SECRET);
  googleReply = { status: 200, body: { success: true, action: "record_gift", score: 0.9 } };
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
  vi.resetModules();
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); rmSync(dir, { recursive: true, force: true }); });

const post = async (body: Record<string, unknown>) => {
  const { POST } = await import("./route");
  const res = await POST(new Request("http://x/api/gifts", { method: "POST", body: JSON.stringify(body) }));
  const text = await res.text();
  return { status: res.status, data: JSON.parse(text), text };
};
const file = () => path.join(dir, "gifts.json");
const saved = () => JSON.parse(readFileSync(file(), "utf8"));
const valid = { name: "Juan Dela Cruz", amount: 1000, method: "GCash", freq: "One-time", recaptchaToken: TOKEN };

describe("POST /api/gifts — email is optional", () => {
  it("records a gift when no email is given", async () => {
    const { status, data } = await post(valid);
    expect(status).toBe(200);
    expect(data.ref).toMatch(/^GCC-[0-9A-F]{6}$/);
    expect(saved()[0]).toMatchObject({ name: "Juan Dela Cruz", email: "", status: "pending" });
  });

  it("records a gift with a valid email (trimmed)", async () => {
    const { status } = await post({ ...valid, email: "  juan@example.com  " });
    expect(status).toBe(200);
    expect(saved()[0].email).toBe("juan@example.com");
  });

  it("treats a whitespace-only email as no email", async () => {
    expect((await post({ ...valid, email: "   " })).status).toBe(200);
    expect(saved()[0].email).toBe("");
  });

  it("rejects an invalid email and saves nothing", async () => {
    const { status, data } = await post({ ...valid, email: "not-an-email" });
    expect(status).toBe(400);
    expect(data.error).toBe("Enter a valid email address.");
    expect(existsSync(file())).toBe(false);
  });

  it("does not return the email in the response", async () => {
    const { data } = await post({ ...valid, email: "juan@example.com" });
    expect(Object.keys(data).sort()).toEqual(["amount", "freq", "method", "ref"]);
  });
});

describe("POST /api/gifts — other validation unchanged", () => {
  it("still requires a name, and invalid gifts never reach Google", async () => {
    expect((await post({ ...valid, name: "  " })).data.error).toBe("Enter your full name.");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(existsSync(file())).toBe(false);
  });
  it("still limits the amount", async () => {
    expect((await post({ ...valid, amount: 0 })).status).toBe(400);
    expect((await post({ ...valid, amount: 12_000_001 })).status).toBe(400);
    expect(existsSync(file())).toBe(false);
  });
  it("accepts every existing payment-method id and rejects others (including display labels)", async () => {
    for (const method of ["GCash", "Maya", "Bank transfer", "Cash at church"]) {
      expect((await post({ ...valid, method })).status, method).toBe(200);
    }
    for (const method of ["Bank Transfer", "Cash at Church", "PayPal"]) {
      expect((await post({ ...valid, method })).status, method).toBe(400);
    }
  });
});

describe("POST /api/gifts — reCAPTCHA v3", () => {
  const rejected = async (body: Record<string, unknown>, status: number) => {
    const res = await post(body);
    expect(res.status).toBe(status);
    expect(existsSync(file())).toBe(false); // nothing saved
    expect(res.text).not.toContain(SECRET);
    return res;
  };

  it("rejects a gift without a token", async () => {
    const { recaptchaToken: _omit, ...noToken } = valid;
    void _omit;
    const res = await rejected(noToken, 400);
    expect(res.data.error).toMatch(/couldn't verify/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects when the request to Google fails", async () => {
    googleReply = "network-error";
    await rejected(valid, 503);
    googleReply = { status: 500, body: {} };
    await rejected(valid, 503);
  });

  it("rejects success: false", async () => {
    googleReply = { status: 200, body: { success: false, "error-codes": ["invalid-input-response"] } };
    await rejected(valid, 403);
  });

  it("rejects the wrong action", async () => {
    googleReply = { status: 200, body: { success: true, action: "login", score: 0.9 } };
    await rejected(valid, 403);
  });

  it("rejects a score below the threshold", async () => {
    googleReply = { status: 200, body: { success: true, action: "record_gift", score: 0.2 } };
    await rejected(valid, 403);
  });

  it("rejects when RECAPTCHA_SECRET_KEY is missing, without calling Google", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    await rejected(valid, 503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("saves the gift only after a successful verification, sending the token to Google", async () => {
    const { status } = await post(valid);
    expect(status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const form = new URLSearchParams(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(form.get("response")).toBe(TOKEN);
    expect(saved()).toHaveLength(1);
  });

  it("does not store the token, and never returns the secret", async () => {
    const res = await post(valid);
    const stored = readFileSync(file(), "utf8");
    expect(stored).not.toContain(TOKEN);
    expect(stored).not.toContain("recaptcha");
    expect(res.text).not.toContain(SECRET);
    expect(res.text).not.toContain(TOKEN);
  });
});

describe("public data never exposes email", () => {
  it("GET /api/gifts (public summary / Giving Wall) contains no email", async () => {
    const gift = (id: string, email: string, anon = false) => ({
      id, ref: `GCC-${id}`, name: `Donor ${id}`, email, amount: 500, freq: "One-time", method: "GCash",
      message: "God bless", anon, status: "confirmed", createdAt: new Date(0).toISOString(),
    });
    writeFileSync(file(), JSON.stringify([gift("A", "a@example.com"), gift("B", "b@example.com", true), gift("C", "")]));
    const { GET } = await import("./route");
    const text = await (await GET()).text();
    const body = JSON.parse(text);
    expect(text).not.toContain("@example.com");
    expect(text).not.toContain("email");
    expect(text).not.toContain(SECRET);
    for (const entry of body.wall) expect(Object.keys(entry).sort()).toEqual(["amount", "id", "message", "name"]);
    expect(body.wall.map((w: { name: string }) => w.name)).toContain("Anonymous");
  });
});
