"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";

/**
 * The official Candies Studio logo (candy ball + "CANDIES" wordmark).
 * Files are produced by `npm run assets:pull`:
 *   1. candies-logo-web.png   – trimmed, 1200px wide (sharp, retina-crisp)
 *   2. candies-logo-small.png – original 221×50 from the old site
 * If neither file exists, a typeset fallback is drawn so the header never breaks.
 */
const SOURCES = ["/media/brand/candies-logo-web.png", "/media/brand/candies-logo-small.png"];

export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLImageElement>(null);

  // Catch load errors that happened before hydration
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setIdx((i) => i + 1);
  }, [idx]);

  const h = size === "lg" ? "h-9 sm:h-11" : "h-7 sm:h-8";

  if (idx < SOURCES.length) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={SOURCES[idx]}
          ref={ref}
          src={asset(SOURCES[idx])}
          alt="Candies Studio"
          width={1200}
          height={163}
          className={cn("block w-auto select-none", h)}
          onError={() => setIdx((i) => i + 1)}
          draggable={false}
        />
      </span>
    );
  }

  // Fallback lockup (only if the logo files are missing)
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className={cn("candy-stripe block aspect-square rounded-full", h)} />
      <span className={cn("display flex items-center italic text-candy", size === "lg" ? "text-[2rem]" : "text-[1.55rem]")}>Candies</span>
      <span className="sr-only">Candies Studio</span>
    </span>
  );
}
