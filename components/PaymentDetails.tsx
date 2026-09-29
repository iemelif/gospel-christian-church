import CopyButton from "./CopyButton";
import type { PaymentMethod } from "@/lib/config";

/**
 * Detail rows, copy button and note for one payment method. Every value comes from PAYMENT_METHODS
 * (lib/config.ts, filled from the NEXT_PUBLIC_* settings); nothing here is hard-coded.
 */
export default function PaymentDetails({ method, className }: { method: PaymentMethod; className: string }) {
  return (
    <div className={className}>
      <dl className="mt-0 mb-2">
        {method.rows.map(([rowLabel, value]) => (
          <div className="flex gap-2.5 py-[3px]" key={rowLabel}><dt className="min-w-[118px] text-mute">{rowLabel}</dt><dd className="m-0 font-semibold text-ink [word-break:break-word]">{value}</dd></div>
        ))}
      </dl>
      {method.copy && <CopyButton value={method.copy} label={method.id === "Bank transfer" ? "Copy account number" : "Copy number"} />}
      <p className="mt-2 mb-0">{method.note}</p>
    </div>
  );
}
