import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { campaigns, getCampaign } from "@/content/landing";
import { site } from "@/content/site";

/**
 * Optional campaign variants (/lp/<slug>/), driven by `campaigns` in
 * src/content/landing.ts. When that list is empty (current setup — only /lp/
 * is used), a placeholder path is generated that simply renders the 404 page,
 * because static export needs at least one path for a dynamic route.
 */
type Params = { params: Promise<{ campaign: string }> };

export function generateStaticParams() {
  const list = campaigns.map((c) => ({ campaign: c.slug }));
  return list.length ? list : [{ campaign: "_" }];
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCampaign((await params).campaign);
  if (!c) return { robots: { index: false } };
  const url = `${site.url}/lp/${c.slug}/`;
  return {
    title: { absolute: `${c.metaTitle} — ${site.name}` },
    description: c.metaDescription,
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url, siteName: site.name, type: "website" },
  };
}

export default async function CampaignLanding({ params }: Params) {
  const c = getCampaign((await params).campaign);
  if (!c) notFound();
  return <LandingPage campaign={c} />;
}
