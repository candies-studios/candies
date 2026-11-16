import { site } from "@/content/site";
import { Reveal, SplitLines } from "../motion";
import { LocalTime } from "../LocalTime";

const tz: Record<string, string> = { IN: "Asia/Kolkata", AE: "Asia/Dubai", US: "America/Denver" };

/**
 * Global presence — only the addresses published on the existing site,
 * plus the "Global Footprint" markets (clearly labelled as markets, not offices).
 */
export function GlobalPresence() {
  return (
    <section aria-labelledby="global-title" className="relative overflow-hidden bg-ink text-paper section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute -right-40 top-10 h-[46rem] w-[46rem] text-fg/[0.06] motion-safe:animate-[spin_120s_linear_infinite]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke="currentColor" />
          {[20, 40, 60, 80].map((r) => (
            <ellipse key={`h${r}`} cx="100" cy="100" rx="98" ry={r} stroke="currentColor" />
          ))}
          {[20, 45, 70, 98].map((r) => (
            <ellipse key={`v${r}`} cx="100" cy="100" rx={r} ry="98" stroke="currentColor" />
          ))}
        </svg>
      </div>
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow text-candy-soft">Global presence</p>
        </Reveal>
        <SplitLines
          id="global-title"
          className="display display-lg mt-7 max-w-[16ch]"
          lines={["Local insight.", <span key="2">Global <span className="serif-accent text-candy-soft">reach.</span></span>]}
        />

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {site.addresses.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.08}>
              <address className="flex h-full flex-col rounded-[1.75rem] border border-fg/10 bg-ink-2 p-8 not-italic transition-colors duration-500 hover:border-fg/25">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">{a.label}</span>
                  <LocalTime timeZone={tz[a.countryCode]} />
                </div>
                <p className="display mt-10 text-3xl">{a.city}</p>
                <p className="mt-4 text-sm leading-relaxed text-paper/60">
                  {a.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                  <span className="block">{a.country}</span>
                </p>
              </address>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col gap-6 border-t border-fg/10 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-paper/45">Markets we&apos;ve worked in</p>
          <ul className="flex flex-wrap gap-2">
            {site.footprint.map((m) => (
              <li key={m} className="rounded-full border border-fg/15 px-4 py-2 text-sm text-paper/80">
                {m}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
