import { createSeededWorkspace, DEMO_USER } from "@/lib/mock/seed";
import type { StoredUser, UserSession, Workspace } from "@/lib/mock/types";

const USERS_KEY = "signal-lab-demo:users:v1";
const SESSION_KEY = "signal-lab-demo:session:v1";
const WORKSPACE_PREFIX = "signal-lab-demo:workspace:v1:";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.error(`Failed to read local storage key: ${key}`, error);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write local storage key: ${key}`, error);
  }
}

function workspaceKey(userId: string) {
  return `${WORKSPACE_PREFIX}${userId}`;
}

function sanitizeSession(user: StoredUser): UserSession {
  // Returning the public session shape explicitly keeps password data out of any UI-facing state.
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: user.role,
    plan: user.plan,
    workspaceId: user.workspaceId,
    onboardingCompleted: user.onboardingCompleted,
    lastLoginAt: user.lastLoginAt,
  };
}

function ensureUsers() {
  const existingUsers = readJson<StoredUser[]>(USERS_KEY, []);

  if (existingUsers.some((user) => user.email === DEMO_USER.email)) {
    return existingUsers;
  }

  const users = [DEMO_USER, ...existingUsers];
  writeJson(USERS_KEY, users);
  return users;
}

export const mockRepository = {
  getUsers() {
    return ensureUsers();
  },
  findUserByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return ensureUsers().find((user) => user.email === normalizedEmail) ?? null;
  },
  createUser(user: Omit<StoredUser, "id" | "workspaceId" | "lastLoginAt">) {
    const normalizedEmail = user.email.trim().toLowerCase();
    const existingUsers = ensureUsers();

    if (existingUsers.some((entry) => entry.email === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }

    const storedUser: StoredUser = {
      ...user,
      id: `user-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
      email: normalizedEmail,
      workspaceId: `workspace-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
      lastLoginAt: new Date().toISOString(),
    };

    const nextUsers = [storedUser, ...existingUsers];
    writeJson(USERS_KEY, nextUsers);
    writeJson(workspaceKey(storedUser.id), createSeededWorkspace(storedUser));
    return sanitizeSession(storedUser);
  },
  updateUserSession(userId: string, changes: Partial<StoredUser>) {
    const users = ensureUsers();
    const nextUsers = users.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      return {
        ...user,
        ...changes,
      };
    });

    writeJson(USERS_KEY, nextUsers);
    const updatedUser = nextUsers.find((user) => user.id === userId);
    return updatedUser ? sanitizeSession(updatedUser) : null;
  },
  saveSession(session: UserSession | null) {
    writeJson(SESSION_KEY, session);
  },
  getSession() {
    return readJson<UserSession | null>(SESSION_KEY, null);
  },
  getWorkspace(user: UserSession) {
    const existingWorkspace = readJson<Workspace | null>(workspaceKey(user.id), null);

    if (existingWorkspace) {
      return existingWorkspace;
    }

    const seededWorkspace = createSeededWorkspace({
      company: user.company,
      plan: user.plan,
      workspaceId: user.workspaceId,
      name: user.name,
      email: user.email,
    });
    writeJson(workspaceKey(user.id), seededWorkspace);
    return seededWorkspace;
  },
  saveWorkspace(userId: string, workspace: Workspace) {
    writeJson(workspaceKey(userId), workspace);
  },
  signIn(email: string, password: string) {
    const user = this.findUserByEmail(email);

    if (!user) {
      throw new Error("No account found for that email.");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password. Try the demo password: password123.");
    }

    const session = sanitizeSession({
      ...user,
      lastLoginAt: new Date().toISOString(),
    });

    const nextSession = this.updateUserSession(user.id, {
      lastLoginAt: session.lastLoginAt,
    });

    this.saveSession(nextSession ?? session);
    return nextSession ?? session;
  },
  signOut() {
    this.saveSession(null);
  },
};
