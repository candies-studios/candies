import { cn } from "@/lib/cn";

/**
 * Lightweight CSS-3D illustrations for each service (no WebGL needed).
 * They animate gently and stop for reduced-motion users.
 */
export function ServiceGlyph({ slug, accent, className }: { slug: string; accent: string; className?: string }) {
  const shade = `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.75), transparent 34%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.45), transparent 55%), ${accent}`;
  return (
    <div aria-hidden className={cn(className?.includes("absolute") ? "" : "relative", "aspect-square [perspective:800px]", className)}>
      {slug === "design" && (
        <div className="absolute inset-0 grid place-items-center [transform-style:preserve-3d] motion-safe:animate-[glyphspin_14s_linear_infinite]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute size-[62%] rounded-[22%] border border-fg/25"
              style={{ background: i === 1 ? shade : "transparent", transform: `rotateY(${i * 60}deg) rotateX(${i * 25}deg)`, opacity: i === 1 ? 1 : 0.7 }}
            />
          ))}
        </div>
      )}
      {slug === "content" && (
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(55deg)_rotateZ(-30deg)]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute left-[18%] top-[18%] size-[64%] rounded-3xl border border-fg/20 motion-safe:animate-[glyphfloat_5s_ease-in-out_infinite]"
              style={{ background: i === 3 ? shade : `color-mix(in srgb, ${accent} ${20 + i * 12}%, transparent)`, transform: `translateZ(${i * 26}px)`, animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </div>
      )}
      {slug === "digital-marketing" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="absolute size-[30%] rounded-full" style={{ background: shade }} />
          {[50, 72, 94].map((s, i) => (
            <div
              key={s}
              className="absolute [transform-style:preserve-3d]"
              style={{ width: `${s}%`, height: `${s}%`, transform: `rotateX(65deg) rotateY(${i * 18}deg)` }}
            >
              <div
                className="size-full rounded-full border border-fg/25 motion-safe:animate-[glyphorbit_12s_linear_infinite]"
                style={{ animationDuration: `${10 + i * 5}s` }}
              >
                <span className="absolute -top-1.5 left-1/2 size-3 rounded-full" style={{ background: accent }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {slug === "websites-and-applications" && (
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(14deg)_rotateY(-22deg)]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute overflow-hidden rounded-[14%] border border-fg/25 motion-safe:animate-[glyphfloat_5s_ease-in-out_infinite]"
              style={{
                left: `${2 + i * 8}%`,
                top: `${18 + i * 8}%`,
                width: "60%",
                height: "48%",
                transform: `translateZ(${(i - 2) * 30}px)`,
                background: i === 2 ? shade : `color-mix(in srgb, ${accent} ${18 + i * 14}%, transparent)`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="flex gap-[6%] px-[7%] pt-[6%]">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="block aspect-square w-[7%] rounded-full bg-fg/60" />
                ))}
              </div>
              {i === 2 && (
                <div className="mt-[8%] space-y-[5%] px-[9%]">
                  <span className="block h-[7px] w-3/5 rounded-full bg-white/80" />
                  <span className="block h-[7px] w-2/5 rounded-full bg-white/50" />
                </div>
              )}
            </div>
          ))}
          {/* phone */}
          <div
            className="absolute right-[6%] top-[34%] h-[50%] w-[24%] rounded-[22%] border border-fg/30 motion-safe:animate-[glyphfloat_4s_ease-in-out_infinite]"
            style={{ background: shade, transform: "translateZ(16px)", animationDelay: "0.6s" }}
          />
        </div>
      )}
      {slug === "events" && (
        <div className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
          <div className="absolute bottom-[14%] h-[14%] w-[80%] rounded-[50%] border border-fg/20 [transform:rotateX(70deg)]" style={{ background: `color-mix(in srgb, ${accent} 25%, transparent)` }} />
          <div className="absolute size-[46%] rounded-full motion-safe:animate-[glyphfloat_4s_ease-in-out_infinite]" style={{ background: shade }} />
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute size-2 rounded-full bg-white/80 motion-safe:animate-[glyphtwinkle_2.4s_ease-in-out_infinite]"
              style={{ left: `${15 + ((i * 53) % 70)}%`, top: `${10 + ((i * 37) % 45)}%`, animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes glyphspin{to{transform:rotateY(360deg) rotateX(20deg)}}
        @keyframes glyphorbit{to{transform:rotate(360deg)}}
        @keyframes glyphfloat{0%,100%{translate:0 0}50%{translate:0 -8%}}
        @keyframes glyphtwinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
      `}</style>
    </div>
  );
}
