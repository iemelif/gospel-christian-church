import { php } from "@/lib/config";
import { formatPercent } from "@/lib/progress";

/**
 * Share of the campaign goal raised, shown directly above the Giving Wall on the Donate page. It sits in the
 * sticky sidebar, so on wide screens it stays in view (floats) with the Giving Wall while the form scrolls.
 * `pct` must come from fundedPercent() (already capped at 100).
 */
export default function FundraisingPercent({ pct, goal, campaign }: { pct: number; goal: number; campaign: string }) {
  const text = formatPercent(pct);
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gold bg-card px-[22px] py-4">
      <p className="m-0 font-serif text-[36px] leading-none text-brand" aria-hidden="true">{text}%</p>
      {/* Screen readers get one full sentence; the large number above is decorative for them. */}
      <p className="m-0 text-[14px] text-mute"><span className="sr-only">{text}% </span>of the {php(goal)} {campaign} goal raised</p>
    </div>
  );
}
