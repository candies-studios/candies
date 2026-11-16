/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO / CASE STUDIES
 * ─────────────────────────────────────────────────────────────
 *  The old site's portfolio contained only a WordPress theme demo
 *  ("Activation" / "London Barbershop" with lorem-ipsum text), so
 *  NO genuine projects could be migrated and none have been invented.
 *
 *  HOW TO ADD A PROJECT
 *  1. Put images in /public/media/work/<slug>/ (cover ≈ 1600×1200).
 *  2. Copy the template below into `projects`, fill it in, and set
 *     `published: true`.
 *  3. Only include `results` you can verify.
 *
 *  Until at least one project is published, /work shows the verified
 *  client roster and capabilities instead of an empty grid, and the
 *  homepage "Featured Work" section shows the client showcase.
 */

export const categories = [
  "Branding & Design",
  "Digital Experiences",
  "Content & Campaigns",
  "Events & Activations",
] as const;
export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  published: boolean;
  client: string;
  title: string;
  industry: string;
  category: Category;
  year?: string;
  cover: string;
  gallery?: string[];
  overview: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  /** Verified results only. Leave empty if none. */
  results?: { value: string; label: string }[];
  services: string[]; // service slugs
};

/** Template — copy, fill in and set published: true. */
export const projectTemplate: Project = {
  slug: "client-project-name",
  published: false,
  client: "Client name",
  title: "Project title",
  industry: "Industry",
  category: "Branding & Design",
  year: "2026",
  cover: "/media/work/client-project-name/cover.jpg",
  gallery: [],
  overview: "One or two sentences on what the project was.",
  challenge: "What problem was the client facing?",
  approach: "How Candies Studio approached it.",
  deliverables: ["Deliverable one", "Deliverable two"],
  results: [],
  services: ["design"],
};

export const projects: Project[] = [
  // Add genuine projects here.
];

export const publishedProjects = () => projects.filter((p) => p.published);
export const getProject = (slug: string) => publishedProjects().find((p) => p.slug === slug);
