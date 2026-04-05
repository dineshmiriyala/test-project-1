"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { joinClasses } from "@/lib/utils";

type ToastTone = "info" | "success" | "warning";

interface ToastItem {
  id: string;
  title: string;
  body: string;
  tone: ToastTone;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast(toast) {
        try {
          const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          setToasts((current) => [...current, { ...toast, id }]);

          // Auto-dismiss keeps the UI moving even when the user does not interact with the toast stack.
          window.setTimeout(() => {
            setToasts((current) => current.filter((item) => item.id !== id));
          }, 4200);
        } catch (error) {
          console.error("Failed to create toast", error);
        }
      },
      dismissToast(id) {
        setToasts((current) => current.filter((item) => item.id !== id));
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={joinClasses("toast-card", `toast-${toast.tone}`)}
            role="status"
          >
            <div>
              <strong>{toast.title}</strong>
              <p>{toast.body}</p>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => value.dismissToast(toast.id)}
              aria-label={`Dismiss ${toast.title}`}
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
