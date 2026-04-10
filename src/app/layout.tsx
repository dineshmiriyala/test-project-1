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
        {/* Load the test Fluxly config first so the bootstrap file can read it on every page. */}
        <Script id="fluxly-config" strategy="beforeInteractive">
          {`window.__FLUXLY__ = {
  apiKey: "pk_test_X6VUAgh6_ZZFW7M0SZNgiCR19So5YO5hvsmZbVUsJ",
  apiHost: "http://192.168.0.198:8000"
};`}
        </Script>
        {/* Boot the Fluxly autocapture bundle after hydration, similar to a PostHog-style site script. */}
        <Script id="fluxly-autocapture" src="/fluxly-autocapture.js" strategy="afterInteractive" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
