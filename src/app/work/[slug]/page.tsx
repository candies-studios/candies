import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MaskReveal, Reveal } from "@/components/motion";
import { ArrowIcon } from "@/components/Button";
import { getProject, publishedProjects } from "@/content/projects";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedProjects().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} — ${p.client}`, description: p.overview, path: `/work/${p.slug}`, image: p.cover });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const all = publishedProjects();
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length];

  return (
    <>
      <PageHero eyebrow={`${p.client} · ${p.industry}`} lines={[p.title]} intro={<p>{p.overview}</p>}>
        <dl className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[
            ["Client", p.client],
            ["Industry", p.industry],
            ["Category", p.category],
            ["Year", p.year ?? "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-[0.2em] text-paper/45">{k}</dt>
              <dd className="mt-2 text-paper">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="bg-ink pb-24 text-paper">
        <div className="container-x">
          <MaskReveal className="relative aspect-[16/9] rounded-[2rem] bg-ink-3">
            <Image src={p.cover} alt={`${p.client} — ${p.title}`} fill priority sizes="100vw" className="object-cover" />
          </MaskReveal>
        </div>
      </section>

      <section className="bg-paper text-ink section-y">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-7">
            <Reveal>
              <h2 className="eyebrow text-candy-deep">The challenge</h2>
              <p className="lede mt-5 text-ink/80">{p.challenge}</p>
            </Reveal>
            <Reveal>
              <h2 className="eyebrow text-candy-deep">Our approach</h2>
              <p className="lede mt-5 text-ink/80">{p.approach}</p>
            </Reveal>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal className="rounded-[1.75rem] border border-ink/10 bg-white p-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Deliverables</h2>
              <ul className="mt-5 space-y-2">
                {p.deliverables.map((d) => (
                  <li key={d} className="text-ink/80">
                    {d}
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Services</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.services.map((s) => {
                  const svc = getService(s);
                  return svc ? (
                    <li key={s}>
                      <Link href={`/services/${s}`} className="rounded-full border border-ink/15 px-3 py-1 text-sm hover:border-ink/50">
                        {svc.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </Reveal>
          </aside>
        </div>
      </section>

      {p.results && p.results.length > 0 && (
        <section className="bg-ink text-paper section-y">
          <div className="container-x">
            <h2 className="eyebrow text-candy-soft">Results</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {p.results.map((r) => (
                <li key={r.label} className="rounded-[1.75rem] border border-white/10 bg-ink-2 p-8">
                  <p className="display text-5xl">{r.value}</p>
                  <p className="mt-3 text-paper/65">{r.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {p.gallery && p.gallery.length > 0 && (
        <section className="bg-ink pb-24 text-paper">
          <div className="container-x grid gap-6 md:grid-cols-2">
            {p.gallery.map((src, i) => (
              <MaskReveal key={src} className={`relative rounded-[1.75rem] bg-ink-3 ${i % 3 === 0 ? "aspect-[16/9] md:col-span-2" : "aspect-[4/5]"}`}>
                <Image src={src} alt={`${p.title} — image ${i + 1}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </MaskReveal>
            ))}
          </div>
        </section>
      )}

      {next && next.slug !== p.slug && (
        <section className="bg-ink text-paper">
          <Link href={`/work/${next.slug}`} className="container-x group flex items-end justify-between gap-6 border-t border-white/10 py-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-paper/45">Next project</p>
              <p className="display display-md mt-4">{next.title}</p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-white/20 transition-all group-hover:bg-paper group-hover:text-ink">
              <ArrowIcon />
            </span>
          </Link>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
