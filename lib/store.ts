import { promises as fs } from "fs";
import path from "path";
import { CHURCH } from "./config";

export type Gift = {
  id: string; ref: string; name: string; email: string; amount: number;
  freq: "One-time" | "Monthly"; method: string; message: string; anon: boolean;
  status: "pending" | "confirmed"; createdAt: string;
};

const FILE = path.join(process.cwd(), "data", "gifts.json");

export async function readGifts(): Promise<Gift[]> {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")) as Gift[]; } catch { return []; }
}
export async function writeGifts(g: Gift[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(g, null, 2));
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
