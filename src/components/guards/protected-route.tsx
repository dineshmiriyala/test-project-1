"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowPendingOnboarding?: boolean;
}

export function ProtectedRoute({
  children,
  allowPendingOnboarding = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, session } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!session) {
      router.replace(`/signin?next=${encodeURIComponent(pathname || "/app")}`);
      return;
    }

    if (!allowPendingOnboarding && !session.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [allowPendingOnboarding, isReady, pathname, router, session]);

  if (!isReady || !session) {
    return <div className="page-loading">Checking demo session…</div>;
  }

  if (!allowPendingOnboarding && !session.onboardingCompleted) {
    return <div className="page-loading">Redirecting to onboarding…</div>;
  }

  return <>{children}</>;
}
