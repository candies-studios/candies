import type { Metadata } from "next";
import { ThankYou } from "@/components/landing/ThankYou";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: `Thank you — ${site.name}` },
  description: "Your enquiry has been received.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
