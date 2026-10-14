"use client";

import { useState } from "react";
import type { KindnessEntry } from "./kindness-practice";

export function kindnessCategoryLabel(kind: KindnessEntry["kind"]) {
  switch (kind) {
    case "gave":
      return "A kindness I gave";
    case "received":
      return "A kindness I received";
    case "witnessed":
      return "A kindness I witnessed";
  }
}

export default function KindnessStories({ entries, emptyMessage, id }: {
  entries: KindnessEntry[];
  emptyMessage: string;
  id: string;
}) {
  const [selected, setSelected] = useState<KindnessEntry | null>(null);

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
