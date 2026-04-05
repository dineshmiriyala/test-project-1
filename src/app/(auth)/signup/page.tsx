"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { useAuth } from "@/components/providers/auth-provider";
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
} from "@/lib/forms/validators";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isReady, session } = useAuth();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady || !session) {
      return;
    }

    router.replace(session.onboardingCompleted ? "/app" : "/onboarding");
  }, [isReady, router, session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstError =
      validateDisplayName(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      (!company.trim() ? "Enter a company or workspace name." : "");

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await signUp({ name, company, email, password });
      router.replace("/onboarding");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sign-up failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <section className="auth-grid">
        <div className="auth-copy">
          <p className="eyebrow">Sign up</p>
          <h1>Create a new local-only account and walk through the fake onboarding flow.</h1>
          <p className="lede">
            The account is saved in your browser so you can sign out, sign back in, and keep the
            same mock workspace activity.
          </p>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Company</span>
            <input value={company} onChange={(event) => setCompany(event.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="field-error">{error}</p> : null}
          <button className="button-primary button-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
          <div className="auth-meta">
            <Link href="/signin">Already have a local account?</Link>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}
