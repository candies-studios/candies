import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/motion";
import { ServiceGlyph } from "@/components/ServiceGlyph";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Design, content, digital marketing and events — Candies Studio is a full-service creative partner covering brand identity, UI/UX, content production, SEO, performance marketing and corporate events.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        lines={["We craft brand", <span key="2">experiences, <span className="serif-accent text-candy-soft">end to end.</span></span>]}
        intro={
          <p>
            We&apos;re full service, which means we&apos;ve got you covered on design and content right through to
            digital and events. Collaboration is central to everything we do.
          </p>
        }
      >
        <nav aria-label="Services" className="mt-14 flex flex-wrap gap-2">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-paper/80 transition-colors hover:border-white/50 hover:text-paper">
              {s.index} · {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {services.map((s, i) => {
        const light = i % 2 === 1;
        return (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            className={light ? "scroll-mt-24 bg-paper text-ink" : "scroll-mt-24 bg-ink text-paper"}
          >
            <div className={`container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center ${!light && i > 0 ? "border-t border-white/10" : ""}`}>
              <Reveal className={`lg:col-span-5 ${light ? "lg:order-2" : ""}`}>
                <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2.5rem]" style={{ background: light ? "#0b0c14" : "#12141f" }}>
                  <div aria-hidden className="absolute inset-0 opacity-50 blur-[80px]" style={{ background: `radial-gradient(circle at 60% 40%, ${s.accent}, transparent 60%)` }} />
                  <ServiceGlyph slug={s.slug} accent={s.accent} className="absolute inset-[18%]" />
                  <span className="absolute left-6 top-6 text-sm font-semibold tracking-[0.2em] text-white/50">{s.index}</span>
                </div>
              </Reveal>
              <div className={`lg:col-span-7 ${light ? "lg:order-1 lg:pr-10" : "lg:pl-10"}`}>
                <Reveal>
                  <p className={`eyebrow ${light ? "text-candy-deep" : "text-candy-soft"}`}>
                    {s.index} — {s.title}
                  </p>
                  <h2 id={`${s.slug}-title`} className="display display-md mt-6">
                    {s.headline}
                  </h2>
                  <p className={`mt-8 leading-relaxed ${light ? "text-ink/70" : "text-paper/70"}`}>{s.intro}</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <h3 className={`mt-10 text-xs font-semibold uppercase tracking-[0.2em] ${light ? "text-ink/45" : "text-paper/45"}`}>What you get</h3>
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-3 text-sm leading-relaxed">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: s.accent }} />
                        <span className={light ? "text-ink/80" : "text-paper/80"}>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <ButtonLink href={`/services/${s.slug}`} variant={light ? "outline-dark" : "ghost"}>
                      Explore {s.title}
                    </ButtonLink>
                    <ButtonLink href={`/contact?service=${encodeURIComponent(s.title)}`}>Enquire</ButtonLink>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section aria-label="All services" className="border-t border-white/10 bg-ink text-paper">
        <ul className="container-x grid divide-y divide-white/10 py-6 md:grid-cols-4 md:divide-x md:divide-y-0">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 px-2 py-6 md:px-6">
                <span>
                  <span className="block text-xs tracking-[0.2em] text-paper/40">{s.index}</span>
                  <span className="mt-1 block text-lg font-semibold">{s.title}</span>
                </span>
                <ArrowIcon className="text-paper/50 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-paper" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FinalCTA />
    </>
  );
}
