import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookieFrom, createSession, passwordOk, sessionValid } from "./auth";

beforeEach(() => vi.stubEnv("ADMIN_PASSWORD", "secret"));
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("passwordOk", () => {
  it("accepts only the configured password", () => {
    expect(passwordOk("secret")).toBe(true);
    expect(passwordOk("wrong")).toBe(false);
  });
  it("rejects everything when ADMIN_PASSWORD is not set", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(passwordOk("")).toBe(false);
  });
});

describe("sessions", () => {
  it("accepts a fresh session and rejects a tampered one", () => {
    const token = createSession();
    expect(sessionValid(token)).toBe(true);
    expect(sessionValid(token.replace(/.$/, (c) => (c === "0" ? "1" : "0")))).toBe(false);
    expect(sessionValid(null)).toBe(false);
  });
  it("expires after one day", () => {
    vi.useFakeTimers();
    const token = createSession();
    vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1);
    expect(sessionValid(token)).toBe(false);
  });
  it("is invalidated when the password changes", () => {
    const token = createSession();
    vi.stubEnv("ADMIN_PASSWORD", "new-secret");
    expect(sessionValid(token)).toBe(false);
  });
});

describe("cookieFrom", () => {
  it("reads one cookie from the Cookie header", () => {
    const req = new Request("http://x", { headers: { cookie: "a=1; gcc_admin=abc%2Edef; b=2" } });
    expect(cookieFrom(req)).toBe("abc.def");
    expect(cookieFrom(new Request("http://x"))).toBeNull();
  });
});
