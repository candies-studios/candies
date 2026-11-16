import Link from "next/link";
import { services } from "@/content/services";
import { ServiceGlyph } from "../ServiceGlyph";
import { ArrowIcon } from "../Button";
import { Reveal, SplitLines } from "../motion";

/** Four interactive capability panels — expanding columns on desktop, stacked cards on mobile. */
export function Capabilities() {
  return (
    <section aria-labelledby="cap-title" className="relative overflow-hidden bg-ink text-paper section-y">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow text-candy-soft">Capabilities</p>
            </Reveal>
            <SplitLines
              id="cap-title"
              className="display display-lg mt-7"
              lines={[
                "Four disciplines.",
                <span key="2">
                  One <span className="serif-accent text-candy-soft">connected</span> studio.
                </span>,
              ]}
            />
          </div>
          <Reveal className="lg:col-span-4" delay={0.1}>
            <p className="text-paper/65">
              Full service means we have you covered from design and content right through to digital and live
              experiences — with collaboration at the centre of everything we do.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-4 lg:h-[640px] lg:flex-row">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08} className="lg:flex lg:min-w-0 lg:flex-1 lg:transition-[flex-grow] lg:duration-[900ms] lg:ease-[var(--ease-out-expo)] lg:hover:flex-[2.3] lg:focus-within:flex-[2.3]">
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-fg/10 bg-ink-2 p-7 transition-colors duration-700 hover:border-fg/25 sm:p-9"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full opacity-25 blur-[90px] transition-opacity duration-700 group-hover:opacity-60"
                  style={{ background: s.accent }}
                />
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold tracking-[0.2em] text-paper/45">{s.index}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-fg/15 transition-all duration-500 group-hover:border-transparent group-hover:bg-paper group-hover:text-ink">
                    <ArrowIcon className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                  </span>
                </div>

                <ServiceGlyph
                  slug={s.slug}
                  accent={s.accent}
                  className="mx-auto my-8 w-40 transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-110 sm:w-48 lg:my-auto lg:w-[min(13rem,70%)]"
                />

                <div className="mt-auto">
                  <h3 className="display text-[clamp(1.8rem,2.6vw,2.6rem)]">{s.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/65 lg:line-clamp-2 lg:group-hover:line-clamp-none">
                    {s.summary}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-700 lg:group-hover:max-h-40 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-40 lg:group-focus-visible:opacity-100">
                    {s.capabilities.map((c) => (
                      <li key={c} className="rounded-full border border-fg/15 px-3 py-1 text-xs text-paper/75">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: s.accent }}>
                    Explore service <ArrowIcon />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
