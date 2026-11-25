import Image from "next/image";
import Link from "next/link";
import { clients } from "@/content/clients";
import { publishedProjects } from "@/content/projects";
import { site, socialLinks } from "@/content/site";
import { challenges, interestOptions, processSteps, serviceCards, testimonials, whyPoints, type Campaign } from "@/content/landing";
import { asset } from "@/lib/asset";
import { ClientLogo } from "../ClientLogo";
import { Logo } from "../Logo";
import { Reveal } from "../motion";
import { ServiceGlyph } from "../ServiceGlyph";
import { EmailLink, EnquireButton, ScheduleButton, ScrollLink, WhatsAppLink } from "./actions";
import { LeadForm } from "./LeadForm";
import { LPHeader, MobileCTA, ViewContentTracker } from "./LPChrome";

const sphere = (c: string) =>
  `radial-gradient(circle at 30% 28%, rgba(255,255,255,.8), transparent 35%), radial-gradient(circle at 70% 80%, rgba(0,0,0,.35), transparent 55%), ${c}`;

const reassurances = [
  "No obligation — a conversation, not a sales pitch",
  "Your details stay private and are never sold",
  "Speak directly with the people who'll do the work",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow text-candy-deep">{children}</p>;
}

export function LandingPage({ campaign }: { campaign: Campaign }) {
  const c = campaign.name;
  const cards = campaign.featuredCard
    ? [...serviceCards.filter((s) => s.key === campaign.featuredCard), ...serviceCards.filter((s) => s.key !== campaign.featuredCard)]
    : serviceCards;
  const projects = publishedProjects().slice(0, 4);
  const sectors = Array.from(new Set(clients.map((x) => x.sector).filter(Boolean))) as string[];
  const socials = socialLinks();

  return (
    <div className="bg-ink text-paper">
      <LPHeader campaign={c} />
      <ViewContentTracker campaign={c} targetId="services" />

      {/* 1 ── HERO ───────────────────────────────────────── */}
      <section aria-labelledby="lp-title" className="relative isolate overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-32 lg:pb-20 lg:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 size-[30rem] rounded-full bg-candy/20 blur-[120px] sm:size-[40rem]" />
          <div className="absolute -left-40 bottom-0 size-[28rem] rounded-full bg-berry/10 blur-[120px]" />
          {/* candy composition (CSS only — no 3D bundle, loads instantly on mobile) */}
          <div className="absolute right-[-14%] top-14 aspect-square w-[36vw] max-w-[520px] min-w-[140px] rounded-full candy-stripe opacity-80 sm:opacity-90 shadow-[inset_-30px_-40px_80px_rgba(0,0,0,0.25),inset_20px_20px_60px_rgba(255,255,255,0.45)] motion-safe:animate-[lpfloat_9s_ease-in-out_infinite] sm:right-[-6%] lg:right-[4%] lg:top-[18%] lg:w-[30vw]" />
          <div className="absolute bottom-[14%] right-[8%] hidden size-9 rounded-full motion-safe:animate-[lpfloat_6s_ease-in-out_infinite_reverse] lg:block" style={{ background: sphere("#34b98a") }} />
        </div>
        <style>{`@keyframes lpfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>

        <div className="container-x grid w-full gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-6 lg:pt-6 xl:col-span-6">
            <p className="eyebrow text-candy-deep">{campaign.eyebrow}</p>
            <h1 id="lp-title" className="display mt-5 max-w-[15ch] text-[clamp(2.1rem,min(8.6vw,7svh),4.6rem)] leading-[0.95]">
              {campaign.headline[0]} <span className="serif-accent text-candy-deep">{campaign.headline[1]}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-paper/70 sm:text-lg">{campaign.subcopy}</p>
            <ul className="mt-6 hidden space-y-2.5 text-sm lg:block">
              {reassurances.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-mint text-[10px] text-white">
                    ✓
                  </span>
                  <span className="text-paper/75">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 hidden flex-wrap items-center gap-x-3 gap-y-1 text-sm text-paper/55 lg:flex">
              <span>{site.combinedExperienceYears}+ years of combined creative experience</span>
              <span aria-hidden>·</span>
              <span>India · UAE · USA</span>
            </p>
            <div className="mt-8 hidden flex-wrap gap-2 lg:flex">
              {clients.slice(0, 8).map((cl) => (
                <span key={cl.name} className="h-11 w-[6.5rem] rounded-xl border border-ink/[0.07] bg-white">
                  <ClientLogo client={cl} />
                </span>
              ))}
            </div>
          </div>

          {/* ENQUIRY FORM — first thing visitors can act on */}
          <div id="enquire" className="scroll-mt-24 lg:col-span-6 xl:col-span-6">
            <h2 className="mb-4 text-lg font-semibold tracking-tight sm:text-xl">
              Let&apos;s create something <span className="serif-accent text-[1.35em] text-candy-deep">extraordinary</span> together.
            </h2>
            <LeadForm campaign={c} preselect={campaign.preselect} />
            <ul className="mt-6 space-y-2.5 text-sm lg:hidden">
              {reassurances.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-mint text-[10px] text-white">
                    ✓
                  </span>
                  <span className="text-paper/75">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-paper/55">
              <ScrollLink target={projects.length ? "work" : "experience"} location="hero" campaign={c} className="font-semibold text-paper underline underline-offset-4">
                Explore our work ↓
              </ScrollLink>
            </p>
          </div>
        </div>
      </section>

      {/* 2 ── TRUST ──────────────────────────────────────── */}
      <section aria-labelledby="trust-title" className="bg-paper py-16 text-ink sm:py-24">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="trust-title" className="display text-[clamp(1.8rem,4.4vw,3.4rem)] lg:col-span-7">
              Creative thinking. <span className="serif-accent text-candy-deep">Strategic execution.</span>
            </h2>
            <p className="text-ink/65 lg:col-span-5">Brands we&apos;ve worked with across banking, financial services, payments, FMCG, media and healthcare.</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {clients.map((cl) => (
              <li key={cl.name} className="h-20 rounded-2xl border border-ink/[0.07] bg-white sm:h-24">
                <ClientLogo client={cl} />
              </li>
            ))}
          </ul>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${site.combinedExperienceYears}+ years`, "of combined creative experience"],
              ["One team", "Strategy, design and development"],
              ["3 offices", "India, UAE and USA"],
              ["6 markets", site.footprint.join(", ")],
            ].map(([k, d]) => (
              <div key={k} className="bg-paper p-6">
                <dt className="display text-2xl normal-case tracking-[-0.02em]">{k}</dt>
                <dd className="mt-1 text-sm text-ink/60">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 ── CHALLENGES ─────────────────────────────────── */}
      <section aria-labelledby="challenge-title" className="py-16 sm:py-24">
        <div className="container-x">
          <Eyebrow>Sound familiar?</Eyebrow>
          <h2 id="challenge-title" className="display mt-5 max-w-[20ch] text-[clamp(1.8rem,4.4vw,3.4rem)]">
            Is your digital platform holding your <span className="serif-accent text-candy-deep">business back?</span>
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((ch, i) => (
              <Reveal as="li" key={ch.problem} delay={(i % 3) * 0.05} className="group flex flex-col rounded-3xl border border-fg/10 bg-ink-2 p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(21,22,31,0.35)] sm:p-7">
                <p className="text-lg font-semibold leading-snug tracking-tight">{ch.problem}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-paper/65">
                  <span className="font-semibold text-candy-deep">→ </span>
                  {ch.answer}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-fg/8 pt-4">
                  <span className="rounded-full bg-fg/5 px-3 py-1 text-xs font-semibold text-paper/70">{ch.service}</span>
                  <EnquireButton location={`challenge_${ch.interest}`} campaign={c} interests={[ch.interest]} variant="ghost" className="min-h-10 px-4 py-2 text-xs">
                    Fix this
                  </EnquireButton>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 ── SERVICES ───────────────────────────────────── */}
      <section id="services" aria-labelledby="services-title" className="scroll-mt-20 bg-paper py-16 text-ink sm:py-24">
        <div className="container-x">
          <Eyebrow>Our services</Eyebrow>
          <h2 id="services-title" className="display mt-5 max-w-[18ch] text-[clamp(1.8rem,4.4vw,3.4rem)]">
            Everything you need to build and <span className="serif-accent text-candy-deep">grow online.</span>
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {cards.map((s, i) => (
              <Reveal as="li" key={s.key} delay={(i % 3) * 0.05}>
                <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-white p-6 sm:p-7">
                  <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-25 blur-[60px]" style={{ background: s.accent }} />
                  <div className="flex items-start justify-between">
                    <ServiceGlyph slug={s.glyph} accent={s.accent} className="w-24" />
                  </div>
                  <h3 className="display mt-4 text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{s.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-ink/10 px-2.5 py-1 text-xs text-ink/70">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                    <EnquireButton location={`service_${s.key}`} campaign={c} interests={[s.interest]} className="min-h-11 px-5 py-2.5">
                      Request a Proposal
                    </EnquireButton>
                    {s.href && s.cta && (
                      <a href={s.href} target="_blank" rel="noopener" className="text-sm font-semibold underline-offset-4 hover:underline" style={{ color: s.accent }}>
                        {s.cta} ↗
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 ── WORK (only genuine, published case studies) ─ */}
      {projects.length > 0 && (
        <section id="work" aria-labelledby="work-title" className="scroll-mt-20 py-16 sm:py-24">
          <div className="container-x">
            <Eyebrow>Our work</Eyebrow>
            <h2 id="work-title" className="display mt-5 text-[clamp(1.8rem,4.4vw,3.4rem)]">
              Creative work that <span className="serif-accent text-candy-deep">speaks for itself.</span>
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <li key={p.slug}>
                  <a href={`/work/${p.slug}/`} target="_blank" rel="noopener" className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-3">
                      <Image src={asset(p.cover)} alt={`${p.client} — ${p.title}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-paper/50">
                      {p.client} · {p.category}
                    </p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">{p.title}</p>
                    <p className="mt-1 text-sm text-paper/60">{p.overview}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 6 ── WHY ────────────────────────────────────────── */}
      <section aria-labelledby="why-title" className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Why Candies Studio</Eyebrow>
            <h2 id="why-title" className="display mt-5 text-[clamp(1.8rem,4vw,3rem)]">
              More than an agency. <span className="serif-accent text-candy-deep">A creative growth partner.</span>
            </h2>
            <span className="mt-8 hidden lg:block">
              <EnquireButton location="why" campaign={c} interests={campaign.preselect}>
                Talk to Our Team
              </EnquireButton>
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {whyPoints.map((w, i) => (
              <Reveal as="li" key={w.title} delay={(i % 2) * 0.05} className="rounded-3xl border border-fg/10 bg-ink-2 p-6">
                <span aria-hidden className="block size-8 rounded-full" style={{ background: sphere(["#5e79bb", "#e8577d", "#34b98a", "#f2a33a", "#6046aa", "#a9b8e0"][i]) }} />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/65">{w.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 ── PROCESS ────────────────────────────────────── */}
      <section id="process" aria-labelledby="process-title" className="scroll-mt-20 bg-paper py-16 text-ink sm:py-24">
        <div className="container-x">
          <Eyebrow>How we work</Eyebrow>
          <h2 id="process-title" className="display mt-5 max-w-[20ch] text-[clamp(1.8rem,4.4vw,3.4rem)]">
            From first conversation to <span className="serif-accent text-candy-deep">final execution.</span>
          </h2>
          <ol className="relative mt-10 grid gap-3 md:grid-cols-5">
            {processSteps.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.05} className="relative rounded-3xl border border-ink/[0.08] bg-white p-6">
                <span className="grid size-10 place-items-center rounded-full bg-[#15161f] text-xs font-semibold text-white">{p.n}</span>
                <h3 className="display mt-5 text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 ── INDUSTRIES / EXPERIENCE ────────────────────── */}
      <section id="experience" aria-labelledby="exp-title" className="scroll-mt-20 py-16 sm:py-24">
        <div className="container-x">
          <Eyebrow>Industries</Eyebrow>
          <h2 id="exp-title" className="display mt-5 max-w-[20ch] text-[clamp(1.8rem,4.4vw,3.4rem)]">
            Experience across sectors that <span className="serif-accent text-candy-deep">matter.</span>
          </h2>
          <ul className="mt-10 border-t border-fg/10">
            {sectors.map((sector) => (
              <li key={sector} className="grid gap-2 border-b border-fg/10 py-6 md:grid-cols-12 md:items-center">
                <h3 className="display text-[clamp(1.3rem,2.6vw,2rem)] md:col-span-6">{sector}</h3>
                <p className="text-sm text-paper/60 md:col-span-6">
                  {clients
                    .filter((x) => x.sector === sector)
                    .map((x) => x.name)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
          {projects.length === 0 && (
            <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-[#15161f] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <p className="text-xl font-semibold tracking-tight">Want to see work relevant to your industry?</p>
                <p className="mt-1 text-sm text-white/70">We&apos;ll share examples and credentials that match your brief on a quick call.</p>
              </div>
              <EnquireButton location="credentials" campaign={c} interests={campaign.preselect} variant="light" className="shrink-0">
                Request Our Credentials
              </EnquireButton>
            </div>
          )}
        </div>
      </section>

      {/* 9 ── TESTIMONIALS (renders only when verified quotes exist) ─ */}
      {testimonials.length > 0 && (
        <section aria-labelledby="t-title" className="bg-paper py-16 text-ink sm:py-24">
          <div className="container-x">
            <h2 id="t-title" className="display text-[clamp(1.8rem,4.4vw,3.4rem)]">
              What our <span className="serif-accent text-candy-deep">partners say.</span>
            </h2>
            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.name}>
                  <figure className="h-full rounded-3xl border border-ink/10 bg-white p-7">
                    <blockquote className="serif-accent text-2xl leading-snug">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 text-sm">
                      <span className="font-semibold">{t.name}</span>
                      <span className="block text-ink/60">
                        {t.role}, {t.company}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 11 ── FINAL CTA ─────────────────────────────────── */}
      <section aria-labelledby="final-title" className="relative isolate overflow-hidden py-20 sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-candy/15 blur-[120px]" />
        </div>
        <div className="container-x text-center">
          <span aria-hidden className="candy-stripe mx-auto block size-14 rounded-full" />
          <h2 id="final-title" className="display mx-auto mt-8 max-w-[18ch] text-[clamp(2rem,5vw,4rem)]">
            Your next big idea starts with a <span className="serif-accent text-candy-deep">conversation.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-paper/70">
            Tell us what you want to build. We&apos;ll help you scope the right website, application or software for your business.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <EnquireButton location="final_cta" campaign={c} interests={campaign.preselect}>
              Start a Conversation
            </EnquireButton>
            <ScheduleButton campaign={c} location="final_cta" />
          </div>
        </div>
      </section>

      {/* 12 ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-fg/10 pb-28 pt-14 sm:pb-12">
        <div className="container-x grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo size="lg" />
            <p className="mt-4 max-w-xs text-sm text-paper/60">{site.tagline}.</p>
            <EmailLink location="footer" campaign={c} className="mt-5 inline-block font-semibold underline-offset-4 hover:underline" />
            <div className="mt-3">
              <WhatsAppLink location="footer" campaign={c} className="text-sm font-semibold text-paper/70 underline-offset-4 hover:underline">
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/45">Services</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {serviceCards.map((s) => (
                <li key={s.key}>
                  <a href={s.href} className="text-paper/75 hover:text-paper">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/45">Offices</h2>
            <ul className="mt-4 grid gap-4 text-sm text-paper/65 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {site.addresses.map((a) => (
                <li key={a.label}>
                  <span className="font-semibold text-paper">{a.label}</span>
                  <address className="mt-1 not-italic leading-relaxed">
                    {a.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4 text-sm">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-paper/75 hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="container-x mt-12 flex flex-col gap-3 border-t border-fg/10 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link href="/terms/" className="hover:text-paper">
              Terms &amp; Conditions
            </Link>
            <Link href="/" className="hover:text-paper">
              Main website
            </Link>
          </nav>
        </div>
      </footer>

      <MobileCTA campaign={c} />
      <p className="sr-only">Services we can help with: {interestOptions.map((o) => o.label).join(", ")}.</p>
    </div>
  );
}
