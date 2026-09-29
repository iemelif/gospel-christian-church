// Google reCAPTCHA v3 (invisible, score-based) verification for recording gifts. Server-only.
// The secret is read from RECAPTCHA_SECRET_KEY at call time and is never logged, returned or stored.
// The browser token is only forwarded to Google; it is never logged or saved.

import { RECAPTCHA_ACTION } from "./config";

/** Action name the client passes to grecaptcha.execute(); the server requires exactly this value back. */
export { RECAPTCHA_ACTION };

/** Default minimum score (0.0 = likely bot … 1.0 = likely human), Google's suggested starting point. */
export const DEFAULT_RECAPTCHA_MIN_SCORE = 0.5;

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const TIMEOUT_MS = 8000;

export type RecaptchaFailure = "missing-token" | "not-configured" | "request-failed" | "not-success" | "wrong-action" | "low-score";
export type RecaptchaResult = { ok: true; score: number } | { ok: false; reason: RecaptchaFailure };

/** Minimum score from RECAPTCHA_MIN_SCORE (a number between 0 and 1), otherwise the default. */
export function recaptchaMinScore(): number {
  const raw = process.env.RECAPTCHA_MIN_SCORE;
  const n = raw === undefined || raw.trim() === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : DEFAULT_RECAPTCHA_MIN_SCORE;
}

/** Verifies a reCAPTCHA v3 token with Google. `fetchImpl` exists for tests; production uses the global fetch. */
export async function verifyRecaptcha(token: unknown, fetchImpl: typeof fetch = fetch): Promise<RecaptchaResult> {
  if (typeof token !== "string" || !token.trim() || token.length > 4000) return { ok: false, reason: "missing-token" };
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: false, reason: "not-configured" };

  let data: { success?: unknown; action?: unknown; score?: unknown };
  try {
    const res = await fetchImpl(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, reason: "request-failed" };
    data = await res.json();
  } catch {
    return { ok: false, reason: "request-failed" };
  }

  if (data.success !== true) return { ok: false, reason: "not-success" };
  if (data.action !== RECAPTCHA_ACTION) return { ok: false, reason: "wrong-action" };
  const score = typeof data.score === "number" ? data.score : NaN;
  if (!(score >= recaptchaMinScore())) return { ok: false, reason: "low-score" };
  return { ok: true, score };
}
