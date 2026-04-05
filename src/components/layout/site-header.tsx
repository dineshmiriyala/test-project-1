"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { joinClasses } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/playground", label: "Playground" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { session } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand-mark">
        <span>Signal Lab</span>
        <small>Analytics test app</small>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={joinClasses("site-nav-link", pathname === item.href && "site-nav-link-active")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="site-header-actions">
        {session ? (
          <Link className="button-secondary" href={session.onboardingCompleted ? "/app" : "/onboarding"}>
            Open workspace
          </Link>
        ) : (
          <>
            <Link className="site-nav-link" href="/signin">
              Sign in
            </Link>
            <Link className="button-primary" href="/signup">
              Start demo
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
