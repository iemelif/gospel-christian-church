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

/** Project Nehemiah video on Facebook, embedded inline on Home and below the Donate page hero (with heading + caption). */
export const NEHEMIAH_VIDEO = {
  url: "https://www.facebook.com/gcc1984/videos/1995167554627898/",
  title: "Project Nehemiah video",
  heading: "See what we're building",
  caption: "A 3D walkthrough of Project Nehemiah in Frances, Calumpit.",
};

/** Caption on the building picture under "Project Nehemiah" on the Donate page (picture: SHARE_IMAGES.donate in content/site.ts). */
export const NEHEMIAH_PICTURE = {
  eyebrow: "The church we are building",
  title: "A new home for Gospel Christian Church",
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
  /** QR code image for this method (public/images/payments/), shown only when the method's details are set. */
  qr?: PaymentQr;
};

/**
 * A QR-only code image served from /public. `width`/`height` are the file's intrinsic size (keeps the aspect
 * ratio; lib/config.test.ts checks them against the file).
 */
export type PaymentQr = { src: string; width: number; height: number; alt: string };

const GCASH_QR: PaymentQr = { src: "/images/payments/qrcode-gcash.jpg", width: 441, height: 442, alt: "GCash QR code for sending your gift" };
const MAYA_QR: PaymentQr = { src: "/images/payments/qrcode-maya.jpg", width: 663, height: 663, alt: "Maya QR code for sending your gift" };

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
    qr: isSet(gcash) ? GCASH_QR : undefined,
  },
  {
    id: "Maya",
    label: "Maya",
    rows: isSet(maya) ? walletRows(maya, "Maya number") : pending("Maya number"),
    copy: isSet(maya) ? numberOf(walletRows(maya, "Maya number")) : undefined,
    note: "Send the amount, then put your reference number in the message.",
    qr: isSet(maya) ? MAYA_QR : undefined,
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
/** reCAPTCHA v3 action for the treasurer's Admin sign-in (a gift token can't be reused to sign in, and vice versa). */
export const RECAPTCHA_ADMIN_ACTION = "admin_sign_in";

export const AMOUNTS = [500, 1000, 2500, 5000, 10000, 50000];
/** Short caption under each preset amount. Edit freely (e.g. replace with real costs from the building plan). */
export const AMOUNT_NOTES: Record<number, string> = {
  500: "A brick", 1000: "A row of bricks", 2500: "A window", 5000: "A wall", 10000: "A room", 50000: "A foundation stone",
};
/** Whole pesos, e.g. ₱12,000,000 — for the goal and preset amounts. */
export const php = (n: number) => "₱" + n.toLocaleString("en-PH");
/** Pesos with centavos, e.g. ₱2,701,248.50 — for gift amounts, the total raised and the amount still needed. */
export const phpCents = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Gift amounts are pesos with up to 2 decimal places. Money maths is done in whole centavos so sums don't drift
 *  (0.1 + 0.2 ≠ 0.3 in floating point). */
export const toCentavos = (n: number) => Math.round(n * 100);
export const sumPesos = (amounts: number[]) => amounts.reduce((s, n) => s + toCentavos(n), 0) / 100;
export const MIN_GIFT = 1;
export const MAX_GIFT = 12_000_000;
/** A valid gift: ₱1 to ₱12,000,000 with at most 2 decimal places (checked in the form and in POST /api/gifts). */
export const isGiftAmount = (n: number) => Number.isFinite(n) && n >= MIN_GIFT && n <= MAX_GIFT && Math.abs(n * 100 - toCentavos(n)) < 1e-6;
export const GIFT_AMOUNT_ERROR = `Enter an amount between ${php(MIN_GIFT)} and ${php(MAX_GIFT)}, with up to 2 decimal places.`;
