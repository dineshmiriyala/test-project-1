import type { Metadata } from "next";
import Script from "next/script";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Lab Demo",
  description: "A realistic product analytics test app with a fake SaaS surface and stub analytics hooks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Load the GetFluxly config first so the latest SDK can read it before it boots. */}
        <Script id="gflux-config" strategy="beforeInteractive">
          {`window.__GFLUX__ = {
  apiKey: "pk_test_9xyqsogP_RAcYr86w1wwoXxzVnP0uU0gHtMffDM3s",
  apiHost: "https://api.getfluxly.com",
  autocapture: {
    pageviews: true,
    clicks: true,
    forms: true,
    pageLeave: true
  }
};`}
        </Script>
        {/* Pin the verified latest package so the app uses the new gflux global every time. */}
        <Script
          id="gflux-sdk"
          src="https://cdn.jsdelivr.net/npm/@getfluxly/sdk-js@0.1.3/dist/gflux.iife.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
