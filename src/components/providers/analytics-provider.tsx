"use client";

import { Suspense, createContext, useContext, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { analyticsClient } from "@/lib/analytics/adapter";
import type { AnalyticsClient } from "@/lib/analytics/types";

const AnalyticsContext = createContext<AnalyticsClient>(analyticsClient);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsContext.Provider value={analyticsClient}>
      <Suspense fallback={null}>
        <AnalyticsPageTracker />
      </Suspense>
      {children}
    </AnalyticsContext.Provider>
  );
}

function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    try {
      analyticsClient.page(pathname || "/", {
        query: query || "none",
      });
    } catch (error) {
      console.error("Failed to track page view", error);
    }
  }, [pathname, query]);

  return null;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
