"use client";

import Link from "next/link";
import { useState } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { useAnalytics } from "@/components/providers/analytics-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Accordion } from "@/components/ui/accordion";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";

const playgroundTabs = [
  { id: "inputs", label: "Inputs" },
  { id: "feedback", label: "Feedback" },
  { id: "lists", label: "Lists" },
];

const accordionItems = [
  {
    id: "faq-1",
    title: "Why add a playground page?",
    body: "Because it lets you validate lots of auto-capture patterns in one place without hunting through the rest of the app.",
  },
  {
    id: "faq-2",
    title: "Should this page be pretty?",
    body: "Pretty enough to feel intentional, but practical enough that every control type is easy to find and click.",
  },
  {
    id: "faq-3",
    title: "Does this page use custom events?",
    body: "A few, mostly around deliberate actions like reordering items or opening structured feedback flows.",
  },
];

const initialBacklog = [
  "Review signup friction",
  "Update release digest",
  "Re-test archived project flow",
  "Tighten docs navigation copy",
];

export default function PlaygroundPage() {
  const analytics = useAnalytics();
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState("inputs");
  const [openItem, setOpenItem] = useState<string | null>("faq-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [backlog, setBacklog] = useState(initialBacklog);
  const [switchEnabled, setSwitchEnabled] = useState(true);
  const [radioValue, setRadioValue] = useState("email");
  const [selectedPlan, setSelectedPlan] = useState("growth");

  function openFeedbackModal(source: string) {
    analytics.capture("playground_modal_opened", {
      source,
    });
    setIsModalOpen(true);
  }

  function closeFeedbackModal(source: string) {
    analytics.capture("playground_modal_closed", {
      source,
    });
    setIsModalOpen(false);
  }

  function triggerToast(tone: "info" | "success", source: string) {
    analytics.capture("playground_toast_triggered", {
      tone,
      source,
    });
    pushToast({
      tone,
      title: tone === "success" ? "Success toast" : "Toast fired",
      body:
        tone === "success"
          ? "Useful for validating click capture with transient UI state."
          : "This is here so you can observe click capture plus transient UI feedback.",
    });
  }

  function handleTabChange(id: string) {
    analytics.capture("playground_tab_selected", {
      tab: id,
    });
    setActiveTab(id);
  }

  function handleAccordionToggle(id: string) {
    analytics.capture("playground_accordion_toggled", {
      item: id,
      willOpen: openItem !== id,
    });
    setOpenItem((current) => (current === id ? null : id));
  }

  function handleSearchChange(value: string) {
    // Track only length so the event shows input use without storing typed text.
    analytics.capture("playground_search_changed", {
      queryLength: value.trim().length,
      hasQuery: Boolean(value.trim()),
    });
    setSearch(value);
  }

  function handlePlanChange(value: string) {
    analytics.capture("playground_plan_selected", {
      plan: value,
    });
    setSelectedPlan(value);
  }

  function handleDigestToggle(isEnabled: boolean) {
    analytics.capture("playground_digest_toggled", {
      enabled: isEnabled,
    });
    setSwitchEnabled(isEnabled);
  }

  function handleContactModeChange(value: string) {
    analytics.capture("playground_contact_mode_selected", {
      mode: value,
    });
    setRadioValue(value);
  }

  function handlePageChange(nextPage: number) {
    analytics.capture("playground_page_changed", {
      page: nextPage,
    });
    setPage(nextPage);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= backlog.length) {
      return;
    }

    const nextItems = [...backlog];
    const [movedItem] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, movedItem);
    setBacklog(nextItems);

    analytics.capture("playground_reordered", {
      item: movedItem,
      direction: direction === -1 ? "up" : "down",
    });
  }

  return (
    <PublicShell>
      <section className="content-block page-hero">
        <p className="eyebrow">Playground</p>
        <h1>A dense page for auto-capture validation.</h1>
        <p className="lede">
          This route collects many common UI behaviors in one place: tabs, modal, accordion, inputs,
          filters, pagination, toasts, toggles, and a reorderable list.
        </p>
        <div className="button-row">
          <button className="button-primary" type="button" onClick={() => openFeedbackModal("hero")}>
            Open modal
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => triggerToast("info", "hero")}
          >
            Trigger toast
          </button>
          <Link href="/app" className="button-secondary">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="content-block stack-xl">
        <Tabs items={playgroundTabs} activeId={activeTab} onChange={handleTabChange} />

        {activeTab === "inputs" ? (
          <div className="card-grid two-up">
            <article className="surface-card stack-md">
              <h2>Form controls</h2>
              <label className="field">
                <span>Search docs</span>
                <input value={search} onChange={(event) => handleSearchChange(event.target.value)} />
              </label>
              <label className="field">
                <span>Plan dropdown</span>
                <select
                  value={selectedPlan}
                  onChange={(event) => handlePlanChange(event.target.value)}
                >
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="scale">Scale</option>
                </select>
              </label>
              <div className="check-grid">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={switchEnabled}
                    onChange={(event) => handleDigestToggle(event.target.checked)}
                  />
                  <span>Enable release digest</span>
                </label>
                <label className="check-row">
                  <input
                    type="radio"
                    name="contact"
                    checked={radioValue === "email"}
                    onChange={() => handleContactModeChange("email")}
                  />
                  <span>Email me updates</span>
                </label>
                <label className="check-row">
                  <input
                    type="radio"
                    name="contact"
                    checked={radioValue === "slack"}
                    onChange={() => handleContactModeChange("slack")}
                  />
                  <span>Send updates to Slack</span>
                </label>
              </div>
            </article>

            <article className="surface-card stack-md">
              <h2>Accordion</h2>
              <Accordion
                items={accordionItems}
                openId={openItem}
                onToggle={handleAccordionToggle}
              />
            </article>
          </div>
        ) : null}

        {activeTab === "feedback" ? (
          <div className="card-grid two-up">
            <article className="surface-card stack-md">
              <h2>Toast and modal patterns</h2>
              <div className="button-row compact">
                <button
                  className="button-primary"
                  type="button"
                  onClick={() => triggerToast("success", "feedback-tab")}
                >
                  Success toast
                </button>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => {
                    analytics.capture("playground_feedback_requested", {
                      area: "feedback-tab",
                    });
                    openFeedbackModal("feedback-tab");
                  }}
                >
                  Feedback modal
                </button>
              </div>
              <div className="pagination-row">
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => handlePageChange(Math.min(5, page + 1))}
                >
                  Next
                </button>
              </div>
            </article>

            <article className="surface-card stack-md scroll-demo">
              <h2>Scroll depth area</h2>
              <p>Deliberately tall content helps validate scroll tracking or viewport-based events.</p>
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="scroll-panel">
                  <strong>Checkpoint {index + 1}</strong>
                  <p>Keep scrolling. Each block gives the route enough depth to feel like a real docs or dashboard screen.</p>
                </div>
              ))}
            </article>
          </div>
        ) : null}

        {activeTab === "lists" ? (
          <div className="card-grid two-up">
            <article className="surface-card stack-md">
              <h2>Reorderable backlog</h2>
              <div className="stack-md">
                {backlog.map((item, index) => (
                  <div key={item} className="list-row">
                    <span>{item}</span>
                    <div className="button-row compact">
                      <button
                        className="button-secondary"
                        type="button"
                        onClick={() => moveItem(index, -1)}
                      >
                        Up
                      </button>
                      <button
                        className="button-secondary"
                        type="button"
                        onClick={() => moveItem(index, 1)}
                      >
                        Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card stack-md">
              <h2>Live state snapshot</h2>
              <div className="detail-grid">
                <div>
                  <small>Search text</small>
                  <strong>{search || "empty"}</strong>
                </div>
                <div>
                  <small>Plan</small>
                  <strong>{selectedPlan}</strong>
                </div>
                <div>
                  <small>Digest toggle</small>
                  <strong>{switchEnabled ? "enabled" : "disabled"}</strong>
                </div>
                <div>
                  <small>Contact mode</small>
                  <strong>{radioValue}</strong>
                </div>
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <Modal
        open={isModalOpen}
        title="Fake feedback modal"
        description="Use this to test overlay clicks, dialog interactions, and close patterns."
        onClose={() => closeFeedbackModal("modal-dismiss")}
      >
        <div className="stack-md">
          <label className="field">
            <span>What felt rough?</span>
            <textarea placeholder="Write anything. This does not go anywhere." />
          </label>
          <button
            className="button-primary button-block"
            type="button"
            onClick={() => {
              analytics.capture("playground_feedback_submitted", {
                source: "modal",
              });
              closeFeedbackModal("feedback-submit");
            }}
          >
            Submit fake feedback
          </button>
        </div>
      </Modal>
    </PublicShell>
  );
}
