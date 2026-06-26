"use client";

import { FormEvent } from "react";
import MascotAvatar from "./MascotAvatar";

interface ShortenFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  hasError: boolean;
  errorMsg: string;
}

export default function ShortenForm({
  url,
  onUrlChange,
  onSubmit,
  isValid,
  hasError,
  errorMsg,
}: ShortenFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="flex items-center gap-2.5 w-full bg-input-bg rounded-2xl transition-shadow duration-200"
          style={{
            padding: "10px 10px 10px 18px",
            boxShadow: hasError
              ? "inset 0 0 0 1.5px rgba(230,181,142,0.5)"
              : "inset 0 0 0 1.5px rgba(237,232,223,0.13)",
          }}
        >
          <input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            aria-label="Long URL"
            placeholder="Paste a long URL…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-mesh font-mono text-[15px] px-1"
          />
          <button
            type="submit"
            className="flex-shrink-0 border-none cursor-pointer text-white font-body text-[15px] font-semibold py-[13px] px-6 rounded-[11px] transition-all duration-200 active:scale-95"
            style={{
              background: isValid ? "#2F43CE" : "#39424F",
              boxShadow: isValid
                ? "0 10px 26px -10px rgba(47,67,206,0.95)"
                : "none",
            }}
          >
            Shorten
          </button>
        </div>
      </form>

      {hasError && (
        <div
          className="flex items-center gap-3 mt-[18px] bg-clay rounded-[14px] animate-riseup"
          style={{
            padding: "12px 16px 12px 12px",
            boxShadow: "inset 0 0 0 1px rgba(230,181,142,0.22)",
          }}
        >
          <MascotAvatar variant="neutral" size={38} />
          <span className="text-[14.5px] text-left leading-[1.4]" style={{ color: "#E6CDBA" }}>
            {errorMsg}
          </span>
        </div>
      )}

      {!hasError && (
        <div className="mt-[18px] font-mono text-[12.5px] tracking-[0.04em] text-faint">
          paste → shorten → copy · press Enter to go
        </div>
      )}
    </div>
  );
}
