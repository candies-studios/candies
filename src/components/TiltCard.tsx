"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Subtle cursor-responsive 3D tilt with a moving highlight. Disabled for touch & reduced motion via CSS. */
export function TiltCard({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "relative transition-transform duration-500 ease-[var(--ease-out-expo)] [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
          "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-500 before:[background:radial-gradient(600px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.10),transparent_40%)] hover:before:opacity-100",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
