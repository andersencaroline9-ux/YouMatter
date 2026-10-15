"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  KINDNESS_TREE_STORY_LIMIT,
  kindnessCategoryLabel,
} from "../lib/kindness";
import { useImpact } from "../lib/use-impact";
import type { KindnessStory } from "../lib/kindness";

const LEAF_POSITIONS = [
  { x: 9, y: 18, mobileX: 9, mobileY: 10 },
  { x: 18, y: 8, mobileX: 29, mobileY: 14 },
  { x: 27, y: 24, mobileX: 51, mobileY: 11 },
  { x: 37, y: 12, mobileX: 73, mobileY: 13 },
  { x: 8, y: 38, mobileX: 92, mobileY: 10 },
  { x: 19, y: 31, mobileX: 18, mobileY: 35 },
  { x: 30, y: 43, mobileX: 40, mobileY: 40 },
  { x: 40, y: 35, mobileX: 63, mobileY: 36 },
  { x: 61, y: 17, mobileX: 85, mobileY: 39 },
  { x: 71, y: 8, mobileX: 9, mobileY: 61 },
  { x: 81, y: 23, mobileX: 30, mobileY: 66 },
  { x: 92, y: 14, mobileX: 53, mobileY: 62 },
  { x: 60, y: 38, mobileX: 75, mobileY: 65 },
  { x: 70, y: 31, mobileX: 92, mobileY: 61 },
  { x: 80, y: 43, mobileX: 18, mobileY: 87 },
  { x: 91, y: 35, mobileX: 41, mobileY: 91 },
  { x: 49, y: 12, mobileX: 64, mobileY: 88 },
  { x: 58, y: 6, mobileX: 86, mobileY: 90 },
];

export default function KindnessDiscovery() {
  const [stories, setStories] = useState<KindnessStory[]>([]);
  const [selected, setSelected] = useState<KindnessStory | null>(null);
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [randomBusy, setRandomBusy] = useState(false);
  const [randomError, setRandomError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const leafButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const discoveryButtonRef = useRef<HTMLButtonElement>(null);
  const focusTargetRef = useRef<HTMLButtonElement | null>(null);
  const { impact, unavailable: impactUnavailable } = useImpact();

  useEffect(() => {
    fetch("/api/kindness/tree", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load kindness stories.");
        return await response.json() as {
          stories?: KindnessStory[];
          hasMore?: boolean;
        };
      })
      .then((data) => {
        setStories(data.stories ?? []);
        setHasMore(data.hasMore ?? false);
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
        setSelectedLeafIndex(null);
        focusTargetRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  const showRandomKindness = async () => {
    setRandomBusy(true);
    setRandomError("");
    try {
      const response = await fetch("/api/kindness/random", { cache: "no-store" });
      if (!response.ok) throw new Error("A kindness story could not be loaded.");
      const data = await response.json() as { story?: KindnessStory | null };
      if (!data.story) {
        setRandomError("There are no approved kindness stories to show right now.");
        setSelected(null);
        setSelectedLeafIndex(null);
        return;
      }
      focusTargetRef.current = discoveryButtonRef.current;
      setSelected(data.story);
      setSelectedLeafIndex(null);
    } catch {
      setRandomError("A kindness story could not be loaded right now. Please try again.");
    } finally {
      setRandomBusy(false);
    }
  };

  const closeStory = () => {
    setSelected(null);
    setSelectedLeafIndex(null);
    focusTargetRef.current?.focus();
  };

  return (
    <div className="kindness-discovery-layout">
      <div className="kindness-tree-experience">
        <p className="kindness-tree-instructions" id="kindness-tree-instructions">
          Each leaf holds a real kindness story, shared by someone and approved before appearing here.
        </p>
        <div
          className="kindness-tree-scene"
          aria-describedby="kindness-tree-instructions"
        >
          <img
            src="/kindness-tree.png"
            alt="A large old tree in a sunlit woodland clearing."
          />
          {stories.slice(0, KINDNESS_TREE_STORY_LIMIT).map((story, index) => {
            const position = LEAF_POSITIONS[index];
            const isSelected = selectedLeafIndex === index;
            const style: CSSProperties & {
              "--mobile-x": string;
              "--mobile-y": string;
            } = {
              "--desktop-x": `${position.x}%`,
              "--desktop-y": `${position.y}%`,
              "--mobile-x": `${position.mobileX}%`,
              "--mobile-y": `${position.mobileY}%`,
            };
            return (
              <button
                key={index}
                ref={(element) => {
                  if (element) leafButtonRefs.current.set(index, element);
                  else leafButtonRefs.current.delete(index);
                }}
                className={`kindness-tree-leaf${isSelected ? " is-selected" : ""}`}
                style={style}
                type="button"
                aria-label={`Read story: ${kindnessCategoryLabel(story.kind)} by ${story.displayName || "Anonymous"}`}
                aria-pressed={isSelected}
                onClick={(event) => {
                  focusTargetRef.current = event.currentTarget;
                  setSelected(story);
                  setSelectedLeafIndex(index);
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
        {stories.length > 0 ? (
          <button
            ref={discoveryButtonRef}
            className="button kindness-discovery-button"
            type="button"
            onClick={showRandomKindness}
            disabled={randomBusy}
          >
            {randomBusy
              ? "Finding a kindness…"
              : selected
                ? "Show me another kindness"
                : "Show me a kindness"}
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
        {randomError && <p className="kindness-empty" role="status">{randomError}</p>}
        {hasMore && (
          <p className="kindness-tree-sample-note">
            Showing a sample of {KINDNESS_TREE_STORY_LIMIT} approved stories. Use “Show me a kindness” to discover another.
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
