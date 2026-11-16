import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Creative & Digital Studio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "creative agency",
    "branding agency",
    "brand identity",
    "UI/UX design",
    "website design",
    "content strategy",
    "digital marketing agency",
    "corporate events",
    "brand activations",
    "Mumbai",
    "Dubai",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Creative & Digital Studio`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: "/media/brand/candies-mark-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/media/brand/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c14",
  colorScheme: "dark",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/media/brand/candies-mark.png`,
  email: site.email,
  description: site.description,
  address: site.addresses.map((a) => ({
    "@type": "PostalAddress",
    streetAddress: a.lines.join(", "),
    addressLocality: a.city,
    addressCountry: a.countryCode,
  })),
  sameAs: Object.values(site.social).filter(Boolean),
  knowsAbout: ["Brand identity", "UI/UX design", "Content strategy", "Digital marketing", "Corporate events"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
