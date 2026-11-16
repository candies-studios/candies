import { pillars } from "@/content/studio";
import { Reveal, SplitLines } from "../motion";

const accents = ["#5e79bb", "#e8577d", "#34b98a", "#f2a33a", "#6046aa", "#a9b8e0"];

export function WhyCandies() {
  return (
    <section aria-labelledby="why-title" className="relative bg-paper text-ink section-y">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow text-candy-deep">Why Candies Studio</p>
            </Reveal>
            <SplitLines
              id="why-title"
              className="display display-md mt-7"
              lines={["A creative partner", <span key="2">built for <span className="serif-accent text-candy-deep">business.</span></span>]}
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-ink/65">
                We combine the imagination of a design studio with the discipline of a delivery partner — so the work
                looks exceptional and arrives on time, on brief and ready to perform.
              </p>
            </Reveal>
          </div>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-7">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className="group relative bg-paper p-8 transition-colors duration-500 hover:bg-white sm:p-10">
              <span
                aria-hidden
                className="block size-10 rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-125"
                style={{
                  background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.8), transparent 35%), radial-gradient(circle at 70% 80%, rgba(0,0,0,.35), transparent 55%), ${accents[i]}`,
                }}
              />
              <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-ink/40">0{i + 1}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
