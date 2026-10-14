"use client";

import { useEffect, useRef, useState } from "react";
import { useImpact } from "../lib/use-impact";
import type { KindnessEntry } from "./kindness-practice";
import { kindnessCategoryLabel } from "./kindness-stories";

const VISIBLE_LEAF_LIMIT = 18;
const LEAF_POSITIONS = [
  { x: 9, y: 18 }, { x: 18, y: 8 }, { x: 27, y: 24 }, { x: 37, y: 12 },
  { x: 8, y: 38 }, { x: 19, y: 31 }, { x: 30, y: 43 }, { x: 40, y: 35 },
  { x: 61, y: 17 }, { x: 71, y: 8 }, { x: 81, y: 23 }, { x: 92, y: 14 },
  { x: 60, y: 38 }, { x: 70, y: 31 }, { x: 80, y: 43 }, { x: 91, y: 35 },
  { x: 49, y: 12 }, { x: 58, y: 11 },
];

function chooseRandomStory(stories: KindnessEntry[]) {
  return stories[Math.floor(Math.random() * stories.length)];
}

export default function KindnessDiscovery() {
  const [entries, setEntries] = useState<KindnessEntry[]>([]);
  const [selected, setSelected] = useState<KindnessEntry | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const leafButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const discoveryButtonRef = useRef<HTMLButtonElement>(null);
  const focusTargetRef = useRef<HTMLButtonElement | null>(null);
  const { impact, unavailable: impactUnavailable } = useImpact();

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

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        focusTargetRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  const approved = entries.filter((entry) => entry.status === "approved");
  const visibleStories = approved.slice(0, VISIBLE_LEAF_LIMIT);
  const showRandomKindness = () => {
    const choices =
      approved.length > 1 && selected
        ? approved.filter((entry) => entry.id !== selected.id)
        : approved;
    const next = chooseRandomStory(choices);
    if (!next) return;
    const leafButton = leafButtonRefs.current.get(next.id) ?? null;
    focusTargetRef.current = leafButton ?? discoveryButtonRef.current;
    setSelected(next);
  };
  const closeStory = () => {
    setSelected(null);
    focusTargetRef.current?.focus();
  };

  return (
    <div className="kindness-discovery-layout">
      <div className="kindness-tree-experience">
        <p className="kindness-tree-instructions" id="kindness-tree-instructions">
          Explore the leaves to discover approved kindness stories.
        </p>
        <div
          className="kindness-tree-scene"
          aria-describedby="kindness-tree-instructions"
        >
          <img
            src="/kindness-tree.png"
            alt="A large old tree in a sunlit woodland clearing."
          />
          {visibleStories.map((entry, index) => {
            const position = LEAF_POSITIONS[index];
            const isSelected = selected?.id === entry.id;
            return (
              <button
                key={entry.id}
                ref={(element) => {
                  if (element) leafButtonRefs.current.set(entry.id, element);
                  else leafButtonRefs.current.delete(entry.id);
                }}
                className={`kindness-tree-leaf${isSelected ? " is-selected" : ""}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                type="button"
                aria-label={`Read story: ${kindnessCategoryLabel(entry.kind)} by ${entry.displayName || "Anonymous"}`}
                aria-pressed={isSelected}
                onClick={(event) => {
                  focusTargetRef.current = event.currentTarget;
                  setSelected(entry);
                }}
              >
                <span aria-hidden="true" />
              </button>
            );
          })}
          {selected && (
            <article
              className="kindness-reveal"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Kindness story"
            >
              <p>{selected.message}</p>
              <span>
                {kindnessCategoryLabel(selected.kind)} · {selected.displayName || "Anonymous"}
              </span>
              <button
                className="kindness-reveal-close"
                type="button"
                onClick={closeStory}
              >
                Close story
              </button>
            </article>
          )}
        </div>
        {approved.length > 0 ? (
          <button
            ref={discoveryButtonRef}
            className="button kindness-discovery-button"
            type="button"
            onClick={showRandomKindness}
          >
            {selected ? "Show me another kindness" : "Show me a kindness"}
          </button>
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
            Finding kindness stories…
          </p>
        )}
        {approved.length > VISIBLE_LEAF_LIMIT && (
          <p className="kindness-tree-sample-note">
            The tree shows a sample of {VISIBLE_LEAF_LIMIT} approved stories; the total is shown separately.
          </p>
        )}
        {impact ? (
          <p className="kindness-tree-count" role="status">
            {impact.kindnessesNoticed} approved kindness {impact.kindnessesNoticed === 1 ? "story" : "stories"} shared
          </p>
        ) : impactUnavailable ? (
          <p className="kindness-tree-count" role="status">
            The kindness story total is temporarily unavailable.
          </p>
        ) : (
          <p className="kindness-tree-count" role="status">
            Loading the kindness story total…
          </p>
        )}
      </div>
    </div>
  );
}
