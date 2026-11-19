/**
 * ─────────────────────────────────────────────────────────────
 *  lead-submit — secure lead intake for the Meta Ads landing pages
 * ─────────────────────────────────────────────────────────────
 *  1. CORS + spam checks (honeypot, timing, optional Turnstile, rate limit)
 *  2. Server-side validation
 *  3. Store in Supabase (service role — the public site never touches the DB)
 *  4. Notify the team (Resend email and/or webhook → CRM / Zapier / Make)
 *  5. Send "Lead" to Meta Conversions API with the same event_id the
 *     browser Pixel uses → Meta deduplicates the two.
 *
 *  Runtime-agnostic: uses only web-standard APIs (fetch, crypto.subtle),
 *  so it runs on Supabase Edge (Deno) and can be unit-tested in Node.
 */

export type Env = (key: string) => string | undefined;

const INTERESTS = ["website", "applications", "software"];
const INTEREST_LABELS: Record<string, string> = {
  website: "Websites",
  applications: "Applications (web & mobile)",
  software: "Custom Software",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COUNTRY_CODES: Record<string, string> = {
  India: "in",
  "United Arab Emirates": "ae",
  "United States": "us",
  "United Kingdom": "gb",
  "Saudi Arabia": "sa",
  Qatar: "qa",
  Singapore: "sg",
  Australia: "au",
  Canada: "ca",
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function validateLead(raw: Record<string, unknown>) {
  const lead = {
    name: str(raw.name, 120),
    email: str(raw.email, 200).toLowerCase(),
    phone: str(raw.phone, 30),
    country: str(raw.country, 80),
    company: str(raw.company, 160),
    designation: str(raw.designation, 120),
    interests: Array.isArray(raw.interests) ? raw.interests.filter((i): i is string => typeof i === "string" && INTERESTS.includes(i)).slice(0, 8) : [],
    message: str(raw.message, 5000),
    budget: str(raw.budget, 60),
    timeline: str(raw.timeline, 60),
    consent: raw.consent === true,
  };
  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = "Name is required.";
  if (!EMAIL_RE.test(lead.email)) errors.email = "A valid email is required.";
  const digits = lead.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) errors.phone = "A valid phone number is required.";
  if (lead.country.length < 2) errors.country = "Country is required.";
  if (!lead.interests.length) errors.interests = "Choose at least one service.";
  if (lead.message.length < 15) errors.message = "Please describe your requirement.";
  if (!lead.consent) errors.consent = "Consent is required.";
  return { lead, errors };
}

export async function handleLead(req: Request, env: Env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  /* ── CORS ── */
  const origin = req.headers.get("origin") || "";
  const allowed = (env("ALLOWED_ORIGINS") || "https://www.candies.studio")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { ok: false, error: "Method not allowed." });
  if (origin && !allowed.includes(origin)) return json(403, { ok: false, error: "Origin not allowed." });

  const SUPABASE_URL = env("SUPABASE_URL");
  const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SERVICE_KEY) return json(500, { ok: false, error: "Server is not configured." });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  /* ── Spam checks ── */
  if (typeof body.website === "string" && body.website.trim()) return json(400, { ok: false, error: "Submission rejected." });
  const started = Number(body.started_at);
  if (!Number.isFinite(started) || Date.now() - started < 3000)
    return json(400, { ok: false, error: "That was quick! Please review your details and submit again." });

  const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ua = (req.headers.get("user-agent") || "").slice(0, 400);

  const turnstileSecret = env("TURNSTILE_SECRET_KEY");
  if (turnstileSecret) {
    const r = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: String(body.turnstile_token || ""), remoteip: ip }),
    });
    const d = (await r.json().catch(() => ({}))) as { success?: boolean };
    if (!d.success) return json(400, { ok: false, error: "Security check failed. Please try again." });
  }

  /* ── Validation ── */
  const { lead, errors } = validateLead((body.lead as Record<string, unknown>) || {});
  if (Object.keys(errors).length) return json(422, { ok: false, error: "Please check the highlighted fields.", errors });

  const rest = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1`;
  const dbHeaders = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };

  /* ── Rate limit: max 5 per IP per 10 minutes ── */
  const ipHash = ip ? await sha256(`${env("RATE_LIMIT_SALT") || "candies"}:${ip}`) : null;
  if (ipHash) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const r = await fetchImpl(`${rest}/leads?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`, {
      method: "HEAD",
      headers: { ...dbHeaders, Prefer: "count=exact" },
    });
    const count = Number((r.headers.get("content-range") || "*/0").split("/")[1]) || 0;
    if (count >= 5) return json(429, { ok: false, error: "Too many submissions. Please try again later or email us." });
  }

  /* ── Store ── */
  const attr = (body.attribution as { first?: Record<string, string>; last?: Record<string, string> }) || {};
  const last = attr.last || {};
  const first = attr.first || {};
  const pick = (k: string) => str(last[k] ?? first[k], 200) || null;
  const eventId = str(body.event_id, 80) || `lead_${crypto.randomUUID()}`;
  const campaign = str(body.campaign, 60) || "master";
  const pageUrl = str(body.page_url, 500);
  const trackingConsent = body.tracking_consent === true;

  const row = {
    ...lead,
    company: lead.company || null,
    designation: lead.designation || null,
    budget: lead.budget || null,
    timeline: lead.timeline || null,
    campaign,
    landing_page_url: pageUrl || null,
    referrer: str(last.referrer || first.referrer, 500) || null,
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
    meta_campaign_id: pick("campaign_id"),
    meta_adset_id: pick("adset_id"),
    meta_ad_id: pick("ad_id"),
    fbclid: pick("fbclid"),
    first_touch: first,
    last_touch: last,
    event_id: eventId,
    tracking_consent: trackingConsent,
    ip_hash: ipHash,
    user_agent: ua,
  };

  let reference = "";
  let leadId = "";
  const ins = await fetchImpl(`${rest}/leads?select=id,reference`, {
    method: "POST",
    headers: { ...dbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (ins.status === 409) {
    // Same event_id already stored (double-click / retry) → idempotent success, no second notification
    const ex = await fetchImpl(`${rest}/leads?select=reference&event_id=eq.${encodeURIComponent(eventId)}`, { headers: dbHeaders });
    const rows = (await ex.json().catch(() => [])) as { reference: string }[];
    return json(200, { ok: true, reference: rows[0]?.reference || "", duplicate: true });
  }
  if (!ins.ok) {
    console.error("[lead-submit] insert failed", ins.status, await ins.text().catch(() => ""));
    return json(500, { ok: false, error: "We couldn't save your enquiry. Please try again or email us." });
  }
  const created = ((await ins.json()) as { id: string; reference: string }[])[0];
  reference = created?.reference || "";
  leadId = created?.id || "";

  /* ── Notify team ── */
  const interestLabels = lead.interests.map((i) => INTEREST_LABELS[i] || i).join(", ");
  let emailStatus = "skipped";
  const resendKey = env("RESEND_API_KEY");
  const from = env("LEAD_FROM_EMAIL");
  const to = (env("LEAD_NOTIFY_TO") || "create@candies.studio").split(",").map((s) => s.trim()).filter(Boolean);
  if (resendKey && from) {
    const rows: [string, string][] = [
      ["Reference", reference],
      ["Name", lead.name],
      ["Company", lead.company || "—"],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Country", lead.country],
      ["Services", interestLabels],
      ["Landing page", campaign],
      ["Source / medium", `${row.utm_source || "—"} / ${row.utm_medium || "—"}`],
      ["Campaign", row.utm_campaign || "—"],
      ["Ad", row.meta_ad_id || row.utm_content || "—"],
    ];
    const html = `<div style="font-family:Arial,sans-serif;color:#15161f"><h2 style="margin:0 0 12px">New lead ${esc(reference)}</h2><table cellpadding="6" style="border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="color:#777">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
      .join("")}</table><h3>Requirement</h3><p style="white-space:pre-wrap;line-height:1.6">${esc(lead.message)}</p></div>`;
    try {
      const r = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          reply_to: lead.email,
          subject: `New lead ${reference} — ${lead.company || lead.name} (${interestLabels})`,
          html,
          text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${lead.message}`,
        }),
      });
      emailStatus = r.ok ? "sent" : `failed:${r.status}`;
    } catch {
      emailStatus = "failed:network";
    }
  }

  const webhook = env("LEAD_WEBHOOK_URL");
  if (webhook) {
    try {
      await fetchImpl(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(env("LEAD_WEBHOOK_SECRET") ? { "x-candies-signature": env("LEAD_WEBHOOK_SECRET")! } : {}) },
        body: JSON.stringify({ id: leadId, reference, status: "new", ...row, ip_hash: undefined, user_agent: undefined }),
      });
    } catch (e) {
      console.error("[lead-submit] webhook failed", e);
    }
  }

  /* ── Meta Conversions API (only with tracking consent) ── */
  let capiStatus = "skipped";
  const pixelId = env("META_PIXEL_ID");
  const capiToken = env("META_CAPI_TOKEN");
  if (pixelId && capiToken && trackingConsent) {
    const [first_name, ...restName] = lead.name.toLowerCase().split(/\s+/);
    const cc = COUNTRY_CODES[lead.country];
    const user_data: Record<string, unknown> = {
      em: [await sha256(lead.email)],
      ph: [await sha256(lead.phone.replace(/\D/g, ""))],
      fn: [await sha256(first_name)],
      ...(restName.length ? { ln: [await sha256(restName.join(" "))] } : {}),
      ...(cc ? { country: [await sha256(cc)] } : {}),
      ...(ip ? { client_ip_address: ip } : {}),
      ...(ua ? { client_user_agent: ua } : {}),
      ...(str(body.fbp, 200) ? { fbp: str(body.fbp, 200) } : {}),
      ...(str(body.fbc, 300) ? { fbc: str(body.fbc, 300) } : {}),
    };
    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId, // same as browser Pixel eventID → deduplicated
          action_source: "website",
          event_source_url: pageUrl || undefined,
          user_data,
          custom_data: { content_name: campaign, content_category: lead.interests.join(","), lead_reference: reference },
        },
      ],
      ...(env("META_TEST_EVENT_CODE") ? { test_event_code: env("META_TEST_EVENT_CODE") } : {}),
    };
    try {
      const v = env("META_GRAPH_VERSION") || "v26.0";
      const r = await fetchImpl(`https://graph.facebook.com/${v}/${pixelId}/events?access_token=${encodeURIComponent(capiToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      capiStatus = r.ok ? "sent" : `failed:${r.status}`;
      if (!r.ok) console.error("[lead-submit] CAPI error", r.status, await r.text().catch(() => ""));
    } catch {
      capiStatus = "failed:network";
    }
  }

  // Record delivery status (best effort)
  if (leadId) {
    await fetchImpl(`${rest}/leads?id=eq.${leadId}`, {
      method: "PATCH",
      headers: dbHeaders,
      body: JSON.stringify({ email_status: emailStatus, capi_status: capiStatus }),
    }).catch(() => undefined);
  }

  return json(200, { ok: true, reference });
}
