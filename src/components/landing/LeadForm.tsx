"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { interestOptions, type InterestId } from "@/content/landing";
import { countries } from "@/content/countries";
import { budgetOptionsFor, budgetValue, currencyName, findCountry } from "@/lib/budget";
import { emptyLead, validateLead, THANKS_KEY, type LeadErrors, type LeadInput, type ThanksPayload } from "@/lib/lead";
import { getAttribution, getConsent, getCookie, newEventId, once, trackCustom } from "@/lib/tracking";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "../Button";
import { EmailLink } from "./actions";

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

type Status = { kind: "editing" } | { kind: "sending" } | { kind: "error"; message: string };

/** Single-step enquiry form. On success the visitor goes to /lp/thank-you/, where the Meta "Lead" fires. */
export function LeadForm({ campaign, preselect = [] }: { campaign: string; preselect?: InterestId[] }) {
  const router = useRouter();
  const [v, setV] = useState<LeadInput>({ ...emptyLead, interests: [...preselect] });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  const [token, setToken] = useState("");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);
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

  const renderTurnstile = () => {
    if (!TURNSTILE_KEY || !tsRef.current || !window.turnstile || tsId.current) return;
    tsId.current = window.turnstile.render(tsRef.current, {
      sitekey: TURNSTILE_KEY,
      theme: "light",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
    });
  };

  const set = <K extends keyof LeadInput>(k: K, value: LeadInput[K]) => {
    once(`form-start:${campaign}`, () => trackCustom("FormStart", { campaign }));
    setV((cur) => ({ ...cur, [k]: value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  // Budget currency follows the selected country (United States → $, UAE → AED)
  const selectedCountry = findCountry(v.country);
  const currency = selectedCountry?.currency || "";
  const budgetChoices = currency ? budgetOptionsFor(currency) : [];
  const setCountry = (name: string) => {
    const next = findCountry(name)?.currency;
    set("country", name);
    // A range in one currency means nothing in another, so ask again when the currency changes
    if (next !== currency) setV((cur) => ({ ...cur, country: name, budget: "" }));
    if (errors.budget) setErrors((e) => ({ ...e, budget: undefined }));
  };

  const toggleInterest = (id: string) =>
    set("interests", v.interests.includes(id) ? v.interests.filter((i) => i !== id) : [...v.interests, id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLead(v);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      requestAnimationFrame(() => (document.getElementById(`lf-${first}`) as HTMLElement | null)?.focus());
      return;
    }
    if (TURNSTILE_KEY && !token) return setStatus({ kind: "error", message: "Please complete the security check above the button." });
    if (honeypot.current?.value) return; // bot
    if (Date.now() - startedAt.current < 3000)
      return setStatus({ kind: "error", message: "That was quick! Please review your details and submit again." });

    if (!eventId.current) eventId.current = newEventId("lead");
    const attribution = getAttribution();
    const pageUrl = window.location.href.split("#")[0];
    const lead = {
      ...v,
      name: v.name.trim(),
      email: v.email.trim().toLowerCase(),
      phone: v.phone.trim(),
      message: v.message.trim(),
      budget: budgetValue(v.budget, currency),
      currency,
      country_code: selectedCountry?.code || "",
    };
    const labels = lead.interests.map((i) => interestOptions.find((o) => o.id === i)?.label || i).join(", ");

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
            subject: `New lead — ${lead.name} (${labels})`,
            _subject: `New lead — ${lead.name} (${labels})`,
            from_name: "Candies Studio landing page",
            replyto: lead.email,
            _replyto: lead.email,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            country: lead.country,
            budget: lead.budget,
            interests: labels,
            message: lead.message,
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
        const json = (await res.json().catch(() => ({}))) as { success?: boolean | string };
        if (!res.ok || json.success === false || json.success === "false") throw new Error("We couldn't submit your enquiry.");
      } else {
        throw new Error(`Our online form isn't connected yet. Please email us at ${site.email}.`);
      }

      // ✅ Saved. Hand off to the thank-you page, which fires the Meta "Lead" (deduplicated with CAPI via eventId).
      const payload: ThanksPayload = {
        eventId: eventId.current,
        campaign,
        interests: lead.interests,
        firstName: lead.name.split(" ")[0],
        reference,
        country: lead.country,
        currency,
      };
      try {
        sessionStorage.setItem(THANKS_KEY, JSON.stringify(payload));
      } catch {}
      router.push(`/lp/thank-you/${window.location.search}`);
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

  const input = (k: "name" | "email" | "phone", label: string, type: string, auto: string, hint?: string) => (
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
        required
        className={fieldCls(k)}
      />
      <label htmlFor={`lf-${k}`} className={labelCls}>
        {label}
      </label>
      <Err k={k} />
    </div>
  );

  return (
    <div className="scroll-mt-28 rounded-[2rem] border border-[#15161f]/10 bg-white p-5 text-[#15161f] shadow-[0_30px_80px_-40px_rgba(21,22,31,0.35)] sm:p-8">
      {TURNSTILE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onReady={renderTurnstile} />
      )}

      <form noValidate onSubmit={submit} aria-label="Project enquiry">
        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] size-0 overflow-hidden">
          <label htmlFor="lf-website">Website</label>
          <input ref={honeypot} id="lf-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset>
          <legend className="text-lg font-semibold tracking-tight">Tell us about you</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {input("name", "Full name", "text", "name")}
            {input("email", "Business email", "email", "email")}
            {input("phone", "Phone (with country code)", "tel", "tel", "+1 415 555 0123")}
            <div className="relative">
              <select
                id="lf-country"
                name="country"
                value={v.country}
                onChange={(e) => setCountry(e.target.value)}
                aria-invalid={Boolean(errors.country)}
                aria-describedby={errors.country ? "lf-country-err" : undefined}
                required
                className={cn(fieldCls("country"), "appearance-none pr-10", !v.country && "text-[#15161f]/45")}
              >
                <option value="" disabled>
                  Select…
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label htmlFor="lf-country" className={labelCls}>
                Country
              </label>
              <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-[1.6rem] size-4 text-[#15161f]/50">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <Err k="country" />
            </div>
            <div className="relative sm:col-span-2">
              <select
                id="lf-budget"
                name="budget"
                value={v.budget}
                onChange={(e) => set("budget", e.target.value)}
                disabled={!currency}
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={[currency ? "lf-budget-hint" : "", errors.budget ? "lf-budget-err" : ""].join(" ").trim() || undefined}
                required
                className={cn(
                  fieldCls("budget"),
                  "appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-[#15161f]/[0.03]",
                  !v.budget && "text-[#15161f]/45",
                )}
              >
                <option value="" disabled>
                  {currency ? "Select a range…" : "Select your country first"}
                </option>
                {budgetChoices.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <label htmlFor="lf-budget" className={labelCls}>
                Estimated budget{currency ? ` (${currency})` : ""}
              </label>
              <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-[1.6rem] size-4 text-[#15161f]/50">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              {currency && !errors.budget && (
                <p id="lf-budget-hint" className="mt-1.5 text-xs text-[#15161f]/55">
                  Shown in {currencyName(currency)}. A rough range is fine; it helps us suggest the right approach.
                </p>
              )}
              <Err k="budget" />
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-6" aria-describedby={errors.interests ? "lf-interests-err" : undefined}>
          <legend className="text-lg font-semibold tracking-tight">What are you looking for?</legend>
          <p className="mt-1 text-sm text-[#15161f]/60">Choose all that apply.</p>
          <div id="lf-interests" tabIndex={-1} className="mt-3 grid gap-2.5 outline-none">
            {interestOptions.map((o) => {
              const on = v.interests.includes(o.id);
              return (
                <label
                  key={o.id}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 transition-all",
                    on ? "border-candy bg-candy/[0.08]" : "border-[#15161f]/12 hover:border-[#15161f]/30",
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

        <div className="relative mt-6">
          <textarea
            id="lf-message"
            name="message"
            rows={3}
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

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-[#15161f]/75">
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
        {TURNSTILE_KEY && <div ref={tsRef} className="mt-4 min-h-[65px]" />}

        {status.kind === "error" && (
          <p role="alert" className="mt-5 rounded-xl border border-berry/30 bg-berry/10 px-4 py-3 text-sm text-[#15161f]">
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group mt-6 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-candy px-7 py-4 text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(94,121,187,0.8)] transition-all hover:bg-candy-deep disabled:cursor-wait disabled:opacity-60"
        >
          {status.kind === "sending" ? "Submitting…" : "Submit My Enquiry"}
          <ArrowIcon className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <p className="mt-5 border-t border-[#15161f]/8 pt-4 text-xs text-[#15161f]/55">
        Prefer email? <EmailLink location="form" campaign={campaign} className="font-semibold text-[#15161f] underline underline-offset-2" />
      </p>
    </div>
  );
}
