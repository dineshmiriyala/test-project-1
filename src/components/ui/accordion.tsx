"use client";

import { joinClasses } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  body: string;
}

interface AccordionProps {
  items: AccordionItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}

export function Accordion({ items, openId, onToggle }: AccordionProps) {
  return (
    <div className="accordion-list">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <article key={item.id} className={joinClasses("accordion-item", isOpen && "accordion-item-open")}>
            <button
              className="accordion-trigger"
              type="button"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <p className="accordion-body">{item.body}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
