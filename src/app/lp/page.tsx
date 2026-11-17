import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { masterCampaign } from "@/content/landing";
import { site } from "@/content/site";

/** Paid-traffic landing pages are kept out of search results (noindex) to avoid duplicate content. */
export const metadata: Metadata = {
  title: { absolute: `${masterCampaign.metaTitle} — ${site.name}` },
  description: masterCampaign.metaDescription,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.url}/lp/` },
  openGraph: { title: masterCampaign.metaTitle, description: masterCampaign.metaDescription, url: `${site.url}/lp/`, siteName: site.name, type: "website" },
};

export default function LandingMaster() {
  return <LandingPage campaign={masterCampaign} />;
}
