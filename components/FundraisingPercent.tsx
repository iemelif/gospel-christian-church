import ChurchProgress from "./ChurchProgress";
import { php } from "@/lib/config";
import { formatPercent } from "@/lib/progress";

/**
 * Share of the campaign goal raised, shown directly above the Giving Wall on the Donate page. It sits in the
 * sticky sidebar, so on wide screens it stays in view (floats) with the Giving Wall while the form scrolls.
 * `pct` must come from fundedPercent() (already capped at 100).
 *
 * Layout: [church illustration] [percentage + sentence]. The church is the ChurchProgress SVG (decorative), on
 * the left. Measured with the site font, the sentence needs ≥173px for two lines (≥312px for one) and the
 * percentage is 100px wide, so the layout adapts to the card width (container = card content width):
 * - ≥362px: one row — church (54×57px) | percentage | sentence;
 * - 268–361px (incl. the ~310px desktop sidebar): church (76×80px, about as tall as the block beside it) |
 *   percentage above the sentence, which keeps two lines instead of being squeezed onto a third;
 * - <268px (small phones, narrow tablet sidebar): the church is hidden and the original percentage | sentence row is used.
 */
export default function FundraisingPercent({ pct, goal, campaign }: { pct: number; goal: number; campaign: string }) {
  const text = formatPercent(pct);
  return (
    <div className="@container rounded-xl border border-gold bg-card px-[22px] py-4">
      <div className="flex items-center gap-4">
        <span className="hidden w-[76px] shrink-0 @min-[268px]:flex @min-[362px]:w-[54px]"><ChurchProgress pct={pct} decorative /></span>
        <div className="flex min-w-0 items-center gap-4 @min-[268px]:flex-col @min-[268px]:items-start @min-[268px]:gap-1 @min-[362px]:flex-row @min-[362px]:items-center @min-[362px]:gap-4">
          <p className="m-0 font-serif text-[36px] leading-none text-brand" aria-hidden="true">{text}%</p>
          {/* Screen readers get one full sentence; the large number above is decorative for them. */}
          <p className="m-0 text-[14px] text-mute"><span className="sr-only">{text}% </span>of the {php(goal)} {campaign} goal raised</p>
        </div>
      </div>
    </div>
  );
}
