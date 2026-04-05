"use client";

import { useState } from "react";

import { Tabs } from "@/components/ui/tabs";
import { useWorkspace } from "@/components/providers/workspace-provider";

const settingsTabs = [
  { id: "workspace", label: "Workspace" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
];

export default function SettingsPage() {
  const { workspace, updateSettings } = useWorkspace();
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div className="stack-xl">
      <section className="section-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Toggle a few persistent workspace preferences.</h2>
        </div>
      </section>

      <Tabs items={settingsTabs} activeId={activeTab} onChange={setActiveTab} />

      {activeTab === "workspace" ? (
        <section className="surface-card stack-md">
          <label className="check-row">
            <input
              type="checkbox"
              checked={workspace?.settings.autoAssign ?? false}
              onChange={(event) => updateSettings({ autoAssign: event.target.checked })}
            />
            <span>Auto-assign new tasks to the project owner</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={workspace?.settings.sidebarCollapsed ?? false}
              onChange={(event) => updateSettings({ sidebarCollapsed: event.target.checked })}
            />
            <span>Collapse the sidebar by default</span>
          </label>
        </section>
      ) : null}

      {activeTab === "notifications" ? (
        <section className="surface-card stack-md">
          <label className="check-row">
            <input
              type="checkbox"
              checked={workspace?.settings.releaseAlerts ?? false}
              onChange={(event) => updateSettings({ releaseAlerts: event.target.checked })}
            />
            <span>Enable release alerts</span>
          </label>
          <label className="field">
            <span>Digest cadence</span>
            <select
              value={workspace?.settings.digestCadence ?? "weekly"}
              onChange={(event) =>
                updateSettings({
                  digestCadence: event.target.value as "daily" | "weekly",
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
        </section>
      ) : null}

      {activeTab === "appearance" ? (
        <section className="surface-card stack-md">
          <label className="check-row">
            <input
              type="radio"
              name="themeMode"
              checked={(workspace?.settings.themeMode ?? "light") === "light"}
              onChange={() => updateSettings({ themeMode: "light" })}
            />
            <span>Light mode</span>
          </label>
          <label className="check-row">
            <input
              type="radio"
              name="themeMode"
              checked={(workspace?.settings.themeMode ?? "light") === "system"}
              onChange={() => updateSettings({ themeMode: "system" })}
            />
            <span>Follow system</span>
          </label>
        </section>
      ) : null}
    </div>
  );
}
