/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — single source of truth for business info
 * ─────────────────────────────────────────────────────────────
 *  Everything here was taken from the live candies.studio website
 *  (audited Nov 2026). Anything marked `TODO(admin)` is information
 *  that was NOT available on the old site and must be confirmed by
 *  the Candies Studio team before it is filled in. Empty values are
 *  simply not rendered — nothing is invented.
 */

export const site = {
  name: "Candies Studio",
  shortName: "Candies",
  tagline: "Elevate your brand story",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.candies.studio").replace(/\/$/, ""),
  description:
    "Candies Studio is an independent creative and digital studio bringing together strategy, design, content, digital marketing and events to build brands that move forward.",
  email: "create@candies.studio",

  /** Verified claim from the existing site: "more than 25 years of combined creative knowledge". */
  combinedExperienceYears: 25,

  /** Addresses exactly as published on the existing Contact page. */
  addresses: [
    {
      label: "India",
      city: "Navi Mumbai",
      lines: ["Inspire Co-spaces, Mayuresh Square", "Sector-15, CBD Belapur", "Navi Mumbai 400614"],
      country: "India",
      countryCode: "IN",
    },
    {
      label: "UAE",
      city: "Dubai",
      lines: ["104, Garhoud Star Building", "Al Garhoud, Dubai"],
      country: "United Arab Emirates",
      countryCode: "AE",
    },
    {
      label: "USA",
      city: "Sheridan, WY",
      lines: ["1309, Coffeen Avenue Ste 1200", "Sheridan, WY 82801"],
      country: "United States",
      countryCode: "US",
    },
  ],

  /**
   * "Global Footprint" markets as listed on the existing homepage.
   * These are markets the studio has worked in — NOT office locations.
   */
  footprint: ["India", "United States", "United Kingdom", "France", "Australia", "New Zealand"],

  /**
   * Social profiles. TODO(admin): the old site showed a "Social" heading
   * but no links. Add full URLs here; empty entries are hidden.
   */
  social: {
    instagram: "",
    linkedin: "",
    behance: "",
    facebook: "",
    x: "",
    youtube: "",
  } as Record<string, string>,

  /** Set NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, intl format) to show WhatsApp links. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",

  /**
   * Default colour theme: "dark" (original) or "bright".
   * Set NEXT_PUBLIC_THEME=bright (or the THEME repo variable on GitHub Pages)
   * to make bright the default. Visitors can preview the other theme with
   * ?theme=bright / ?theme=dark, or with the switch in the footer.
   */
  theme: (process.env.NEXT_PUBLIC_THEME === "bright" ? "bright" : "dark") as "bright" | "dark",

  /** The studio's own mantra, from the existing About page. */
  mantra: ["Imagine.", "Create.", "Inspire.", "Succeed.", "Repeat."],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our Work" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export function socialLinks() {
  return Object.entries(site.social)
    .filter(([, url]) => Boolean(url))
    .map(([key, url]) => ({ key, url, label: key === "x" ? "X (Twitter)" : key[0].toUpperCase() + key.slice(1) }));
}

export function whatsappLink(message = "Hi Candies Studio, I'd like to discuss a project.") {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
