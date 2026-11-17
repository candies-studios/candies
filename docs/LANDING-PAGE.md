# Meta Ads landing pages — strategy, setup and launch guide

Live URL (after deploy): **`https://www.candies.studio/lp/`**, the Websites, Applications & Software landing page.

The form asks visitors to choose from three requirements: **Websites**, **Applications** and **Software**. Earlier variant URLs (`/lp/websites/`, `/lp/branding/`, …) redirect to `/lp/` and keep their UTM and ad parameters.

The landing page is `noindex` (paid traffic only) but remain crawlable so Meta can review ads.

---

## 1. Audit summary (conversion lens)

The main site (`www.candies.studio`) is strong on brand and credibility, but it is built for browsing rather than converting paid traffic:

- **Too many exits.** The navigation has six top-level destinations. Paid visitors need one path: enquire.
- **Generic form.** The single contact form has no qualification questions (services, timeline) and captures no campaign attribution.
- **No tracking.** No Meta Pixel or Conversions API, and no lead events, so Meta can't optimise for leads.
- **Heavy hero.** The WebGL 3D hero is impressive on desktop but costly on mobile data.
- **Proof gaps.** There are no published case studies and no testimonials. The genuine proof assets are the 11 client logos, the sector spread, "25+ years combined creative experience", three office addresses and six markets. The landing pages lead with these and never invent anything.

## 2. Strategy and conversion funnel

```
Meta ad (campaign-specific creative)
  → /lp/<campaign>/?utm_…&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}
     PageView (Pixel) ── attribution captured (first + last touch, fbclid → _fbc)
  → scroll to Services ── ViewContent (once per campaign)
  → CTA click (hero / service card / challenge / sticky / quick-start) ── CTAClick (custom)
  → Multi-step form: Contact → Requirement (pre-ticked) → Project ── FormStart, FormStep (custom)
  → Submit → Edge Function: validate → store → email team → CAPI "Lead" (event_id X)
  → Success screen ── Pixel "Lead" (eventID X, deduplicated)  →  "Schedule a Discovery Call" ── Schedule
```

**Principles:**

- One goal per page.
- The main CTA stays visible on screen at all times: in the sticky header on desktop and the sticky bar on mobile.
- Every section ends in a way to enquire.
- Proof sits next to the form (client logos, reassurance points).
- The form is three short steps, and the services are pre-selected from the ad.

## 3. Design direction

The pages use the bright Candies brand (warm white with soft candy-blue tints), the official logo, and the candy-ball motif rendered in **CSS only**, with no 3D bundle so they load fast on 4G. Display type is Archivo with Instrument Serif accents. Motion is limited to gentle floats, reveals and form step transitions, and everything respects reduced-motion settings. Buttons are at least 48px tall for easy tapping, and a sticky enquiry bar appears on mobile.

## 4. Architecture

| Layer | What | Where |
|---|---|---|
| Pages | Next.js static export (same repo and deploy as the main site) | `src/app/lp/`, `src/components/landing/` |
| Content and variants | Typed config, so there is no duplicated code | `src/content/landing.ts` |
| Tracking | Pixel, GA4, GTM, consent, attribution, dedup | `src/lib/tracking.ts`, `src/components/Tracking.tsx` |
| Lead backend | Supabase Postgres + Edge Function (secrets stay server-side) | `supabase/` |
| Legal | Privacy Policy, Terms | `/privacy/`, `/terms/` |

Nothing secret is in the frontend. The browser only knows the public function URL and the Supabase anon key, and the anon key has no access to the `leads` table because RLS is on and there are no policies.

---

## 5. Setup, step by step

### 5.1 Supabase (lead storage), about 15 minutes

1. Create a project at [supabase.com](https://supabase.com). Choose a region close to India, e.g. Mumbai.
2. Go to **SQL Editor → New query**, paste `supabase/migrations/20261117000000_leads.sql`, and click **Run**.
3. Install the CLI (`npm i -g supabase`), then from the repo root run:
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   cp supabase/env.example supabase/.env      # fill in the values (see 5.2–5.4), never commit it
   supabase secrets set --env-file supabase/.env
   supabase functions deploy lead-submit --no-verify-jwt
   ```
4. Your endpoint is `https://<project-ref>.supabase.co/functions/v1/lead-submit`.

### 5.2 Team email notifications (Resend)

1. Create a [Resend](https://resend.com) account and add and verify the domain `candies.studio`. Resend gives you DNS records to add in GoDaddy; your existing email (MX) records are not affected.
2. Create an API key and set these in `supabase/.env`:
   - `RESEND_API_KEY`
   - `LEAD_FROM_EMAIL=Candies Studio Leads <leads@candies.studio>`
   - `LEAD_NOTIFY_TO=create@candies.studio`
3. **Optional:** set `LEAD_WEBHOOK_URL` to also push each lead to a CRM, Zapier, Make or a Google Sheet.

### 5.3 Meta Pixel and Conversions API

1. In **Meta Events Manager → Connect data → Web**, create a dataset (Pixel) and copy the **Pixel ID**.
2. On that Pixel, go to **Settings → Conversions API → Generate access token**.
3. Put `META_PIXEL_ID` and `META_CAPI_TOKEN` in `supabase/.env`, then run `supabase secrets set --env-file supabase/.env`.
4. Add the same Pixel ID as a GitHub variable named `META_PIXEL_ID` (see 5.5).
5. **Domain verification:** in **Business Settings → Brand safety → Domains**, add `candies.studio` and verify it with the DNS TXT method in GoDaddy.

**Events sent:**

| Event | When | Source |
|---|---|---|
| PageView | Every page load / route change | Pixel |
| ViewContent | Services section seen, once per campaign | Pixel |
| Contact | WhatsApp or email link clicked | Pixel |
| CTAClick, FormStart, FormStep (custom) | CTA clicks and form progress | Pixel |
| **Lead** | **Only after the backend confirms the enquiry was saved** | Pixel **and** CAPI, with the same `event_id` so Meta deduplicates them |
| Schedule | A Calendly meeting is actually booked | Pixel |

Duplicate protection:

- The Lead event fires once per `event_id`.
- Re-submitting the same `event_id` returns the existing reference without creating a new row, email or CAPI event.
- Refreshing the success page does not re-fire anything.

### 5.4 GA4 and Google Tag Manager (optional)

- **GA4:** create a GA4 property and web stream, then set the GitHub variable `GA_ID=G-XXXXXXX`. The `generate_lead` event fires on successful submissions; mark it as a **Key event** in GA4.
- **GTM:** set `GTM_ID=GTM-XXXXXXX` only if you manage tags in GTM. Every event is also pushed to `dataLayer` (`meta_Lead`, `CTAClick`, …).

### 5.5 GitHub repository variables

Go to **Settings → Secrets and variables → Actions → Variables → New repository variable**:

| Variable | Example | Purpose |
|---|---|---|
| `LEAD_ENDPOINT` | `https://abcd.supabase.co/functions/v1/lead-submit` | Where the form posts |
| `SUPABASE_ANON_KEY` | `eyJ…` (Project settings → API → anon public) | Public key sent with requests (safe) |
| `META_PIXEL_ID` | `1234567890` | Meta Pixel |
| `GA_ID` | `G-XXXXXXX` | GA4 (optional) |
| `GTM_ID` | `GTM-XXXXXXX` | GTM (optional) |
| `WHATSAPP_NUMBER` | `9198XXXXXXXX` | Verified business number, digits only; shows WhatsApp buttons |
| `SCHEDULING_URL` | `https://calendly.com/candies-studio/discovery` | Turns "Request a Call Back" into "Schedule a Discovery Call" |
| `TURNSTILE_SITE_KEY` | `0x4AAA…` | Optional spam check (set `TURNSTILE_SECRET_KEY` in Supabase too) |
| `TRACKING_CONSENT` | `required` (default) or `implied` | `required` shows a cookie banner and loads tracking only after Accept |

Then go to **Actions → Deploy to GitHub Pages → Run workflow**.

> **Consent note:** `required` is the GDPR-safe default, and it matters for UK/EU traffic. With `implied`, tracking loads immediately; it gives more ad data, but use it only if your legal advice allows it for your markets. CAPI events are sent only when the visitor accepted tracking.

---

## 6. Launching the first Meta campaign

1. **Objective:** create a **Leads** campaign. For the conversion location choose **Website**, select your Pixel, and choose the **Lead** event.
2. **Website URL:** `https://www.candies.studio/lp/`
3. **URL parameters** (Ad → Tracking → URL parameters), paste:
   ```
   utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}&placement={{placement}}&site_source_name={{site_source_name}}
   ```
4. **Per-variant reporting:** each Lead carries `content_name` = the variant (`websites`, `events`, …). In Events Manager create **Custom Conversions** (Lead where `content_name` equals `websites`, and so on) to report and optimise each landing page separately.
5. **Test before spending:** see the checklist in section 7.

## 7. Testing the full journey (do this after every setup change)

1. In Events Manager → **Test events**, copy the test code. Set `META_TEST_EVENT_CODE` in Supabase secrets and redeploy the function.
2. Open the test URL from Events Manager, adding `?utm_source=test&ad_id=123` to the end.
3. Accept cookies. You should see **PageView** in Test events. Scroll to Services and you should see **ViewContent**.
4. Click WhatsApp and you should see **Contact**.
5. Submit the form with real-looking test data. You should see **Lead ×2**, one from the browser and one from the server, marked *Deduplicated*.
6. Check the Supabase **Table Editor → leads**. The new row should show `utm_source = test`, `meta_ad_id = 123`, `email_status = sent` and `capi_status = sent`.
7. Check that the notification email arrived at create@candies.studio.
8. Remove `META_TEST_EVENT_CODE` and redeploy the function.

## 8. Viewing and managing leads

- **Supabase → Table Editor → `leads`** (or the `leads_overview` view) is your dashboard. Filter by `status`, `campaign` or `utm_campaign`.
- **Statuses:** `new → contacted → qualified → proposal_sent → converted / lost`. Edit the `status`, `owner` and `notes` columns directly.
- **CRM later:** point `LEAD_WEBHOOK_URL` at Zapier, Make or HubSpot, or sync the table. Every attribution field is stored, so CRM reports can show campaign ROI.
- Export any time with **Table Editor → Export CSV**.

## 9. Editing the landing page or adding variants later

- **Copy:** all copy, challenges, service cards, process steps, budgets and timelines live in `src/content/landing.ts` (`masterCampaign` holds the hero copy).
- **Form options:** the three form options are `interestOptions` in the same file. If you change them, also update `INTERESTS` and `INTEREST_LABELS` in `supabase/functions/_shared/handler.ts`, then redeploy the function.
- **Variants:** to bring back separate pages (e.g. `/lp/ecommerce/`), add entries to `campaigns` and restore the dynamic route `src/app/lp/[campaign]/page.tsx` (available in the repo history).
- **Testimonials:** they stay hidden until verified quotes are added.
- **Case studies:** they appear once projects in `src/content/projects.ts` are published.

## 10. QA report (17 Nov 2026)

| Check | Result |
|---|---|
| Widths 360, 375, 390, 430, 768, 1024, 1440, 1920 on `/lp/`, a variant, `/privacy/`, `/terms/` | No horizontal overflow, no runtime errors |
| First screen on mobile (360–430) | Headline, copy and primary CTA visible without scrolling |
| Form validation | Each step blocks with inline errors and focuses the first error |
| Variant pre-selection | `/lp/websites/` ticks Website; `/lp/events/` ticks Corporate Events |
| Budget currency | INR for India, USD elsewhere |
| Successful submission (end to end, with a mocked Supabase/Resend/Meta) | Stored with all UTM and Meta IDs and the fbclid; email sent; CAPI sent; success screen with reference |
| Browser/server dedup | Pixel `eventID` equals CAPI `event_id`; exactly one Lead per submission |
| Backend unreachable | Clear error shown, no Lead event fired |
| Backend unit tests | CORS, origin block, honeypot, timing, validation (422), Turnstile fail, duplicate `event_id` (idempotent), rate limit (429 after 5 per 10 min per IP), no CAPI without consent, downstream failures recorded |
| Consent | Nothing loads before Accept; Decline keeps tracking off |

Not testable from here (do these after configuring): the live Supabase deployment, real Resend delivery, real Meta Test Events, and the Calendly booking event.
