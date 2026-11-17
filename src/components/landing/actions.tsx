"use client";

import type { ReactNode } from "react";
import { trackCustom, trackStandard } from "@/lib/tracking";
import { whatsappLink, site } from "@/content/site";
import type { InterestId } from "@/content/landing";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "../Button";

export const SCHEDULING_URL = process.env.NEXT_PUBLIC_SCHEDULING_URL || "";

/** Scrolls to the enquiry form and (optionally) pre-selects services. */
export function goToForm(interests: InterestId[] = []) {
  window.dispatchEvent(new CustomEvent("candies:prefill", { detail: interests }));
  const el = document.getElementById("enquire");
  if (el) {
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    setTimeout(() => (document.getElementById("lf-name") as HTMLInputElement | null)?.focus({ preventScroll: true }), 700);
  }
}

const variants = {
  primary: "bg-candy text-white hover:bg-candy-deep shadow-[0_12px_30px_-12px_rgba(94,121,187,0.8)]",
  dark: "bg-paper text-ink hover:opacity-90",
  ghost: "border border-fg/20 text-paper hover:border-fg/50 hover:bg-fg/5",
  light: "bg-white text-[#15161f] hover:bg-white/90",
} as const;

export function EnquireButton({
  children,
  location,
  campaign,
  interests = [],
  variant = "primary",
  className,
  arrow = true,
}: {
  children: ReactNode;
  location: string;
  campaign: string;
  interests?: InterestId[];
  variant?: keyof typeof variants;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCustom("CTAClick", { cta: typeof children === "string" ? children : "enquire", location, campaign });
        goToForm(interests);
      }}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300",
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
}

export function ScrollLink({
  children,
  target,
  location,
  campaign,
  className,
}: {
  children: ReactNode;
  target: string;
  location: string;
  campaign: string;
  className?: string;
}) {
  return (
    <a
      href={`#${target}`}
      onClick={() => trackCustom("CTAClick", { cta: typeof children === "string" ? children : target, location, campaign })}
      className={className}
    >
      {children}
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-5", className)} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.14.31-.29.48-.14.17-.3.38-.43.5-.14.15-.29.3-.12.59.17.29.75 1.24 1.61 2 1.1.98 2.03 1.29 2.32 1.43.29.14.46.12.63-.07.17-.2.72-.84.92-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.7-.17 1.38Z" />
    </svg>
  );
}

export function WhatsAppLink({
  location,
  campaign,
  className,
  children,
}: {
  location: string;
  campaign: string;
  className?: string;
  children?: ReactNode;
}) {
  const href = whatsappLink(`Hi Candies Studio, I'd like to discuss a project.`);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackStandard("Contact", { method: "whatsapp", location, content_name: campaign })}
      className={className}
      aria-label={children ? undefined : "Chat with us on WhatsApp"}
    >
      {children ?? <WhatsAppIcon />}
    </a>
  );
}

export function EmailLink({ location, campaign, className }: { location: string; campaign: string; className?: string }) {
  return (
    <a
      href={`mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`}
      onClick={() => trackStandard("Contact", { method: "email", location, content_name: campaign })}
      className={className}
    >
      {site.email}
    </a>
  );
}

/* ── Discovery call scheduling ──────────────────────────────
   Set NEXT_PUBLIC_SCHEDULING_URL (e.g. a Calendly event link).
   Calendly links open as a popup and fire the Meta "Schedule"
   event only when a meeting is actually booked. Other links
   open in a new tab (a CTA click is tracked, not "Schedule").  */

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (o: { url: string }) => void };
  }
}

let calendlyListener = false;
function ensureCalendly(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) return resolve();
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("calendly"));
    document.head.appendChild(s);
  });
}

export async function openScheduler(campaign: string, location: string) {
  trackCustom("CTAClick", { cta: "Schedule a Discovery Call", location, campaign });
  if (!SCHEDULING_URL) return goToForm();
  if (/calendly\.com/.test(SCHEDULING_URL)) {
    if (!calendlyListener) {
      calendlyListener = true;
      window.addEventListener("message", (e) => {
        if (e.origin.includes("calendly.com") && e.data?.event === "calendly.event_scheduled") {
          trackStandard("Schedule", { content_name: campaign });
        }
      });
    }
    try {
      await ensureCalendly();
      window.Calendly?.initPopupWidget({ url: SCHEDULING_URL });
      return;
    } catch {
      /* fall through to a new tab */
    }
  }
  window.open(SCHEDULING_URL, "_blank", "noopener");
}

export function ScheduleButton({
  campaign,
  location,
  variant = "ghost",
  className,
}: {
  campaign: string;
  location: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openScheduler(campaign, location)}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300",
        variants[variant],
        className,
      )}
    >
      {SCHEDULING_URL ? "Schedule a Discovery Call" : "Request a Call Back"}
      <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
