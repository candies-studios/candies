"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Theme = "dark" | "bright";

/** Small footer switch to compare the original (dark) and bright themes. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || "dark");
  }, []);

  const apply = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("candies-theme", t);
    } catch {}
    setTheme(t);
  };

  return (
    <div role="group" aria-label="Colour theme" className="inline-flex rounded-full border border-fg/15 p-1 text-xs">
      {(["bright", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => apply(t)}
          className={cn(
            "rounded-full px-3 py-1.5 font-semibold capitalize tracking-wide transition-colors",
            theme === t ? "bg-paper text-ink" : "text-paper/60 hover:text-paper",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
