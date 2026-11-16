#!/usr/bin/env node
/**
 * Static hosts (GitHub Pages) can't do server redirects, so after a static
 * export this writes tiny HTML redirect pages for the old WordPress URLs.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const map = {
  "about-us": "/about/",
  "contact-us": "/contact/",
  "portfolio-pages/work": "/work/",
  "project/activation": "/work/",
  blog: "/insights/",
  events: "/services/events/",
  "morning-coffee-groove": "/services/events/",
  "home-creative-agency": "/",
  "2023/03/07/hello-world": "/insights/",
};

for (const [from, to] of Object.entries(map)) {
  const target = `${base}${to}`;
  const dir = join("out", from);
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "index.html"),
    `<!doctype html><meta charset="utf-8"><title>Redirecting…</title><link rel="canonical" href="${target}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${target}"><script>location.replace(${JSON.stringify(target)})</script><a href="${target}">Continue</a>`,
  );
}
await writeFile(join("out", ".nojekyll"), "");
console.log(`Wrote ${Object.keys(map).length} legacy redirects (base: "${base || "/"}")`);
