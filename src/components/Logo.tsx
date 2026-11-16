"use client";

import { useImageFallback } from "@/lib/useImageFallback";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";

/**
 * Candies Studio logo lockup: the original candy-ball mark (pulled from the
 * old site into /media/brand/candies-mark.png) + wordmark set in the brand
 * display face so it reads on both dark and light backgrounds.
 * If the mark file is missing, a striped candy disc is drawn in CSS.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { ok: markOk, ref, onError } = useImageFallback();
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative block size-8 shrink-0 overflow-hidden rounded-full sm:size-9">
        {markOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset("/media/brand/candies-mark.png")}
            alt=""
            width={36}
            height={36}
            className="size-full object-cover"
            ref={ref}
            onError={onError}
          />
        ) : (
          <span aria-hidden className="candy-stripe block size-full rounded-full" />
        )}
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="display text-[1.15rem] tracking-[-0.02em] sm:text-[1.3rem]">Candies</span>
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.42em] opacity-70">Studio</span>
        </span>
      )}
      <span className="sr-only">Candies Studio</span>
    </span>
  );
}
