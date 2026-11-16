import { clients } from "@/content/clients";
import { ClientLogo } from "../ClientLogo";
import { Reveal, SplitLines } from "../motion";

/** Two-row infinite logo marquee on a light surface (logos keep their original colours). */
export function ClientShowcase({
  eyebrow = "Clients",
  title = ["Trusted by teams at", "ambitious brands."],
}: {
  eyebrow?: string;
  title?: string[];
}) {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)];

  return (
    <section aria-labelledby="clients-title" className="relative bg-paper text-ink section-y">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-candy-deep">{eyebrow}</p>
          </Reveal>
          <SplitLines
            id="clients-title"
            lines={title.map((t, i) => (i === title.length - 1 ? <span key={i} className="serif-accent text-candy-deep">{t}</span> : t))}
            className="display display-md mt-6"
          />
        </div>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <p className="text-ink/65 lg:text-lg">
            From banking and financial services to FMCG and media, we partner with established organisations and
            growing businesses alike.
          </p>
        </Reveal>
      </div>

      {/* Marquee (motion) */}
      <div className="group mt-16 space-y-4 motion-reduce:hidden" aria-hidden>
        {rows.map((row, r) => (
          <div key={r} className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div
              className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]"
              style={{ animationDirection: r % 2 ? "reverse" : "normal", ["--marquee-duration" as string]: "48s" }}
            >
              {[...row, ...row, ...row, ...row].map((c, i) => (
                <div key={i} className="h-24 w-52 shrink-0 rounded-2xl border border-ink/[0.07] bg-white sm:h-28 sm:w-64">
                  <ClientLogo client={c} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Accessible static grid (also used for reduced motion) */}
      <ul className="container-x mt-16 hidden grid-cols-2 gap-3 motion-reduce:grid sm:grid-cols-3 lg:grid-cols-4">
        {clients.map((c) => (
          <li key={c.name} className="h-24 rounded-2xl border border-ink/[0.07] bg-white">
            <ClientLogo client={c} />
          </li>
        ))}
      </ul>
      <p className="sr-only">Clients include: {clients.map((c) => c.name).join(", ")}.</p>
    </section>
  );
}
