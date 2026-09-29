// NEXT_PUBLIC_* values are inlined at build time (see Dockerfile build args and the deploy workflow).
// They are public by design: never put secrets in them.
// Each one must be read as `process.env.NEXT_PUBLIC_X` (no destructuring) so Next.js can inline it.
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL || "wlabesamis@gmail.com";
const gcash = (process.env.NEXT_PUBLIC_GCASH_NUMBER ?? "").trim();
const maya = (process.env.NEXT_PUBLIC_MAYA_NUMBER ?? "").trim();
const bank = (process.env.NEXT_PUBLIC_BANK_DETAILS ?? "").trim();

/** A value counts as "set" only if it is filled in and is not the .env.example placeholder (XXXX). */
const isSet = (v: string) => v.length > 0 && !/x{3,}/i.test(v);

export const CHURCH = {
  name: "Gospel Christian Church",
  email,
  goal: Number(process.env.NEXT_PUBLIC_GOAL) || 12_000_000,
  baseRaised: Number(process.env.NEXT_PUBLIC_BASE_RAISED) || 2_700_000, // collected before this site went live
  campaign: "Project Nehemiah", // the church building project; the Donate page exists to support it
};

export const SCHEDULE = [
  { title: "Sunday Worship Service", time: "8:30 AM – 11:00 AM", day: "Every Sunday" },
  { title: "Wednesday Worship Service", time: "7:00 PM – 9:00 PM", day: "Every Wednesday" },
  { title: "Morning Devotion", time: "5:30 AM – 7:00 AM", day: "Every Saturday" },
];

export type PaymentMethod = {
  /** Stored with each pledge and checked by the server: never rename an existing id. */
  id: string;
  /** Name shown to donors. */
  label: string;
  /** Lines shown to the donor, as [label, value]. `copy` is the value the Copy button puts on the clipboard. */
  rows: [string, string][];
  copy?: string;
  note: string;
};

/** Splits "Bank: X · Account name: Y · Account no.: Z" into label/value rows. */
function bankRows(text: string): [string, string][] {
  return text.split(/\s*[·|\n]\s*/).filter(Boolean).map((part) => {
    const i = part.indexOf(":");
    return (i > 0 ? [part.slice(0, i).trim(), part.slice(i + 1).trim()] : ["Details", part.trim()]) as [string, string];
  });
}

type Row = [string, string];
const ACCOUNT_NAME: Row = ["Account name", "Gospel Christian Church"];
/**
 * GCash / Maya value: either the same "Label: value · Label: value" format as the bank
 * (e.g. "GCash Number: +639... · Account name: Juan Dela Cruz"), or just a plain number,
 * in which case the account name defaults to the church.
 */
function walletRows(text: string, numberLabel: string): Row[] {
  return text.includes(":") ? bankRows(text) : [[numberLabel, text], ACCOUNT_NAME];
}
const numberOf = (rows: Row[]) => rows.find(([l]) => /\b(number|num|no\.?)/i.test(l))?.[1];


const pending = (what: string): PaymentMethod["rows"] => [["Details", `Please email ${email} for the ${what}.`]];

/**
 * Payment methods shown on the site. All four are always listed. GCash, Maya and Bank transfer show the
 * value from NEXT_PUBLIC_GCASH_NUMBER / NEXT_PUBLIC_MAYA_NUMBER / NEXT_PUBLIC_BANK_DETAILS; if one of those
 * is empty (or still the XXXX placeholder) the method stays visible and tells donors to email the church.
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "GCash",
    label: "GCash",
    rows: isSet(gcash) ? walletRows(gcash, "GCash number") : pending("GCash number"),
    copy: isSet(gcash) ? numberOf(walletRows(gcash, "GCash number")) : undefined,
    note: "Send the amount, then put your reference number in the message.",
  },
  {
    id: "Maya",
    label: "Maya",
    rows: isSet(maya) ? walletRows(maya, "Maya number") : pending("Maya number"),
    copy: isSet(maya) ? numberOf(walletRows(maya, "Maya number")) : undefined,
    note: "Send the amount, then put your reference number in the message.",
  },
  {
    id: "Bank transfer",
    label: "Bank Transfer",
    rows: isSet(bank) ? bankRows(bank) : pending("bank account details"),
    copy: isSet(bank) ? bankRows(bank).find(([l]) => /acc(oun)?t\.?\s*(no|num)/i.test(l))?.[1] : undefined,
    note: "Put your reference number in the transfer remarks.",
  },
  {
    id: "Cash at church",
    label: "Cash at Church",
    rows: [["Where", "Church treasurer or offering envelope"]],
    note: "Write your reference number on an offering envelope, or hand it to the church treasurer.",
  },
];

export const PAYMENT_IDS = PAYMENT_METHODS.map((m) => m.id);

/** Google reCAPTCHA v3 public site key (safe in the browser). The secret key is server-only: see lib/recaptcha.ts. */
export const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
/** reCAPTCHA v3 action for recording a gift; the client sends it and the server requires it back from Google. */
export const RECAPTCHA_ACTION = "record_gift";

export const AMOUNTS = [500, 1000, 2500, 5000, 10000, 50000];
/** Short caption under each preset amount. Edit freely (e.g. replace with real costs from the building plan). */
export const AMOUNT_NOTES: Record<number, string> = {
  500: "A brick", 1000: "A row of bricks", 2500: "A window", 5000: "A wall", 10000: "A room", 50000: "A foundation stone",
};
export const php = (n: number) => "₱" + n.toLocaleString("en-PH");
