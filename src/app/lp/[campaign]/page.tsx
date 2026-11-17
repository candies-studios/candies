import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";
import { campaigns, getCampaign } from "@/content/landing";
import { site } from "@/content/site";

type Params = { params: Promise<{ campaign: string }> };

export function generateStaticParams() {
  return campaigns.map((c) => ({ campaign: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCampaign((await params).campaign);
  if (!c) return {};
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
