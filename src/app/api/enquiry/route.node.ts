import { NextResponse } from "next/server";
import { normalise, validate, type Enquiry } from "@/lib/enquiry";
import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Basic per-instance rate limit (5 requests / 10 min / IP) ────────────
   For multi-region or high-traffic deployments, swap for a shared store
   (e.g. Upstash Redis / Vercel KV). Turnstile below is the main defence. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQ = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_REQ;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → rely on honeypot + timing + rate limit
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

async function sendEmail(e: Enquiry, meta: { ip: string; ua: string; ref: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return { attempted: false, ok: false };
  const to = (process.env.CONTACT_TO_EMAIL || site.email).split(",").map((s) => s.trim()).filter(Boolean);

  const rows: [string, string][] = [
    ["Name", e.name],
    ["Company", e.company],
    ["Email", e.email],
    ["Phone", e.phone || "—"],
    ["Country", e.country],
    ["Service", e.service],
    ["Budget", e.budget],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;color:#0b0c14">
      <h2 style="margin:0 0 16px">New project enquiry</h2>
      <table cellpadding="6" style="border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
        .join("")}</table>
      <h3 style="margin:24px 0 8px">Project description</h3>
      <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(e.message)}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:12px;color:#999">Sent from ${escapeHtml(meta.ref || site.url)} · IP ${escapeHtml(meta.ip)}</p>
    </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${e.message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: e.email,
      subject: `New enquiry — ${e.company} (${e.service})`,
      html,
      text,
    }),
  });
  if (!res.ok) console.error("[enquiry] Resend error", res.status, await res.text().catch(() => ""));
  return { attempted: true, ok: res.ok };
}

async function sendWebhook(e: Enquiry, meta: { ip: string; ua: string; ref: string }) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return { attempted: false, ok: false };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_SECRET ? { "x-candies-signature": process.env.CONTACT_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({ ...e, submittedAt: new Date().toISOString(), source: meta.ref, userAgent: meta.ua }),
  });
  if (!res.ok) console.error("[enquiry] Webhook error", res.status);
  return { attempted: true, ok: res.ok };
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const meta = { ip, ua: req.headers.get("user-agent") || "", ref: req.headers.get("referer") || "" };

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: false, error: "Submission rejected." }, { status: 400 });
  }
  // Timing: humans take more than ~3s to fill a long form.
  const started = Number(body.startedAt);
  if (!Number.isFinite(started) || Date.now() - started < 3000) {
    return NextResponse.json({ ok: false, error: "That was fast! Please review your details and try again." }, { status: 400 });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes or email us directly." },
      { status: 429 },
    );
  }

  if (!(await verifyTurnstile(String(body.turnstileToken || ""), ip))) {
    return NextResponse.json({ ok: false, error: "Spam check failed. Please refresh and try again." }, { status: 400 });
  }

  const enquiry = normalise(body);
  const errors = validate(enquiry);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please correct the highlighted fields.", errors }, { status: 422 });
  }

  const [email, hook] = await Promise.all([
    sendEmail(enquiry, meta).catch((err) => (console.error(err), { attempted: true, ok: false })),
    sendWebhook(enquiry, meta).catch((err) => (console.error(err), { attempted: true, ok: false })),
  ]);

  if (!email.attempted && !hook.attempted) {
    console.error("[enquiry] No delivery channel configured. Set RESEND_API_KEY + CONTACT_FROM_EMAIL or CONTACT_WEBHOOK_URL.");
    return NextResponse.json(
      { ok: false, error: `Our form isn't accepting messages right now. Please email us at ${site.email}.` },
      { status: 503 },
    );
  }
  if (!email.ok && !hook.ok) {
    return NextResponse.json(
      { ok: false, error: `We couldn't send your message. Please try again or email us at ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
