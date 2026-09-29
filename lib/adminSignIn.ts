import { RECAPTCHA_ADMIN_ACTION } from "./config";
import { recaptchaToken } from "./recaptchaClient";

export type SignInResult = { ok: true } | { ok: false; error: string };

/** The one sign-in failure message: never says whether the password, configuration or reCAPTCHA was the cause. */
export const SIGN_IN_FAILED = "Unable to sign in. Please try again.";

/**
 * Admin sign-in: gets a reCAPTCHA v3 token for `admin_sign_in` first, and only then posts the password with it to
 * /api/admin/session (which verifies the token before checking the password). No token → nothing is sent.
 * `getToken` and `fetchImpl` exist for tests; the page uses the defaults.
 */
export async function signInWithRecaptcha(
  password: string,
  getToken: () => Promise<string> = () => recaptchaToken(RECAPTCHA_ADMIN_ACTION),
  fetchImpl: typeof fetch = fetch,
): Promise<SignInResult> {
  const token = await getToken();
  if (!token) return { ok: false, error: SIGN_IN_FAILED };
  try {
    const res = await fetchImpl("/api/admin/session", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, recaptchaToken: token }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? SIGN_IN_FAILED };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection and try again." };
  }
}
