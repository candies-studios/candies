import Link from "next/link";
import { nav, site, socialLinks, whatsappLink } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "./Logo";

export function SiteFooter() {
  const socials = socialLinks();
  const wa = whatsappLink();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-fg/10 bg-ink text-paper">
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <Logo size="lg" />
          <p className="mt-6 max-w-sm text-paper/60">{site.description}</p>
          <a
            href={`mailto:${site.email}`}
            className="display display-sm mt-10 inline-block normal-case tracking-[-0.03em] text-paper transition-colors hover:text-candy-soft"
          >
            {site.email}
          </a>
          {wa && (
            <p className="mt-4">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-paper/70">
                Chat on WhatsApp
              </a>
            </p>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
          <div>
            <h2 className="eyebrow text-paper/45">Studio</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline text-paper/80 hover:text-paper">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-paper/45">Services</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline text-paper/80 hover:text-paper">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-paper/45">Offices</h2>
            <ul className="mt-5 space-y-4 text-sm text-paper/70">
              {site.addresses.map((a) => (
                <li key={a.label}>
                  <span className="font-semibold text-paper">{a.city}</span>
                  <span className="block text-paper/50">{a.country}</span>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <>
                <h2 className="eyebrow mt-8 text-paper/45">Follow</h2>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline text-paper/80">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-x" aria-hidden>
        <p className="display select-none whitespace-nowrap text-center text-[17.5vw] leading-[0.8] text-fg/[0.04] lg:text-[16.5vw]">
          Candies
        </p>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-fg/10 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/privacy/" className="hover:text-paper">Privacy Policy</Link>
          <Link href="/terms/" className="hover:text-paper">Terms &amp; Conditions</Link>
          <p className="tracking-[0.2em] uppercase">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
