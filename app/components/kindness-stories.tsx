"use client";

import { useState } from "react";
import { kindnessCategoryLabel, type PendingKindnessEntry } from "../lib/kindness";

export default function KindnessStories({ entries, emptyMessage, id }: {
  entries: PendingKindnessEntry[];
  emptyMessage: string;
  id: string;
}) {
  const [selected, setSelected] = useState<PendingKindnessEntry | null>(null);

  return <>
    {entries.length === 0 && <p className="kindness-empty">{emptyMessage}</p>}
    <ul className="kindness-story-list">
      {entries.map((entry) => <li key={`${entry.status}-${entry.id}`}>
        <button
          type="button"
          className="kindness-story-choice"
          aria-expanded={selected?.id === entry.id}
          aria-controls={`${id}-${entry.id}-detail`}
          onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
        >
          <small>{kindnessCategoryLabel(entry.kind)}{entry.status === "pending" ? " · Awaiting approval" : ""}</small>
          <span>{entry.message}</span>
        </button>
        <div className="kindness-story-detail" id={`${id}-${entry.id}-detail`} hidden={selected?.id !== entry.id}>
          <p>{entry.message}</p>
          <span>{kindnessCategoryLabel(entry.kind)} · {entry.displayName || "Anonymous"}
            {entry.status === "pending" ? " · Awaiting approval" : ""}
          </span>
          <button type="button" onClick={(event) => {
            const trigger = event.currentTarget.parentElement?.previousElementSibling;
            setSelected(null);
            if (trigger instanceof HTMLElement) trigger.focus();
          }}>Close story</button>
        </div>
      </li>)}
    </ul>
  </>;
}
