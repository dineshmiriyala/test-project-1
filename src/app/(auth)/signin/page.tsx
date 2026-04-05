"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { validateEmail, validatePassword } from "@/lib/forms/validators";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, session, isReady } = useAuth();
  const [email, setEmail] = useState("alex@horizon.io");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady || !session) {
      return;
    }

    const next = searchParams.get("next");
    router.replace(next || (session.onboardingCompleted ? "/app" : "/onboarding"));
  }, [isReady, router, searchParams, session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const nextSession = await signIn({ email, password });
      const next = searchParams.get("next");
      router.replace(next || (nextSession.onboardingCompleted ? "/app" : "/onboarding"));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PublicShell>
      <section className="auth-grid">
        <div className="auth-copy">
          <p className="eyebrow">Sign in</p>
          <h1>Open the seeded workspace and start generating analytics traffic.</h1>
          <p className="lede">
            Use the demo account or any account you created locally from the sign-up flow. No real
            backend exists here.
          </p>
          <div className="inline-note">
            Demo credentials: <strong>alex@horizon.io</strong> / <strong>password123</strong>
          </div>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
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
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
          <div className="auth-meta">
            <Link href="/forgot-password">Forgot password?</Link>
            <Link href="/signup">Need an account?</Link>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}
