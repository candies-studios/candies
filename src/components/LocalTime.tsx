"use client";

import { useEffect, useState } from "react";

/** Live local time for an office (renders nothing until mounted to avoid hydration mismatch). */
export function LocalTime({ timeZone }: { timeZone?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    if (!timeZone) return;
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  if (!now) return <span className="h-4" />;
  return (
    <span className="inline-flex items-center gap-2 text-xs tabular-nums text-paper/55">
      <span className="size-1.5 rounded-full bg-mint motion-safe:animate-pulse" />
      {now} local
    </span>
  );
}
