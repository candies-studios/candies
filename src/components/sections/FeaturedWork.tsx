import Image from "next/image";
import Link from "next/link";
import { publishedProjects } from "@/content/projects";
import { clients } from "@/content/clients";
import { ButtonLink } from "../Button";
import { MaskReveal, Reveal, SplitLines } from "../motion";
import { TiltCard } from "../TiltCard";
import { asset } from "@/lib/asset";

/**
 * Featured work. Shows published case studies in an editorial layout.
 * If none have been published yet (the old site had none to migrate),
 * it presents the verified client experience by sector instead —
 * nothing is invented.
 */
export function FeaturedWork() {
  const projects = publishedProjects().slice(0, 4);

  return (
    <section aria-labelledby="work-title" className="relative bg-ink text-paper section-y">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-candy-soft">{projects.length ? "Featured work" : "Experience"}</p>
            </Reveal>
            <SplitLines
              id="work-title"
              className="display display-lg mt-7"
              lines={
                projects.length
                  ? ["Selected", <span key="2" className="serif-accent text-candy-soft">work.</span>]
                  : ["Work across", <span key="2">sectors that <span className="serif-accent text-candy-soft">matter.</span></span>]
              }
            />
          </div>
          <Reveal delay={0.1}>
            <ButtonLink href="/work" variant="ghost">
              View all projects
            </ButtonLink>
          </Reveal>
        </div>

        {projects.length > 0 ? (
          <div className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-12">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                className={
                  i % 4 === 0 ? "md:col-span-7" : i % 4 === 1 ? "md:col-span-5 md:mt-32" : i % 4 === 2 ? "md:col-span-5" : "md:col-span-7 md:-mt-24"
                }
              >
                <Link href={`/work/${p.slug}`} className="group block">
                  <TiltCard className="rounded-[1.75rem]">
                    <MaskReveal className="relative aspect-[4/3] rounded-[1.75rem] bg-ink-3">
                      <Image
                        src={asset(p.cover)}
                        alt={`${p.client} — ${p.title}`}
                        fill
                        sizes="(min-width:768px) 55vw, 100vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
                      />
                    </MaskReveal>
                  </TiltCard>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/45">
                        {p.client} · {p.industry}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.title}</h3>
                    </div>
                    <span className="mt-1 shrink-0 rounded-full border border-fg/15 px-3 py-1 text-xs text-paper/70">{p.category}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <SectorRoster />
        )}
      </div>
    </section>
  );
}

export function SectorRoster() {
  const sectors = Array.from(new Set(clients.map((c) => c.sector).filter(Boolean))) as string[];
  const accents = ["#5e79bb", "#e8577d", "#34b98a", "#f2a33a"];
  return (
    <ul className="mt-16 border-t border-fg/10">
      {sectors.map((sector, i) => {
        const names = clients.filter((c) => c.sector === sector).map((c) => c.name);
        return (
          <Reveal as="li" key={sector} delay={i * 0.06} className="group relative border-b border-fg/10">
            <div className="grid gap-4 py-8 transition-[padding] duration-700 ease-[var(--ease-out-expo)] md:grid-cols-12 md:items-center md:py-10 md:group-hover:py-14">
              <span className="text-sm font-semibold tracking-[0.2em] text-paper/40 md:col-span-1">0{i + 1}</span>
              <h3 className="display text-[clamp(1.6rem,3.2vw,3.2rem)] md:col-span-6">{sector}</h3>
              <p className="text-paper/60 md:col-span-4">{names.join(" · ")}</p>
              <span
                aria-hidden
                className="hidden size-10 justify-self-end rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-125 md:col-span-1 md:block"
                style={{
                  background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.75), transparent 35%), radial-gradient(circle at 70% 80%, rgba(0,0,0,.4), transparent 55%), ${accents[i % accents.length]}`,
                }}
              />
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
