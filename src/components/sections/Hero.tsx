import { HeroVisual } from "../three/HeroVisual";
import { ButtonLink } from "../Button";
import { Reveal, SplitLines } from "../motion";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper grain">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -left-40 top-1/3 size-[40rem] rounded-full bg-candy/20 blur-[160px]" />
        <div className="absolute right-0 top-0 size-[36rem] rounded-full bg-grape/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_srgb,var(--color-ink)_85%,transparent)_100%)]" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[54svh] lg:inset-0 lg:h-auto">
        <HeroVisual />
      </div>
      {/* legibility veil on small screens */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%] bg-gradient-to-t from-ink via-ink/80 to-transparent lg:hidden" />

      <div className="container-x flex flex-1 flex-col justify-end pb-14 pt-[46svh] sm:pb-14 lg:justify-center lg:pb-10 lg:pt-28">
        <Reveal y={12}>
          <p className="eyebrow text-candy-soft">Independent creative &amp; digital studio</p>
        </Reveal>
        <SplitLines
          as="h1"
          id="hero-title"
          immediate
          delay={0.15}
          className="hero-title display mt-6 max-w-[15ch] sm:max-w-none lg:mt-7 lg:mix-blend-difference"
          lines={[
            "We turn ideas into",
            "experiences that",
            <span key="l3">
              move brands <span className="serif-accent text-candy-soft">forward.</span>
            </span>,
          ]}
        />
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end lg:mt-[min(3rem,4svh)]">
          <Reveal delay={0.7} className="md:col-span-6 lg:col-span-5">
            <p className="lede text-paper/72">
              We are an independent creative and digital studio bringing together strategy, design, content and
              technology to create meaningful brand experiences.
            </p>
          </Reveal>
          <Reveal delay={0.85} className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end lg:col-span-7">
            <ButtonLink href="/work" variant="light">
              Explore our work
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Start a project
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <div className="container-x relative">
        <Reveal delay={1.1} y={0}>
          <div className="flex items-center justify-between gap-6 border-t border-fg/10 py-5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-paper/50">
            <span className="hidden sm:inline">{site.combinedExperienceYears}+ years of combined creative experience</span>
            <span className="hidden md:inline">Design · Content · Digital · Web · Events</span>
            <a href="#intro" className="group inline-flex items-center gap-3 text-paper/70 hover:text-paper">
              Scroll
              <span className="relative block h-8 w-[1px] overflow-hidden bg-fg/15">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-paper motion-safe:animate-[scrollcue_2.2s_cubic-bezier(0.83,0,0.17,1)_infinite]" />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
