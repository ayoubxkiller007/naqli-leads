"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Google Ads account + GA4 — override via Netlify env if needed */
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-17638857709";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-X2T792QM0E";
/** Naqli Lead Form Submit — conversionAction 7719575470 */
export const LEAD_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "wvDvCK6__eAcEO237tpB";

export function GoogleAdsPixel() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="naqli-google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}

type LeadConversionProps = {
  /** Lead id from thank-you URL (?id=…) */
  leadId?: string;
};

/**
 * Fires Google Ads lead conversion once per submitted lead (thank-you page).
 * Create a "Submit lead form" conversion in Ads and set NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL.
 */
export function GoogleAdsLeadConversion({ leadId }: LeadConversionProps) {
  return (
    <Script id="naqli-lead-conversion" strategy="afterInteractive">
      {`
        (function () {
          var LEAD_ID = ${JSON.stringify(leadId || "")};
          var SEND_TO = ${JSON.stringify(LEAD_LABEL ? `${GOOGLE_ADS_ID}/${LEAD_LABEL}` : "")};
          if (!SEND_TO) return;
          var key = "naqli_lead_conv_" + (LEAD_ID || "anon");
          if (sessionStorage.getItem(key)) return;
          function fire() {
            if (typeof window.gtag !== "function") return false;
            window.gtag("event", "conversion", {
              send_to: SEND_TO,
              value: 1.0,
              currency: "SAR",
              transaction_id: LEAD_ID || undefined,
            });
            window.gtag("event", "generate_lead", {
              currency: "SAR",
              value: 1.0,
              transaction_id: LEAD_ID || undefined,
            });
            sessionStorage.setItem(key, "1");
            return true;
          }
          if (fire()) return;
          var tries = 0;
          var t = setInterval(function () {
            if (fire() || ++tries > 25) clearInterval(t);
          }, 400);
        })();
      `}
    </Script>
  );
}
