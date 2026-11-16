import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { getPost, publishedPosts } from "@/content/insights";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const params = publishedPosts().map((p) => ({ slug: p.slug }));
  // Static export needs at least one path; the placeholder renders the 404 page.
  return params.length ? params : [{ slug: "_" }];
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.excerpt, path: `/insights/${p.slug}`, image: p.cover });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    author: { "@type": "Organization", name: p.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/insights/${p.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="bg-paper pb-24 pt-40 text-ink sm:pt-48">
        <header className="container-x max-w-4xl">
          <Link href="/insights" className="link-underline text-sm text-ink/60">
            ← All insights
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-candy-deep">
            {p.topic} · <time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          </p>
          <h1 className="display display-md mt-6">{p.title}</h1>
          <p className="lede mt-8 text-ink/70">{p.excerpt}</p>
        </header>
        {p.cover && (
          <div className="container-x mt-14">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-ink">
              <Image src={asset(p.cover)} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className="container-x mt-14 max-w-3xl space-y-6 text-lg leading-[1.75] text-ink/80">
          {p.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i} className="pt-6 text-3xl font-semibold tracking-tight text-ink">{b.text}</h2>;
            if (b.type === "quote")
              return (
                <blockquote key={i} className="serif-accent border-l-2 border-candy pl-6 text-3xl leading-snug text-ink">
                  {b.text}
                  {b.cite && <cite className="mt-3 block font-sans text-sm not-italic text-ink/50">— {b.cite}</cite>}
                </blockquote>
              );
            if (b.type === "list")
              return (
                <ul key={i} className="list-disc space-y-2 pl-6">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{b.text}</p>;
          })}
        </div>
      </article>
      <FinalCTA />
    </>
  );
}
