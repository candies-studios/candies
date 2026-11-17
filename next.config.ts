import type { NextConfig } from "next";

/**
 * Legacy WordPress URLs → new routes (permanent 308 redirects),
 * so existing links, bookmarks and search rankings keep working.
 */
const legacyRedirects = [
  { source: "/home-creative-agency", destination: "/" },
  { source: "/about-us", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/portfolio-pages/work", destination: "/work" },
  { source: "/project/:slug*", destination: "/work" },
  { source: "/blog", destination: "/insights" },
  { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*", destination: "/insights" },
  { source: "/events", destination: "/services/events" },
  { source: "/morning-coffee-groove", destination: "/services/events" },
  { source: "/wp-admin/:path*", destination: "/" },
  { source: "/lp/:variant(websites|branding|digital-marketing|social-media|events|content)", destination: "/lp/" },
  { source: "/wp-login.php", destination: "/" },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * STATIC_EXPORT=true builds a fully static site into /out (used for GitHub Pages).
 * Static hosting can't run the /api/enquiry route or server redirects, so in that
 * mode the contact form posts to NEXT_PUBLIC_FORM_ENDPOINT instead (see README).
 */
const isStatic = process.env.STATIC_EXPORT === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const staticConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // `route.node.ts` (the server-only enquiry API) is excluded from static builds
  pageExtensions: ["tsx", "ts"],
};

const serverConfig: NextConfig = {
  basePath: basePath || undefined,
  pageExtensions: ["tsx", "ts", "node.ts"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Next.js already normalises trailing slashes (/about-us/ → /about-us),
    // so the WordPress-style URLs are covered by these rules.
    return legacyRedirects.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic ? staticConfig : serverConfig),
};

export default nextConfig;
