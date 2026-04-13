export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

// This contract is intentionally tiny so a real tracker can replace the stub without touching page code.
export interface AnalyticsClient {
  page: (name?: string, props?: AnalyticsPayload) => void;
  identify: (userId: string, traits?: AnalyticsPayload) => void;
  capture: (event: string, props?: AnalyticsPayload) => void;
  reset: () => void;
  destroy: () => void;
}
