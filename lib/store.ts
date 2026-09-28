import { promises as fs } from "fs";
import path from "path";
import { CHURCH } from "./config";

export type Gift = {
  id: string; ref: string; name: string; email: string; amount: number;
  freq: "One-time" | "Monthly"; method: string; message: string; anon: boolean;
  status: "pending" | "confirmed"; createdAt: string;
};

const DIR = process.env.DATA_DIR || path.join(process.cwd(), "data"); // on Cloud Run: the mounted bucket (/data)
const FILE = path.join(DIR, "gifts.json");

/**
 * Reads all gifts. A missing file means "no gifts yet", but any OTHER failure (unreadable, corrupt JSON)
 * is thrown on purpose: silently returning [] here would let the next write overwrite every saved pledge.
 */
export async function readGifts(): Promise<Gift[]> {
  let raw: string;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
  if (!raw.trim()) return [];
  return JSON.parse(raw) as Gift[];
}

export async function writeGifts(g: Gift[]) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(g, null, 2));
}

let chain: Promise<unknown> = Promise.resolve();
/** Serialises read-modify-write so concurrent requests can't overwrite each other. */
export function update<T>(fn: (gifts: Gift[]) => Gift[] | Promise<Gift[]>, result?: () => T): Promise<T | undefined> {
  const run = chain.then(async () => { await writeGifts(await fn(await readGifts())); return result?.(); });
  chain = run.catch(() => undefined);
  return run;
}

export async function summary() {
  let gifts: Gift[] = [];
  try { gifts = await readGifts(); } catch (e) { console.error("Could not read gifts:", e); }
  const confirmed = gifts.filter((g) => g.status === "confirmed");
  const raised = CHURCH.baseRaised + confirmed.reduce((s, g) => s + g.amount, 0);
  const wall = confirmed.slice(-8).reverse().map((g) => ({
    id: g.id, name: g.anon ? "Anonymous" : g.name, amount: g.amount, message: g.message,
  }));
  return { raised, wall, donors: confirmed.length, pledged: gifts.filter((g) => g.status === "pending").length };
}
