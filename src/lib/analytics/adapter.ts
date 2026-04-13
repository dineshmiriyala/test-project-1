import type { AnalyticsClient } from "@/lib/analytics/types";

type GfluxPayload = Record<string, string | number | boolean | null | undefined>;

interface GfluxClient {
  identify: (externalId: string, traits?: GfluxPayload) => void;
  track: (eventName: string, properties?: GfluxPayload) => void;
  reset: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    gflux?: GfluxClient;
  }
}

interface PendingGfluxAction {
  name: string;
  run: (client: GfluxClient) => void;
}

const MAX_PENDING_ACTIONS = 100;
const SDK_READY_RETRY_MS = 200;
const SDK_READY_TIMEOUT_MS = 5000;

let pendingActions: PendingGfluxAction[] = [];
let retryStartedAt = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

function getGfluxClient() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.gflux ?? null;
}

function flushPendingActions() {
  const client = getGfluxClient();

  if (client) {
    const actionsToSend = pendingActions;
    pendingActions = [];
    retryStartedAt = 0;
    retryTimer = null;

    actionsToSend.forEach((action) => {
      try {
        action.run(client);
      } catch (error) {
        console.error(`Failed to send queued GetFluxly action: ${action.name}`, error);
      }
    });
    return;
  }

  if (!retryStartedAt || Date.now() - retryStartedAt < SDK_READY_TIMEOUT_MS) {
    retryTimer = setTimeout(flushPendingActions, SDK_READY_RETRY_MS);
    return;
  }

  const droppedCount = pendingActions.length;
  pendingActions = [];
  retryStartedAt = 0;
  retryTimer = null;
  console.warn(`Dropped ${droppedCount} GetFluxly action(s) because the SDK did not load.`);
}

function queueActionUntilSdkLoads(action: PendingGfluxAction) {
  if (typeof window === "undefined") {
    return;
  }

  // Keep a hard limit so a blocked CDN cannot grow memory forever.
  if (pendingActions.length >= MAX_PENDING_ACTIONS) {
    pendingActions.shift();
  }

  pendingActions.push(action);

  if (!retryStartedAt) {
    retryStartedAt = Date.now();
  }

  if (!retryTimer) {
    retryTimer = setTimeout(flushPendingActions, SDK_READY_RETRY_MS);
  }
}

function sendToGflux(name: string, run: (client: GfluxClient) => void) {
  try {
    const client = getGfluxClient();

    if (client) {
      run(client);
      return;
    }

    queueActionUntilSdkLoads({ name, run });
  } catch (error) {
    console.error(`Failed to call GetFluxly action: ${name}`, error);
  }
}

export const analyticsClient: AnalyticsClient = {
  page(name = "page_view", props) {
    // GetFluxly already auto-captures page views, so this custom event preserves app route context.
    sendToGflux("route_viewed", (client) => {
      client.track("route_viewed", {
        ...props,
        path: name,
      });
    });
  },
  identify(userId, traits) {
    sendToGflux("identify", (client) => {
      client.identify(userId, traits);
    });
  },
  capture(event, props) {
    sendToGflux(event, (client) => {
      client.track(event, props);
    });
  },
  reset() {
    sendToGflux("reset", (client) => {
      client.reset();
    });
  },
  destroy() {
    pendingActions = [];
    retryStartedAt = 0;

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    try {
      getGfluxClient()?.destroy();
    } catch (error) {
      console.error("Failed to destroy GetFluxly SDK", error);
    }
  },
};
