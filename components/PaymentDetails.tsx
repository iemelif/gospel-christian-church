import Image from "next/image";
import CopyButton from "./CopyButton";
import type { PaymentMethod } from "@/lib/config";

/**
 * Detail rows, copy button and note for one payment method. Every value comes from PAYMENT_METHODS
 * (lib/config.ts, filled from the NEXT_PUBLIC_* settings); nothing here is hard-coded.
 * Methods with a QR code (GCash, Maya) show it on the left and the details on the right when the container is
 * wide enough, otherwise the QR stacks above the details.
 */
export default function PaymentDetails({ method, className }: { method: PaymentMethod; className: string }) {
  const details = (
    <>
      <dl className="mt-0 mb-2">
        {method.rows.map(([rowLabel, value]) => (
          <div className="flex gap-2.5 py-[3px]" key={rowLabel}><dt className="min-w-[118px] text-mute">{rowLabel}</dt><dd className="m-0 font-semibold text-ink [word-break:break-word]">{value}</dd></div>
        ))}
      </dl>
      {method.copy && <CopyButton value={method.copy} label={method.id === "Bank transfer" ? "Copy account number" : "Copy number"} />}
      <p className="mt-2 mb-0">{method.note}</p>
    </>
  );
  if (!method.qr) return <div className={className}>{details}</div>;

  // QR sizes keep ≥2.5 CSS px per module (both codes have ~66–70 modules): 180px beside the details when the
  // container is ≥460px, otherwise stacked above them at up to 240px (never squeezed to stay beside the text).
  // No rounded corners: the codes have almost no built-in quiet zone, so rounding would clip the corner squares;
  // the surrounding white card/gap provides the quiet zone.
  const { src, width, height, alt } = method.qr;
  return (
    <div className={`${className} @container`}>
      <div className="flex flex-col items-start gap-4 @min-[460px]:flex-row @min-[460px]:gap-5">
        <Image src={src} width={width} height={height} alt={alt} unoptimized className="block h-auto w-full max-w-[240px] shrink-0 @min-[460px]:w-[180px]" />
        <div className="min-w-0 flex-1">{details}</div>
      </div>
    </div>
  );
}
