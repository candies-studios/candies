import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal, SplitLines } from "@/components/motion";
import { ServiceGlyph } from "@/components/ServiceGlyph";
import { ArrowIcon, ButtonLink } from "@/components/Button";
import { getService, services, studioEvents } from "@/content/services";
import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = publishedProjects().filter((p) => p.services.includes(s.slug)).slice(0, 3);
  const idx = services.findIndex((x) => x.slug === s.slug);
  const next = services[(idx + 1) % services.length];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.capabilities.join(", "),
    description: s.metaDescription,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    url: `${site.url}/services/${s.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <PageHero
        eyebrow={`Services / ${s.index} — ${s.title}`}
        accent={s.accent}
        lines={[s.title]}
        intro={<p>{s.headline}</p>}
      >
        <div className="mt-12 flex flex-wrap gap-2">
          {s.capabilities.map((c) => (
            <span key={c} className="rounded-full border border-fg/15 px-4 py-2 text-sm text-paper/80">
              {c}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Overview */}
      <section aria-labelledby="overview" className="bg-paper text-ink section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2.5rem] bg-stage stage">
              <div aria-hidden className="absolute inset-0 opacity-60 blur-[80px]" style={{ background: `radial-gradient(circle at 60% 40%, ${s.accent}, transparent 60%)` }} />
              <ServiceGlyph slug={s.slug} accent={s.accent} className="absolute inset-[12%]" />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-candy-deep">Overview</p>
              <h2 id="overview" className="display display-sm mt-6 normal-case tracking-[-0.03em]">
                {s.headline}
              </h2>
              <p className="lede mt-8 text-ink/70">{s.intro}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section aria-labelledby="deliverables" className="bg-ink text-paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow text-candy-soft">Deliverables</p>
            </Reveal>
            <SplitLines id="deliverables" className="display display-md mt-7" lines={["What you", <span key="2" className="serif-accent" style={{ color: s.accent }}>receive.</span>]} />
          </div>
          <ol className="lg:col-span-8">
            {s.deliverables.map((d, i) => (
              <Reveal as="li" key={d} delay={i * 0.04} className="group flex items-baseline gap-6 border-b border-fg/10 py-6 first:border-t">
                <span className="w-8 shrink-0 text-xs font-semibold tracking-[0.2em] text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg text-paper/85 transition-transform duration-500 group-hover:translate-x-2 sm:text-xl">{d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits" className="bg-paper text-ink section-y">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-candy-deep">Business value</p>
          </Reveal>
          <SplitLines id="benefits" className="display display-md mt-7 max-w-[18ch]" lines={["Why it matters", <span key="2" className="serif-accent text-candy-deep">to your business.</span>]} />
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {s.benefits.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.08} className="rounded-[1.75rem] border border-ink/10 bg-white p-8 sm:p-10">
                <span aria-hidden className="block h-1 w-10 rounded-full" style={{ background: s.accent }} />
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/65">{b.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach" className="bg-ink text-paper section-y">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-candy-soft">How we work</p>
          </Reveal>
          <SplitLines id="approach" className="display display-md mt-7" lines={["Our approach."]} />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.approach.map((a, i) => (
              <Reveal as="li" key={a.step} delay={i * 0.08} className="rounded-[1.75rem] border border-fg/10 bg-ink-2 p-8">
                <span className="text-xs font-semibold tracking-[0.2em]" style={{ color: s.accent }}>
                  0{i + 1}
                </span>
                <h3 className="display mt-6 text-2xl">{a.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">{a.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Genuine studio event (Events page only) */}
      {s.slug === "events" && studioEvents.length > 0 && (
        <section aria-labelledby="studio-events" className="bg-paper text-ink section-y">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow text-candy-deep">From the studio</p>
            </Reveal>
            <h2 id="studio-events" className="display display-md mt-7">
              Candies events
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {studioEvents.map((e) => (
                <Reveal as="li" key={e.title} className="grid overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white sm:grid-cols-[200px_1fr]">
                  <div className="relative aspect-[3/4] bg-ink sm:aspect-auto">
                    <Image src={asset(e.image)} alt={`${e.title} poster`} fill sizes="200px" className="object-cover" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                      <time dateTime={e.date}>{e.dateLabel}</time>
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight">{e.title}</h3>
                    <p className="mt-3 text-sm text-ink/65">{e.description}</p>
                    <p className="mt-4 text-xs text-ink/50">{e.venue}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related work */}
      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-ink text-paper section-y">
          <div className="container-x">
            <h2 id="related" className="display display-md">
              Related work
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink-3">
                      <Image src={asset(p.cover)} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-paper/45">{p.client}</p>
                    <p className="mt-1 text-lg font-semibold">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Enquiry + next service */}
      <section className="bg-ink text-paper">
        <div className="container-x grid gap-6 border-t border-fg/10 py-16 md:grid-cols-2">
          <div className="rounded-[1.75rem] p-8 sm:p-10" style={{ background: s.accent }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Ready when you are</p>
            <p className="display mt-6 text-3xl text-white sm:text-4xl">Talk to us about {s.title.toLowerCase()}.</p>
            <ButtonLink href={`/contact?service=${encodeURIComponent(s.title)}`} variant="light" className="mt-8">
              Start a project
            </ButtonLink>
          </div>
          <Link href={`/services/${next.slug}`} className="group flex flex-col justify-between rounded-[1.75rem] border border-fg/10 bg-ink-2 p-8 transition-colors hover:border-fg/30 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-paper/45">Next service</p>
            <div className="mt-6 flex items-end justify-between gap-6">
              <p className="display text-4xl sm:text-5xl">{next.title}</p>
              <span className="grid size-14 place-items-center rounded-full border border-fg/20 transition-all duration-500 group-hover:bg-paper group-hover:text-ink">
                <ArrowIcon />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
