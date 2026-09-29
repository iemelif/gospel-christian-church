import type { SVGProps } from "react";

/**
 * Church outline filled with gold up to `pct` %. By default it is an image with an accessible label (hero).
 * `decorative` hides it from assistive technology (used where the percentage is already given as text); it also
 * uses its own clip-path id so two illustrations on one page never share an id.
 */
export default function ChurchProgress({ pct, decorative = false }: { pct: number; decorative?: boolean }) {
  const h = (170 * Math.min(100, pct)) / 100;
  const clipId = decorative ? "cp-decorative" : "cp";
  const a11y: SVGProps<SVGSVGElement> = decorative
    ? { "aria-hidden": true, focusable: false }
    : { role: "img", "aria-label": `Church illustration, ${pct.toFixed(1)}% funded` };
  return (
    <svg className="w-full max-w-[280px]" viewBox="0 0 200 210" {...a11y}>
      <defs>
        <clipPath id={clipId}>
          <path d="M30 200V110L80 80V200Z" /><path d="M75 200V85L100 55L125 85V200Z" /><path d="M120 200V80L170 110V200Z" />
        </clipPath>
      </defs>
      <rect x="0" y={200 - h} width="200" height={h} clipPath={`url(#${clipId})`} fill="#deb942" opacity=".85" />
      <g fill="none" stroke="#deb942" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M30 200V110L80 80V200Z" /><path d="M75 200V85L100 55L125 85V200Z" /><path d="M120 200V80L170 110V200Z" />
        <path d="M100 55V22M92 32H108M20 200H180" />
      </g>
      <path d="M92 200v-28a8 8 0 0116 0v28z" fill="#7f1f36" />
    </svg>
  );
}
