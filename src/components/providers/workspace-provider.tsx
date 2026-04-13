"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAnalytics } from "@/components/providers/analytics-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { validateEmail } from "@/lib/forms/validators";
import { mockRepository } from "@/lib/mock/repository";
import type { Project, TaskStatus, TeamMember, Workspace, WorkspaceSettings } from "@/lib/mock/types";

interface CreateProjectInput {
  name: string;
  summary: string;
  owner: string;
}

interface InviteMemberInput {
  name: string;
  email: string;
  role: string;
  team: string;
}

interface WorkspaceContextValue {
  workspace: Workspace | null;
  isReady: boolean;
  createProject: (input: CreateProjectInput) => boolean;
  archiveProject: (projectId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskComplete: (taskId: string) => void;
  inviteTeamMember: (input: InviteMemberInput) => boolean;
  updateSettings: (changes: Partial<WorkspaceSettings>) => void;
  markNotificationRead: (notificationId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const analytics = useAnalytics();
  const { pushToast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!session) {
      setWorkspace(null);
      setIsReady(true);
      return;
    }

    try {
      setWorkspace(mockRepository.getWorkspace(session));
    } catch (error) {
      console.error("Failed to load workspace", error);
      setWorkspace(null);
    } finally {
      setIsReady(true);
    }
  }, [session]);

  const persistWorkspace = useCallback(
    (updater: (current: Workspace) => Workspace) => {
      if (!session || !workspace) {
        throw new Error("No workspace is loaded.");
      }

      // Keeping persistence inside a stable callback avoids stale closures and satisfies hook linting.
      const nextWorkspace = updater(workspace);
      setWorkspace(nextWorkspace);
      mockRepository.saveWorkspace(session.id, nextWorkspace);
      return nextWorkspace;
    },
    [session, workspace],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace,
      isReady,
      createProject(input) {
        if (!workspace) {
          pushToast({
            tone: "warning",
            title: "Workspace missing",
            body: "Load a workspace before creating a project.",
          });
          return false;
        }

        const cleanName = input.name.trim();
        const cleanSummary = input.summary.trim();

        if (!cleanName || !cleanSummary) {
          pushToast({
            tone: "warning",
            title: "Missing details",
            body: "Project name and summary are both required.",
          });
          return false;
        }

        if (
          workspace.projects.some(
            (project) => project.name.trim().toLowerCase() === cleanName.toLowerCase(),
          )
        ) {
          pushToast({
            tone: "warning",
            title: "Project exists",
            body: "Use a different project name so the list stays readable.",
          });
          return false;
        }

        try {
          const project: Project = {
            id: `project-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
            name: cleanName,
            summary: cleanSummary,
            owner: input.owner.trim() || "Alex Carter",
            status: "planning",
            health: "steady",
            progress: 8,
            stage: "Kickoff",
            tags: ["new", "tracked"],
            updatedAt: new Date().toISOString(),
            archived: false,
          };

          persistWorkspace((current) => ({
            ...current,
            projects: [project, ...current.projects],
          }));

          analytics.capture("project_created", {
            projectName: cleanName,
          });

          pushToast({
            tone: "success",
            title: "Project created",
            body: `${cleanName} is now part of the seeded workspace.`,
          });
          return true;
        } catch (error) {
          console.error("Failed to create project", error);
          pushToast({
            tone: "warning",
            title: "Project issue",
            body: "The project could not be created cleanly.",
          });
          return false;
        }
      },
      archiveProject(projectId) {
        try {
          const nextWorkspace = persistWorkspace((current) => ({
            ...current,
            projects: current.projects.map((project) =>
              project.id === projectId
                ? { ...project, archived: !project.archived, updatedAt: new Date().toISOString() }
                : project,
            ),
          }));

          const project = nextWorkspace.projects.find((entry) => entry.id === projectId);
          analytics.capture("project_archive_toggled", {
            projectId,
            projectName: project?.name ?? "unknown",
            archived: project?.archived ?? false,
          });
          pushToast({
            tone: "info",
            title: project?.archived ? "Project archived" : "Project restored",
            body: "Project visibility changed inside the mock workspace.",
          });
        } catch (error) {
          console.error("Failed to archive project", error);
          pushToast({
            tone: "warning",
            title: "Archive issue",
            body: "The project state could not be updated.",
          });
        }
      },
      updateTaskStatus(taskId, status) {
        try {
          const nextWorkspace = persistWorkspace((current) => ({
            ...current,
            tasks: current.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    status,
                    completed: status === "done",
                  }
                : task,
            ),
          }));

          const task = nextWorkspace.tasks.find((entry) => entry.id === taskId);
          analytics.capture("task_status_changed", {
            taskId,
            status,
          });

          pushToast({
            tone: "success",
            title: "Task updated",
            body: `${task?.title ?? "The task"} now shows ${status}.`,
          });
        } catch (error) {
          console.error("Failed to update task status", error);
          pushToast({
            tone: "warning",
            title: "Task issue",
            body: "The task state could not be saved.",
          });
        }
      },
      toggleTaskComplete(taskId) {
        try {
          const nextWorkspace = persistWorkspace((current) => ({
            ...current,
            tasks: current.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    completed: !task.completed,
                    status: task.completed ? "todo" : "done",
                  }
                : task,
            ),
          }));

          const task = nextWorkspace.tasks.find((entry) => entry.id === taskId);
          analytics.capture("task_status_changed", {
            taskId,
            status: task?.status ?? "unknown",
          });
        } catch (error) {
          console.error("Failed to toggle task completion", error);
        }
      },
      inviteTeamMember(input) {
        if (!workspace) {
          pushToast({
            tone: "warning",
            title: "Workspace missing",
            body: "Load a workspace before inviting teammates.",
          });
          return false;
        }

        const cleanEmail = input.email.trim().toLowerCase();
        const cleanName = input.name.trim();

        if (!cleanName || !cleanEmail) {
          pushToast({
            tone: "warning",
            title: "Missing details",
            body: "Name and email are required to invite a teammate.",
          });
          return false;
        }

        const emailError = validateEmail(cleanEmail);

        if (emailError) {
          pushToast({
            tone: "warning",
            title: "Invalid email",
            body: emailError,
          });
          return false;
        }

        if (workspace.team.some((member) => member.email === cleanEmail)) {
          pushToast({
            tone: "warning",
            title: "Member exists",
            body: "That teammate already exists in the mock workspace.",
          });
          return false;
        }

        try {
          const member: TeamMember = {
            id: `member-${cleanEmail.replace(/[^a-z0-9]/g, "-")}`,
            name: cleanName,
            email: cleanEmail,
            role: input.role.trim() || "Contributor",
            team: input.team.trim() || "Product",
            status: "online",
            avatarHue: Math.floor(Math.random() * 360),
          };

          persistWorkspace((current) => ({
            ...current,
            team: [member, ...current.team],
          }));

          analytics.capture("teammate_invited", {
            email: cleanEmail,
            role: member.role,
          });

          pushToast({
            tone: "success",
            title: "Invite created",
            body: `${cleanName} is now part of the fake team list.`,
          });
          return true;
        } catch (error) {
          console.error("Failed to invite teammate", error);
          pushToast({
            tone: "warning",
            title: "Invite issue",
            body: "The teammate could not be added.",
          });
          return false;
        }
      },
      updateSettings(changes) {
        try {
          const nextWorkspace = persistWorkspace((current) => ({
            ...current,
            settings: {
              ...current.settings,
              ...changes,
            },
          }));
          analytics.capture("workspace_settings_updated", {
            digestCadence: nextWorkspace.settings.digestCadence,
            releaseAlerts: nextWorkspace.settings.releaseAlerts,
            autoAssign: nextWorkspace.settings.autoAssign,
            sidebarCollapsed: nextWorkspace.settings.sidebarCollapsed,
            themeMode: nextWorkspace.settings.themeMode,
          });

          pushToast({
            tone: "info",
            title: "Settings saved",
            body: "Workspace preferences were stored in local browser state.",
          });
        } catch (error) {
          console.error("Failed to update settings", error);
          pushToast({
            tone: "warning",
            title: "Settings issue",
            body: "The new preferences could not be stored.",
          });
        }
      },
      markNotificationRead(notificationId) {
        try {
          const nextWorkspace = persistWorkspace((current) => ({
            ...current,
            notifications: current.notifications.map((notification) =>
              notification.id === notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification,
            ),
          }));
          const notification = nextWorkspace.notifications.find((entry) => entry.id === notificationId);
          analytics.capture("notification_marked_read", {
            notificationId,
            notificationTitle: notification?.title ?? "unknown",
            notificationType: notification?.type ?? "unknown",
          });
        } catch (error) {
          console.error("Failed to update notification", error);
        }
      },
    }),
    [analytics, isReady, persistWorkspace, pushToast, workspace],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider.");
  }

  return context;
}
