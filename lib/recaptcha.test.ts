import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_RECAPTCHA_MIN_SCORE, RECAPTCHA_ACTION, RECAPTCHA_ADMIN_ACTION, recaptchaError, recaptchaMinScore, recaptchaUnavailable, verifyRecaptcha } from "./recaptcha";

// Google is never called: every test passes a mocked fetch.
const SECRET = "test-secret-do-not-use";
const google = (body: unknown, init: { status?: number } = {}) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status: init.status ?? 200, headers: { "Content-Type": "application/json" } }));
const human = { success: true, action: "record_gift", score: 0.9 };

beforeEach(() => vi.stubEnv("RECAPTCHA_SECRET_KEY", SECRET));
afterEach(() => vi.unstubAllEnvs());

describe("verifyRecaptcha", () => {
  it("uses the record_gift action", () => expect(RECAPTCHA_ACTION).toBe("record_gift"));

  it("accepts a successful verification with the right action and a good score", async () => {
    const fetchMock = google(human);
    expect(await verifyRecaptcha("token-123", fetchMock)).toEqual({ ok: true, score: 0.9 });
    // posts the secret and token as a form to Google's siteverify endpoint
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://www.google.com/recaptcha/api/siteverify");
    const form = new URLSearchParams(String(init.body));
    expect(form.get("secret")).toBe(SECRET);
    expect(form.get("response")).toBe("token-123");
  });

  it("rejects a missing, empty or non-string token without calling Google", async () => {
    const fetchMock = google(human);
    for (const t of [undefined, "", "   ", 42, null]) expect(await verifyRecaptcha(t, fetchMock)).toEqual({ ok: false, reason: "missing-token" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when RECAPTCHA_SECRET_KEY is missing, without calling Google", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    const fetchMock = google(human);
    expect(await verifyRecaptcha("token", fetchMock)).toEqual({ ok: false, reason: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails when the request to Google fails (network error or HTTP error)", async () => {
    const offline = vi.fn(async () => { throw new TypeError("fetch failed"); });
    expect(await verifyRecaptcha("token", offline)).toEqual({ ok: false, reason: "request-failed" });
    expect(await verifyRecaptcha("token", google({}, { status: 500 }))).toEqual({ ok: false, reason: "request-failed" });
  });

  it("rejects success: false", async () => {
    expect(await verifyRecaptcha("token", google({ success: false, "error-codes": ["invalid-input-response"] }))).toEqual({ ok: false, reason: "not-success" });
  });

  it("rejects a different action", async () => {
    expect(await verifyRecaptcha("token", google({ ...human, action: "login" }))).toEqual({ ok: false, reason: "wrong-action" });
    expect(await verifyRecaptcha("token", google({ success: true, score: 0.9 }))).toEqual({ ok: false, reason: "wrong-action" });
  });

  it("rejects a score below the threshold (or no score)", async () => {
    expect(await verifyRecaptcha("token", google({ ...human, score: 0.3 }))).toEqual({ ok: false, reason: "low-score" });
    expect(await verifyRecaptcha("token", google({ success: true, action: "record_gift" }))).toEqual({ ok: false, reason: "low-score" });
    // exactly at the threshold passes
    expect((await verifyRecaptcha("token", google({ ...human, score: DEFAULT_RECAPTCHA_MIN_SCORE }))).ok).toBe(true);
  });

  it("never includes the secret in its result", async () => {
    for (const body of [human, { success: false }, { ...human, score: 0.1 }]) {
      expect(JSON.stringify(await verifyRecaptcha("token", google(body)))).not.toContain(SECRET);
    }
  });
});

describe("recaptchaMinScore", () => {
  it("defaults to 0.5", () => expect(recaptchaMinScore()).toBe(0.5));
  it("reads RECAPTCHA_MIN_SCORE when it is a number from 0 to 1", () => {
    vi.stubEnv("RECAPTCHA_MIN_SCORE", "0.7");
    expect(recaptchaMinScore()).toBe(0.7);
  });
  it("ignores invalid values", () => {
    for (const v of ["abc", "2", "-1", ""]) { vi.stubEnv("RECAPTCHA_MIN_SCORE", v); expect(recaptchaMinScore()).toBe(0.5); }
  });
});

describe("verifyRecaptcha — action per protected form", () => {
  it("defaults to record_gift and accepts admin_sign_in only when that action is requested", async () => {
    const admin = { success: true, action: RECAPTCHA_ADMIN_ACTION, score: 0.9 };
    expect(RECAPTCHA_ADMIN_ACTION).toBe("admin_sign_in");
    expect(await verifyRecaptcha("t", google(admin), RECAPTCHA_ADMIN_ACTION)).toEqual({ ok: true, score: 0.9 });
    expect(await verifyRecaptcha("t", google(admin))).toEqual({ ok: false, reason: "wrong-action" });
    expect(await verifyRecaptcha("t", google(human), RECAPTCHA_ADMIN_ACTION)).toEqual({ ok: false, reason: "wrong-action" });
  });
});

describe("recaptchaError", () => {
  it("maps failures to 503 (unavailable), 400 (no token) or 403, without revealing the reason", () => {
    expect(recaptchaError("not-configured").status).toBe(503);
    expect(recaptchaError("request-failed").status).toBe(503);
    expect(recaptchaError("missing-token").status).toBe(400);
    for (const r of ["not-success", "wrong-action", "low-score"] as const) expect(recaptchaError(r)).toEqual({ status: 403, error: "We couldn't verify your request. Please reload the page and try again." });
    expect(recaptchaUnavailable("not-configured") && recaptchaUnavailable("request-failed") && !recaptchaUnavailable("low-score")).toBe(true);
  });
});
