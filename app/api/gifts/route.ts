import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { update, summary, type Gift } from "@/lib/store";
import { GIFT_AMOUNT_ERROR, PAYMENT_IDS, isGiftAmount, toCentavos } from "@/lib/config";
import { recaptchaError, recaptchaUnavailable, verifyRecaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await summary());
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const name = String(b.name ?? "").trim().slice(0, 100);
  const email = String(b.email ?? "").trim().slice(0, 120);
  const raw = Number(b.amount);
  const method = String(b.method ?? "");
  const freq = b.freq === "Monthly" ? "Monthly" : "One-time";
  if (!name) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  // Email is optional; when given it must look like an address. It is stored for the treasurer only (never public).
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  // Centavos are allowed (up to 2 decimals); the stored amount is normalised to exactly 2 decimals.
  if (!isGiftAmount(raw)) return NextResponse.json({ error: GIFT_AMOUNT_ERROR }, { status: 400 });
  const amount = toCentavos(raw) / 100;
  if (!PAYMENT_IDS.includes(method)) return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });

  // Google reCAPTCHA v3, checked only after the fields are valid and before anything is saved.
  // The token (b.recaptchaToken) is sent to Google only; it is not logged and not stored with the gift.
  const check = await verifyRecaptcha(b.recaptchaToken);
  if (!check.ok) {
    if (recaptchaUnavailable(check.reason)) console.error(`Gift not saved: reCAPTCHA verification unavailable (${check.reason}).`);
    const { status, error } = recaptchaError(check.reason);
    return NextResponse.json({ error }, { status });
  }

  const gift: Gift = {
    id: randomUUID(), ref: "GCC-" + randomUUID().slice(0, 6).toUpperCase(), name, email, amount, freq, method,
    message: String(b.message ?? "").trim().slice(0, 300), anon: Boolean(b.anon),
    status: "pending", createdAt: new Date().toISOString(),
  };
  try {
    await update((all) => [...all, gift]);
  } catch (e) {
    console.error("Could not save pledge:", e);
    return NextResponse.json({ error: "We couldn't save your pledge just now. Please try again in a moment." }, { status: 500 });
  }
  return NextResponse.json({ ref: gift.ref, amount, freq, method });
}
