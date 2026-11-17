"use client";

/**
 * ─────────────────────────────────────────────────────────────
 *  Tracking & attribution (Meta Pixel, GA4, GTM)
 * ─────────────────────────────────────────────────────────────
 *  IDs come from environment variables — never hardcode them:
 *    NEXT_PUBLIC_META_PIXEL_ID   Meta Pixel ID
 *    NEXT_PUBLIC_GA_ID           GA4 measurement ID (G-XXXX)
 *    NEXT_PUBLIC_GTM_ID          Google Tag Manager container (GTM-XXXX), optional
 *    NEXT_PUBLIC_TRACKING_CONSENT  "required" (default) | "implied"
 *
 *  Every event is also pushed to window.dataLayer so GTM users can
 *  build tags without code changes.
 */

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
export const CONSENT_MODE = (process.env.NEXT_PUBLIC_TRACKING_CONSENT || "required") as "required" | "implied";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/* ── Consent ─────────────────────────────────────────────── */

const CONSENT_KEY = "candies-tracking-consent";
export type Consent = "granted" | "denied" | null;

export function getConsent(): Consent {
  if (CONSENT_MODE === "implied") return "granted";
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
export function setConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {}
  window.dispatchEvent(new CustomEvent("candies:consent", { detail: v }));
}

/* ── Attribution (UTM / Meta click IDs) ──────────────────── */

const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  // Meta dynamic URL parameters, e.g. ?campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}
  "campaign_id",
  "adset_id",
  "ad_id",
  "placement",
  "site_source_name",
] as const;
export type Attribution = Partial<Record<(typeof ATTR_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
};

const FIRST_KEY = "candies-attr-first";
const LAST_KEY = "candies-attr-last";

/** Call on every page load: stores first-touch and last-touch attribution. */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const k of ATTR_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    const hasCampaign = Object.keys(found).length > 0;
    const snapshot: Attribution = {
      ...found,
      landing_page: window.location.href.split("#")[0].slice(0, 500),
      referrer: document.referrer.slice(0, 500),
      first_seen: new Date().toISOString(),
    };
    if (!localStorage.getItem(FIRST_KEY)) localStorage.setItem(FIRST_KEY, JSON.stringify(snapshot));
    // Only overwrite last-touch when the visit carries campaign data
    if (hasCampaign || !localStorage.getItem(LAST_KEY)) localStorage.setItem(LAST_KEY, JSON.stringify(snapshot));
    // fbclid → _fbc cookie (Meta format) so the server can match the click
    if (found.fbclid) {
      const fbc = `fb.1.${Date.now()}.${found.fbclid}`;
      document.cookie = `_fbc=${fbc}; path=/; max-age=${90 * 86400}; SameSite=Lax`;
    }
  } catch {}
}

export function getAttribution(): { first: Attribution; last: Attribution } {
  const read = (k: string) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "{}") as Attribution;
    } catch {
      return {};
    }
  };
  return { first: read(FIRST_KEY), last: read(LAST_KEY) };
}

export function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** Keeps UTM parameters on internal links (e.g. /lp → /lp/websites). */
export function withAttribution(href: string) {
  if (typeof window === "undefined" || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const current = new URLSearchParams(window.location.search);
  const keep = new URLSearchParams();
  for (const k of ATTR_KEYS) {
    const v = current.get(k);
    if (v) keep.set(k, v);
  }
  const qs = keep.toString();
  if (!qs) return href;
  const [path, hash] = href.split("#");
  return `${path}${path.includes("?") ? "&" : "?"}${qs}${hash ? `#${hash}` : ""}`;
}

/* ── Events ──────────────────────────────────────────────── */

export const newEventId = (prefix = "ev") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

function dl(event: string, params: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/** Standard Meta event (+ GA4 + dataLayer). Use eventId for CAPI deduplication. */
export function trackStandard(
  name: "PageView" | "ViewContent" | "Contact" | "Lead" | "Schedule" | "SubmitApplication",
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (getConsent() !== "granted") return;
  if (window.fbq) {
    if (eventId) window.fbq("track", name, params, { eventID: eventId });
    else window.fbq("track", name, params);
  }
  const gaName: Record<string, string> = {
    PageView: "page_view",
    ViewContent: "view_item",
    Contact: "contact",
    Lead: "generate_lead",
    Schedule: "schedule_meeting",
    SubmitApplication: "submit_application",
  };
  if (name !== "PageView") window.gtag?.("event", gaName[name], params);
  dl(`meta_${name}`, { ...params, event_id: eventId });
}

/** CTA clicks etc. — tracked separately from conversions. */
export function trackCustom(name: string, params: Record<string, unknown> = {}) {
  if (getConsent() !== "granted") return;
  window.fbq?.("trackCustom", name, params);
  window.gtag?.("event", name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(), params);
  dl(name, params);
}

/**
 * Fires a tracking event at most once per browser session for a given key
 * (prevents duplicates on refresh/back). Does nothing — and doesn't mark the
 * key as used — until tracking consent is granted.
 */
export function once(key: string, fn: () => void) {
  if (getConsent() !== "granted") return;
  try {
    const k = `candies-once:${key}`;
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, "1");
  } catch {}
  fn();
}
