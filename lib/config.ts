// NEXT_PUBLIC_* values are inlined at build time (see Dockerfile build args and the deploy workflow).
// They are public by design: never put secrets in them.
const email = process.env.NEXT_PUBLIC_CHURCH_EMAIL || "wlabesamis@gmail.com";
const gcash = process.env.NEXT_PUBLIC_GCASH_NUMBER || "09XX-XXX-XXXX";
const maya = process.env.NEXT_PUBLIC_MAYA_NUMBER || "09XX-XXX-XXXX";
const bank = process.env.NEXT_PUBLIC_BANK_DETAILS || "Bank: YOUR BANK · Account name: Gospel Christian Church · Account no.: XXXX-XXXX-XX";

export const CHURCH = {
  name: "Gospel Christian Church",
  email,
  goal: Number(process.env.NEXT_PUBLIC_GOAL) || 12_000_000,
  baseRaised: Number(process.env.NEXT_PUBLIC_BASE_RAISED) || 2_700_000, // collected before this site went live
  campaign: "Church Building Fund",
};

export const SCHEDULE = [
  { title: "Sunday Worship Service", time: "8:30 AM – 11:00 AM", day: "Every Sunday" },
  { title: "Wednesday Worship Service", time: "7:00 PM – 9:00 PM", day: "Every Wednesday" },
  { title: "Morning Devotion", time: "5:30 AM – 7:00 AM", day: "Every Saturday" },
];

export const PAYMENT: Record<string, string> = {
  GCash: `Send to GCash ${gcash} (Gospel Christian Church). Put your reference number in the note.`,
  Maya: `Send to Maya ${maya} (Gospel Christian Church). Put your reference number in the note.`,
  "Bank transfer": `${bank}. Put your reference number in the remarks.`,
  "Cash at church": "Place your gift in an offering envelope marked with your reference number, or hand it to the church treasurer.",
};

export const AMOUNTS = [500, 1000, 2500, 5000, 10000, 50000];
export const php = (n: number) => "₱" + n.toLocaleString("en-PH");
