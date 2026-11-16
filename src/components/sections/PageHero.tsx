import type { ReactNode } from "react";
import { Reveal, SplitLines } from "../motion";
import { cn } from "@/lib/cn";

/** Cinematic hero for inner pages. */
export function PageHero({
  eyebrow,
  lines,
  intro,
  children,
  accent = "#5e79bb",
  className,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro?: ReactNode;
  children?: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-ink pb-20 pt-40 text-paper grain sm:pb-28 sm:pt-48 lg:pt-56", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -right-32 -top-32 size-[38rem] rounded-full opacity-40 blur-[120px]"
          style={{ background: accent }}
        />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {/* floating dimensional rings */}
        <div className="absolute right-[6%] top-[28%] hidden aspect-square w-[22vw] max-w-[340px] rounded-full border border-white/10 lg:block [transform:rotateX(68deg)_rotateZ(20deg)] motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute right-[10%] top-[34%] hidden aspect-square w-[14vw] max-w-[220px] rounded-full border border-white/15 lg:block [transform:rotateX(70deg)_rotateY(-20deg)] motion-safe:animate-[spin_28s_linear_infinite_reverse]" />
      </div>
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-candy-soft">{eyebrow}</p>
        </Reveal>
        <SplitLines as="h1" immediate delay={0.1} lines={lines} className="display display-lg mt-8 max-w-[18ch]" />
        {intro && (
          <Reveal delay={0.45} className="mt-10 max-w-2xl">
            <div className="lede text-paper/70">{intro}</div>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
