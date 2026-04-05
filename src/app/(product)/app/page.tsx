"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatRelativeDate } from "@/lib/utils";

export default function DashboardPage() {
  const { session } = useAuth();
  const { workspace, markNotificationRead } = useWorkspace();

  const activeProjects = workspace?.projects.filter((project) => !project.archived) ?? [];
  const openTasks = workspace?.tasks.filter((task) => !task.completed) ?? [];
  const unreadNotifications = workspace?.notifications.filter((item) => !item.read) ?? [];

  return (
    <div className="stack-xl">
      <section className="app-hero-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back, {session?.name ?? "Operator"}.</h2>
          <p>
            This view is dense on purpose. It gives your analytics system a mix of links, quick
            actions, notifications, and stateful product panels.
          </p>
        </div>
        <div className="button-row">
          <Link href="/app/projects" className="button-primary">
            Create or review projects
          </Link>
          <Link href="/playground" className="button-secondary">
            Open playground
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <article className="surface-card stat-card">
          <small>Active projects</small>
          <strong>{activeProjects.length}</strong>
          <span>Track create, archive, and revisit flows</span>
        </article>
        <article className="surface-card stat-card">
          <small>Open tasks</small>
          <strong>{openTasks.length}</strong>
          <span>Toggle state and move work through the funnel</span>
        </article>
        <article className="surface-card stat-card">
          <small>Unread notifications</small>
          <strong>{unreadNotifications.length}</strong>
          <span>Each notification is clickable and stateful</span>
        </article>
      </section>

      <section className="card-grid two-up">
        <article className="surface-card">
          <h3>Projects in motion</h3>
          <div className="stack-md">
            {activeProjects.map((project) => (
              <div key={project.id} className="inline-split">
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.summary}</p>
                </div>
                <div className="status-column">
                  <span className="badge">{project.status}</span>
                  <small>{project.progress}% complete</small>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="surface-card">
          <h3>Notification feed</h3>
          <div className="stack-md">
            {workspace?.notifications.map((notification) => (
              <button
                key={notification.id}
                className="notification-row"
                type="button"
                onClick={() => markNotificationRead(notification.id)}
              >
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.body}</p>
                </div>
                <small>{formatRelativeDate(notification.createdAt)}</small>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
