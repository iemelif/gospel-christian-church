// Browser side of Google reCAPTCHA v3 (invisible, score-based; no checkbox), shared by GiveForm (record a gift) and
// the Admin sign-in. The script is loaded by components/RecaptchaNotice.tsx; the server check is lib/recaptcha.ts.
import { RECAPTCHA_SITE_KEY } from "./config";

declare global {
  interface Window { grecaptcha?: { ready(cb: () => void): void; execute(siteKey: string, opts: { action: string }): Promise<string> } }
}

/** Google's script URL for this site key (v3 "render" mode). */
export const recaptchaScriptSrc = (siteKey: string) => `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;

/** Gets a fresh reCAPTCHA v3 token for `action`, or "" if reCAPTCHA is unavailable (the server then rejects). */
export async function recaptchaToken(action: string): Promise<string> {
  const g = typeof window === "undefined" ? undefined : window.grecaptcha;
  if (!RECAPTCHA_SITE_KEY || !g) return "";
  try {
    await new Promise<void>((resolve) => g.ready(resolve));
    return await g.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return "";
  }
}
