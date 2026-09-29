"use client";
import { useState } from "react";

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch { /* clipboard blocked: the value is still visible to copy by hand */ }
  }
  return (
    <button type="button" onClick={copy} aria-live="polite"
      className="cursor-pointer rounded-md border-[1.5px] border-brand bg-card px-3 py-[5px] font-sans text-[13px] leading-[normal] font-semibold text-brand hover:bg-brand hover:text-white">
      {done ? "Copied" : label}
    </button>
  );
}
