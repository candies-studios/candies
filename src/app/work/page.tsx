import { PageHero } from "@/components/sections/PageHero";
import { ClientShowcase } from "@/components/sections/ClientShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SectorRoster } from "@/components/sections/FeaturedWork";
import { WorkGrid } from "@/components/WorkGrid";
import { Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/Button";
import { categories, publishedProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Work",
  description:
    "Selected branding, digital, content and event work from Candies Studio for clients across banking, financial services, FMCG and media.",
  path: "/work",
});

export default function WorkPage() {
  const projects = publishedProjects();
  // Only show category filters that actually have projects
  const activeCategories = categories.filter((c) => projects.some((p) => p.category === c));

  return (
    <>
      <PageHero
        eyebrow="Our work"
        lines={["Ideas, crafted", <span key="2">and <span className="serif-accent text-candy-soft">delivered.</span></span>]}
        intro={
          <p>
            Brand identities, digital experiences, content and live events for organisations that care about how they
            show up in the world.
          </p>
        }
      />

      <section aria-label="Projects" className="bg-ink text-paper">
        <div className="container-x pb-24 sm:pb-32">
          {projects.length > 0 ? (
            <WorkGrid projects={projects} categories={activeCategories as string[]} />
          ) : (
            <>
              <Reveal>
                <div className="rounded-[2rem] border border-white/10 bg-ink-2 p-8 sm:p-12">
                  <p className="eyebrow text-candy-soft">Case studies</p>
                  <p className="display display-sm mt-6 max-w-[26ch] normal-case tracking-[-0.03em]">
                    Detailed case studies are being prepared. In the meantime, here&apos;s where our experience lies.
                  </p>
                  <p className="mt-6 max-w-2xl text-paper/60">
                    Want to see work relevant to your industry? We&apos;re happy to walk you through examples on a call.
                  </p>
                  <div className="mt-8">
                    <ButtonLink href="/contact">Request our credentials</ButtonLink>
                  </div>
                </div>
              </Reveal>
              <SectorRoster />
            </>
          )}
        </div>
      </section>

      <ClientShowcase />
      <FinalCTA />
    </>
  );
}
