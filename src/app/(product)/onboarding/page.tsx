"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/guards/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import { useWorkspace } from "@/components/providers/workspace-provider";

const steps = [
  "Name the workspace",
  "Pick a focus area",
  "Launch the fake product",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { session, completeOnboarding } = useAuth();
  const { workspace } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState("");
  const [focusArea, setFocusArea] = useState("Activation and weekly usage");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (session.onboardingCompleted) {
      router.replace("/app");
      return;
    }

    setWorkspaceName(workspace?.name ?? `${session.company} Workspace`);
    setFocusArea(workspace?.focusArea ?? "Activation and weekly usage");
  }, [router, session, workspace]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workspaceName.trim() || !focusArea.trim()) {
      setError("Workspace name and focus area are both required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await completeOnboarding({ workspaceName, focusArea });
      router.replace("/app");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not complete onboarding.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute allowPendingOnboarding>
      <section className="onboarding-shell">
        <div className="onboarding-copy">
          <p className="eyebrow">Onboarding</p>
          <h1>Finish the setup so the dashboard becomes available.</h1>
          <p className="lede">
            This is a fake onboarding flow, but it still updates session state, changes the workspace
            data, and emits a custom analytics event.
          </p>
          <div className="step-list">
            {steps.map((step, index) => (
              <div key={step} className="step-chip">
                <strong>0{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <label className="field">
            <span>Workspace name</span>
            <input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Primary focus area</span>
            <input value={focusArea} onChange={(event) => setFocusArea(event.target.value)} />
          </label>
          <label className="field">
            <span>Starter checklist</span>
            <div className="check-grid">
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                <span>Track onboarding completion</span>
              </label>
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                <span>Track project creation</span>
              </label>
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                <span>Track teammate invites</span>
              </label>
            </div>
          </label>
          {error ? <p className="field-error">{error}</p> : null}
          <button className="button-primary button-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving workspace…" : "Complete onboarding"}
          </button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
