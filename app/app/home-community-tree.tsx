"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { getCountryDisplay } from "../lib/countries";

type Checkin = {
  rating: number;
  comment: string | null;
  displayName: string;
  countryCode: string | null;
};

type CheckinsResponse = {
  checkins?: Checkin[];
  error?: string;
};

const VISIBLE_LEAF_LIMIT = 12;

const leafPositions = [
  { x: 63, y: 56, mobileX: 22, mobileY: 53, rotation: -25 },
  { x: 77, y: 52, mobileX: 46, mobileY: 43, rotation: 15 },
  { x: 89, y: 47, mobileX: 73, mobileY: 34, rotation: -12 },
  { x: 54, y: 63, mobileX: 12, mobileY: 65, rotation: 25 },
  { x: 71, y: 62, mobileX: 38, mobileY: 60, rotation: -20 },
  { x: 94, y: 57, mobileX: 87, mobileY: 53, rotation: 18 },
  { x: 65, y: 69, mobileX: 26, mobileY: 73, rotation: -28 },
  { x: 77, y: 69, mobileX: 52, mobileY: 68, rotation: 22 },
  { x: 88, y: 67, mobileX: 76, mobileY: 65, rotation: -14 },
  { x: 50, y: 74, mobileX: 12, mobileY: 84, rotation: 28 },
  { x: 60, y: 80, mobileX: 35, mobileY: 84, rotation: -18 },
  { x: 86, y: 80, mobileX: 75, mobileY: 85, rotation: 12 },
] as const;

export default function HomeCommunityTree() {
  const [approved, setApproved] = useState<Checkin[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedLeafRef = useRef<HTMLButtonElement | null>(null);

  const visibleCheckins = approved.slice(0, VISIBLE_LEAF_LIMIT);
  const selectedCheckin =
    selectedIndex === null ? null : visibleCheckins[selectedIndex] ?? null;
  const selectedCountry = selectedCheckin?.countryCode
    ? getCountryDisplay(selectedCheckin.countryCode)
    : null;

  useEffect(() => {
    let active = true;

    fetch("/api/home-checkins", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as CheckinsResponse;
        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load community check-ins.");
        }
        return data;
      })
      .then((data) => {
        if (!active) return;
        setApproved(data.checkins ?? []);
        setLoaded(true);
      })
      .catch((loadError: unknown) => {
        console.error("Unable to load homepage check-ins.", loadError);
        if (!active) return;
        setUnavailable(true);
        setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSelectedIndex(null);
      selectedLeafRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedIndex]);

  function closeCard() {
    setSelectedIndex(null);
    selectedLeafRef.current?.focus();
  }

  return (
    <section
      className="home-community"
      aria-labelledby="home-community-title"
    >
      <div className="home-community__heading">
        <p className="home-welcome__eyebrow">Together, as we are</p>
        <h3 id="home-community-title">How we’re doing</h3>
        <p className="home-community__intro">
          A little glimpse of how we’re all doing.
        </p>
      </div>

      <div className="home-community__scene">
        <div className="home-community__canopy">
          {visibleCheckins.map((checkin, index) => {
            const position = leafPositions[index];
            return (
              <button
                key={`${checkin.rating}-${checkin.displayName}-${index}`}
                ref={(button) => {
                  if (selectedIndex === index) selectedLeafRef.current = button;
                }}
                type="button"
                className="home-community__leaf"
                style={{
                  "--leaf-x": `${position.x}%`,
                  "--leaf-y": `${position.y}%`,
                  "--leaf-mobile-x": `${position.mobileX}%`,
                  "--leaf-mobile-y": `${position.mobileY}%`,
                  "--leaf-rotation": `${position.rotation}deg`,
                } as CSSProperties}
                aria-label={`Read check-in ${index + 1} of ${visibleCheckins.length}, rated ${checkin.rating} out of 10, shared by ${checkin.displayName}`}
                aria-pressed={selectedIndex === index}
                aria-controls="home-community-card"
                aria-expanded={selectedIndex === index}
                onClick={(event) => {
                  selectedLeafRef.current = event.currentTarget;
                  setSelectedIndex(index);
                }}
              >
                <span aria-hidden="true" />
              </button>
            );
          })}
        </div>
        {!loaded ? (
          <p className="home-community__status" role="status">
            The community tree
          </p>
        ) : unavailable ? (
          <p className="home-community__status" role="status">
            We can’t show the check-ins just now.
          </p>
        ) : visibleCheckins.length === 0 ? (
          <p className="home-community__status" role="status">
            The tree is waiting for its first leaves.
          </p>
        ) : null}

        <section
          className="home-community__card"
          id="home-community-card"
          role="region"
          aria-live="polite"
          aria-labelledby="home-community-card-title"
          hidden={!selectedCheckin}
        >
          <button
            className="home-community__close"
            type="button"
            aria-label="Close check-in card"
            onClick={closeCard}
          >
            ×
          </button>
          <h4 id="home-community-card-title">
            {selectedCheckin
              ? `${selectedCheckin.rating}/10 · ${selectedCheckin.displayName}`
              : "Community check-in"}
            {selectedCountry && (
              <>
                {" · "}
                {selectedCountry.name}{" "}
                <span aria-hidden="true">{selectedCountry.flag}</span>
              </>
            )}
          </h4>
          {selectedCheckin?.comment && (
            <p>“{selectedCheckin.comment}”</p>
          )}
        </section>
      </div>
    </section>
  );
}
