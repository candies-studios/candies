"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const CandyScene = dynamic(() => import("./CandyScene"), { ssr: false });

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/**
 * Static fallback — pure CSS candy forms. Shown for reduced-motion users,
 * devices without WebGL, Save-Data connections, and while the 3D loads.
 */
export function StaticCandies({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute right-[8%] top-[22%] aspect-square w-[34vw] max-w-[520px] min-w-[220px] rounded-full shadow-[inset_-30px_-40px_80px_rgba(0,0,0,0.45),inset_20px_20px_60px_rgba(255,255,255,0.35)] candy-stripe" />
      <div className="absolute right-[4%] top-[12%] aspect-square w-[9vw] max-w-[140px] min-w-[60px] rounded-full bg-candy shadow-[inset_-12px_-16px_30px_rgba(0,0,0,0.4),inset_8px_8px_20px_rgba(255,255,255,0.35)]" />
      <div className="absolute right-[38%] top-[16%] aspect-square w-[4vw] max-w-[64px] min-w-[28px] rounded-full bg-berry shadow-[inset_-6px_-8px_16px_rgba(0,0,0,0.35),inset_4px_4px_10px_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-[16%] right-[30%] aspect-square w-[3vw] max-w-[48px] min-w-[22px] rounded-full bg-mint shadow-[inset_-6px_-8px_16px_rgba(0,0,0,0.35),inset_4px_4px_10px_rgba(255,255,255,0.4)]" />
    </div>
  );
}

export function HeroVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setCompact(window.innerWidth < 1024);
    setMode(!reduce && !saveData && canUseWebGL() ? "3d" : "static");

    const onResize = () => setCompact(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Pause rendering when the hero is off-screen
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (mode !== "3d") return;
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <StaticCandies
        className={cn("transition-opacity duration-1000", mode === "3d" && ready ? "opacity-0" : compact ? "opacity-60" : "opacity-100")}
      />
      {mode === "3d" && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1600ms]", ready ? "opacity-100" : "opacity-0")}>
          <CandyScene compact={compact} paused={!visible} />
        </div>
      )}
    </div>
  );
}
