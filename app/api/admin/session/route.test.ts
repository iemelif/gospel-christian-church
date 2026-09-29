import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Google reCAPTCHA is never called: the global fetch is replaced with a mock of the siteverify response.
// Fresh modules per test also reset the in-memory rate limiter.
const PASSWORD = "correct-horse";
let googleReply: { status: number; body: unknown } | "network-error";
const fetchMock = vi.fn<typeof fetch>(async () => {
  if (googleReply === "network-error") throw new TypeError("fetch failed");
  return new Response(JSON.stringify(googleReply.body), { status: googleReply.status, headers: { "Content-Type": "application/json" } });
});

beforeEach(() => {
  vi.stubEnv("ADMIN_PASSWORD", PASSWORD);
  vi.stubEnv("RECAPTCHA_SECRET_KEY", "test-secret-do-not-use");
  googleReply = { status: 200, body: { success: true, action: "admin_sign_in", score: 0.9 } };
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
  vi.resetModules();
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const signIn = async (body: unknown, POST?: (req: Request) => Promise<Response>) => {
  POST ??= (await import("./route")).POST;
  const res = await POST(new Request("http://x/api/admin/session", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body), headers: { "x-forwarded-for": "203.0.113.7" } }));
  return { status: res.status, data: await res.json(), cookie: res.headers.get("set-cookie") ?? "" };
};

describe("POST /api/admin/session — reCAPTCHA before the password", () => {
  it("verifies the token with Google (action admin_sign_in), then signs in with the right password", async () => {
    const r = await signIn({ password: PASSWORD, recaptchaToken: "tok-1" });
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ ok: true });
    expect(r.cookie).toMatch(/^gcc_admin=\d+\.[0-9a-f]{64};/);
    expect(r.cookie).toMatch(/HttpOnly/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://www.google.com/recaptcha/api/siteverify");
    expect(String(init?.body)).toContain("response=tok-1");
  });
  it("refuses without a token (400) and never creates a session, even with the right password", async () => {
    for (const body of [{ password: PASSWORD }, { password: PASSWORD, recaptchaToken: "" }, "not json"]) {
      const r = await signIn(body);
      expect(r.status).toBe(400);
      expect(r.data).toEqual({ error: "Unable to sign in. Please try again." });
      expect(r.cookie).toBe("");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("refuses a failed check (403): low score, wrong action (a gift token), not successful", async () => {
    for (const body of [{ success: true, action: "admin_sign_in", score: 0.2 }, { success: true, action: "record_gift", score: 0.9 }, { success: false }]) {
      googleReply = { status: 200, body };
      const r = await signIn({ password: PASSWORD, recaptchaToken: "tok" });
      expect(r).toMatchObject({ status: 403, data: { error: "Unable to sign in. Please try again." }, cookie: "" });
    }
  });
  it("returns 503 when reCAPTCHA is not configured or Google is unreachable, and logs no secret or token", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    googleReply = "network-error";
    expect((await signIn({ password: PASSWORD, recaptchaToken: "tok-secret" })).status).toBe(503);
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    const r = await signIn({ password: PASSWORD, recaptchaToken: "tok-secret" });
    expect(r).toMatchObject({ status: 503, data: { error: "Unable to sign in. Please try again." }, cookie: "" });
    const logged = JSON.stringify(log.mock.calls);
    expect(logged).not.toContain("tok-secret");
    expect(logged).not.toContain("test-secret-do-not-use");
  });
  it("keeps the password check: a verified request with a wrong password gets 401", async () => {
    const r = await signIn({ password: "wrong", recaptchaToken: "tok" });
    expect(r).toMatchObject({ status: 401, data: { error: "Unable to sign in. Please try again." }, cookie: "" });
  });
  it("keeps the rate limit (8 wrong passwords → 429); failed reCAPTCHA checks don't count as wrong passwords", async () => {
    const { POST } = await import("./route");
    for (let i = 0; i < 10; i++) expect((await signIn({ password: PASSWORD }, POST)).status).toBe(400);
    expect((await signIn({ password: PASSWORD, recaptchaToken: "tok" }, POST)).status).toBe(200);
    for (let i = 0; i < 8; i++) expect((await signIn({ password: "wrong", recaptchaToken: "tok" }, POST)).status).toBe(401);
    expect((await signIn({ password: PASSWORD, recaptchaToken: "tok" }, POST)).status).toBe(429);
  });
});

describe("DELETE /api/admin/session", () => {
  it("signs out by clearing the cookie (no reCAPTCHA)", async () => {
    const { DELETE } = await import("./route");
    const res = await DELETE();
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/^gcc_admin=;.*Max-Age=0/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
