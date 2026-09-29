import Script from "next/script";
import { RECAPTCHA_SITE_KEY } from "@/lib/config";
import { recaptchaScriptSrc } from "@/lib/recaptchaClient";

/**
 * Loads Google reCAPTCHA v3 and shows Google's notice, which is required because the badge is hidden
 * (`.grecaptcha-badge` in app/globals.css). Renders nothing without a site key. Used inside forms that call
 * `recaptchaToken()`: GiveForm and the Admin sign-in.
 */
export default function RecaptchaNotice() {
  if (!RECAPTCHA_SITE_KEY) return null;
  return (
    <>
      <Script src={recaptchaScriptSrc(RECAPTCHA_SITE_KEY)} strategy="afterInteractive" />
      <p className="mt-2 mb-0 text-center text-[12px] text-mute">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.</p>
    </>
  );
}
