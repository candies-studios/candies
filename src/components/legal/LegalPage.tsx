import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="bg-ink pb-24 pt-36 text-paper sm:pt-44">
      <div className="container-x max-w-3xl">
        <p className="eyebrow text-candy-deep">Legal</p>
        <h1 className="display mt-6 text-[clamp(2.2rem,6vw,4rem)]">{title}</h1>
        <p className="mt-4 text-sm text-paper/55">Last updated: {updated}</p>
        <div className="mt-12 space-y-6 leading-relaxed text-paper/80 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-paper [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </article>
  );
}
