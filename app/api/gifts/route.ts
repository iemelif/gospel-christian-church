import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { update, summary, type Gift } from "@/lib/store";
import { PAYMENT } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await summary());
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const name = String(b.name ?? "").trim().slice(0, 100);
  const email = String(b.email ?? "").trim().slice(0, 120);
  const amount = Math.round(Number(b.amount));
  const method = String(b.method ?? "");
  const freq = b.freq === "Monthly" ? "Monthly" : "One-time";
  if (!name) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!Number.isFinite(amount) || amount < 1 || amount > 12_000_000) return NextResponse.json({ error: "Enter an amount between ₱1 and ₱12,000,000." }, { status: 400 });
  if (!(method in PAYMENT)) return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });

  const gift: Gift = {
    id: randomUUID(), ref: "GCC-" + randomUUID().slice(0, 6).toUpperCase(), name, email, amount, freq, method,
    message: String(b.message ?? "").trim().slice(0, 300), anon: Boolean(b.anon),
    status: "pending", createdAt: new Date().toISOString(),
  };
  await update((all) => [...all, gift]);
  return NextResponse.json({ ref: gift.ref, amount, freq, method });
}
