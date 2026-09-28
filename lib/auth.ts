import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "gcc_admin";
export const SESSION_SECONDS = 60 * 60 * 24; // one day

/** The signing key is derived from ADMIN_PASSWORD, so changing the password signs everyone out. */
const key = () => `gcc-admin-session:${process.env.ADMIN_PASSWORD ?? ""}`;
const sign = (payload: string) => createHmac("sha256", key()).update(payload).digest("hex");

const safeEqual = (a: string, b: string) => {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export function passwordOk(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && safeEqual(createHmac("sha256", "pw").update(input).digest("hex"), createHmac("sha256", "pw").update(pw!).digest("hex"));
}

export function createSession() {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

export function sessionValid(token?: string | null) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now();
}

export function cookieFrom(req: Request, name = SESSION_COOKIE) {
  const m = (req.headers.get("cookie") ?? "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export const cookieOptions = (maxAge = SESSION_SECONDS) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});
