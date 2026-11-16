import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/motion";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { publishedPosts } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description: "Thinking on branding, design, content, digital marketing and brand experiences from the Candies Studio team.",
  path: "/insights",
});

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function InsightsPage() {
  const posts = publishedPosts();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        lines={["Notes from", <span key="2">the <span className="serif-accent text-candy-soft">studio.</span></span>]}
        intro={<p>Perspectives on brand, design, content and digital — written for the people who build brands.</p>}
      />
      <section aria-label="Articles" className="bg-ink text-paper">
        <div className="container-x pb-24 sm:pb-32">
          {posts.length ? (
            <ul className="border-t border-fg/10">
              {posts.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.05} className="border-b border-fg/10">
                  <Link href={`/insights/${p.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:items-baseline">
                    <span className="text-sm text-paper/45 md:col-span-2">
                      <time dateTime={p.date}>{fmt(p.date)}</time>
                    </span>
                    <span className="md:col-span-7">
                      <span className="block text-2xl font-semibold tracking-tight transition-colors group-hover:text-candy-soft sm:text-3xl">{p.title}</span>
                      <span className="mt-3 block text-paper/60">{p.excerpt}</span>
                    </span>
                    <span className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
                      <span className="rounded-full border border-fg/15 px-3 py-1 text-xs text-paper/70">{p.topic}</span>
                      <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal>
              <div className="rounded-[2rem] border border-fg/10 bg-ink-2 p-8 sm:p-12">
                <p className="display display-sm max-w-[24ch] normal-case tracking-[-0.03em]">
                  Our first articles are on the way.
                </p>
                <p className="mt-5 max-w-xl text-paper/60">
                  We&apos;re writing about brand building, design systems, content that performs and creating memorable
                  experiences. Have a topic you&apos;d like us to cover?
                </p>
                <div className="mt-8">
                  <ButtonLink href="/contact" variant="ghost">
                    Tell us
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
