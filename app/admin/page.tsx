"use client";
import { useCallback, useEffect, useState } from "react";
import type { Gift } from "@/lib/store";
import { php } from "@/lib/config";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [checking, setChecking] = useState(true); // true while we look for an existing one-day session
  const [err, setErr] = useState("");

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

  async function signIn() {
    setErr("");
    const res = await fetch("/api/admin/session", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }),
    });
    if (!res.ok) return setErr((await res.json()).error ?? "Could not sign in.");
    setPw("");
    await load();
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

  if (checking) return <div className="wrap" style={{ padding: "40px 20px" }}><p className="muted">Loading…</p></div>;

  return (
    <div className="wrap" style={{ padding: "40px 20px" }}>
      <div className="admin-head">
        <h2>Treasurer dashboard</h2>
        {gifts && <button className="btn sm ghost" onClick={signOut}>Log out</button>}
      </div>
      {!gifts ? (
        <form className="card" style={{ maxWidth: 380, marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); signIn(); }}>
          <label htmlFor="pw">Admin password</label>
          <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <p className="err" role="alert">{err}</p>
          <button className="btn full" type="submit">Sign in</button>
          <p className="muted" style={{ marginTop: 10 }}>You’ll stay signed in on this device for one day.</p>
        </form>
      ) : (
        <>
          <p className="sub">Confirmed through this site: <b>{php(total)}</b> · {pending} waiting for confirmation. Confirm a pledge only after you have received the money.</p>
          <p className="err" role="alert">{err}</p>
          <div className="card" style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Date</th><th>Ref</th><th>Donor</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {gifts.map((g) => (
                  <tr key={g.id}>
                    <td>{new Date(g.createdAt).toLocaleDateString("en-PH")}</td><td>{g.ref}</td>
                    <td>{g.name}<br /><small>{g.email}</small></td><td>{php(g.amount)}<br /><small>{g.freq}</small></td>
                    <td>{g.method}</td><td>{g.status}</td>
                    <td className="acts">
                      {g.status === "pending" ? (
                        <>
                          <button className="btn sm" onClick={() => act(g.id, "confirm")}>Confirm</button>
                          <button className="btn sm ghost" onClick={() => act(g.id, "delete")}>Delete</button>
                        </>
                      ) : (
                        <button className="btn sm ghost" onClick={() => act(g.id, "unconfirm")}>Undo</button>
                      )}
                    </td>
                  </tr>
                ))}
                {!gifts.length && <tr><td colSpan={7}>No pledges yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
