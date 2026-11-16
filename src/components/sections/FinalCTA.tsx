import { site } from "@/content/site";
import { ButtonLink } from "../Button";
import { Reveal, SplitLines } from "../motion";

export function FinalCTA({
  title = ["Good ideas deserve", "great execution."],
  body = "Have a brand, business or experience in mind? Let's make something meaningful together.",
}: {
  title?: string[];
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-ink text-paper grain">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/2 size-[42rem] -translate-y-1/2 rounded-full bg-candy/25 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 size-[30rem] rounded-full bg-berry/15 blur-[140px]" />
      </div>
      <div className="container-x section-y">
        <Reveal>
          <p className="eyebrow text-candy-soft">Start a project</p>
        </Reveal>
        <SplitLines
          as="h2"
          id="cta-title"
          lines={title.map((t, i) =>
            i === title.length - 1 ? (
              <span key={i}>
                {t.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="serif-accent text-candy-soft">{t.split(" ").slice(-1)}</span>
              </span>
            ) : (
              t
            ),
          )}
          className="display display-xl mt-8 max-w-[14ch]"
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6" delay={0.1}>
            <p className="lede text-paper/70">{body}</p>
          </Reveal>
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:col-span-6 lg:justify-end" delay={0.2}>
            <ButtonLink href="/contact" variant="primary">
              Let&apos;s create something extraordinary
            </ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="ghost" arrow={false}>
              {site.email}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
