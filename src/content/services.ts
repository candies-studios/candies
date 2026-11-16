/**
 * SERVICES — the four capabilities from the existing site
 * (Design, Content, Digital Marketing, Events) plus Websites & Applications,
 * rewritten for
 * corporate decision-makers. Copy describes what clients receive;
 * it makes no claims about results.
 */
export type Service = {
  slug: string;
  index: string;
  title: string;
  /** Optional compact label for tight spaces (capability cards, chips) */
  shortTitle?: string;
  /** Short line for cards */
  summary: string;
  /** Large statement on the detail page */
  headline: string;
  intro: string;
  /** Capabilities shown as tags on the homepage */
  capabilities: string[];
  /** What a client actually receives */
  deliverables: string[];
  /** Business value, written for decision-makers */
  benefits: { title: string; body: string }[];
  /** Typical engagement shape */
  approach: { step: string; body: string }[];
  /** Accent used by the visual system */
  accent: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "design",
    index: "01",
    title: "Design",
    summary:
      "Brand identity, graphic design, UI/UX, website design, creative campaigns and visual communication.",
    headline: "Identities and interfaces built to be remembered.",
    intro:
      "Design is where strategy becomes visible. We research your market, audience and ambitions, then build visual systems that make your brand instantly recognisable — across print, screen, space and everything in between. Every decision is deliberate, documented and built to scale with your business.",
    capabilities: ["Brand identity", "Graphic design", "UI/UX", "Website design", "Creative campaigns", "Visual communication"],
    deliverables: [
      "Brand strategy, positioning and naming support",
      "Logo systems, colour, typography and brand guidelines",
      "Website and product UI/UX design, from wireframes to high-fidelity prototypes",
      "Campaign key visuals and adaptations across formats",
      "Corporate collateral — reports, presentations, brochures, packaging",
      "3D, motion and illustration assets for a distinctive visual language",
    ],
    benefits: [
      { title: "Recognition that compounds", body: "A coherent system makes every touchpoint reinforce the last, so your marketing spend works harder." },
      { title: "Consistency at scale", body: "Clear guidelines and reusable assets let internal teams and partners produce on-brand work faster." },
      { title: "Interfaces that convert", body: "User-centred UI/UX reduces friction, so visitors find what they need and take action." },
    ],
    approach: [
      { step: "Immerse", body: "Workshops, stakeholder interviews and competitive audit to understand the brief behind the brief." },
      { step: "Define", body: "Positioning, creative territories and a clear design rationale agreed before execution." },
      { step: "Design", body: "Iterative concept development with structured feedback rounds and real-world mock-ups." },
      { step: "Deliver", body: "Production-ready files, guidelines and hand-over so your team can run with it." },
    ],
    accent: "#5e79bb",
    metaTitle: "Brand Identity, UI/UX & Website Design",
    metaDescription:
      "Brand identity, UI/UX, website design and creative campaigns from Candies Studio — strategic design systems that make brands recognisable and scalable.",
  },
  {
    slug: "content",
    index: "02",
    title: "Content",
    summary:
      "Content strategy, copywriting, storytelling, creative content production and brand communication.",
    headline: "Stories with a point of view — produced at the pace of business.",
    intro:
      "Great content answers the real questions your customers are asking. Our strategists and writers study your niche, your audience's pain points and your commercial goals, then create, produce and distribute content that earns attention and builds trust — from a single brand film to an always-on content engine.",
    capabilities: ["Content strategy", "Copywriting", "Storytelling", "Content production", "Brand communication"],
    deliverables: [
      "Content strategy, editorial calendars and channel playbooks",
      "Brand voice, messaging frameworks and tone-of-voice guides",
      "Copywriting for websites, campaigns, reports and leadership communication",
      "Photo, video, motion and 3D content production",
      "Social-first content series and short-form video",
      "Large-scale production and distribution so your story takes centre stage",
    ],
    benefits: [
      { title: "A voice people trust", body: "A clear messaging framework keeps every team saying the right thing, the same way." },
      { title: "Content that does a job", body: "Every piece is mapped to an audience need and a business objective — not just a posting schedule." },
      { title: "One partner, end to end", body: "Strategy, writing and production under one roof means fewer hand-offs and faster turnaround." },
    ],
    approach: [
      { step: "Listen", body: "Audience research, content audit and search insight to find what matters to your customers." },
      { step: "Plan", body: "Editorial pillars, formats and calendars tied to your commercial priorities." },
      { step: "Produce", body: "Writing, shooting, editing and animating with tight review loops." },
      { step: "Amplify", body: "Distribution, repurposing and performance review to keep improving." },
    ],
    accent: "#e8577d",
    metaTitle: "Content Strategy, Copywriting & Production",
    metaDescription:
      "Content strategy, copywriting, storytelling and creative content production from Candies Studio — content that earns attention and builds trust.",
  },
  {
    slug: "digital-marketing",
    index: "03",
    title: "Digital Marketing",
    summary:
      "Digital strategy, social media, performance marketing, SEO, campaign management and audience engagement.",
    headline: "Reach the right people, then give them a reason to act.",
    intro:
      "We plan and run digital programmes that connect creative with measurable outcomes. From search and social to performance media, influencer and email, we build the channel mix around your audience and your targets, and report transparently on what is working.",
    capabilities: ["Digital strategy", "Social media", "Performance marketing", "SEO", "Campaign management", "Audience engagement"],
    deliverables: [
      "Digital strategy and channel planning",
      "Social media management, community and content calendars",
      "Paid search, paid social and performance campaign management",
      "Search engine optimisation — technical, on-page and content",
      "Influencer and email marketing programmes",
      "Dashboards and transparent reporting against agreed KPIs",
    ],
    benefits: [
      { title: "Spend with intent", body: "Every rupee, dirham or dollar is tied to an objective, an audience and a measurement plan." },
      { title: "Creative that performs", body: "Because design and content sit with us too, we can test and iterate creative quickly." },
      { title: "Clarity, not jargon", body: "Regular reporting in plain language, so leadership can see what is driving results." },
    ],
    approach: [
      { step: "Audit", body: "Channels, analytics, competitors and audience behaviour reviewed to establish a baseline." },
      { step: "Strategise", body: "Objectives, KPIs, channel mix and budget allocation agreed up front." },
      { step: "Launch", body: "Campaign build, creative production, tracking set-up and go-live." },
      { step: "Optimise", body: "Continuous testing, reporting and reallocation towards what works." },
    ],
    accent: "#34b98a",
    metaTitle: "Digital Marketing, SEO & Performance Campaigns",
    metaDescription:
      "Digital strategy, social media, SEO, performance marketing and campaign management from Candies Studio — channels planned around your audience and goals.",
  },
  {
    slug: "websites-and-applications",
    index: "04",
    title: "Websites & Applications",
    shortTitle: "Web & Apps",
    summary:
      "Corporate websites, e-commerce, web applications, mobile apps, CMS platforms and ongoing support.",
    headline: "Digital products that look the part — and work hard for the business.",
    intro:
      "Your website or app is often the first real conversation a customer has with your brand. We plan, design and build fast, secure and accessible digital products — from corporate websites and campaign microsites to e-commerce stores, customer portals and mobile applications. Design and engineering sit in the same team, so what gets approved is exactly what gets launched, and it stays easy for your team to update long after go-live.",
    capabilities: ["Corporate websites", "E-commerce", "Web applications", "Mobile apps", "CMS & integrations", "Support & maintenance"],
    deliverables: [
      "Discovery, information architecture, sitemaps and user journeys",
      "UI/UX design systems, interactive prototypes and usability testing",
      "Responsive websites on modern stacks (Next.js, React) or CMS platforms such as WordPress, Webflow and Shopify",
      "Web applications, dashboards and customer portals with secure logins",
      "iOS and Android apps (cross-platform or native) and progressive web apps",
      "Integrations — CRM, payment gateways, analytics, marketing automation and APIs",
      "Technical SEO, performance optimisation and accessibility (WCAG) built in",
      "Hosting setup, security updates, maintenance and ongoing enhancement retainers",
    ],
    benefits: [
      { title: "Built to convert", body: "Clear journeys, fast load times and purposeful calls to action turn visitors into enquiries, sign-ups and sales." },
      { title: "Easy to own", body: "A CMS your team can actually use, documented code and a clean hand-over — no dependency on us for every small change." },
      { title: "Secure and scalable", body: "Modern architecture, best-practice security and performance budgets, so the platform grows with your business." },
    ],
    approach: [
      { step: "Discover", body: "Goals, users, content and technical requirements mapped into a clear scope and roadmap." },
      { step: "Design", body: "Wireframes, UI design and clickable prototypes reviewed with you before development starts." },
      { step: "Build", body: "Agile development in sprints with staging previews, QA across devices and browsers, and content migration." },
      { step: "Launch & grow", body: "Go-live, analytics, training and ongoing support — with improvements driven by real usage data." },
    ],
    accent: "#6046aa",
    metaTitle: "Website Design & Development, Web Apps & Mobile Apps",
    metaDescription:
      "Corporate websites, e-commerce, web applications and mobile apps from Candies Studio — designed and built to be fast, secure, accessible and easy to manage.",
  },
  {
    slug: "events",
    index: "05",
    title: "Events",
    summary:
      "Corporate events, brand activations, product launches, event communication and experiential marketing.",
    headline: "Moments that people talk about long after the lights go down.",
    intro:
      "From corporate gatherings to product launches and brand activations, we design, plan and execute every detail. Our design and content teams make sure the experience, the communication and the story around it all feel like one idea — leaving a lasting impression on everyone in the room and everyone who sees it afterwards.",
    capabilities: ["Corporate events", "Brand activations", "Product launches", "Event communication", "Experiential marketing"],
    deliverables: [
      "Event concept, theme and experience design",
      "Planning, vendor coordination and on-ground execution",
      "Stage, set, signage and spatial graphics",
      "Invitations, event identity and pre/post-event communication",
      "Brand activations and experiential installations",
      "Event content capture — photo, video and social coverage",
    ],
    benefits: [
      { title: "One idea, every touchpoint", body: "The same team shapes the invite, the stage, the content and the follow-up — so it all connects." },
      { title: "Flawless on the day", body: "Detailed run-of-show planning and coordination so your team can focus on your guests." },
      { title: "Value beyond the venue", body: "Captured content extends the event's reach across digital channels." },
    ],
    approach: [
      { step: "Brief", body: "Objectives, audience, budget and success criteria agreed together." },
      { step: "Concept", body: "Theme, experience journey and creative identity for the event." },
      { step: "Produce", body: "Design, fabrication, vendor management and rehearsals." },
      { step: "Deliver", body: "On-ground execution, content capture and post-event communication." },
    ],
    accent: "#f2a33a",
    metaTitle: "Corporate Events, Brand Activations & Launches",
    metaDescription:
      "Corporate events, product launches, brand activations and experiential marketing from Candies Studio — designed, planned and executed end to end.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/** A genuine Candies Studio event, from the existing /events page. */
export const studioEvents = [
  {
    title: "Morning Coffee Groove",
    date: "2026-01-10T09:00:00+05:30",
    dateLabel: "Sat, 10 Jan 2026 · 9:00 AM",
    venue: "Big Boy Cake and Bakers / GOAT Coffee Company (Refined Sugar-Free), Navi Mumbai",
    description: "A weekend morning of refined sugar-free coffee and acoustic sets — a Candies Studio community event.",
    image: "/media/events/morning-coffee-groove.png",
  },
];
