"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AMOUNTS, AMOUNT_NOTES, CHURCH, PAYMENT_METHODS, RECAPTCHA_ACTION, RECAPTCHA_SITE_KEY, php } from "@/lib/config";
import { btn, cardTitle, errorText, input, label, muted } from "@/lib/ui";
import CopyButton from "./CopyButton";
import PaymentDetails from "./PaymentDetails";

type Receipt = { ref: string; amount: number; freq: string; method: string };

// Google reCAPTCHA v3 (invisible, score-based; no checkbox). Loaded by the <Script> in the form below.
declare global {
  interface Window { grecaptcha?: { ready(cb: () => void): void; execute(siteKey: string, opts: { action: string }): Promise<string> } }
}

/** Gets a fresh reCAPTCHA v3 token for recording a gift, or "" if reCAPTCHA is unavailable (the server then rejects). */
async function recaptchaToken(): Promise<string> {
  const g = window.grecaptcha;
  if (!RECAPTCHA_SITE_KEY || !g) return "";
  try {
    await new Promise<void>((resolve) => g.ready(resolve));
    return await g.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION });
  } catch {
    return "";
  }
}

// Styles used only by this form.
const fieldset = "m-0 mb-[18px] min-w-0 border-0 p-0";
const legend = "mb-3 flex items-center gap-2.5 font-serif text-[17px] font-normal";
const stepNo = "inline-grid size-[26px] place-items-center rounded-full bg-brand font-sans text-[13px] leading-[normal] font-semibold text-white";
// Radio "cards": the real radio is transparent (opacity 0, peer); the span after it shows the checked/focused state.
const radioInput = "peer absolute opacity-0";
const amountSpan = "flex cursor-pointer flex-col items-center rounded-[10px] border-[1.5px] border-line bg-bg px-1.5 py-3 text-center peer-checked:border-brand peer-checked:bg-[color-mix(in_srgb,var(--color-gold)_22%,#fff)] peer-checked:shadow-[0_0_0_1px_var(--color-brand)] peer-focus-visible:outline-[3px] peer-focus-visible:outline-blue";
const chipLabel = "relative m-0 block text-[14px] font-medium";
const chipSpan = "block cursor-pointer rounded-lg border-[1.5px] border-line bg-bg px-4 py-2.5 peer-checked:border-brand peer-checked:bg-[color-mix(in_srgb,var(--color-gold)_18%,transparent)] peer-checked:font-semibold peer-checked:shadow-[0_0_0_1px_var(--color-brand)] peer-focus-visible:outline-[3px] peer-focus-visible:outline-blue";

/** Payment instructions for one method (before Record Gift and on the receipt; exported for tests). In the receipt the box is centred and narrower. */
export function MethodDetails({ id, receipt = false }: { id: string; receipt?: boolean }) {
  const m = PAYMENT_METHODS.find((x) => x.id === id);
  if (!m) return null;
  return <PaymentDetails method={m} className={`rounded-lg border border-dashed border-line bg-bg p-3 text-left text-[14px] text-mute ${receipt ? "mx-auto my-4 max-w-[500px]" : "mt-2.5"}`} />;
}

export default function GiveForm() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [freq, setFreq] = useState("One-time");
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const valid = amount > 0;
  const monthly = freq === "Monthly";

  async function submit() {
    setError("");
    if (!valid) return setError("Choose or enter an amount greater than zero.");
    setBusy(true);
    try {
      const recaptcha = await recaptchaToken();
      const res = await fetch("/api/gifts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, freq, method, name, email, message, anon, recaptchaToken: recaptcha }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error ?? "Something went wrong. Try again.");
      setReceipt(data);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally { setBusy(false); }
  }

  if (receipt) {
    return (
      <div className="py-2.5 text-center" aria-live="polite">
        <div className="mx-auto mb-2.5 grid size-14 place-items-center rounded-full bg-brand text-[28px] text-gold" aria-hidden="true">✓</div>
        <h3 className={cardTitle}>Thank you, {name.split(" ")[0]}.</h3>
        <p>Your pledge of <b>{php(receipt.amount)}{receipt.freq === "Monthly" ? " every month" : ""}</b> to {CHURCH.campaign} is recorded.</p>
        <p className="mb-0 font-semibold">Now send your gift and include this reference number:</p>
        <div className="my-2.5 inline-block rounded-md bg-bg px-3.5 py-1.5 text-[20px] leading-[normal] font-semibold [font-family:monospace]">{receipt.ref}</div>
        <div><CopyButton value={receipt.ref} label="Copy reference" /></div>
        <MethodDetails id={receipt.method} receipt />
        <p className={muted}>Your gift is added to the total once the treasurer confirms it.</p>
        <button className={btn.ghost} onClick={() => { setReceipt(null); setMessage(""); }}>Give again</button>{" "}
        <button className={btn.ghost} onClick={() => window.print()}>Print receipt</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      {RECAPTCHA_SITE_KEY && <Script src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`} strategy="afterInteractive" />}
      <fieldset className={fieldset}>
        <legend className={legend}><span className={stepNo}>1</span>Choose your gift</legend>
        <div className="grid grid-cols-[repeat(3,1fr)] gap-2 max-xs:grid-cols-[repeat(2,1fr)]">
          {AMOUNTS.map((a) => (
            <label className="relative m-0 block text-[14px] font-semibold" key={a}>
              <input className={radioInput} type="radio" name="amt" checked={amount === a && !custom} onChange={() => { setAmount(a); setCustom(""); }} />
              <span className={amountSpan}><b className="text-[18px]">{php(a)}</b><small className="text-[12px] font-medium text-mute">{AMOUNT_NOTES[a]}</small></span>
            </label>
          ))}
        </div>
        <input className={`${input} mt-2.5`} type="number" min={1} inputMode="numeric" placeholder="Or enter another amount (₱)" aria-label="Other amount in pesos" value={custom}
          onChange={(e) => { setCustom(e.target.value); setAmount(Number(e.target.value)); }} />
        <div className="mt-3 flex flex-wrap gap-2">
          {["One-time", "Monthly"].map((f) => (
            <label className={chipLabel} key={f}><input className={radioInput} type="radio" name="freq" checked={freq === f} onChange={() => setFreq(f)} /><span className={chipSpan}>{f}</span></label>
          ))}
        </div>
        {monthly && valid && <p className="mt-2.5 mb-0 text-[14px] font-semibold text-brand">{php(amount)} a month adds up to <b>{php(amount * 12)}</b> in a year.</p>}
      </fieldset>

      <fieldset className={fieldset}>
        <legend className={legend}><span className={stepNo}>2</span>Your details</legend>
        <div className="grid grid-cols-[1fr_1fr] gap-3.5 max-md:grid-cols-[1fr]">
          <div><label className={label} htmlFor="name">Full name</label><input className={input} id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className={label} htmlFor="email">Email <span className="font-normal text-mute">(optional)</span></label><input className={input} id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <label className={`${label} mt-3.5`} htmlFor="msg">Message or prayer request (optional)</label>
        <textarea className={`${input} min-h-[70px] resize-y`} id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
        <label className="mb-1.5 flex items-center gap-2 text-[14px] font-medium"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Show my gift as “Anonymous” on the giving wall</label>
      </fieldset>

      <fieldset className={fieldset}>
        <legend className={legend}><span className={stepNo}>3</span>How will you send it?</legend>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <label className={chipLabel} key={m.id}><input className={radioInput} type="radio" name="pm" checked={method === m.id} onChange={() => setMethod(m.id)} /><span className={chipSpan}>{m.label}</span></label>
          ))}
        </div>
        <MethodDetails id={method} />
      </fieldset>

      <p className={errorText} role="alert">{error}</p>
      <button className={btn.primaryFullLg} type="submit" disabled={busy}>
        {busy ? "Recording…" : valid ? `Record my ${php(amount)}${monthly ? " monthly" : ""} gift` : "Record my gift"}
      </button>
      <p className="mt-2.5 mb-0 text-center text-[13px] text-mute">No payment is taken on this site. You’ll get a reference number, then send your gift using the method above.</p>
      {/* Required by Google when the reCAPTCHA badge is hidden (see the base layer in app/globals.css). */}
      {RECAPTCHA_SITE_KEY && <p className="mt-2 mb-0 text-center text-[12px] text-mute">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.</p>}
    </form>
  );
}
