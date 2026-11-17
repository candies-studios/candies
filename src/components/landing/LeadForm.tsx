"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { budgetOptions, countryOptions, interestOptions, timelineOptions, type InterestId } from "@/content/landing";
import { currencyFor, emptyLead, validateStep, type LeadErrors, type LeadInput } from "@/lib/lead";
import { getAttribution, getConsent, getCookie, newEventId, once, trackCustom, trackStandard } from "@/lib/tracking";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "../Button";
import { EmailLink, ScheduleButton, WhatsAppLink } from "./actions";

/* ── Configuration (environment variables — no secrets here) ──
   NEXT_PUBLIC_LEAD_ENDPOINT        Supabase Edge Function URL (recommended)
   NEXT_PUBLIC_SUPABASE_ANON_KEY    Supabase public anon key (safe to expose)
   NEXT_PUBLIC_FORM_ENDPOINT        Fallback: Formspree / Web3Forms URL
   NEXT_PUBLIC_FORM_ACCESS_KEY      Fallback: Web3Forms public access key
   NEXT_PUBLIC_TURNSTILE_SITE_KEY   Optional Cloudflare Turnstile          */
const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
const FORM_ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY || "";
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

const STEPS = ["Contact details", "Requirement", "Project"] as const;

type Status =
  | { kind: "editing" }
  | { kind: "sending" }
  | { kind: "error"; message: string }
  | { kind: "success"; reference: string; firstName: string };

export function LeadForm({ campaign, preselect = [] }: { campaign: string; preselect?: InterestId[] }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [v, setV] = useState<LeadInput>({ ...emptyLead, interests: [...preselect] });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  const [token, setToken] = useState("");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);
  const topRef = useRef<HTMLDivElement>(null);
  const eventId = useRef("");

  useEffect(() => {
    startedAt.current = Date.now();
    const onPrefill = (e: Event) => {
      const ids = (e as CustomEvent<InterestId[]>).detail || [];
      if (!ids.length) return;
      setV((cur) => ({ ...cur, interests: Array.from(new Set([...cur.interests, ...ids])) }));
    };
    window.addEventListener("candies:prefill", onPrefill);
    return () => window.removeEventListener("candies:prefill", onPrefill);
  }, []);

  // Turnstile renders on the final step
  useEffect(() => {
    if (!TURNSTILE_KEY || step !== 2 || !tsRef.current || !window.turnstile || tsId.current) return;
    tsId.current = window.turnstile.render(tsRef.current, {
      sitekey: TURNSTILE_KEY,
      theme: "light",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
    });
  }, [step, status]);

  const set = <K extends keyof LeadInput>(k: K, value: LeadInput[K]) => {
    once(`form-start:${campaign}`, () => trackCustom("FormStart", { campaign }));
    setV((cur) => ({ ...cur, [k]: value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleInterest = (id: string) =>
    set("interests", v.interests.includes(id) ? v.interests.filter((i) => i !== id) : [...v.interests, id]);

  const focusFirstError = (errs: LeadErrors) => {
    const k = Object.keys(errs)[0];
    if (k) requestAnimationFrame(() => (document.getElementById(`lf-${k}`) as HTMLElement | null)?.focus());
  };

  const next = () => {
    const errs = validateStep(step, v);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    trackCustom("FormStep", { campaign, step: step + 2 });
    setStep((s) => s + 1);
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  };

  // Budget options follow the selected country's currency
  const currency = currencyFor(v.country);
  useEffect(() => {
    if (v.budget && !(budgetOptions[currency] as readonly string[]).includes(v.budget)) setV((cur) => ({ ...cur, budget: "" }));
  }, [currency, v.budget]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) return next();
    const errs = validateStep(2, v);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    if (TURNSTILE_KEY && !token) {
      setStatus({ kind: "error", message: "Please complete the security check above the button." });
      return;
    }
    if (honeypot.current?.value) return; // bot
    if (Date.now() - startedAt.current < 4000) {
      setStatus({ kind: "error", message: "That was quick! Please review your details and submit again." });
      return;
    }

    if (!eventId.current) eventId.current = newEventId("lead");
    const attribution = getAttribution();
    const pageUrl = window.location.href.split("#")[0];
    const lead = {
      ...v,
      name: v.name.trim(),
      email: v.email.trim().toLowerCase(),
      phone: v.phone.trim(),
      company: v.company.trim(),
      designation: v.designation.trim(),
      message: v.message.trim(),
    };

    setStatus({ kind: "sending" });
    try {
      let reference = "";
      if (LEAD_ENDPOINT) {
        const res = await fetch(LEAD_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(SUPABASE_ANON ? { Authorization: `Bearer ${SUPABASE_ANON}`, apikey: SUPABASE_ANON } : {}),
          },
          body: JSON.stringify({
            lead,
            campaign,
            event_id: eventId.current,
            page_url: pageUrl,
            attribution,
            fbp: getCookie("_fbp"),
            fbc: getCookie("_fbc"),
            tracking_consent: getConsent() === "granted",
            website: honeypot.current?.value || "",
            started_at: startedAt.current,
            turnstile_token: token,
          }),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "We couldn't submit your enquiry.");
        reference = json.reference || "";
      } else if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...(FORM_ACCESS_KEY ? { access_key: FORM_ACCESS_KEY } : {}),
            subject: `New lead — ${lead.company} (${lead.interests.join(", ")})`,
            _subject: `New lead — ${lead.company} (${lead.interests.join(", ")})`,
            from_name: "Candies Studio landing page",
            replyto: lead.email,
            _replyto: lead.email,
            ...lead,
            interests: lead.interests.map((i) => interestOptions.find((o) => o.id === i)?.label || i).join(", "),
            consent: "Yes",
            campaign,
            page_url: pageUrl,
            utm_source: attribution.last.utm_source || "",
            utm_medium: attribution.last.utm_medium || "",
            utm_campaign: attribution.last.utm_campaign || "",
            utm_content: attribution.last.utm_content || "",
            utm_term: attribution.last.utm_term || "",
            meta_campaign_id: attribution.last.campaign_id || "",
            meta_adset_id: attribution.last.adset_id || "",
            meta_ad_id: attribution.last.ad_id || "",
            event_id: eventId.current,
          }),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; success?: boolean | string };
        if (!res.ok || json.success === false || json.success === "false") throw new Error("We couldn't submit your enquiry.");
      } else {
        throw new Error(`Our online form isn't connected yet. Please email us at ${site.email}.`);
      }

      // ✅ Conversion only after a confirmed submission — once per lead (dedup with CAPI via eventID)
      once(eventId.current, () =>
        trackStandard(
          "Lead",
          { content_name: campaign, content_category: lead.interests.join(","), currency: currency, value: 0 },
          eventId.current,
        ),
      );
      setStatus({ kind: "success", reference, firstName: lead.name.split(" ")[0] });
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error && err.message !== "Failed to fetch"
            ? err.message
            : `Network error — please check your connection and try again, or email us at ${site.email}.`,
      });
      if (TURNSTILE_KEY) {
        window.turnstile?.reset(tsId.current);
        setToken("");
      }
    }
  }

  /* ── UI helpers ── */
  const fieldCls = (k: keyof LeadInput) =>
    cn(
      "peer block w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-[16px] text-[#15161f] outline-none transition-colors placeholder:text-transparent focus:border-candy focus:ring-4 focus:ring-candy/15",
      errors[k] ? "border-berry" : "border-[#15161f]/12",
    );
  const labelCls = "pointer-events-none absolute left-4 top-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#15161f]/55";
  const Err = ({ k }: { k: keyof LeadInput }) =>
    errors[k] ? (
      <p id={`lf-${k}-err`} className="mt-1.5 text-xs font-medium text-berry">
        {errors[k]}
      </p>
    ) : null;

  const input = (k: "name" | "email" | "phone" | "company" | "designation", label: string, type = "text", auto?: string, optional = false, hint?: string) => (
    <div className="relative">
      <input
        id={`lf-${k}`}
        name={k}
        type={type}
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        autoComplete={auto}
        inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
        placeholder={hint || label}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `lf-${k}-err` : undefined}
        required={!optional}
        className={fieldCls(k)}
      />
      <label htmlFor={`lf-${k}`} className={labelCls}>
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal opacity-70">(optional)</span>}
      </label>
      <Err k={k} />
    </div>
  );

  const select = (k: "country" | "budget" | "timeline", label: string, options: readonly string[]) => (
    <div className="relative">
      <select
        id={`lf-${k}`}
        name={k}
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `lf-${k}-err` : undefined}
        required
        className={cn(fieldCls(k), "appearance-none pr-10", !v[k] && "text-[#15161f]/45")}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <label htmlFor={`lf-${k}`} className={labelCls}>
        {label}
      </label>
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-[1.6rem] size-4 text-[#15161f]/50">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <Err k={k} />
    </div>
  );

  /* ── Success ── */
  if (status.kind === "success") {
    return (
      <div ref={topRef} role="status" tabIndex={-1} className="scroll-mt-28 rounded-[2rem] border border-[#15161f]/10 bg-white p-7 text-[#15161f] shadow-[0_30px_80px_-40px_rgba(21,22,31,0.35)] sm:p-10">
        <span aria-hidden className="candy-stripe block size-14 rounded-full" />
        <h3 className="display mt-7 text-[clamp(1.6rem,4vw,2.4rem)]">Thank you, {status.firstName}.</h3>
        <p className="mt-4 text-[#15161f]/70">
          Your enquiry has been received
          {status.reference && (
            <>
              {" "}
              — reference <strong className="font-semibold text-[#15161f]">{status.reference}</strong>
            </>
          )}
          . Our team will review your requirement and get in touch with you shortly.
        </p>
        <div className="mt-7 rounded-2xl bg-[#eef1f9] p-5 text-sm">
          <p className="font-semibold">What happens next</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-[#15161f]/70">
            <li>We review your requirement and prepare questions.</li>
            <li>A short discovery call to understand your goals.</li>
            <li>A tailored proposal with scope, timeline and investment.</li>
          </ol>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ScheduleButton campaign={campaign} location="form_success" variant="primary" />
          <WhatsAppLink location="form_success" campaign={campaign} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#15161f]/15 px-6 text-sm font-semibold">
            <span className="inline-flex items-center gap-2">
              <span className="text-[#25D366]">●</span> Message us on WhatsApp
            </span>
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div ref={topRef} className="scroll-mt-28 rounded-[2rem] border border-[#15161f]/10 bg-white p-5 text-[#15161f] shadow-[0_30px_80px_-40px_rgba(21,22,31,0.35)] sm:p-8">
      {TURNSTILE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
          onReady={() => setStatus((s) => ({ ...s }))}
        />
      )}

      {/* Progress */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Form progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <span className={cn("block h-1.5 rounded-full transition-colors duration-500", i <= step ? "bg-candy" : "bg-[#15161f]/10")} />
            <span className={cn("mt-2 block text-[0.7rem] font-semibold uppercase tracking-[0.12em]", i === step ? "text-[#15161f]" : "text-[#15161f]/45")}>
              <span className="sm:hidden">Step {i + 1}</span>
              <span className="hidden sm:inline">
                {i + 1}. {label}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <form noValidate onSubmit={submit} className="mt-6" aria-label="Project enquiry">
        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] size-0 overflow-hidden">
          <label htmlFor="lf-website">Website</label>
          <input ref={honeypot} id="lf-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="text-lg font-semibold tracking-tight">Tell us about you</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {input("name", "Full name", "text", "name")}
                  {input("email", "Business email", "email", "email")}
                  {input("phone", "Phone (with country code)", "tel", "tel", false, "+91 98765 43210")}
                  {select("country", "Country", countryOptions)}
                  {input("company", "Company name", "text", "organization")}
                  {input("designation", "Designation", "text", "organization-title", true)}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset aria-describedby={errors.interests ? "lf-interests-err" : undefined}>
                <legend className="text-lg font-semibold tracking-tight">What are you looking for?</legend>
                <p className="mt-1 text-sm text-[#15161f]/60">Choose all that apply.</p>
                <div id="lf-interests" tabIndex={-1} className="mt-4 grid gap-2.5 outline-none">
                  {interestOptions.map((o) => {
                    const on = v.interests.includes(o.id);
                    return (
                      <label
                        key={o.id}
                        className={cn(
                          "flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all",
                          on ? "border-candy bg-candy/[0.08] text-[#15161f]" : "border-[#15161f]/12 hover:border-[#15161f]/30",
                        )}
                      >
                        <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggleInterest(o.id)} />
                        <span
                          aria-hidden
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-candy/30",
                            on ? "border-candy bg-candy text-white" : "border-[#15161f]/25",
                          )}
                        >
                          {on && (
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </span>
                        <span>
                          <span className="block text-[0.95rem] font-semibold">{o.label}</span>
                          <span className="mt-0.5 block text-xs text-[#15161f]/60">{o.hint}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <Err k="interests" />
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="text-lg font-semibold tracking-tight">About your project</legend>
                <div className="mt-4 grid gap-3">
                  <div className="relative">
                    <textarea
                      id="lf-message"
                      name="message"
                      rows={4}
                      value={v.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us about your requirement"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "lf-message-err" : undefined}
                      className={cn(fieldCls("message"), "resize-y pt-7")}
                    />
                    <label htmlFor="lf-message" className={labelCls}>
                      Tell us about your requirement
                    </label>
                    <Err k="message" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {select("budget", `Approx. budget (${currency})`, budgetOptions[currency])}
                    {select("timeline", "Expected timeline", timelineOptions)}
                  </div>
                  <label className="mt-1 flex cursor-pointer items-start gap-3 text-sm text-[#15161f]/75">
                    <input
                      id="lf-consent"
                      type="checkbox"
                      checked={v.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "lf-consent-err" : undefined}
                      className="mt-0.5 size-5 shrink-0 accent-[#5e79bb]"
                    />
                    <span>
                      I agree that Candies Studio may store my details and contact me about this enquiry, as described in the{" "}
                      <a href="/privacy/" target="_blank" className="underline underline-offset-2">
                        privacy policy
                      </a>
                      .
                    </span>
                  </label>
                  <Err k="consent" />
                  {TURNSTILE_KEY && <div ref={tsRef} className="min-h-[65px]" />}
                </div>
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>

        {status.kind === "error" && (
          <p role="alert" className="mt-5 rounded-xl border border-berry/30 bg-berry/10 px-4 py-3 text-sm text-[#15161f]">
            {status.message}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setStep((s) => s - 1);
              }}
              className="min-h-12 rounded-full px-4 text-sm font-semibold text-[#15161f]/70 hover:text-[#15161f]"
            >
              ← Back
            </button>
          ) : (
            <span className="text-xs text-[#15161f]/50">Takes about a minute</span>
          )}
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-candy px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(94,121,187,0.8)] transition-all hover:bg-candy-deep disabled:cursor-wait disabled:opacity-60"
          >
            {status.kind === "sending" ? "Submitting…" : step < 2 ? "Continue" : "Submit My Enquiry"}
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>

      <p className="mt-5 border-t border-[#15161f]/8 pt-4 text-xs text-[#15161f]/55">
        Prefer email? <EmailLink location="form" campaign={campaign} className="font-semibold text-[#15161f] underline underline-offset-2" />
      </p>
    </div>
  );
}
