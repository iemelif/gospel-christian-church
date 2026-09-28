export default function ChurchProgress({ pct }: { pct: number }) {
  const h = (170 * Math.min(100, pct)) / 100;
  return (
    <svg viewBox="0 0 200 210" role="img" aria-label={`Church illustration, ${pct.toFixed(1)}% funded`}>
      <defs>
        <clipPath id="cp">
          <path d="M30 200V110L80 80V200Z" /><path d="M75 200V85L100 55L125 85V200Z" /><path d="M120 200V80L170 110V200Z" />
        </clipPath>
      </defs>
      <rect x="0" y={200 - h} width="200" height={h} clipPath="url(#cp)" fill="#e0b046" opacity=".85" />
      <g fill="none" stroke="#e0b046" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M30 200V110L80 80V200Z" /><path d="M75 200V85L100 55L125 85V200Z" /><path d="M120 200V80L170 110V200Z" />
        <path d="M100 55V22M92 32H108M20 200H180" />
      </g>
      <path d="M92 200v-28a8 8 0 0116 0v28z" fill="#16294a" />
    </svg>
  );
}
