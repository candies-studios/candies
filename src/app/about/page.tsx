import { PageHero } from "@/components/sections/PageHero";
import { ClientShowcase } from "@/components/sections/ClientShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal, SplitLines } from "@/components/motion";
import { TeamCard } from "@/components/TeamCard";
import { ButtonLink } from "@/components/Button";
import { team } from "@/content/team";
import { values, pillars, methodology } from "@/content/studio";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Meet Candies Studio — thinkers, makers and creative problem solvers bringing together imagination, strategy and execution to help businesses build stronger brands.",
  path: "/about",
});

const valueAccents = ["#5e79bb", "#34b98a", "#f2a33a", "#a9b8e0", "#e8577d", "#6046aa"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Candies Studio"
        lines={[
          "We are thinkers,",
          "makers and creative",
          <span key="3">
            problem <span className="serif-accent text-candy-soft">solvers.</span>
          </span>,
        ]}
        intro={
          <p>
            At Candies Studio, we bring together imagination, strategic thinking and creative execution to help
            businesses communicate better, connect with audiences and build stronger brands.
          </p>
        }
      />

      {/* Brand introduction */}
      <section aria-labelledby="about-intro" className="bg-paper text-ink section-y">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-candy-deep">The studio</p>
          </Reveal>
          <div className="lg:col-span-9">
            <SplitLines
              id="about-intro"
              className="display display-md"
              lines={[
                "Innovative solutions.",
                "Exceptional creativity.",
                <span key="3">
                  Impactful <span className="serif-accent text-candy-deep">results.</span>
                </span>,
              ]}
            />
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              <Reveal>
                <p className="text-xl leading-relaxed text-ink/80">
                  We work closely with our clients to understand their unique needs and goals, and we are committed to
                  delivering work that exceeds expectations.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="leading-relaxed text-ink/65">
                  The creative and digital domain is constantly evolving, which is why we stay up to date with the
                  latest trends and technologies. Our team is always learning and growing, so we can bring clients the
                  most innovative solutions possible — and we pride ourselves on thinking beyond the obvious to solve
                  complex challenges.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Story & evolution */}
      <section aria-labelledby="story-title" className="bg-ink text-paper section-y">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-candy-soft">Our story</p>
          </Reveal>
          <SplitLines
            id="story-title"
            className="display display-lg mt-7 max-w-[16ch]"
            lines={["From design studio", <span key="2">to <span className="serif-accent text-candy-soft">creative partner.</span></span>]}
          />
          <ol className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              {
                k: "Chapter 01",
                t: "A digital design studio",
                b: "Candies started with a simple focus: crafting unique brand identities and online experiences, and approaching creative challenges through well-thought, streamlined processes.",
              },
              {
                k: "Chapter 02",
                t: "Becoming full service",
                b: "As client needs grew, so did we — adding content, digital marketing and events, so brands could work with one team from idea to execution.",
              },
              {
                k: "Chapter 03",
                t: "Today",
                b: `A team of strategists, designers, writers, marketers and producers with more than ${site.combinedExperienceYears} years of combined creative experience, working across markets including ${site.footprint.slice(0, -1).join(", ")} and ${site.footprint.at(-1)}.`,
              },
            ].map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 0.1} className="relative rounded-[1.75rem] border border-white/10 bg-ink-2 p-8 sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-candy-soft">{c.k}</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">{c.t}</h3>
                <p className="mt-4 leading-relaxed text-paper/65">{c.b}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-title" className="relative overflow-hidden bg-ink text-paper">
        <div className="container-x grid gap-12 border-t border-white/10 py-24 sm:py-32 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-candy-soft">Philosophy &amp; approach</p>
            </Reveal>
            <SplitLines
              id="philosophy-title"
              className="display display-md mt-7"
              lines={["Creativity that", <span key="2">drives <span className="serif-accent text-candy-soft">success.</span></span>]}
            />
          </div>
          <Reveal className="space-y-6 lg:col-span-6" delay={0.1}>
            <p className="lede text-paper/75">
              We believe the best creative work is equal parts imagination and intention. Every idea has to earn its
              place by serving the brand, the audience and the business.
            </p>
            <p className="text-paper/60">
              We value collaboration, honesty and transparency. Open communication builds strong, lasting
              relationships — and better work. That&apos;s why clients see our thinking, not just our output.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What makes us different */}
      <section aria-labelledby="diff-title" className="bg-paper text-ink section-y">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-candy-deep">What makes us different</p>
              </Reveal>
              <SplitLines id="diff-title" className="display display-md mt-7" lines={["Integrated by design.", <span key="2" className="serif-accent text-candy-deep">Obsessive in detail.</span>]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="text-ink/65">
                {services.map((s) => s.title).join(", ").replace(/, ([^,]*)$/, " and $1")} live under one roof, so
                strategy, craft and delivery stay connected from first workshop to final launch.
              </p>
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 3) * 0.06} className="bg-paper p-8 transition-colors duration-500 hover:bg-white sm:p-10">
                <span className="text-xs font-semibold tracking-[0.2em] text-ink/40">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-ink/65">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="relative overflow-hidden bg-ink text-paper section-y">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-candy-soft">Core values</p>
          </Reveal>
          <SplitLines id="values-title" className="display display-lg mt-7" lines={["What we", <span key="2" className="serif-accent text-candy-soft">stand for.</span>]} />
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 3) * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 p-8 transition-colors duration-700 hover:border-white/25 sm:p-10">
                  <div className="[perspective:600px]">
                    <span
                      aria-hidden
                      className="block size-16 rounded-full transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:[transform:rotateY(180deg)_scale(1.1)]"
                      style={{
                        background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.75), transparent 35%), radial-gradient(circle at 70% 80%, rgba(0,0,0,.45), transparent 55%), ${valueAccents[i]}`,
                      }}
                    />
                  </div>
                  <h3 className="display mt-10 text-3xl">{v.title}</h3>
                  <p className="mt-4 leading-relaxed text-paper/65">{v.body}</p>
                  <span aria-hidden className="pointer-events-none absolute -bottom-6 -right-2 display text-[7rem] leading-none text-white/[0.03]">
                    0{i + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section id="team" aria-labelledby="team-title" className="bg-ink text-paper">
        <div className="container-x border-t border-white/10 py-24 sm:py-32 lg:py-40">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-candy-soft">Meet the team</p>
              </Reveal>
              <SplitLines id="team-title" className="display display-lg mt-7" lines={["Hello!", <span key="2">Nice to <span className="serif-accent text-candy-soft">meet you.</span></span>]} />
            </div>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <p className="text-paper/65">
                A talented team of designers, writers, strategists and marketers — passionate, inventive and dedicated
                to work that resonates with our clients&apos; audiences.
              </p>
            </Reveal>
          </div>
          <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:gap-x-10">
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 3) * 0.06}>
                <TeamCard member={m} index={i} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Methodology */}
      <section aria-labelledby="method-title" className="bg-paper text-ink section-y">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-candy-deep">How we work</p>
          </Reveal>
          <SplitLines id="method-title" className="display display-md mt-7 max-w-[18ch]" lines={["A clear process.", <span key="2" className="serif-accent text-candy-deep">No surprises.</span>]} />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
            <span aria-hidden className="absolute left-0 right-0 top-5 hidden h-px bg-ink/15 md:block" />
            {methodology.map((m, i) => (
              <Reveal as="li" key={m.n} delay={i * 0.08} className="relative">
                <span className="relative z-10 grid size-10 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{m.n}</span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Mantra */}
      <section aria-label="Our mantra" className="overflow-hidden bg-candy py-10 text-white sm:py-14">
        <div className="flex w-max animate-marquee gap-10 motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center" style={{ ["--marquee-duration" as string]: "30s" }}>
          {[0, 1].map((k) => (
            <p key={k} aria-hidden={k === 1} className="display flex shrink-0 items-center gap-10 whitespace-nowrap text-[clamp(2.4rem,6vw,5.5rem)] motion-reduce:[&:nth-child(2)]:hidden">
              {site.mantra.map((w) => (
                <span key={w} className="flex items-center gap-10">
                  {w}
                  <span aria-hidden className="candy-stripe block size-[0.55em] rounded-full" />
                </span>
              ))}
            </p>
          ))}
        </div>
        <p className="container-x mt-6 text-sm text-white/80">
          Our mantra — our commitment to innovation, creativity and exceptional results for the brands we work with.
        </p>
      </section>

      <ClientShowcase eyebrow="Client relationships" title={["Partnerships built", "on trust."]} />

      <section className="bg-paper pb-24 text-ink sm:pb-32">
        <div className="container-x flex flex-col items-start gap-6 border-t border-ink/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-ink/70">Want to see how we can help your brand? Explore our capabilities or get in touch.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/services" variant="outline-dark">
              Our services
            </ButtonLink>
            <ButtonLink href="/contact">Start a project</ButtonLink>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
