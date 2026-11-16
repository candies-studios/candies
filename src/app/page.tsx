import { Hero } from "@/components/sections/Hero";
import { BrandIntro } from "@/components/sections/BrandIntro";
import { Capabilities } from "@/components/sections/Capabilities";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { WhyCandies } from "@/components/sections/WhyCandies";
import { ClientShowcase } from "@/components/sections/ClientShowcase";
import { GlobalPresence } from "@/components/sections/GlobalPresence";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ path: "/" }),
  title: { absolute: "Candies Studio — Creative & Digital Studio | Branding, Content, Digital, Events" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <Capabilities />
      <FeaturedWork />
      <WhyCandies />
      <ClientShowcase />
      <GlobalPresence />
      <FinalCTA />
    </>
  );
}
