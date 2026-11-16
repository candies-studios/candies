"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts content into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "p";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.2 : 1.1, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/**
 * Headline that reveals line by line through a mask.
 * Pass an array of lines; each line may contain JSX.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  immediate = false,
  id,
}: {
  id?: string;
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: ElementType;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: delay } } };
  const line: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.2, ease: EASE } } };

  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        variants={container}
        initial="hidden"
        {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
      >
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className={cn("block will-change-transform", lineClassName)}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Image/card that reveals through an expanding mask. */
export function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(18% 12% 18% 12% round 28px)", opacity: 0.4 }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
