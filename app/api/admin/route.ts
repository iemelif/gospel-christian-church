import { NextResponse } from "next/server";
import { readGifts, update } from "@/lib/store";
import { SESSION_COOKIE, cookieFrom, sessionValid } from "@/lib/auth";

export const dynamic = "force-dynamic";

const authorized = (req: Request) => sessionValid(cookieFrom(req, SESSION_COOKIE));
const deny = () => NextResponse.json({ error: "Please sign in." }, { status: 401 });

export async function GET(req: Request) {
  if (!authorized(req)) return deny();
  try {
    return NextResponse.json((await readGifts()).reverse());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not read the saved pledges. Check the data storage." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!authorized(req)) return deny();
  const { id, action } = (await req.json()) as { id: string; action: "confirm" | "unconfirm" | "delete" };

  // Confirmed gifts are part of the public total, so they can never be deleted. Undo first if it was a mistake.
  let blocked = false;
  await update((all) => {
    if (action === "delete") {
      const g = all.find((x) => x.id === id);
      if (g?.status === "confirmed") { blocked = true; return all; }
      return all.filter((x) => x.id !== id);
    }
    return all.map((g) => (g.id === id ? { ...g, status: action === "confirm" ? "confirmed" : "pending" } : g));
  });
  if (blocked) return NextResponse.json({ error: "A confirmed pledge can't be deleted." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
