export const CHURCH = {
  name: "Gospel Christian Church",
  email: "wlabesamis@gmail.com",
  goal: 12_000_000,
  baseRaised: 2_700_000, // amount already collected before this site went live
  campaign: "Church Building Fund",
};

export const SCHEDULE = [
  { title: "Sunday Worship Service", time: "8:30 AM – 11:00 AM", day: "Every Sunday" },
  { title: "Wednesday Worship Service", time: "7:00 PM – 9:00 PM", day: "Every Wednesday" },
  { title: "Morning Devotion", time: "5:30 AM – 7:00 AM", day: "Every Saturday" },
];

// Replace the placeholders with your real account details.
export const PAYMENT: Record<string, string> = {
  GCash: "Send to GCash 09XX-XXX-XXXX (Gospel Christian Church). Put your reference number in the note.",
  Maya: "Send to Maya 09XX-XXX-XXXX (Gospel Christian Church). Put your reference number in the note.",
  "Bank transfer": "Bank: YOUR BANK · Account name: Gospel Christian Church · Account no.: XXXX-XXXX-XX. Put your reference number in the remarks.",
  "Cash at church": "Place your gift in an offering envelope marked with your reference number, or hand it to the church treasurer.",
};

export const AMOUNTS = [500, 1000, 2500, 5000, 10000, 50000];
export const php = (n: number) => "₱" + n.toLocaleString("en-PH");
