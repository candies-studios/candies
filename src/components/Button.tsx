import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "light" | "ghost" | "outline-dark";

const styles: Record<Variant, string> = {
  primary: "bg-candy text-white hover:bg-candy-deep",
  light: "bg-paper text-ink hover:bg-white",
  ghost: "border border-white/25 text-paper hover:border-white/60 hover:bg-white/5",
  "outline-dark": "border border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/5",
};

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-4", className)}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean } & Omit<ComponentProps<typeof Link>, "href">) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = cn(
    "group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-[var(--ease-out-expo)] sm:px-7 sm:py-4",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="relative grid size-5 place-items-center overflow-hidden">
          <ArrowIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-5" />
          <ArrowIcon className="absolute -translate-x-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
