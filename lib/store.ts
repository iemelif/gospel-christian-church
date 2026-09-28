import { promises as fs } from "fs";
import path from "path";
import { CHURCH } from "./config";

export type Gift = {
  id: string; ref: string; name: string; email: string; amount: number;
  freq: "One-time" | "Monthly"; method: string; message: string; anon: boolean;
  status: "pending" | "confirmed"; createdAt: string;
};

const DIR = process.env.DATA_DIR || path.join(process.cwd(), "data"); // on Cloud Run: a mounted bucket
const FILE = path.join(DIR, "gifts.json");

export async function readGifts(): Promise<Gift[]> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")) as Gift[]; } catch { return []; }
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
  const gifts = await readGifts();
  const confirmed = gifts.filter((g) => g.status === "confirmed");
  const raised = CHURCH.baseRaised + confirmed.reduce((s, g) => s + g.amount, 0);
  const wall = confirmed.slice(-8).reverse().map((g) => ({
    id: g.id, name: g.anon ? "Anonymous" : g.name, amount: g.amount, message: g.message,
  }));
  return { raised, wall, donors: confirmed.length };
}
