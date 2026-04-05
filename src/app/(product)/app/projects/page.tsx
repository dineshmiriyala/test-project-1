"use client";

import { useMemo, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatRelativeDate } from "@/lib/utils";

const projectTabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

export default function ProjectsPage() {
  const { workspace, createProject, archiveProject } = useWorkspace();
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [owner, setOwner] = useState("Alex Carter");

  const projects = useMemo(() => {
    const allProjects = workspace?.projects ?? [];

    if (activeTab === "active") {
      return allProjects.filter((project) => !project.archived);
    }

    if (activeTab === "archived") {
      return allProjects.filter((project) => project.archived);
    }

    return allProjects;
  }, [activeTab, workspace?.projects]);

  function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const didCreateProject = createProject({ name, summary, owner });

    if (!didCreateProject) {
      return;
    }

    setName("");
    setSummary("");
    setOwner("Alex Carter");
    setIsModalOpen(false);
  }

  return (
    <div className="stack-xl">
      <section className="section-header">
        <div>
          <p className="eyebrow">Projects</p>
          <h2>Manage a believable project portfolio.</h2>
        </div>
        <button className="button-primary" type="button" onClick={() => setIsModalOpen(true)}>
          New project
        </button>
      </section>

      <Tabs items={projectTabs} activeId={activeTab} onChange={setActiveTab} />

      <div className="stack-md">
        {!projects.length ? (
          <article className="surface-card">
            <h3>No projects match this filter.</h3>
            <p>Try another tab or create a new project to keep the workspace busy.</p>
          </article>
        ) : null}
        {projects.map((project) => (
          <article key={project.id} className="surface-card project-card">
            <div className="project-card-top">
              <div>
                <div className="button-row compact">
                  <span className="badge">{project.status}</span>
                  <span className="badge badge-muted">{project.health}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <button
                className="button-secondary"
                type="button"
                onClick={() => archiveProject(project.id)}
              >
                {project.archived ? "Restore" : "Archive"}
              </button>
            </div>
            <div className="detail-grid">
              <div>
                <small>Owner</small>
                <strong>{project.owner}</strong>
              </div>
              <div>
                <small>Progress</small>
                <strong>{project.progress}%</strong>
              </div>
              <div>
                <small>Stage</small>
                <strong>{project.stage}</strong>
              </div>
              <div>
                <small>Updated</small>
                <strong>{formatRelativeDate(project.updatedAt)}</strong>
              </div>
            </div>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        title="Create a project"
        description="This action updates local workspace state and triggers a custom analytics event."
        onClose={() => setIsModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleCreateProject}>
          <label className="field">
            <span>Project name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Summary</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
          </label>
          <label className="field">
            <span>Owner</span>
            <input value={owner} onChange={(event) => setOwner(event.target.value)} />
          </label>
          <button className="button-primary button-block" type="submit">
            Create project
          </button>
        </form>
      </Modal>
    </div>
  );
}
