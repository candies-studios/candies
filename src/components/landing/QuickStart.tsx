"use client";

import { useState } from "react";
import { interestOptions, type InterestId } from "@/content/landing";
import { trackCustom } from "@/lib/tracking";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "../Button";
import { goToForm } from "./actions";

/** Hero quick-start: pick services, then jump to the form with them pre-selected. */
export function QuickStart({ campaign }: { campaign: string }) {
  const [picked, setPicked] = useState<InterestId[]>([]);
  const toggle = (id: InterestId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="rounded-[2rem] border border-fg/10 bg-ink-2/85 p-6 shadow-[0_30px_80px_-40px_rgba(21,22,31,0.4)] backdrop-blur-xl xl:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Quick start</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">What can we help you with?</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {interestOptions
          .filter((o) => o.id !== "other")
          .map((o) => {
            const on = picked.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(o.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  on ? "border-candy bg-candy text-white" : "border-fg/15 text-paper/80 hover:border-fg/40",
                )}
              >
                {o.label}
              </button>
            );
          })}
      </div>
      <button
        type="button"
        onClick={() => {
          trackCustom("CTAClick", { cta: "Quick start", location: "hero_quickstart", campaign, services: picked.join(",") });
          goToForm(picked);
        }}
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-paper px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
      >
        {picked.length ? `Continue with ${picked.length} selected` : "Get a Creative Consultation"}
        <ArrowIcon className="transition-transform group-hover:translate-x-1" />
      </button>
      <p className="mt-3 text-center text-xs text-paper/50">Free initial consultation · No obligation</p>
    </div>
  );
}
