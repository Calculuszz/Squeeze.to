"use client";

import { FormEvent, useState } from "react";
import MascotAvatar from "./MascotAvatar";
import { getStats } from "@/lib/api";

interface StatsViewProps {}

interface StatsResult {
  found: boolean;
  clicks?: number;
  url?: string;
  code?: string;
}

export default function StatsView({}: StatsViewProps) {
  const [statsCode, setStatsCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const code = statsCode.trim().replace(/^.*\//, "");
    if (!code) {
      setSearched(true);
      setResult({ found: false });
      return;
    }

    setLoading(true);
    try {
      const data = await getStats(code);
      setSearched(true);
      setResult({
        found: true,
        clicks: data.clickCount,
        url: data.longUrl,
        code: data.shortCode,
      });
    } catch {
      setSearched(true);
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px]">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,46px)] leading-none tracking-tight mb-3.5">
          How&apos;s that link doing?
        </h1>
        <p className="text-[17px] leading-relaxed text-muted max-w-[38ch] mx-auto">
          Enter a short code and see the clicks roll in.
        </p>
      </div>

      {/* Lookup form */}
      <form onSubmit={handleLookup} className="w-full">
        <div
          className="flex items-center gap-2 w-full bg-input-bg rounded-2xl"
          style={{
            padding: "12px 10px 12px 18px",
            boxShadow: "inset 0 0 0 1.5px rgba(237,232,223,0.13)",
          }}
        >
          <span className="font-mono text-[15px] text-faint flex-shrink-0">
            squeeze.to/
          </span>
          <input
            value={statsCode}
            onChange={(e) => setStatsCode(e.target.value)}
            type="text"
            autoComplete="off"
            spellCheck={false}
            aria-label="Short code"
            placeholder="a4Bk9"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-mesh font-mono text-[15px] px-0.5"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 border-none cursor-pointer text-white font-body text-[14.5px] font-semibold py-3 px-[22px] rounded-[11px] bg-cobalt active:scale-95 transition-transform disabled:opacity-60"
            style={{
              boxShadow: "0 10px 26px -10px rgba(47,67,206,0.95)",
            }}
          >
            {loading ? "..." : "Look up"}
          </button>
        </div>
      </form>

      {/* Results */}
      {result?.found && (
        <div className="mt-10 flex flex-col items-center text-center animate-riseup">
          <div
            className="font-display font-extrabold text-[clamp(88px,16vw,150px)] leading-[0.82] tracking-tighter"
            style={{
              background: "linear-gradient(180deg, #EDE8DF, #B9C2FF)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {result.clicks?.toLocaleString()}
          </div>
          <div className="font-mono text-xs tracking-[0.24em] uppercase text-dim mt-3.5">
            total clicks
          </div>
          <div className="mt-[22px] font-mono text-[13.5px] text-faint max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis">
            squeeze.to/{result.code} → {result.url}
          </div>
        </div>
      )}

      {searched && result && !result.found && (
        <div
          className="mt-9 flex items-center gap-3.5 justify-center bg-clay rounded-2xl animate-riseup"
          style={{
            padding: "16px 20px 16px 14px",
            boxShadow: "inset 0 0 0 1px rgba(237,232,223,0.08)",
          }}
        >
          <MascotAvatar variant="neutral" size={46} />
          <span className="text-[15px] text-left leading-[1.45]" style={{ color: "#C9BFB4" }}>
            No link with that code yet. Shorten one first, then track it here.
          </span>
        </div>
      )}
    </div>
  );
}
