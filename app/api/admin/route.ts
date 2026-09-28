import { NextResponse } from "next/server";
import { readGifts, update } from "@/lib/store";

export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && req.headers.get("x-admin-password") === pw;
}
const deny = () => NextResponse.json({ error: "Wrong password, or ADMIN_PASSWORD is not set on the server." }, { status: 401 });

export async function GET(req: Request) {
  if (!authorized(req)) return deny();
  return NextResponse.json((await readGifts()).reverse());
}

export async function PATCH(req: Request) {
  if (!authorized(req)) return deny();
  const { id, action } = (await req.json()) as { id: string; action: "confirm" | "unconfirm" | "delete" };
  await update((all) =>
    action === "delete"
      ? all.filter((g) => g.id !== id)
      : all.map((g) => (g.id === id ? { ...g, status: action === "confirm" ? "confirmed" : "pending" } : g)),
  );
  return NextResponse.json({ ok: true });
}
