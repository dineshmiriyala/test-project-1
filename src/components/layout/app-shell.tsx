"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { joinClasses } from "@/lib/utils";

const productNav = [
  { href: "/app", label: "Overview" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/tasks", label: "Tasks" },
  { href: "/app/team", label: "Team" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, signOut } = useAuth();
  const { workspace } = useWorkspace();
  const unreadNotifications =
    workspace?.notifications.filter((notification) => !notification.read).length ?? 0;

  return (
    <div
      className={joinClasses(
        "app-shell",
        workspace?.settings.sidebarCollapsed && "app-shell-collapsed",
      )}
    >
      <aside className="app-sidebar">
        <div className="app-sidebar-brand">
          <span>{workspace?.name ?? "Signal Lab"}</span>
          <small>{workspace?.focusArea ?? "Activation tracking"}</small>
        </div>
        <nav className="app-nav" aria-label="Workspace navigation">
          {productNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={joinClasses(
                "app-nav-link",
                pathname === item.href && "app-nav-link-active",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/playground"
            className={joinClasses(
              "app-nav-link",
              pathname === "/playground" && "app-nav-link-active",
            )}
          >
            Playground
          </Link>
        </nav>
        <div className="app-sidebar-meta">
          <p>{session?.name ?? "Guest"}</p>
          <small>{session?.role ?? "Local demo user"}</small>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{workspace?.name ?? "Loading workspace"}</h1>
          </div>
          <div className="app-topbar-actions">
            <Link href="/docs/routing-map" className="button-secondary">
              Route map
            </Link>
            <button className="notification-pill" type="button">
              {unreadNotifications} unread
            </button>
            <button className="button-primary" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>
        <div className="app-content-body">{children}</div>
      </div>
    </div>
  );
}
