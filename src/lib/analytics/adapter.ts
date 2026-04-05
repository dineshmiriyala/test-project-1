import { createConsoleAnalyticsClient } from "@/lib/analytics/default-client";
import type { AnalyticsClient } from "@/lib/analytics/types";

// Replace this export with your real tracking client when you are ready to wire the pipeline.
export const analyticsClient: AnalyticsClient = createConsoleAnalyticsClient();
