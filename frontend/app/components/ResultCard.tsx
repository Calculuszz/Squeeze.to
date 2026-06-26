"use client";

import { useState, useCallback } from "react";
import MascotAvatar from "./MascotAvatar";

interface ResultCardProps {
  shortCode: string;
  onReset: () => void;
}

export default function ResultCard({ shortCode, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const txt = `squeeze.to/${shortCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [shortCode]);

  return (
    <div className="w-full flex flex-col items-center animate-riseup">
      <div
        className="flex items-center gap-4 bg-clay rounded-[18px] max-w-full"
        style={{
          padding: "14px 14px 14px 18px",
          boxShadow:
            "0 20px 50px -22px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(237,232,223,0.09)",
        }}
      >
        <MascotAvatar variant="smile" size={52} className="animate-popin" />

        <span className="font-mono text-[clamp(20px,3.4vw,27px)] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          squeeze.to/<span className="text-code-blue">{shortCode}</span>
        </span>

        <button
          onClick={handleCopy}
          className="flex-shrink-0 border-none cursor-pointer font-body text-sm font-semibold py-[11px] px-[18px] rounded-[11px] transition-all duration-250 active:scale-95"
          style={{
            background: copied ? "#2B4A33" : "#2F43CE",
            color: copied ? "#9FE6B4" : "#fff",
            boxShadow: copied
              ? "none"
              : "0 8px 20px -10px rgba(47,67,206,0.9)",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="mt-[22px] bg-transparent border-none cursor-pointer text-dim font-body text-[14.5px] font-medium p-2 px-3 rounded-[10px] hover:text-mesh hover:bg-input-bg transition-colors duration-200"
      >
        Shorten another link
      </button>
    </div>
  );
}
