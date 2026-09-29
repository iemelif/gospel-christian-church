/**
 * Share of the goal raised, as a number from 0 to 100 (capped at 100). The Donate page uses this for both the
 * hero and the fundraising percentage above the Giving Wall, so they always show the same figure.
 */
export function fundedPercent(raised: number, goal: number): number {
  if (!(goal > 0) || !(raised > 0)) return 0;
  return Math.min(100, (raised / goal) * 100);
}

/** "42.5" / "100" — one decimal, without a trailing ".0" (the format used across the Donate page). */
export function formatPercent(pct: number): string {
  return pct.toFixed(1).replace(/\.0$/, "");
}
