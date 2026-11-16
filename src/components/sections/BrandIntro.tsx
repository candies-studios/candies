import { Reveal, SplitLines } from "../motion";
import { ButtonLink } from "../Button";
import { site } from "@/content/site";

const disciplines = ["Strategy", "Design", "Content", "Digital", "Technology", "Experiences"];

export function BrandIntro() {
  return (
    <section id="intro" aria-labelledby="intro-title" className="relative bg-paper text-ink section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow text-candy-deep">Who we are</p>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <SplitLines
              id="intro-title"
              className="display display-lg"
              lines={[
                "Creativity with purpose.",
                <span key="2">
                  Ideas with <span className="serif-accent text-candy-deep">impact.</span>
                </span>,
              ]}
            />
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              <Reveal>
                <p className="text-xl leading-relaxed text-ink/80 sm:text-2xl sm:leading-[1.5]">
                  Candies Studio combines creative thinking, design, content, digital strategy and execution to help
                  brands grow.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="leading-relaxed text-ink/65">
                  Our team of strategists, designers, writers, marketers and producers crafts custom solutions for each
                  brand&apos;s specific needs — from identity and websites to content, campaigns and live events. With
                  more than {site.combinedExperienceYears} years of combined creative experience, we approach every
                  challenge through well-thought, streamlined processes and a genuinely collaborative way of working.
                </p>
                <div className="mt-8">
                  <ButtonLink href="/about" variant="outline-dark">
                    About the studio
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* kinetic discipline strip */}
        <Reveal className="mt-24 lg:mt-32">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-ink/10 py-8">
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-center gap-4">
                <span className="display text-[clamp(1.4rem,3.4vw,3rem)] text-ink/85 transition-colors duration-300 hover:text-candy">
                  {d}
                </span>
                {i < disciplines.length - 1 && <span aria-hidden className="candy-stripe block size-3 rounded-full sm:size-4" />}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
