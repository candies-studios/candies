"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { interestOptions } from "@/content/landing";
import { THANKS_KEY, type ThanksPayload } from "@/lib/lead";
import { once, trackStandard } from "@/lib/tracking";
import { site } from "@/content/site";
import { Logo } from "../Logo";
import { ScheduleButton, WhatsAppLink, EmailLink, SCHEDULING_URL } from "./actions";

/**
 * Thank-you page shown after a successful enquiry.
 * Fires Meta "Lead" exactly once per submission, using the same event ID the
 * server sent to the Conversions API, so Meta deduplicates the two.
 * Visiting the URL directly (no submission) shows the page but fires nothing.
 */
export function ThankYou() {
  const [data, setData] = useState<ThanksPayload | null>(null);

  useEffect(() => {
    let p: ThanksPayload | null = null;
    try {
      p = JSON.parse(sessionStorage.getItem(THANKS_KEY) || "null");
    } catch {}
    setData(p);
    if (p?.eventId) {
      once(p.eventId, () =>
        trackStandard(
          "Lead",
          { content_name: p!.campaign, content_category: p!.interests.join(","), currency: p!.country === "India" ? "INR" : "USD", value: 0 },
          p!.eventId,
        ),
      );
    }
  }, []);

  const services = (data?.interests || []).map((i) => interestOptions.find((o) => o.id === i)?.label || i);
  const campaign = data?.campaign || "thank_you";

  return (
    <div className="min-h-[100svh] bg-ink text-paper">
      <header className="container-x py-5">
        <Link href="/" aria-label="Candies Studio — main website">
          <Logo />
        </Link>
      </header>

      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 size-[32rem] rounded-full bg-candy/20 blur-[120px]" />
          <div className="absolute -left-32 bottom-0 size-[26rem] rounded-full bg-mint/10 blur-[120px]" />
        </div>
        <div className="container-x max-w-3xl pb-24 pt-10 text-center sm:pt-16">
          <span aria-hidden className="mx-auto grid size-20 place-items-center rounded-full bg-mint text-white shadow-[0_20px_50px_-20px_rgba(52,185,138,0.9)]">
            <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h1 className="display mt-8 text-[clamp(2.2rem,7vw,4.4rem)]">
            Thank you{data?.firstName ? `, ${data.firstName}` : ""}. <span className="serif-accent text-candy-deep">We&apos;ve got it.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">
            Your enquiry has been received
            {data?.reference && (
              <>
                {" "}
                — reference <strong className="font-semibold text-paper">{data.reference}</strong>
              </>
            )}
            . Our team will review it and get back to you shortly.
          </p>
          {services.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {services.map((s) => (
                <li key={s} className="rounded-full border border-fg/15 bg-ink-2 px-4 py-1.5 text-sm font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          )}

          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-fg/10 bg-ink-2 p-6 text-left sm:p-8">
            <p className="font-semibold">What happens next</p>
            <ol className="mt-4 space-y-4">
              {[
                ["1", "We review your requirement", "and prepare a few questions."],
                ["2", "A short discovery call", "to understand your goals."],
                ["3", "A tailored proposal", "with scope, timeline and investment."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-candy text-sm font-semibold text-white">{n}</span>
                  <span className="pt-1 text-paper/75">
                    <strong className="text-paper">{t}</strong> {d}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            {SCHEDULING_URL && <ScheduleButton campaign={campaign} location="thank_you" variant="primary" />}
            <WhatsAppLink
              location="thank_you"
              campaign={campaign}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-fg/20 px-6 text-sm font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-[#25D366]">●</span> Message us on WhatsApp
              </span>
            </WhatsAppLink>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-fg/20 px-6 text-sm font-semibold hover:border-fg/50">
              Visit our website
            </Link>
          </div>
          <p className="mt-8 text-sm text-paper/55">
            Questions in the meantime? <EmailLink location="thank_you" campaign={campaign} className="font-semibold text-paper underline underline-offset-2" />
          </p>
        </div>
      </section>

      <footer className="container-x border-t border-fg/10 py-6 text-xs text-paper/50">
        © {new Date().getFullYear()} {site.name}. ·{" "}
        <Link href="/privacy/" className="hover:text-paper">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
