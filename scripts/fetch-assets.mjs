#!/usr/bin/env node
/**
 * Pulls the genuine Candies Studio assets (logo, favicon, team portraits,
 * client logos, event poster) from the current WordPress site into
 * /public/media so they are committed with the new codebase.
 *
 *   npm run assets:pull            # skip files that already exist
 *   npm run assets:pull -- --force # re-download everything
 *
 * Run this ONCE before the old WordPress site is switched off, then commit
 * the /public/media folder.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");
const BASE = "https://www.candies.studio/wp-content/uploads";
const force = process.argv.includes("--force");

const assets = {
  // Brand
  "brand/candies-logo.png": `${BASE}/2023/04/Candies-logo-1-2.png`, // high-res master (10470×2370)
  "brand/candies-logo-small.png": `${BASE}/2023/04/Candies-logo-1-1-1-1.png`,
  "brand/candies-mark.png": `${BASE}/2023/03/cropped-Favicon-270x270.png`,
  "brand/candies-mark-192.png": `${BASE}/2023/03/cropped-Favicon-192x192.png`,
  "brand/apple-touch-icon.png": `${BASE}/2023/03/cropped-Favicon-180x180.png`,

  // Team (order / names as on the About page)
  "team/sushil-chandanshive.jpg": `${BASE}/2023/05/160A6337.jpg`,
  "team/hamza-hameed.jpg": `${BASE}/2024/01/h.jpg`,
  "team/aditiya.png": `${BASE}/2024/01/Aditya.png`,
  "team/amarlis-vega.webp": `${BASE}/2023/05/Untitled-design-24-1.webp`,
  "team/arwa-lacchawala.jpg": `${BASE}/2024/01/arwa-2.jpg`,
  "team/aswajit.png": `${BASE}/2024/01/Aswajit.png`,
  "team/bharti-dand.png": `${BASE}/2023/05/2.png`,
  "team/shivam.jpg": `${BASE}/2024/01/S.jpg`,
  "team/gajanan.jpg": `${BASE}/2024/01/Gajanan.jpg`,

  // Client logos
  "clients/axis-bank.png": `${BASE}/2023/04/axis-200x50.png`,
  "clients/adma.png": `${BASE}/2023/04/adma-logo-200x50.png`,
  "clients/godrej-agrovet.png": `${BASE}/2023/04/Godrej-Agrovet-Logo-PNG-1024x541-1-200x50.png`,
  "clients/borosil.png": `${BASE}/2023/04/Borosil-logo-200x50.png`,
  "clients/kotak.png": `${BASE}/2023/04/kotak-200x50.png`,
  "clients/parachute.png": `${BASE}/2023/04/rksmj7u8-200x50.png`,
  "clients/worldline.png": `${BASE}/2023/04/wl-200x50.png`,
  "clients/sidbi.png": `${BASE}/2024/01/sidbi-logo-black-200x50.png`,
  "clients/lt-finance.png": `${BASE}/2024/01/LTF-200x50.png`,
  "clients/forbes-india.png": `${BASE}/2024/01/1.png`,
  "clients/viacom18.png": `${BASE}/2024/01/3.png`,

  // Events
  "events/morning-coffee-groove.png": `${BASE}/2026/01/coffee-rave-portrait-1-5-1-675x900.png`,
};

const exists = (p) => access(p).then(() => true, () => false);

let ok = 0, skipped = 0, failed = 0;
for (const [rel, url] of Object.entries(assets)) {
  const out = join(ROOT, rel);
  if (!force && (await exists(out))) { skipped++; continue; }
  try {
    const res = await fetch(url, { headers: { "User-Agent": "candies-asset-migration/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${rel}`);
    ok++;
  } catch (err) {
    console.error(`✗ ${rel}  ←  ${url}  (${err.message})`);
    failed++;
  }
}
/* ── Web-ready logo ───────────────────────────────────────────
   The master logo is 10470×2370 (~600 KB) with lots of empty
   padding. Trim it and resize to a crisp 1200px-wide PNG for
   the header/footer. Uses sharp (installed with Next.js). */
const master = join(ROOT, "brand/candies-logo.png");
const webLogo = join(ROOT, "brand/candies-logo-web.png");
if ((await exists(master)) && (force || !(await exists(webLogo)))) {
  try {
    const { default: sharp } = await import("sharp");
    await sharp(master).trim().resize({ width: 1200 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(webLogo);
    console.log("✓ brand/candies-logo-web.png (trimmed & resized)");
  } catch (err) {
    console.error(`✗ Could not optimise logo (${err.message}) — the site will use candies-logo-small.png`);
  }
}

console.log(`\nDone: ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
if (failed) process.exitCode = 1;
