"use client";

import Image from "next/image";
import { useImageFallback } from "@/lib/useImageFallback";
import type { TeamMember } from "@/content/team";

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const { ok, ref, onError } = useImageFallback(Boolean(member.photo));
  return (
    <figure className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-ink-3">
        {ok && member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="(min-width:768px) 30vw, 50vw"
            className="object-cover object-top grayscale-[35%] transition-all duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:grayscale-0"
            ref={ref}
            onError={onError}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-candy/40 via-ink-3 to-grape/40">
            <span className="display text-5xl text-paper/80">{initials(member.name)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-2.5 py-1 text-[0.65rem] font-semibold tracking-widest text-paper/80 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <figcaption className="mt-4">
        <p className="text-lg font-semibold tracking-tight text-paper">{member.name}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-paper/50">{member.role}</p>
      </figcaption>
    </figure>
  );
}
