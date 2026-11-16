"use client";

import { useImageFallback } from "@/lib/useImageFallback";
import type { Client } from "@/content/clients";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";

/** Displays a client logo in its original colours & proportions; falls back to the name if the file is missing. */
export function ClientLogo({ client, className }: { client: Client; className?: string }) {
  const { ok, ref, onError } = useImageFallback();
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)} title={client.name}>
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(client.logo)}
          alt={client.name}
          width={200}
          height={50}
          decoding="async"
          ref={ref}
          onError={onError}
          className="h-auto max-h-11 w-auto max-w-[78%] object-contain"
        />
      ) : (
        <span className="text-center text-sm font-semibold tracking-wide text-ink/70">{client.name}</span>
      )}
    </div>
  );
}
