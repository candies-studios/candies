"use client";

import { useState } from "react";
import { interestOptions, type InterestId } from "@/content/landing";
import { trackCustom } from "@/lib/tracking";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "../Button";
import { goToForm } from "./actions";

/**
 * Optional quick-start chips (not currently used on the page — the full
 * enquiry form sits in the hero instead). Kept for future campaign layouts.
 */
export function QuickStart({ campaign }: { campaign: string }) {
  const [picked, setPicked] = useState<InterestId[]>([]);
  const toggle = (id: InterestId) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="rounded-[2rem] border border-fg/10 bg-ink-2/85 p-6 backdrop-blur-xl">
      <p className="text-xl font-semibold tracking-tight">What can we help you with?</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {interestOptions.map((o) => {
          const on = picked.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.id)}
              className={cn("rounded-full border px-4 py-2 text-sm font-medium", on ? "border-candy bg-candy text-white" : "border-fg/15")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => {
          trackCustom("CTAClick", { cta: "Quick start", location: "quickstart", campaign });
          goToForm(picked);
        }}
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-paper px-6 text-sm font-semibold text-ink"
      >
        Continue
        <ArrowIcon />
      </button>
    </div>
  );
}
