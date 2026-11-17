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
  { id: "branding", label: "Branding & Design" },
  { id: "website", label: "Website Design & Development" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "seo", label: "SEO" },
  { id: "social-media", label: "Social Media Marketing" },
  { id: "content", label: "Content Creation" },
  { id: "events", label: "Corporate Events" },
  { id: "other", label: "Other" },
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
  { problem: "Your brand looks different on every platform.", answer: "A unified identity system and guidelines your whole team can use.", service: "Design", interest: "branding" },
  { problem: "Your website gets visits, not enquiries.", answer: "Conversion-focused UX and a fast, modern website.", service: "Websites & Applications", interest: "website" },
  { problem: "Your social media lacks consistency.", answer: "Content pillars, calendars and creative that look and sound like you.", service: "Social & Content", interest: "social-media" },
  { problem: "Your marketing has activity, but no clear strategy.", answer: "A channel plan tied to objectives, budgets and measurable KPIs.", service: "Digital Marketing", interest: "digital-marketing" },
  { problem: "Customers don't quickly understand your value.", answer: "Sharper positioning, messaging and copy that sells.", service: "Content", interest: "content" },
  { problem: "Your events don't feel like your brand.", answer: "End-to-end event concept, design and execution.", service: "Events", interest: "events" },
];

export const serviceCards = [
  {
    key: "design",
    title: "Design",
    glyph: "design",
    accent: "#5e79bb",
    body: "Build a recognisable identity through thoughtful design, visual storytelling and compelling brand experiences.",
    points: ["Brand identity & strategy", "Graphic & digital design", "Website UI/UX", "Visual storytelling"],
    cta: "Explore Design Solutions",
    interest: "branding" as InterestId,
    href: "/services/design/",
  },
  {
    key: "content",
    title: "Content",
    glyph: "content",
    accent: "#e8577d",
    body: "Communicate your brand story through strategic content that informs, engages and connects with your audience.",
    points: ["Content strategy", "Copywriting", "Content creation", "Brand communication"],
    cta: "Explore Content Solutions",
    interest: "content" as InterestId,
    href: "/services/content/",
  },
  {
    key: "digital",
    title: "Digital Marketing",
    glyph: "digital-marketing",
    accent: "#34b98a",
    body: "Strengthen your digital presence through strategic marketing, SEO, social media and performance-oriented campaigns.",
    points: ["SEO", "Social media marketing", "Influencer & email marketing", "Campaigns & lead generation"],
    cta: "Explore Marketing Solutions",
    interest: "digital-marketing" as InterestId,
    href: "/services/digital-marketing/",
  },
  {
    key: "web",
    title: "Websites & Apps",
    glyph: "websites-and-applications",
    accent: "#6046aa",
    body: "Launch fast, secure websites and digital products designed to turn visitors into enquiries and customers.",
    points: ["Corporate websites", "E-commerce", "Web & mobile apps", "CMS & integrations"],
    cta: "Explore Web Solutions",
    interest: "website" as InterestId,
    href: "/services/websites-and-applications/",
  },
  {
    key: "events",
    title: "Events",
    glyph: "events",
    accent: "#f2a33a",
    body: "Create memorable brand experiences through thoughtfully planned corporate events, activations and launches.",
    points: ["Corporate events", "Product launches", "Brand activations", "Event communication"],
    cta: "Explore Event Solutions",
    interest: "events" as InterestId,
    href: "/services/events/",
  },
];

export const whyPoints = [
  { title: "Strategy meets creativity", body: "Every idea starts from your objectives and audience — not from a template." },
  { title: "Integrated capabilities", body: "Design, content, digital, web and events under one roof. One team, one brand voice." },
  { title: "Collaborative by default", body: "Open communication, clear review rounds and no surprises on scope or timelines." },
  { title: "Tailored to your business", body: "Solutions scoped to your goals and budget, whether you're a startup or an established brand." },
  { title: "Multi-industry experience", body: "Work for organisations in banking, financial services, payments, FMCG, media and healthcare." },
  { title: "International perspective", body: "Offices in Navi Mumbai, Dubai and the USA, with work across India, the US, the UK, France, Australia and New Zealand." },
];

export const processSteps = [
  { n: "01", title: "Discover", body: "We understand your business, objectives, challenges and audience." },
  { n: "02", title: "Strategise", body: "We define the right creative and communication approach." },
  { n: "03", title: "Create", body: "We turn ideas into meaningful creative solutions." },
  { n: "04", title: "Execute", body: "We deliver the agreed work across the relevant channels." },
  { n: "05", title: "Optimise", body: "We review performance, gather feedback and find what to improve." },
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
  name: "master",
  eyebrow: "Creative & digital studio",
  headline: ["Your brand deserves more than just", "marketing."],
  subcopy:
    "From memorable brand identities to websites, content and campaigns, Candies Studio helps businesses communicate better, connect with audiences and grow.",
  preselect: [],
  metaTitle: "Creative Agency for Branding, Websites, Marketing & Events",
  metaDescription:
    "Candies Studio is a creative and digital studio for branding, websites, content, digital marketing and corporate events. Tell us about your project.",
};

export const campaigns: Campaign[] = [
  {
    slug: "branding",
    name: "branding",
    eyebrow: "Branding & creative design",
    headline: ["Build a brand people", "remember."],
    subcopy:
      "Strategy-led identities, visual systems and brand communication that make your business instantly recognisable — everywhere it shows up.",
    preselect: ["branding"],
    featuredCard: "design",
    metaTitle: "Branding & Creative Design Agency",
    metaDescription: "Brand identity, visual systems and creative design from Candies Studio. Request a proposal for your brand.",
  },
  {
    slug: "websites",
    name: "websites",
    eyebrow: "Website design & development",
    headline: ["Websites that turn visitors into", "enquiries."],
    subcopy:
      "Fast, secure, beautifully designed websites and web apps — built around your customers' journey and easy for your team to manage.",
    preselect: ["website"],
    featuredCard: "web",
    metaTitle: "Website Design & Development Agency",
    metaDescription: "Corporate websites, e-commerce and web apps designed and built by Candies Studio. Talk to our team.",
  },
  {
    slug: "digital-marketing",
    name: "digital_marketing",
    eyebrow: "Digital marketing & SEO",
    headline: ["Marketing with a plan, not just", "posts."],
    subcopy:
      "Search, social and performance campaigns tied to clear objectives — with creative and reporting your leadership can trust.",
    preselect: ["digital-marketing", "seo"],
    featuredCard: "digital",
    metaTitle: "Digital Marketing & SEO Agency",
    metaDescription: "SEO, performance marketing and digital strategy from Candies Studio. Get a creative consultation.",
  },
  {
    slug: "social-media",
    name: "social_media",
    eyebrow: "Social media marketing",
    headline: ["Social media that looks and sounds like", "you."],
    subcopy:
      "Content pillars, calendars, creative and community management that keep your brand consistent and your audience engaged.",
    preselect: ["social-media"],
    featuredCard: "digital",
    metaTitle: "Social Media Marketing Agency",
    metaDescription: "Social media strategy, content and management from Candies Studio. Let's discuss your brand.",
  },
  {
    slug: "events",
    name: "events",
    eyebrow: "Corporate events & activations",
    headline: ["Events your audience will", "talk about."],
    subcopy:
      "Corporate events, product launches and brand activations — concept, design, planning and on-ground execution by one team.",
    preselect: ["events"],
    featuredCard: "events",
    metaTitle: "Corporate Events & Brand Activations",
    metaDescription: "Corporate events, launches and brand activations planned and executed by Candies Studio. Request a proposal.",
  },
  {
    slug: "content",
    name: "content",
    eyebrow: "Content marketing",
    headline: ["Content that earns attention and", "trust."],
    subcopy:
      "Strategy, copywriting and production for content that answers your customers' real questions — and moves them to act.",
    preselect: ["content"],
    featuredCard: "content",
    metaTitle: "Content Marketing & Copywriting Agency",
    metaDescription: "Content strategy, copywriting and production from Candies Studio. Talk to our team.",
  },
];

export const getCampaign = (slug: string) => campaigns.find((c) => c.slug === slug);
