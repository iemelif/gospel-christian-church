import { describe, expect, it, vi } from "vitest";
import { SIGN_IN_FAILED, signInWithRecaptcha } from "./adminSignIn";

// The browser flow of the Admin "Sign in" button, with reCAPTCHA and the network mocked.
const reply = (status: number, body: unknown) => vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }));

describe("signInWithRecaptcha", () => {
  it("gets a reCAPTCHA token first, then sends password + token to /api/admin/session", async () => {
    const order: string[] = [];
    const getToken = vi.fn(async () => { order.push("recaptcha"); return "tok-123"; });
    const fetchMock = vi.fn<typeof fetch>(async () => { order.push("fetch"); return new Response("{}", { status: 200 }); });
    expect(await signInWithRecaptcha("secret-pw", getToken, fetchMock)).toEqual({ ok: true });
    expect(order).toEqual(["recaptcha", "fetch"]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/admin/session");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ password: "secret-pw", recaptchaToken: "tok-123" });
  });
  it("never sends the password when reCAPTCHA gives no token", async () => {
    const fetchMock = reply(200, {});
    expect(await signInWithRecaptcha("secret-pw", async () => "", fetchMock)).toEqual({ ok: false, error: SIGN_IN_FAILED });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("shows the server's error (wrong password, failed reCAPTCHA, rate limit) and handles network errors", async () => {
    expect(await signInWithRecaptcha("x", async () => "t", reply(401, { error: SIGN_IN_FAILED }))).toEqual({ ok: false, error: SIGN_IN_FAILED });
    expect(await signInWithRecaptcha("x", async () => "t", reply(429, { error: "Too many attempts. Try again in a few minutes." }))).toEqual({ ok: false, error: "Too many attempts. Try again in a few minutes." });
    expect(await signInWithRecaptcha("x", async () => "t", reply(500, "not json"))).toEqual({ ok: false, error: SIGN_IN_FAILED });
    expect(await signInWithRecaptcha("x", async () => "t", vi.fn(async () => { throw new TypeError("offline"); }))).toEqual({ ok: false, error: "Could not reach the server. Check your connection and try again." });
  });
});
