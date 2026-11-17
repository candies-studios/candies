"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_MODE, GA_ID, GTM_ID, PIXEL_ID, captureAttribution, getConsent, setConsent, type Consent } from "@/lib/tracking";

/**
 * Loads Meta Pixel, GA4 and GTM only after consent (or immediately when
 * NEXT_PUBLIC_TRACKING_CONSENT="implied"), captures UTM attribution on
 * every page, and sends PageView on client-side navigation.
 */
export function Tracking() {
  const pathname = usePathname();
  const [consent, setC] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    setMounted(true);
    captureAttribution();
    setC(getConsent());
    const on = (e: Event) => setC((e as CustomEvent).detail);
    window.addEventListener("candies:consent", on);
    return () => window.removeEventListener("candies:consent", on);
  }, []);

  // PageView on route changes (the initial one is sent by the Pixel/GA init snippets)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (getConsent() !== "granted") return;
    window.fbq?.("track", "PageView");
    if (GA_ID) window.gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href });
  }, [pathname]);

  const enabled = consent === "granted";
  const anyTracking = Boolean(PIXEL_ID || GA_ID || GTM_ID);

  return (
    <>
      {enabled && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {enabled && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {enabled && GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {mounted && anyTracking && CONSENT_MODE === "required" && consent === null && (
        <div
          role="region"
          aria-label="Cookie preferences"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-fg/10 bg-ink-2 p-4 text-sm text-paper shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] sm:bottom-5 sm:p-5"
        >
          <p className="text-paper/75">
            We use cookies to measure our advertising and improve this site. See our{" "}
            <Link href="/privacy/" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConsent("granted")} className="rounded-full bg-candy px-4 py-2 font-semibold text-white">
              Accept
            </button>
            <button type="button" onClick={() => setConsent("denied")} className="rounded-full border border-fg/15 px-4 py-2 font-semibold">
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
