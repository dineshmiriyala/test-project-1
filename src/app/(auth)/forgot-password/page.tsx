"use client";

import Link from "next/link";
import { useState } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { validateEmail } from "@/lib/forms/validators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setError("");
    setIsSent(true);
  }

  return (
    <PublicShell>
      <section className="auth-grid">
        <div className="auth-copy">
          <p className="eyebrow">Forgot password</p>
          <h1>No real email gets sent. The point is the flow.</h1>
          <p className="lede">
            This screen exists to mimic a realistic auth surface and to give your analytics module
            another form flow and CTA sequence to capture.
          </p>
        </div>
        <form className="auth-card" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          {error ? <p className="field-error">{error}</p> : null}
          {isSent ? (
            <p className="field-success">A fake reset email was "sent" to {email}.</p>
          ) : null}
          <button className="button-primary button-block" type="submit">
            Send reset link
          </button>
          <div className="auth-meta">
            <Link href="/signin">Back to sign in</Link>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}
