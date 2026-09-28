"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AMOUNTS, AMOUNT_NOTES, PAYMENT_METHODS, php } from "@/lib/config";
import CopyButton from "./CopyButton";

type Receipt = { ref: string; amount: number; freq: string; method: string };

function MethodDetails({ id }: { id: string }) {
  const m = PAYMENT_METHODS.find((x) => x.id === id);
  if (!m) return null;
  return (
    <div className="how">
      <dl>
        {m.rows.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {m.copy && <CopyButton value={m.copy} label={id === "Bank transfer" ? "Copy account number" : "Copy number"} />}
      <p className="how-note">{m.note}</p>
    </div>
  );
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
      const res = await fetch("/api/gifts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, freq, method, name, email, message, anon }),
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
      <div className="receipt" aria-live="polite">
        <div className="receipt-mark" aria-hidden="true">✓</div>
        <h3>Thank you, {name.split(" ")[0]}.</h3>
        <p>Your pledge of <b>{php(receipt.amount)}{receipt.freq === "Monthly" ? " every month" : ""}</b> to the Church Building Fund is recorded.</p>
        <p className="receipt-step">Now send your gift and include this reference number:</p>
        <div className="ref">{receipt.ref}</div>
        <div><CopyButton value={receipt.ref} label="Copy reference" /></div>
        <MethodDetails id={receipt.method} />
        <p className="muted">Your gift is added to the total once the treasurer confirms it.</p>
        <button className="btn ghost" onClick={() => { setReceipt(null); setMessage(""); }}>Give again</button>{" "}
        <button className="btn ghost" onClick={() => window.print()}>Print receipt</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      <fieldset>
        <legend><span className="step">1</span>Choose your gift</legend>
        <div className="amounts">
          {AMOUNTS.map((a) => (
            <label key={a}>
              <input type="radio" name="amt" checked={amount === a && !custom} onChange={() => { setAmount(a); setCustom(""); }} />
              <span><b>{php(a)}</b><small>{AMOUNT_NOTES[a]}</small></span>
            </label>
          ))}
        </div>
        <input type="number" min={1} inputMode="numeric" placeholder="Or enter another amount (₱)" aria-label="Other amount in pesos" value={custom} style={{ marginTop: 10 }}
          onChange={(e) => { setCustom(e.target.value); setAmount(Number(e.target.value)); }} />
        <div className="chips freq">
          {["One-time", "Monthly"].map((f) => (
            <label key={f}><input type="radio" name="freq" checked={freq === f} onChange={() => setFreq(f)} /><span>{f}</span></label>
          ))}
        </div>
        {monthly && valid && <p className="hint">{php(amount)} a month adds up to <b>{php(amount * 12)}</b> in a year.</p>}
      </fieldset>

      <fieldset>
        <legend><span className="step">2</span>Your details</legend>
        <div className="two">
          <div><label htmlFor="name">Full name</label><input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <label htmlFor="msg" style={{ marginTop: 14 }}>Message or prayer request (optional)</label>
        <textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
        <label className="check"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Show my gift as “Anonymous” on the giving wall</label>
      </fieldset>

      <fieldset>
        <legend><span className="step">3</span>How will you send it?</legend>
        <div className="chips">
          {PAYMENT_METHODS.map((m) => (
            <label key={m.id}><input type="radio" name="pm" checked={method === m.id} onChange={() => setMethod(m.id)} /><span>{m.id}</span></label>
          ))}
        </div>
        <MethodDetails id={method} />
      </fieldset>

      <p className="err" role="alert">{error}</p>
      <button className="btn full lg" type="submit" disabled={busy}>
        {busy ? "Recording…" : valid ? `Record my ${php(amount)}${monthly ? " monthly" : ""} gift` : "Record my gift"}
      </button>
      <p className="fine">No payment is taken on this site. You’ll get a reference number, then send your gift using the method above.</p>
    </form>
  );
}
