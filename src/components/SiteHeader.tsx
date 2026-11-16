"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/content/site";
import { Logo } from "./Logo";
import { ArrowIcon } from "./Button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // hide on fast scroll down, show on scroll up
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "container-x flex items-center justify-between transition-all duration-700 ease-[var(--ease-out-expo)]",
            scrolled ? "py-3" : "py-5 sm:py-7",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between rounded-full transition-all duration-700 ease-[var(--ease-out-expo)]",
              scrolled && !open
                ? "border border-white/10 bg-ink/70 px-4 py-2.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-5"
                : "border border-transparent px-0 py-0",
            )}
          >
            <Link href="/" aria-label="Candies Studio — home" className="relative z-10 text-paper">
              <Logo />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-[0.82rem] font-medium tracking-wide transition-colors duration-300",
                        isActive(item.href) ? "text-paper" : "text-paper/65 hover:text-paper",
                      )}
                    >
                      {isActive(item.href) && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-0 rounded-full bg-white/10"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="group hidden items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[0.82rem] font-semibold text-ink transition-colors hover:bg-white sm:inline-flex"
              >
                Start a Project
                <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative z-10 grid size-11 place-items-center rounded-full border border-white/20 text-paper lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500",
                      open ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500",
                      open ? "top-1.5 -rotate-45" : "top-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
          >
            <div className="pointer-events-none absolute -right-24 top-1/3 size-80 rounded-full bg-candy/30 blur-[100px]" />
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-24">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "display flex items-baseline gap-4 py-1.5 text-[clamp(2.2rem,11vw,4rem)]",
                        isActive(item.href) ? "text-paper" : "text-paper/50",
                      )}
                    >
                      <span className="font-sans text-xs font-medium tracking-widest text-candy-soft">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-paper/70">
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
              <Link href="/contact" className="rounded-full bg-candy px-5 py-2.5 font-semibold text-white">
                Start a Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
