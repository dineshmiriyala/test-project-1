"use client";

import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { WorkspaceProvider } from "@/components/providers/workspace-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <ToastProvider>
        <AuthProvider>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </AuthProvider>
      </ToastProvider>
    </AnalyticsProvider>
  );
}
