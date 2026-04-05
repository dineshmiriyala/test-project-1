import type { AnalyticsClient, AnalyticsPayload } from "@/lib/analytics/types";

function logEvent(kind: string, name: string, props?: AnalyticsPayload) {
  try {
    // Console output makes it obvious when the stub fired while still staying harmless.
    console.info(`[analytics:${kind}]`, name, props ?? {});
  } catch (error) {
    console.error("Analytics stub failed to log an event", error);
  }
}

export function createConsoleAnalyticsClient(): AnalyticsClient {
  return {
    page(name = "page_view", props) {
      logEvent("page", name, props);
    },
    identify(userId, traits) {
      logEvent("identify", userId, traits);
    },
    capture(event, props) {
      logEvent("capture", event, props);
    },
    reset() {
      logEvent("reset", "session_reset");
    },
  };
}
