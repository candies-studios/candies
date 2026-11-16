import { ContactForm } from "@/components/ContactForm";
import { Reveal, SplitLines } from "@/components/motion";
import { LocalTime } from "@/components/LocalTime";
import { site, socialLinks, whatsappLink } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Candies Studio. Tell us about your brand, campaign, website or event — or write to create@candies.studio.",
  path: "/contact",
});

const tz: Record<string, string> = { IN: "Asia/Kolkata", AE: "Asia/Dubai", US: "America/Denver" };

export default function ContactPage() {
  const wa = whatsappLink();
  const socials = socialLinks();

  return (
    <section className="relative isolate overflow-hidden bg-ink pb-24 pt-40 text-paper grain sm:pb-32 sm:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 size-[36rem] rounded-full bg-candy/25 blur-[140px]" />
        <div className="absolute -right-40 bottom-40 size-[28rem] rounded-full bg-berry/15 blur-[140px]" />
      </div>
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-candy-soft">Contact</p>
        </Reveal>
        <SplitLines
          as="h1"
          immediate
          delay={0.1}
          className="display display-lg mt-8 max-w-[16ch]"
          lines={["Let's build something", <span key="2">great <span className="serif-accent text-candy-soft">together.</span></span>]}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <ContactForm />
            </Reveal>
          </div>

          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.25}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">Write to us</h2>
              <a href={`mailto:${site.email}`} className="display mt-4 block text-2xl normal-case tracking-[-0.03em] transition-colors hover:text-candy-soft sm:text-3xl">
                {site.email}
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40">
                  <span className="size-2 rounded-full bg-mint" /> Chat on WhatsApp
                </a>
              )}
            </Reveal>

            <Reveal delay={0.3}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">Offices</h2>
              <ul className="mt-5 space-y-6">
                {site.addresses.map((a) => (
                  <li key={a.label} className="border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">{a.city}</p>
                      <LocalTime timeZone={tz[a.countryCode]} />
                    </div>
                    <address className="mt-2 text-sm not-italic leading-relaxed text-paper/60">
                      {a.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                      <span className="block">{a.country}</span>
                    </address>
                  </li>
                ))}
              </ul>
            </Reveal>

            {socials.length > 0 && (
              <Reveal delay={0.35}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/45">Follow</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={0.4}>
              <div className="rounded-[1.5rem] border border-white/10 bg-ink-2 p-6 text-sm text-paper/65">
                <p className="font-semibold text-paper">What happens next?</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-4">
                  <li>We review your brief and come back with questions.</li>
                  <li>A short discovery call to understand your goals.</li>
                  <li>A tailored proposal with scope, timeline and investment.</li>
                </ol>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
