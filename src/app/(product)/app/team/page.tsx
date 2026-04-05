"use client";

import { useState } from "react";

import { useWorkspace } from "@/components/providers/workspace-provider";

export default function TeamPage() {
  const { workspace, inviteTeamMember } = useWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Contributor");
  const [team, setTeam] = useState("Product");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const didInviteMember = inviteTeamMember({ name, email, role, team });

    if (!didInviteMember) {
      return;
    }

    setName("");
    setEmail("");
    setRole("Contributor");
    setTeam("Product");
  }

  return (
    <div className="stack-xl">
      <section className="section-header">
        <div>
          <p className="eyebrow">Team</p>
          <h2>Invite teammates and exercise list-management flows.</h2>
        </div>
      </section>

      <div className="card-grid two-up">
        <form className="surface-card modal-form" onSubmit={handleSubmit}>
          <h3>Invite teammate</h3>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Role</span>
            <input value={role} onChange={(event) => setRole(event.target.value)} />
          </label>
          <label className="field">
            <span>Team</span>
            <input value={team} onChange={(event) => setTeam(event.target.value)} />
          </label>
          <button className="button-primary button-block" type="submit">
            Invite member
          </button>
        </form>

        <div className="stack-md">
          {!(workspace?.team ?? []).length ? (
            <article className="surface-card">
              <h3>No teammates yet.</h3>
              <p>Add someone from the form to exercise the invite flow.</p>
            </article>
          ) : null}
          {(workspace?.team ?? []).map((member) => (
            <article key={member.id} className="surface-card team-card">
              <div className="avatar-row">
                <span
                  className="avatar-dot"
                  style={{ backgroundColor: `hsl(${member.avatarHue} 68% 55%)` }}
                />
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.email}</p>
                </div>
              </div>
              <div className="detail-grid">
                <div>
                  <small>Role</small>
                  <strong>{member.role}</strong>
                </div>
                <div>
                  <small>Team</small>
                  <strong>{member.team}</strong>
                </div>
                <div>
                  <small>Status</small>
                  <strong>{member.status}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
