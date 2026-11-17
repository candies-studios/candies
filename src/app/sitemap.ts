export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { publishedProjects } from "@/content/projects";
import { publishedPosts } from "@/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/about", "/services", "/work", "/insights", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...publishedProjects().map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...publishedPosts().map((p) => ({ url: `${site.url}/insights/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
