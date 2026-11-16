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
  { source: "/wp-login.php", destination: "/" },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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

export default nextConfig;
