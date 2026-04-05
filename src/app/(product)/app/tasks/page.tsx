"use client";

import { useMemo, useState } from "react";

import { Tabs } from "@/components/ui/tabs";
import { useWorkspace } from "@/components/providers/workspace-provider";

const taskTabs = [
  { id: "all", label: "All tasks" },
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Done" },
];

const nextStatuses = ["todo", "in-progress", "blocked", "done"] as const;

export default function TasksPage() {
  const { workspace, toggleTaskComplete, updateTaskStatus } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const tasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (workspace?.tasks ?? []).filter((task) => {
      const matchesStatus = activeTab === "all" ? true : task.status === activeTab;
      const matchesQuery = query
        ? [task.title, task.notes, task.type].join(" ").toLowerCase().includes(query)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [activeTab, search, workspace?.tasks]);

  return (
    <div className="stack-xl">
      <section className="section-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h2>Move work through a few different task states.</h2>
        </div>
        <label className="search-field">
          <span>Search</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </section>

      <Tabs items={taskTabs} activeId={activeTab} onChange={setActiveTab} />

      <div className="stack-md">
        {!tasks.length ? (
          <article className="surface-card">
            <h3>No tasks found.</h3>
            <p>Change the filter or search text to bring tasks back into view.</p>
          </article>
        ) : null}
        {tasks.map((task) => (
          <article key={task.id} className="surface-card">
            <div className="inline-split task-top">
              <div>
                <div className="button-row compact">
                  <span className="badge">{task.status}</span>
                  <span className="badge badge-muted">{task.priority}</span>
                  <span className="badge badge-muted">{task.type}</span>
                </div>
                <h3>{task.title}</h3>
                <p>{task.notes}</p>
              </div>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                />
                <span>Complete</span>
              </label>
            </div>
            <div className="detail-grid">
              <div>
                <small>Due date</small>
                <strong>{task.dueDate}</strong>
              </div>
              <div>
                <small>Estimate</small>
                <strong>{task.estimate}</strong>
              </div>
            </div>
            <div className="button-row compact">
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  className="button-secondary"
                  type="button"
                  onClick={() => updateTaskStatus(task.id, status)}
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
