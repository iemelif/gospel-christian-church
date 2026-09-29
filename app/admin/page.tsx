"use client";
import { useCallback, useEffect, useState } from "react";
import RecaptchaNotice from "@/components/RecaptchaNotice";
import { signInWithRecaptcha } from "@/lib/adminSignIn";
import type { Gift } from "@/lib/store";
import { php } from "@/lib/config";
import { btn, card, errorText, h2, input, label, muted, sub, wrap } from "@/lib/ui";

// Table cells (was the global th/td rule).
const cell = "border-b border-line px-2 py-2.5 text-left align-top";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [checking, setChecking] = useState(true); // true while we look for an existing one-day session
  const [err, setErr] = useState("");
  const [signingIn, setSigningIn] = useState(false); // reCAPTCHA + sign-in request running: blocks double submits

  const load = useCallback(async () => {
    const res = await fetch("/api/admin", { cache: "no-store" });
    if (res.status === 401) { setGifts(null); return false; }
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Something went wrong."); return false; }
    setGifts(data);
    return true;
  }, []);

  // Restore the session (the cookie lasts one day), so a refresh doesn't ask for the password again.
  useEffect(() => { load().finally(() => setChecking(false)); }, [load]);

  /** Gets a reCAPTCHA token first; the password is only sent with a token (lib/adminSignIn.ts). */
  async function signIn() {
    if (signingIn) return;
    setErr("");
    setSigningIn(true);
    try {
      const r = await signInWithRecaptcha(pw);
      if (!r.ok) return setErr(r.error);
      setPw("");
      await load();
    } finally { setSigningIn(false); }
  }
  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setGifts(null);
    setErr("");
  }
  async function act(id: string, action: "confirm" | "unconfirm" | "delete") {
    if (action === "delete" && !confirm("Delete this pending pledge? This can't be undone.")) return;
    const res = await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (res.status === 401) { setGifts(null); return setErr("Your session expired. Please sign in again."); }
    if (!res.ok) setErr((await res.json()).error ?? "Something went wrong.");
    load();
  }
  const total = (gifts ?? []).filter((g) => g.status === "confirmed").reduce((s, g) => s + g.amount, 0);
  const pending = (gifts ?? []).filter((g) => g.status === "pending").length;

  if (checking) return <div className={`${wrap} py-10`}><p className={muted}>Loading…</p></div>;

  return (
    <div className={`${wrap} py-10`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={h2}>Treasurer dashboard</h2>
        {gifts && <button className={btn.ghostSm} onClick={signOut}>Log out</button>}
      </div>
      {!gifts ? (
        <form className={`${card} mt-5 max-w-[380px]`} onSubmit={(e) => { e.preventDefault(); signIn(); }}>
          <label className={label} htmlFor="pw">Admin password</label>
          <input className={input} id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <p className={errorText} role="alert">{err}</p>
          <button className={btn.primaryFull} type="submit" disabled={signingIn}>{signingIn ? "Signing in…" : "Sign in"}</button>
          <p className={`${muted} mt-2.5`}>You’ll stay signed in on this device for one day.</p>
          <RecaptchaNotice />
        </form>
      ) : (
        <>
          <p className={sub}>Confirmed through this site: <b>{php(total)}</b> · {pending} waiting for confirmation. Confirm a pledge only after you have received the money.</p>
          <p className={errorText} role="alert">{err}</p>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full border-collapse text-[14px]">
              <thead><tr>{["Date", "Ref", "Donor", "Amount", "Method", "Status", ""].map((h) => <th className={cell} key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {gifts.map((g) => (
                  <tr key={g.id}>
                    <td className={cell}>{new Date(g.createdAt).toLocaleDateString("en-PH")}</td><td className={cell}>{g.ref}</td>
                    <td className={cell}>{g.name}<br /><small>{g.email}</small></td><td className={cell}>{php(g.amount)}<br /><small>{g.freq}</small></td>
                    <td className={cell}>{g.method}</td><td className={cell}>{g.status}</td>
                    <td className={`${cell} whitespace-nowrap`}>
                      {g.status === "pending" ? (
                        <>
                          <button className={`${btn.primarySm} mr-1.5`} onClick={() => act(g.id, "confirm")}>Confirm</button>
                          <button className={`${btn.ghostSm} mr-1.5`} onClick={() => act(g.id, "delete")}>Delete</button>
                        </>
                      ) : (
                        <button className={`${btn.ghostSm} mr-1.5`} onClick={() => act(g.id, "unconfirm")}>Undo</button>
                      )}
                    </td>
                  </tr>
                ))}
                {!gifts.length && <tr><td className={cell} colSpan={7}>No pledges yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
