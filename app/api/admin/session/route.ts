import { NextResponse } from "next/server";
import { SESSION_COOKIE, cookieOptions, createSession, passwordOk } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Basic brute-force guard: 8 wrong passwords per IP per 15 minutes.
const fails = new Map<string, { n: number; until: number }>();
const ip = (req: Request) => (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

/** Sign in: checks the password and sets a one-day session cookie. */
export async function POST(req: Request) {
  const who = ip(req);
  const f = fails.get(who);
  if (f && f.until > Date.now() && f.n >= 8) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  let password = "";
  try { password = String((await req.json()).password ?? ""); } catch { /* falls through to the error below */ }
  if (!passwordOk(password)) {
    fails.set(who, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 15 * 60 * 1000 });
    return NextResponse.json({ error: "Wrong password, or ADMIN_PASSWORD is not set on the server." }, { status: 401 });
  }
  fails.delete(who);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSession(), cookieOptions());
  return res;
}

/** Sign out: clears the session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return res;
}
