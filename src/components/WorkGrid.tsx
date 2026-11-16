"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { TiltCard } from "./TiltCard";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";

/** Filterable editorial portfolio grid. */
export function WorkGrid({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [active, setActive] = useState<string>("All");
  const list = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {categories.length > 1 && (
        <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                active === c ? "border-paper bg-paper text-ink" : "border-white/15 text-paper/75 hover:border-white/50",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <motion.ul layout className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              layout
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={i % 2 === 1 ? "md:mt-24" : ""}
            >
              <Link href={`/work/${p.slug}`} className="group block">
                <TiltCard className="overflow-hidden rounded-[1.75rem]">
                  <div className="relative aspect-[4/3] bg-ink-3">
                    <Image
                      src={asset(p.cover)}
                      alt={`${p.client} — ${p.title}`}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
                    />
                  </div>
                </TiltCard>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/45">
                      {p.client} · {p.industry}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{p.title}</h2>
                  </div>
                  <span className="mt-1 shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs text-paper/70">{p.category}</span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
