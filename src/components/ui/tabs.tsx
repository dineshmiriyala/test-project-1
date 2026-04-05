"use client";

import { joinClasses } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="tabs-row" role="tablist" aria-label="Tabs">
      {items.map((item) => (
        <button
          key={item.id}
          className={joinClasses("tab-chip", activeId === item.id && "tab-chip-active")}
          type="button"
          role="tab"
          aria-selected={activeId === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
