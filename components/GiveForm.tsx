"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AMOUNTS, PAYMENT, php } from "@/lib/config";

type Receipt = { ref: string; amount: number; freq: string; method: string };

export default function GiveForm() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [freq, setFreq] = useState("One-time");
  const [method, setMethod] = useState("GCash");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  async function submit() {
    setError("");
    if (!(amount > 0)) return setError("Choose or enter an amount greater than zero.");
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
      <div className="receipt">
        <h3>Thank you, {name.split(" ")[0]}!</h3>
        <p>Your pledge of <b>{php(receipt.amount)}{receipt.freq === "Monthly" ? " per month" : ""}</b> to the Church Building Fund is recorded.</p>
        <div className="ref">{receipt.ref}</div>
        <p className="how">To complete your gift: {PAYMENT[receipt.method]}</p>
        <p className="muted">Your gift is added to the total once the treasurer confirms receipt.</p>
        <button className="btn ghost" onClick={() => { setReceipt(null); setMessage(""); }}>Give again</button>{" "}
        <button className="btn ghost" onClick={() => window.print()}>Print receipt</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      <fieldset>
        <legend>Amount (PHP)</legend>
        <div className="chips">
          {AMOUNTS.map((a) => (
            <label key={a}><input type="radio" name="amt" checked={amount === a && !custom} onChange={() => { setAmount(a); setCustom(""); }} /><span>{php(a)}</span></label>
          ))}
        </div>
        <input type="number" min={1} placeholder="Other amount" aria-label="Other amount" value={custom} style={{ marginTop: 10 }}
          onChange={(e) => { setCustom(e.target.value); setAmount(Number(e.target.value)); }} />
      </fieldset>
      <fieldset>
        <legend>How often</legend>
        <div className="chips">
          {["One-time", "Monthly"].map((f) => (
            <label key={f}><input type="radio" name="freq" checked={freq === f} onChange={() => setFreq(f)} /><span>{f}</span></label>
          ))}
        </div>
      </fieldset>
      <div className="two">
        <fieldset><label htmlFor="name">Full name</label><input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></fieldset>
        <fieldset><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></fieldset>
      </div>
      <fieldset>
        <legend>Payment method</legend>
        <div className="chips">
          {Object.keys(PAYMENT).map((m) => (
            <label key={m}><input type="radio" name="pm" checked={method === m} onChange={() => setMethod(m)} /><span>{m}</span></label>
          ))}
        </div>
        <div className="how">{PAYMENT[method]}</div>
      </fieldset>
      <fieldset><label htmlFor="msg">Message or prayer request (optional)</label><textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} /></fieldset>
      <label className="check"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Show my gift as “Anonymous” on the giving wall</label>
      <p className="err" role="alert">{error}</p>
      <button className="btn full" type="submit" disabled={busy}>{busy ? "Recording…" : "Record my gift"}</button>
    </form>
  );
}
