"use client";
import { useState } from "react";
import type { Gift } from "@/lib/store";
import { php } from "@/lib/config";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [err, setErr] = useState("");

  async function load(password = pw) {
    setErr("");
    const res = await fetch("/api/admin", { headers: { "x-admin-password": password } });
    const data = await res.json();
    if (!res.ok) { setGifts(null); return setErr(data.error); }
    setGifts(data);
  }
  async function act(id: string, action: "confirm" | "unconfirm" | "delete") {
    if (action === "delete" && !confirm("Delete this record?")) return;
    await fetch("/api/admin", { method: "PATCH", headers: { "x-admin-password": pw, "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    load();
  }
  const total = (gifts ?? []).filter((g) => g.status === "confirmed").reduce((s, g) => s + g.amount, 0);

  return (
    <div className="wrap" style={{ padding: "40px 20px" }}>
      <h2>Treasurer dashboard</h2>
      {!gifts ? (
        <form className="card" style={{ maxWidth: 380, marginTop: 20 }} onSubmit={(e) => { e.preventDefault(); load(); }}>
          <label htmlFor="pw">Admin password</label>
          <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <p className="err" role="alert">{err}</p>
          <button className="btn full" type="submit">Sign in</button>
        </form>
      ) : (
        <>
          <p className="sub">Confirmed through this site: <b>{php(total)}</b>. Confirm a pledge only after you have received the money.</p>
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
                      {g.status === "pending"
                        ? <button className="btn sm" onClick={() => act(g.id, "confirm")}>Confirm</button>
                        : <button className="btn sm ghost" onClick={() => act(g.id, "unconfirm")}>Undo</button>}
                      <button className="btn sm ghost" onClick={() => act(g.id, "delete")}>Delete</button>
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
