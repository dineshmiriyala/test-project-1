"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAnalytics } from "@/components/providers/analytics-provider";
import { useToast } from "@/components/providers/toast-provider";
import { mockRepository } from "@/lib/mock/repository";
import type { UserSession } from "@/lib/mock/types";

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  name: string;
  company: string;
}

interface OnboardingInput {
  workspaceName: string;
  focusArea: string;
}

interface AuthContextValue {
  session: UserSession | null;
  isReady: boolean;
  signIn: (input: SignInInput) => Promise<UserSession>;
  signUp: (input: SignUpInput) => Promise<UserSession>;
  signOut: () => void;
  completeOnboarding: (input: OnboardingInput) => Promise<UserSession>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();
  const { pushToast } = useToast();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const nextSession = mockRepository.getSession();
      setSession(nextSession);
    } catch (error) {
      console.error("Failed to load session", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    try {
      if (session) {
        analytics.identify(session.id, {
          email: session.email,
          name: session.name,
          plan: session.plan,
          company: session.company,
          onboardingCompleted: session.onboardingCompleted,
        });
        return;
      }

      analytics.reset();
    } catch (error) {
      console.error("Failed to sync session with analytics", error);
    }
  }, [analytics, isReady, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isReady,
      async signIn(input) {
        const nextSession = mockRepository.signIn(input.email, input.password);
        setSession(nextSession);
        analytics.capture("sign_in_completed", {
          userId: nextSession.id,
          email: nextSession.email,
          plan: nextSession.plan,
          onboardingCompleted: nextSession.onboardingCompleted,
        });
        pushToast({
          tone: "success",
          title: "Signed in",
          body: `Welcome back, ${nextSession.name}.`,
        });
        return nextSession;
      },
      async signUp(input) {
        const nextSession = mockRepository.createUser({
          email: input.email,
          password: input.password,
          name: input.name,
          company: input.company.trim() || "Signal Lab",
          role: "Workspace Owner",
          plan: "Starter",
          onboardingCompleted: false,
        });
        mockRepository.saveSession(nextSession);
        setSession(nextSession);
        analytics.capture("sign_up_completed", {
          userId: nextSession.id,
          email: nextSession.email,
          company: nextSession.company,
          plan: nextSession.plan,
        });
        pushToast({
          tone: "success",
          title: "Account created",
          body: "Your mock workspace is ready. Continue into onboarding.",
        });
        return nextSession;
      },
      signOut() {
        try {
          // Track the explicit logout click before session reset clears the GetFluxly identity.
          analytics.capture("sign_out_requested", {
            userId: session?.id ?? "unknown",
            email: session?.email ?? "unknown",
          });
          mockRepository.signOut();
          setSession(null);
          pushToast({
            tone: "info",
            title: "Signed out",
            body: "The demo session is cleared. Local mock data stays on this browser.",
          });
        } catch (error) {
          console.error("Failed to sign out", error);
          pushToast({
            tone: "warning",
            title: "Sign-out issue",
            body: "The app could not clear the session cleanly.",
          });
        }
      },
      async completeOnboarding(input) {
        if (!session) {
          throw new Error("You must be signed in to complete onboarding.");
        }

        const nextSession =
          mockRepository.updateUserSession(session.id, {
            onboardingCompleted: true,
          }) ?? { ...session, onboardingCompleted: true };

        const workspace = mockRepository.getWorkspace(nextSession);
        mockRepository.saveWorkspace(nextSession.id, {
          ...workspace,
          name: input.workspaceName.trim() || workspace.name,
          focusArea: input.focusArea.trim() || workspace.focusArea,
        });
        mockRepository.saveSession(nextSession);
        setSession(nextSession);

        analytics.capture("onboarding_completed", {
          workspaceName: input.workspaceName.trim() || workspace.name,
          focusArea: input.focusArea.trim() || workspace.focusArea,
        });

        pushToast({
          tone: "success",
          title: "Onboarding complete",
          body: "The dashboard is ready with seeded data and tracked interactions.",
        });

        return nextSession;
      },
    }),
    [analytics, isReady, pushToast, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
