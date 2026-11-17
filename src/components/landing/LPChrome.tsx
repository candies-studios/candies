"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";
import { cn } from "@/lib/cn";
import { EnquireButton, WhatsAppLink, WhatsAppIcon } from "./actions";
import { trackStandard, once } from "@/lib/tracking";

/** Sticky landing-page header: logo, in-page anchors, prominent enquiry CTA. */
export function LPHeader({ campaign }: { campaign: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn("transition-all duration-500", scrolled ? "py-2.5" : "py-4 sm:py-5")}>
        <div className="container-x">
          <div
            className={cn(
              "flex items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-500 sm:px-4",
              scrolled ? "border border-fg/10 bg-ink/80 shadow-[0_12px_40px_-18px_rgba(21,22,31,0.35)] backdrop-blur-xl" : "border border-transparent",
            )}
          >
            <Link href="/" aria-label="Candies Studio — main website" className="shrink-0 pl-1">
              <Logo />
            </Link>
            <nav aria-label="Page sections" className="hidden items-center gap-1 text-sm font-medium text-paper/70 lg:flex">
              {[
                ["services", "Services"],
                ["experience", "Experience"],
                ["process", "Process"],
                ["enquire", "Contact"],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="rounded-full px-3.5 py-2 transition-colors hover:bg-fg/5 hover:text-paper">
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <WhatsAppLink
                location="header"
                campaign={campaign}
                className="grid size-11 place-items-center rounded-full border border-fg/15 text-[#25D366] transition-colors hover:border-fg/40"
              />
              <span className="hidden sm:block">
                <EnquireButton location="header" campaign={campaign} className="min-h-11 px-5 py-2.5">
                  Let&apos;s Discuss Your Project
                </EnquireButton>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/** Mobile sticky CTA — hidden while the form is on screen. */
export function MobileCTA({ campaign }: { campaign: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const form = document.getElementById("enquire");
    let formVisible = false;
    const io = form
      ? new IntersectionObserver(([e]) => {
          formVisible = e.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;
    if (form && io) io.observe(form);
    function update() {
      setShow(window.scrollY > window.innerHeight * 0.6 && !formVisible);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-fg/10 bg-ink/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 sm:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-2">
        <EnquireButton location="mobile_sticky" campaign={campaign} className="flex-1">
          Let&apos;s Discuss Your Project
        </EnquireButton>
        <WhatsAppLink
          location="mobile_sticky"
          campaign={campaign}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"
        >
          <WhatsAppIcon />
          <span className="sr-only">Chat on WhatsApp</span>
        </WhatsAppLink>
      </div>
    </div>
  );
}

/** Fires Meta ViewContent once per campaign when a key section becomes visible. */
export function ViewContentTracker({ campaign, targetId }: { campaign: string; targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          once(`viewcontent:${campaign}`, () => trackStandard("ViewContent", { content_name: campaign, content_type: "landing_page" }));
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [campaign, targetId]);
  return null;
}
