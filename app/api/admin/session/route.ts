import { NextResponse } from "next/server";
import { SIGN_IN_FAILED } from "@/lib/adminSignIn";
import { SESSION_COOKIE, cookieOptions, createSession, passwordOk } from "@/lib/auth";
import { RECAPTCHA_ADMIN_ACTION, recaptchaError, recaptchaUnavailable, verifyRecaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

// Basic brute-force guard: 8 wrong passwords per IP per 15 minutes.
const fails = new Map<string, { n: number; until: number }>();
const ip = (req: Request) => (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

/**
 * Sign in: verifies the Google reCAPTCHA v3 token (action `admin_sign_in`) first; only then checks the password and
 * sets a one-day session cookie. A failed reCAPTCHA check never looks at the password and doesn't count as a
 * wrong password. The token goes to Google only (not logged or stored).
 */
export async function POST(req: Request) {
  const who = ip(req);
  const f = fails.get(who);
  if (f && f.until > Date.now() && f.n >= 8) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  let body: { password?: unknown; recaptchaToken?: unknown } = {};
  try { body = await req.json(); } catch { /* no token → rejected by the reCAPTCHA check below */ }
  const check = await verifyRecaptcha(body.recaptchaToken, fetch, RECAPTCHA_ADMIN_ACTION);
  if (!check.ok) {
    if (recaptchaUnavailable(check.reason)) console.error(`Admin sign-in refused: reCAPTCHA verification unavailable (${check.reason}).`);
    return NextResponse.json({ error: SIGN_IN_FAILED }, { status: recaptchaError(check.reason).status });
  }
  const password = String(body.password ?? "");
  if (!passwordOk(password)) {
    fails.set(who, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    return NextResponse.json({ error: SIGN_IN_FAILED }, { status: 401 });
  }
  fails.delete(who);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(), cookieOptions());
  return res;
}

/** Sign out: clears the session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return res;
}
