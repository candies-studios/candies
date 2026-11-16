"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { budgetOptions, normalise, serviceOptions, validate, type Enquiry, type FieldErrors } from "@/lib/enquiry";
import { site } from "@/content/site";
import { ArrowIcon } from "./Button";
import { cn } from "@/lib/cn";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const empty: Enquiry = { name: "", company: "", email: "", phone: "", country: "", service: "", budget: "", message: "" };

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; message: string };

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [values, setValues] = useState<Enquiry>({ ...empty, service: defaultService ?? "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Enquiry, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [token, setToken] = useState("");
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const renderTurnstile = () => {
    if (!TURNSTILE_KEY || !tsRef.current || !window.turnstile || tsId.current) return;
    tsId.current = window.turnstile.render(tsRef.current, {
      sitekey: TURNSTILE_KEY,
      theme: "dark",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
    });
  };

  const set = (k: keyof Enquiry) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(normalise(next)));
  };
  const blur = (k: keyof Enquiry) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(normalise(values)));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = normalise(values);
    const errs = validate(data);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(empty).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      const first = document.getElementById(`f-${Object.keys(errs)[0]}`);
      first?.focus();
      return;
    }
    if (TURNSTILE_KEY && !token) {
      setStatus({ kind: "error", message: "Please complete the spam check below." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
          turnstileToken: token,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: FieldErrors };
      if (res.ok && json.ok) {
        setStatus({ kind: "success" });
        setValues(empty);
        setTouched({});
        // analytics hook (no-op if GA isn't configured)
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "generate_lead", { service: data.service });
      } else {
        if (json.errors) setErrors(json.errors);
        setStatus({ kind: "error", message: json.error || `Something went wrong. Please email us at ${site.email}.` });
        if (TURNSTILE_KEY) {
          window.turnstile?.reset(tsId.current);
          setToken("");
        }
      }
    } catch {
      setStatus({ kind: "error", message: `Network error. Please check your connection or email us at ${site.email}.` });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[2rem] border border-white/10 bg-ink-2 p-8 sm:p-12">
        <span aria-hidden className="candy-stripe block size-14 rounded-full" />
        <h2 className="display display-sm mt-8">Thank you — we&apos;ve got it.</h2>
        <p className="mt-4 max-w-lg text-paper/70">
          Your enquiry has been received. Someone from the Candies Studio team will get back to you shortly. For anything
          urgent, write to{" "}
          <a className="link-underline text-paper" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus({ kind: "idle" });
            startedAt.current = Date.now();
          }}
          className="mt-8 text-sm font-semibold text-candy-soft link-underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = "peer w-full rounded-2xl border bg-white/[0.03] px-5 pb-3 pt-7 text-[0.98rem] text-paper outline-none transition-colors placeholder:text-transparent focus:border-candy focus:bg-white/[0.05]";
  const label = "pointer-events-none absolute left-5 top-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper/50";
  const err = (k: keyof Enquiry) => touched[k] && errors[k];

  const Field = ({ k, labelText, type = "text", required = true, autoComplete }: { k: keyof Enquiry; labelText: string; type?: string; required?: boolean; autoComplete?: string }) => (
    <div className="relative">
      <input
        id={`f-${k}`}
        name={k}
        type={type}
        value={values[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(err(k))}
        aria-describedby={err(k) ? `e-${k}` : undefined}
        placeholder={labelText}
        className={cn(field, err(k) ? "border-berry" : "border-white/12")}
      />
      <label htmlFor={`f-${k}`} className={label}>
        {labelText} {!required && <span className="normal-case tracking-normal opacity-60">(optional)</span>}
      </label>
      {err(k) && (
        <p id={`e-${k}`} className="mt-2 text-xs text-berry">
          {errors[k]}
        </p>
      )}
    </div>
  );

  const Select = ({ k, labelText, options }: { k: keyof Enquiry; labelText: string; options: readonly string[] }) => (
    <div className="relative">
      <select
        id={`f-${k}`}
        name={k}
        value={values[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        required
        aria-invalid={Boolean(err(k))}
        aria-describedby={err(k) ? `e-${k}` : undefined}
        className={cn(field, "appearance-none pr-12", err(k) ? "border-berry" : "border-white/12", !values[k] && "text-paper/40")}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink text-paper">
            {o}
          </option>
        ))}
      </select>
      <label htmlFor={`f-${k}`} className={label}>
        {labelText}
      </label>
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-paper/50">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      {err(k) && (
        <p id={`e-${k}`} className="mt-2 text-xs text-berry">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4" aria-describedby="form-note">
      {TURNSTILE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={renderTurnstile} />
      )}
      {/* Honeypot — hidden from humans & assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input ref={honeypot} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Field({ k: "name", labelText: "Full name", autoComplete: "name" })}
        {Field({ k: "company", labelText: "Company name", autoComplete: "organization" })}
        {Field({ k: "email", labelText: "Work email", type: "email", autoComplete: "email" })}
        {Field({ k: "phone", labelText: "Phone number", type: "tel", required: false, autoComplete: "tel" })}
        {Field({ k: "country", labelText: "Country", autoComplete: "country-name" })}
        {Select({ k: "service", labelText: "Service required", options: serviceOptions })}
      </div>
      {Select({ k: "budget", labelText: "Estimated project budget", options: budgetOptions })}

      <div className="relative">
        <textarea
          id="f-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          required
          aria-invalid={Boolean(err("message"))}
          aria-describedby={err("message") ? "e-message" : undefined}
          placeholder="Project description"
          className={cn(field, "resize-y pt-8", err("message") ? "border-berry" : "border-white/12")}
        />
        <label htmlFor="f-message" className={label}>
          Project description
        </label>
        {err("message") && (
          <p id="e-message" className="mt-2 text-xs text-berry">
            {errors.message}
          </p>
        )}
      </div>

      {TURNSTILE_KEY && <div ref={tsRef} className="min-h-[65px]" />}

      <div
        ref={statusRef}
        tabIndex={-1}
        role={status.kind === "error" ? "alert" : "status"}
        aria-live="polite"
        className={cn("text-sm outline-none", status.kind === "error" ? "rounded-xl border border-berry/40 bg-berry/10 px-4 py-3 text-paper" : "sr-only")}
      >
        {status.kind === "error" ? status.message : status.kind === "sending" ? "Sending your enquiry…" : ""}
      </div>

      <div className="flex flex-col-reverse gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="max-w-sm text-xs leading-relaxed text-paper/45">
          We use your details only to respond to this enquiry. We never sell or share your information.
        </p>
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-candy px-8 py-4 text-sm font-semibold text-white transition-all duration-500 hover:bg-candy-deep disabled:cursor-wait disabled:opacity-60"
        >
          {status.kind === "sending" ? "Sending…" : "Send enquiry"}
          <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
