/**
 * ─────────────────────────────────────────────────────────────
 *  META ADS LANDING PAGES — all copy & configuration
 * ─────────────────────────────────────────────────────────────
 *  One master page (/lp/) + campaign variants (/lp/<slug>/).
 *  Each variant only overrides what it needs; everything else
 *  falls back to the master content. To add a campaign, add an
 *  entry to `campaigns` — no new code required.
 *
 *  Rules: no invented clients, results, testimonials or metrics.
 */

/* ── Form options (edit freely) ───────────────────────────── */

export const interestOptions = [
  { id: "website", label: "Websites", hint: "Corporate websites, e-commerce, landing pages" },
  { id: "applications", label: "Applications", hint: "Web portals, dashboards, iOS & Android apps" },
  { id: "software", label: "Software", hint: "Custom business software, automation, integrations" },
] as const;
export type InterestId = (typeof interestOptions)[number]["id"];

/**
 * Budget ranges shown on the form. Configurable — these are not price
 * commitments. Shown in INR for India visitors and USD elsewhere
 * (based on the Country field). Edit to match how the studio quotes.
 */
export const budgetOptions = {
  INR: ["Under ₹2 lakh", "₹2–5 lakh", "₹5–15 lakh", "₹15–40 lakh", "₹40 lakh+", "Not sure yet"],
  USD: ["Under $3k", "$3k–$7.5k", "$7.5k–$20k", "$20k–$50k", "$50k+", "Not sure yet"],
} as const;

export const timelineOptions = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Just exploring"] as const;

/** Countries listed first in the selector (others available via "Other"). */
export const countryOptions = [
  "India",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Saudi Arabia",
  "Qatar",
  "Singapore",
  "Australia",
  "Canada",
  "Other",
] as const;

/* ── Section content ──────────────────────────────────────── */

export const challenges: { problem: string; answer: string; service: string; interest: InterestId }[] = [
  { problem: "Your website gets visits, not enquiries.", answer: "Conversion-focused UX, clear journeys and calls to action that turn visitors into leads.", service: "Websites", interest: "website" },
  { problem: "Your site is slow, outdated or hard to update.", answer: "A fast, modern, mobile-first website with a CMS your team can actually use.", service: "Websites", interest: "website" },
  { problem: "Your online store doesn't sell like it should.", answer: "E-commerce built around smooth browsing, trust and a frictionless checkout.", service: "Websites", interest: "website" },
  { problem: "Your customers expect an app — you don't have one.", answer: "Web and mobile applications designed for real customer needs.", service: "Applications", interest: "applications" },
  { problem: "Your team runs on spreadsheets and manual work.", answer: "Custom software that automates workflows and saves hours every week.", service: "Software", interest: "software" },
  { problem: "Your systems don't talk to each other.", answer: "Integrations and APIs that connect your CRM, payments, ERP and tools.", service: "Software", interest: "software" },
];

export const serviceCards = [
  {
    key: "websites",
    title: "Websites",
    glyph: "websites-and-applications",
    accent: "#6046aa",
    body: "Fast, secure, beautifully designed websites built around your customers' journey — and easy for your team to manage.",
    points: ["Corporate websites", "E-commerce", "Landing pages & microsites", "CMS: WordPress, Webflow, Shopify"],
    cta: "Explore Website Solutions",
    interest: "website" as InterestId,
    href: "/services/websites-and-applications/",
  },
  {
    key: "applications",
    title: "Applications",
    glyph: "content",
    accent: "#5e79bb",
    body: "Web and mobile applications that give your customers and teams a better way to work with you.",
    points: ["Web apps & customer portals", "iOS & Android apps", "Progressive web apps", "Dashboards & admin panels"],
    cta: "Explore Application Solutions",
    interest: "applications" as InterestId,
    href: "/services/websites-and-applications/",
  },
  {
    key: "software",
    title: "Custom Software",
    glyph: "design",
    accent: "#34b98a",
    body: "Software tailored to how your business actually runs — automating workflows and connecting the tools you already use.",
    points: ["Custom business software", "Workflow automation", "CRM, ERP & payment integrations", "Cloud hosting & maintenance"],
    cta: "",
    interest: "software" as InterestId,
    href: "",
  },
];

export const whyPoints = [
  { title: "Design and engineering in one team", body: "What gets approved in design is exactly what gets built — no hand-off gaps between agencies." },
  { title: "Built to convert", body: "Every page, screen and flow is designed around your business goal, not just how it looks." },
  { title: "Fast, secure and scalable", body: "Modern stacks, performance budgets and security best practice from day one." },
  { title: "Easy to own", body: "A CMS and admin tools your team can use, documented code and a clean hand-over." },
  { title: "Multi-industry experience", body: "Work for organisations in banking, financial services, payments, FMCG, media and healthcare." },
  { title: "Support after launch", body: "Hosting, maintenance and ongoing improvements — so your platform keeps getting better." },
];

export const processSteps = [
  { n: "01", title: "Discover", body: "We understand your business, users, goals and technical requirements." },
  { n: "02", title: "Plan", body: "We define the scope, architecture, timeline and investment." },
  { n: "03", title: "Design", body: "Wireframes, UI design and clickable prototypes you approve before build." },
  { n: "04", title: "Build & test", body: "Development in sprints with previews and testing across devices." },
  { n: "05", title: "Launch & support", body: "Go-live, training, then maintenance and ongoing improvements." },
];

/**
 * TESTIMONIALS — verified quotes only. The section is hidden while empty.
 * Get written permission from each client before adding.
 */
export const testimonials: { quote: string; name: string; role: string; company: string }[] = [];

/* ── Campaign variants ────────────────────────────────────── */

export type Campaign = {
  slug: string;
  /** Internal name, also sent to Meta/GA as content_name for per-campaign reporting */
  name: string;
  eyebrow: string;
  headline: [string, string]; // [main, serif-accent ending]
  subcopy: string;
  /** Services pre-ticked on the form */
  preselect: InterestId[];
  /** Service card shown first */
  featuredCard?: string;
  /** Short line used in the final CTA */
  closing?: string;
  metaTitle: string;
  metaDescription: string;
};

export const masterCampaign: Campaign = {
  slug: "",
  name: "websites_apps_software",
  eyebrow: "Websites, applications & software",
  headline: ["Websites, apps and software that grow your", "business."],
  subcopy:
    "From high-converting websites to web and mobile apps and custom software, Candies Studio designs and builds digital products that are fast, secure and easy for your team to manage.",
  preselect: [],
  featuredCard: "websites",
  metaTitle: "Website, App & Software Development Company",
  metaDescription:
    "Websites, web & mobile applications and custom software designed and built by Candies Studio. Tell us about your project and get a proposal.",
};

/**
 * Additional campaign variants (/lp/<slug>/). Currently none — the master
 * page at /lp/ is the only landing page. To add one later, add an entry here
 * and restore src/app/lp/[campaign]/page.tsx (see docs/LANDING-PAGE.md).
 */
export const campaigns: Campaign[] = [];

export const getCampaign = (slug: string) => campaigns.find((c) => c.slug === slug);
