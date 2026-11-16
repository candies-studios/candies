# Candies Studio — website

The new www.candies.studio: a custom Next.js site with a WebGL hero, motion design, a working enquiry form and SEO built in. It replaces the old WordPress theme.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber · Framer Motion. There is no CMS. All content lives in typed files under `src/content/`.

---

## 1. First-time setup

```bash
nvm use               # Node 22 (see .nvmrc; Node ≥ 20.9 required)
npm install
npm run assets:pull   # ⚠️ run once, while the old WordPress site is still online
cp .env.example .env.local
npm run dev           # http://localhost:3000
```

### ⚠️ `npm run assets:pull`: do this before switching domains

This script downloads the **genuine assets** from the current WordPress site into `public/media/`: the logo and candy mark, favicons, all 9 team portraits, the 11 client logos and the event poster. **Commit `public/media/` after running it.** The site still works without these files (it shows monograms, client names and a CSS candy mark instead), but it is meant to ship with them.

## 2. Deploy (recommended: Vercel)

1. Push this repo to GitHub.
2. In Vercel, choose **Import Project** and select the repo. The framework is detected automatically.
3. Add the environment variables from `.env.example` (see below).
4. Point `candies.studio` / `www.candies.studio` at Vercel.

The old WordPress URLs redirect permanently (308) to the new pages (see `next.config.ts`):

| Old URL | New URL |
|---|---|
| `/about-us/` | `/about` |
| `/contact-us/` | `/contact` |
| `/portfolio-pages/work/`, `/project/*` | `/work` |
| `/blog/`, `/YYYY/MM/DD/*` | `/insights` |
| `/events/`, `/morning-coffee-groove/` | `/services/events` |
| `/home-creative-agency/` | `/` |

It also runs on any Node host (`npm run build && npm start`), e.g. Netlify, Render or a VPS.

## 3. Contact form: configure at least one delivery channel

The form posts to `/api/enquiry`, which validates on the server, checks for spam and then delivers the enquiry. **If no channel is configured, the form shows an error. It never shows a fake success message.**

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Sends each enquiry by email through [Resend](https://resend.com). Verify the `candies.studio` domain in Resend first. Reply-To is set to the person who enquired. |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` | POSTs the enquiry as JSON to Zapier, Make, a Google Sheet (Apps Script) or a CRM, so every lead is stored. The secret is sent as the `x-candies-signature` header. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile spam check. Optional but recommended. |

Spam protection that is always on: a honeypot field, a minimum fill time, a per-IP rate limit (5 per 10 minutes) and server-side validation. Output is HTML-escaped in emails.

**Recommended:** set up both Resend (so the team gets an email) and a webhook to a Google Sheet or CRM (so leads are stored permanently).

## 4. Other optional settings

- `NEXT_PUBLIC_SITE_URL`: the canonical domain (default `https://www.candies.studio`)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: digits only, e.g. `9198XXXXXXXX`. Shows WhatsApp links in the footer and on the contact page.
- `NEXT_PUBLIC_GA_ID`: Google Analytics 4. The form fires a `generate_lead` event on success.

## 5. Editing content

| What | File |
|---|---|
| Email, addresses, markets, social links, mantra | `src/content/site.ts` |
| Team (names, roles, photos) | `src/content/team.ts` |
| Client logos | `src/content/clients.ts` |
| Services: copy, deliverables, benefits, process | `src/content/services.ts` |
| Values, "Why us" pillars, methodology | `src/content/studio.ts` |
| **Portfolio / case studies** | `src/content/projects.ts` (a template is included) |
| **Insights articles** | `src/content/insights.ts` (an example is included) |

Each section shows only what exists. Empty social links are hidden. Case-study layouts appear as soon as the first project has `published: true`. Category filters appear only for categories that have projects.

See **`docs/CONTENT-GAPS.md`** for the information the studio still needs to supply.

## 6. Project structure

```
src/
  app/                 routes (home, about, services/[slug], work/[slug], insights/[slug], contact, api/enquiry)
                       + sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  components/
    sections/          page sections (Hero, Capabilities, ClientShowcase, …)
    three/             WebGL hero (CandyScene) + static fallback (HeroVisual)
  content/             all editable content
  lib/                 SEO helper, enquiry validation, utilities
scripts/fetch-assets.mjs
docs/                  audit, design strategy, content gaps
```

## 7. Performance and accessibility notes

- The 3D hero loads lazily on the client and has no external models or HDR files: geometry and textures are generated in code. It pauses when off-screen, limits device pixel ratio, and uses a lighter layout below 1024px.
- **Fallbacks:** a static CSS composition is shown for `prefers-reduced-motion`, Save-Data connections and devices without WebGL.
- All animations respect `prefers-reduced-motion`.
- The site includes a skip link, semantic headings, labelled form fields with inline errors, visible focus states, `aria-current` navigation and a keyboard-closable mobile menu.
- **SEO:** each page has its own title, description and canonical URL. Open Graph and Twitter cards are generated. The site has Organization, Service and Article JSON-LD, `sitemap.xml` and `robots.txt`.

## Scripts

| | |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | TypeScript check |
| `npm run assets:pull` | Download genuine assets from the old site (`-- --force` to re-download) |
