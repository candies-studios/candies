import { ButtonLink } from "@/components/Button";
import { StaticCandies } from "@/components/three/HeroVisual";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pt-32 text-paper grain">
      <StaticCandies className="-z-10 opacity-50" />
      <div className="container-x">
        <p className="eyebrow text-candy-soft">Error 404</p>
        <h1 className="display display-xl mt-8 max-w-[12ch]">
          This candy&apos;s <span className="serif-accent text-candy-soft">gone.</span>
        </h1>
        <p className="lede mt-8 max-w-xl text-paper/70">
          The page you&apos;re looking for has moved or no longer exists. Our website has been redesigned — let&apos;s
          get you back on track.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="light">Back to home</ButtonLink>
          <ButtonLink href="/work" variant="ghost">See our work</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink>
        </div>
      </div>
    </section>
  );
}
