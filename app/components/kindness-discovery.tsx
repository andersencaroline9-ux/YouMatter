"use client";

import { useEffect, useState } from "react";
import type { KindnessEntry } from "./kindness-practice";
import { kindnessCategoryLabel } from "./kindness-stories";

export default function KindnessDiscovery() {
  const [entries, setEntries] = useState<KindnessEntry[]>([]);
  const [selected, setSelected] = useState<KindnessEntry | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/kindness")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load kindness stories.");
        return await response.json() as { entries?: KindnessEntry[] };
      })
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setLoadError(true);
        setLoaded(true);
      });
  }, []);

  const approved = entries.filter((entry) => entry.status === "approved");
  const showRandomKindness = () => {
    const choices =
      approved.length > 1 && selected
        ? approved.filter((entry) => entry.id !== selected.id)
        : approved;
    const next = choices[Math.floor(Math.random() * choices.length)];
    if (next) setSelected(next);
  };

  return (
    <div className="kindness-discovery-layout">
      <div className="kindness-tree-experience">
        <div className="kindness-tree-scene">
          <img
            src="/kindness-tree.png"
            alt="A large old tree in a sunlit woodland clearing."
          />
        </div>
        {approved.length > 0 ? (
          <>
            <button
              className="button kindness-discovery-button"
              type="button"
              onClick={showRandomKindness}
            >
              {selected ? "Show me another" : "Show me a kindness"}
            </button>
            {selected && (
              <article
                className="kindness-reveal"
                aria-live="polite"
                aria-atomic="true"
              >
                <p>{selected.message}</p>
                <span>
                  {kindnessCategoryLabel(selected.kind)} · {selected.displayName || "Anonymous"}
                </span>
              </article>
            )}
          </>
        ) : loadError ? (
          <p className="kindness-empty" role="status">
            Kindness stories couldn’t be loaded right now.
          </p>
        ) : loaded ? (
          <p className="kindness-empty">
            The tree is waiting for its first kindness story.
          </p>
        ) : (
          <p className="kindness-empty" role="status">
            Finding a kindness story…
          </p>
        )}
      </div>
    </div>
  );
}
