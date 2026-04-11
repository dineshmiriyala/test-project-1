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
        {/* Load the Fluxly config first so the official SDK can read it before it boots. */}
        <Script id="fluxly-config" strategy="beforeInteractive">
          {`window.__FLUXLY__ = {
  apiKey: "pk_test_X6VUAgh6_ZZFW7M0SZNgiCR19So5YO5hvsmZbVUsJ",
  apiHost: "https://api.getfluxly.com"
};`}
        </Script>
        {/* Use the published Fluxly browser package instead of the old local copied bootstrap file. */}
        <Script
          id="fluxly-sdk"
          src="https://cdn.jsdelivr.net/npm/@getfluxly/sdk-js@0.1.1/dist/fluxly.iife.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
