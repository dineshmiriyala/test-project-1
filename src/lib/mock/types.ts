export type ProjectStatus = "planning" | "active" | "review" | "paused";
export type TaskStatus = "todo" | "in-progress" | "blocked" | "done";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  plan: string;
  workspaceId: string;
  onboardingCompleted: boolean;
  lastLoginAt: string;
}

export interface StoredUser extends UserSession {
  password: string;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  summary: string;
  status: ProjectStatus;
  health: "great" | "steady" | "at-risk";
  progress: number;
  stage: string;
  tags: string[];
  updatedAt: string;
  archived: boolean;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  dueDate: string;
  type: "feature" | "bug" | "ops";
  estimate: string;
  notes: string;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: "online" | "focus" | "offline";
  avatarHue: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "warning" | "success" | "info";
  createdAt: string;
  read: boolean;
}

export interface WorkspaceSettings {
  digestCadence: "daily" | "weekly";
  releaseAlerts: boolean;
  autoAssign: boolean;
  sidebarCollapsed: boolean;
  themeMode: "light" | "system";
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  focusArea: string;
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  notifications: Notification[];
  settings: WorkspaceSettings;
}
