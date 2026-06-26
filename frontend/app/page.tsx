"use client";

import { useState, useCallback, useRef } from "react";
import Logo from "./components/Logo";
import TabNav from "./components/TabNav";
import MascotAvatar from "./components/MascotAvatar";
import ShortenForm from "./components/ShortenForm";
import SqueezeAnimation from "./components/SqueezeAnimation";
import ResultCard from "./components/ResultCard";
import StatsView from "./components/StatsView";
import { shortenUrl } from "@/lib/api";

type View = "home" | "stats";
type Phase = "idle" | "squeeze" | "result";

function normalizeUrl(raw: string): string | null {
  let v = (raw || "").trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  try {
    const u = new URL(v);
    if (!u.hostname.includes(".") || u.hostname.length < 3) return null;
    return u.href;
  } catch {
    return null;
  }
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [longUrlDisplay, setLongUrlDisplay] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  const squeezeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    setHasError(false);
  }, []);

  const isValid = normalizeUrl(url) !== null;

  const handleSubmit = useCallback(async () => {
    if (phase === "squeeze" || loading) return;

    const norm = normalizeUrl(url);
    if (!norm) {
      setHasError(true);
      setErrorMsg(
        url.trim()
          ? "That doesn't look like a web address yet. Try one starting with a site name, like example.com/page."
          : "Drop a link in first — anything from example.com to a long, messy URL."
      );
      return;
    }

    setHasError(false);
    setLongUrlDisplay(norm);
    setLoading(true);

    try {
      const result = await shortenUrl(norm);
      setShortCode(result.shortCode);

      // Check reduced motion preference
      const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        setPhase("result");
      } else {
        setPhase("squeeze");
        if (squeezeTimer.current) clearTimeout(squeezeTimer.current);
        squeezeTimer.current = setTimeout(() => setPhase("result"), 500);
      }
    } catch (err) {
      setHasError(true);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [url, phase, loading]);

  const handleReset = useCallback(() => {
    if (squeezeTimer.current) clearTimeout(squeezeTimer.current);
    setPhase("idle");
    setUrl("");
    setHasError(false);
  }, []);

  return (
    <div
      className="font-body text-mesh relative flex flex-col overflow-x-hidden min-h-screen"
      style={{
        background: "#1E1714",
        backgroundImage:
          "radial-gradient(1200px 680px at 50% -12%, rgba(47,67,206,0.20), transparent 62%)",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-[34px] py-[26px] flex-shrink-0 relative z-10">
        <Logo onClick={() => { setView("home"); handleReset(); }} />
        <TabNav active={view} onChange={(v) => { setView(v); if (v === "home") handleReset(); }} />
      </header>

      {/* HOME VIEW */}
      {view === "home" && (
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-5 text-center relative z-[2]">
          {/* Mascot */}
          <div
            className="w-24 h-24 rounded-3xl overflow-hidden bg-mascot-bg mb-[30px] animate-floaty"
            style={{
              boxShadow:
                "0 22px 50px -20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(237,232,223,0.08)",
            }}
          >
            <MascotAvatar variant="smile" size={96} />
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-[clamp(38px,6.2vw,62px)] leading-[0.98] tracking-tight max-w-[13ch] mb-[18px]">
            Paste a long link, get a short one.
          </h1>
          <p className="text-[clamp(16px,2.2vw,19px)] leading-normal text-muted max-w-[42ch] mb-11">
            One field, one button. No sign-up, no detour — your link is ready
            the second you hit shorten.
          </p>

          {/* Stage */}
          <div className="w-full max-w-[600px] min-h-[140px] flex flex-col items-center">
            {phase === "idle" && (
              <ShortenForm
                url={url}
                onUrlChange={handleUrlChange}
                onSubmit={handleSubmit}
                isValid={isValid}
                hasError={hasError}
                errorMsg={errorMsg}
              />
            )}

            {phase === "squeeze" && (
              <SqueezeAnimation
                longUrl={longUrlDisplay}
                shortCode={shortCode}
              />
            )}

            {phase === "result" && (
              <ResultCard shortCode={shortCode} onReset={handleReset} />
            )}
          </div>
        </main>
      )}

      {/* STATS VIEW */}
      {view === "stats" && (
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-5 relative z-[2] w-full">
          <StatsView />
        </main>
      )}
    </div>
  );
}
