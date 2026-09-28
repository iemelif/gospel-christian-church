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
    <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
      {done ? "Copied" : label}
    </button>
  );
}
