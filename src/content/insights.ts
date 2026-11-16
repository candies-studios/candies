/**
 * INSIGHTS / BLOG
 * The old blog only contained the default WordPress "Hello world!" post,
 * so nothing was migrated. Add articles below; body supports simple
 * blocks (paragraphs, headings, quotes, lists).
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  published: boolean;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  topic: string;
  cover?: string;
  body: Block[];
};

export const posts: Post[] = [
  // Example (unpublished) — copy, edit and set published: true
  {
    slug: "example-article",
    published: false,
    title: "Article title",
    excerpt: "One-sentence summary shown on the listing page.",
    date: "2026-11-16",
    author: "Candies Studio",
    topic: "Branding",
    body: [
      { type: "p", text: "Opening paragraph." },
      { type: "h2", text: "A section heading" },
      { type: "p", text: "More text." },
    ],
  },
];

export const publishedPosts = () =>
  posts.filter((p) => p.published).sort((a, b) => (a.date < b.date ? 1 : -1));
export const getPost = (slug: string) => publishedPosts().find((p) => p.slug === slug);
