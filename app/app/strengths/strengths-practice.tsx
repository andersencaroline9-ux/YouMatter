"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { getCountryDisplay, countries } from "../../lib/countries";
import {
  characterStrengthGroups,
  isCharacterStrength,
  isCharacterStrengthSelection,
} from "../../lib/character-strengths";
import { useImpact } from "../../lib/use-impact";

const STRENGTHS_WALL_POSITIONS = [
  { left: 40, bottom: 8, width: 12, rotation: -2, depthBand: "foreground" },
  { left: 53, bottom: 8, width: 12, rotation: 2, depthBand: "foreground" },
  { left: 27, bottom: 8, width: 12, rotation: 1, depthBand: "foreground" },
  { left: 66, bottom: 8, width: 12, rotation: -1, depthBand: "foreground" },
  { left: 14, bottom: 8, width: 12, rotation: 2, depthBand: "foreground" },
  { left: 79, bottom: 8, width: 12, rotation: -2, depthBand: "foreground" },
  { left: 34, bottom: 18, width: 12, rotation: 1, depthBand: "foreground" },
  { left: 47, bottom: 19, width: 12, rotation: -2, depthBand: "foreground" },
  { left: 60, bottom: 18, width: 12, rotation: 2, depthBand: "foreground" },
  { left: 73, bottom: 19, width: 12, rotation: -1, depthBand: "foreground" },
  { left: 21, bottom: 18, width: 12, rotation: -2, depthBand: "foreground" },
  { left: 28, bottom: 28, width: 11, rotation: 2, depthBand: "middle" },
  { left: 42, bottom: 29, width: 11, rotation: -1, depthBand: "middle" },
  { left: 56, bottom: 28, width: 11, rotation: 2, depthBand: "middle" },
  { left: 70, bottom: 29, width: 11, rotation: -2, depthBand: "middle" },
  { left: 84, bottom: 28, width: 11, rotation: 1, depthBand: "middle" },
  { left: 35, bottom: 39, width: 10, rotation: -2, depthBand: "background" },
  { left: 48, bottom: 40, width: 10, rotation: 1, depthBand: "background" },
  { left: 61, bottom: 39, width: 10, rotation: -1, depthBand: "background" },
  { left: 74, bottom: 40, width: 10, rotation: 2, depthBand: "background" },
] as const;

const STRENGTHS_WALL_DEPTH = {
  background: 1,
  middle: 2,
  foreground: 3,
} as const;

type WallPositionStyle = CSSProperties & {
  "--wall-left": `${number}%`;
  "--wall-bottom": `${number}%`;
  "--wall-width": `${number}%`;
  "--wall-transform": string;
  "--wall-layer": number;
};

type StrengthContribution = {
  key: string;
  strengths: string[];
  reflection: string | null;
  displayName: string;
  countryCode: string | null;
  sequence: number | null;
  status: "pending" | "approved";
};

type StrengthContributionData = Omit<
  StrengthContribution,
  "key" | "status"
>;

type StrengthsResponse = {
  contributions?: StrengthContributionData[];
  pending?: StrengthContributionData[];
  contribution?: StrengthContributionData & {
    status: "pending" | "approved";
  };
  error?: string;
};

type IdentityChoice = "anonymous" | "firstName";

const REFLECTION_MAX_LENGTH = 240;

export default function StrengthsPractice() {
  const [contributions, setContributions] = useState<StrengthContribution[]>(
    []
  );
  const [contributionsLoaded, setContributionsLoaded] = useState(false);
  const [contributionsLoadError, setContributionsLoadError] = useState(false);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [identityChoice, setIdentityChoice] =
    useState<IdentityChoice>("anonymous");
  const [firstName, setFirstName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedContributionKey, setSelectedContributionKey] = useState<string | null>(null);
  const stoneButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusTargetRef = useRef<HTMLButtonElement | null>(null);
  const { impact, unavailable: impactUnavailable } = useImpact();

  useEffect(() => {
    fetch("/api/strengths")
      .then(async (response) => {
        const data = (await response.json()) as StrengthsResponse;
        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load your contributions.");
        }
        return data;
      })
      .then((data) => {
        setContributions([
          ...(data.contributions ?? []).map((contribution) => ({
            ...contribution,
            key: `approved-${contribution.sequence}`,
            status: "approved" as const,
          })),
          ...(data.pending ?? []).map((contribution, index) => ({
            ...contribution,
            key: `pending-${index}`,
            status: "pending" as const,
          })),
        ]);
        setContributionsLoaded(true);
      })
      .catch(() => {
        setNote("Your contributions are temporarily unavailable.");
        setContributionsLoadError(true);
        setContributionsLoaded(true);
      });
  }, []);

  const approved = contributions.filter(
    (contribution): contribution is StrengthContribution & {
      sequence: number;
    } =>
      contribution.status === "approved" &&
      contribution.sequence !== null &&
      contribution.sequence > 0 &&
      isCharacterStrengthSelection(contribution.strengths)
  );
  const visibleContributions = approved.filter(
    (contribution) => contribution.sequence <= STRENGTHS_WALL_POSITIONS.length
  );
  const selectedContribution =
    visibleContributions.find(({ key }) => key === selectedContributionKey) ?? null;

  useEffect(() => {
    if (!selectedContributionKey) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedContributionKey(null);
        focusTargetRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedContributionKey]);

  function closeContribution() {
    setSelectedContributionKey(null);
    focusTargetRef.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isCharacterStrengthSelection(selectedStrengths)) {
      setNote("Choose three different strengths you recognise in yourself.");
      return;
    }
    if (!consent) {
      setNote("Please confirm that your contribution may be shared after review.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/strengths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strengths: selectedStrengths,
          reflection,
          identityChoice,
          firstName: identityChoice === "firstName" ? firstName : "",
          countryCode,
          consent,
        }),
      });
      const data = (await response.json()) as StrengthsResponse;
      const contribution = data.contribution;
      if (!response.ok || !contribution) {
        setNote(data.error ?? "Unable to save this contribution.");
        return;
      }

      setContributions((current) => [
        {
          ...contribution,
          key: crypto.randomUUID(),
          sequence: null,
        },
        ...current,
      ]);
      setSelectedStrengths([]);
      setReflection("");
      setNote(
        "Thank you. What you bring is waiting for approval before it joins the collective."
      );
    } catch {
      setNote("Unable to save this contribution right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const pending = contributions.filter(
    (contribution) => contribution.status === "pending"
  );

  return (
    <div className="strengths-experience">
      <section className="strengths-intro" aria-labelledby="strengths-title">
        <p className="eyebrow">A shared adventure</p>
        <h1 id="strengths-title">What Do You Bring?</h1>
        <p>
          We each bring different qualities to the people and places around us.
          Choose three qualities you recognise in yourself. This is not a test
          or formal strengths assessment.
        </p>
        <section className="strengths-why" aria-labelledby="strengths-why-title">
          <h2 id="strengths-why-title">
            What if we paid more attention to what’s strong?
          </h2>
          <p>
            We’re often quite good at noticing what we’re not good at. The
            things we struggle with. The things we wish we could change. The
            things other people seem to do better.
          </p>
          <p>But what about the good things we already bring?</p>
          <p>
            Positive psychology researchers have identified 24 character
            strengths — qualities such as curiosity, kindness, bravery, humour,
            gratitude and perseverance. We all have the capacity to use these
            strengths, although some come more naturally to us than others.
            Research suggests that recognising and using our character
            strengths can support wellbeing, meaning and stronger relationships.
          </p>
          <p className="strengths-why-question">
            What might happen if you started noticing yours?
          </p>
          <details className="strengths-science">
            <summary>Curious about the science?</summary>
            <div>
              <p>
                The VIA Classification of Character Strengths was developed
                through the work of Christopher Peterson, Martin Seligman and
                other researchers. It describes 24 character strengths
                organised under six broad virtues.
              </p>
              <p>
                You Matter is not administering the VIA Survey, and this
                reflective activity is not a psychological assessment. You can
                take part without taking VIA. If you’re curious, you can take
                the official VIA Character Strengths Survey separately.
              </p>
              <a
                href="https://www.viacharacter.org/survey/account/register"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the official VIA Character Strengths Survey
              </a>
            </div>
          </details>
        </section>
      </section>

      <section className="strengths-wall" aria-labelledby="strengths-wall-title">
        <h2 id="strengths-wall-title" className="strengths-wall-heading">
          None of us brings everything. Together, we bring a lot.
        </h2>
        <p className="strengths-wall-intro">
          Your three strengths stay together as one contribution. Each eligible
          approved contribution becomes one stone.
        </p>
        <div
          className="strengths-wall-scene"
          role="group"
          aria-labelledby="strengths-wall-title"
        >
          <img
            className="strengths-wall-background"
            src="/strengths-woodland-base.png"
            alt="A sunlit Northern European woodland floor with ferns, moss and mature trees."
          />
          {visibleContributions.map((contribution) => {
            const slot = contribution.sequence - 1;
            const position = STRENGTHS_WALL_POSITIONS[slot];
            const wallPositionStyle: WallPositionStyle = {
              "--wall-left": `${position.left}%`,
              "--wall-bottom": `${position.bottom}%`,
              "--wall-width": `${position.width}%`,
              "--wall-transform": `translate(-50%, 50%) rotate(${position.rotation}deg)`,
              "--wall-layer": STRENGTHS_WALL_DEPTH[position.depthBand],
            };
            return (
              <button
                key={contribution.key}
                ref={(element) => {
                  if (element) stoneButtonRefs.current.set(contribution.key, element);
                  else stoneButtonRefs.current.delete(contribution.key);
                }}
                className={`strengths-wall-stone${selectedContributionKey === contribution.key ? " is-selected" : ""}`}
                data-mobile-row={Math.floor(slot / 5)}
                data-mobile-column={slot % 5}
                style={wallPositionStyle}
                type="button"
                aria-label={`Read contribution by ${contribution.displayName || "Anonymous"}: ${contribution.strengths.join(", ")}`}
                aria-pressed={selectedContributionKey === contribution.key}
                onClick={(event) => {
                  focusTargetRef.current = event.currentTarget;
                  setSelectedContributionKey(contribution.key);
                }}
              >
                <img
                  src={`/strengths-stones/stone-${String((slot % 12) + 1).padStart(2, "0")}.png`}
                  alt=""
                />
              </button>
            );
          })}
          {contributionsLoaded && visibleContributions.length === 0 && (
            <p className="strengths-wall-empty" role={contributionsLoadError ? "status" : undefined}>
              {contributionsLoadError
                ? "The woodland contributions are temporarily unavailable."
                : approved.length === 0
                  ? "Nothing has been built here yet. What will you bring?"
                  : "Approved contributions have permanent places beyond the stones shown here. Their count remains included below."}
            </p>
          )}
          {!contributionsLoaded && (
            <p className="strengths-wall-loading" role="status">
              Finding what people have brought…
            </p>
          )}
        </div>
        {impact ? (
          <p className="strengths-wall-count" role="status">
            {impact.strengthsRecognised} approved {impact.strengthsRecognised === 1 ? "contribution" : "contributions"}
          </p>
        ) : impactUnavailable ? (
          <p className="strengths-wall-count" role="status">
            The approved contribution total is temporarily unavailable.
          </p>
        ) : (
          <p className="strengths-wall-count" role="status">
            Loading the approved contribution total…
          </p>
        )}
        {(impact?.strengthsRecognised ?? 0) > STRENGTHS_WALL_POSITIONS.length && (
          <p className="strengths-wall-sample">
            The first {STRENGTHS_WALL_POSITIONS.length} places are shown here.
            Later contributions keep their place and are included in the total.
          </p>
        )}
        {selectedContribution && (
          <article
            className="strengths-contribution-card"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Strengths contribution"
          >
            <h3>{selectedContribution.strengths.join(" · ")}</h3>
            {selectedContribution.reflection && (
              <p className="strengths-contribution-reflection">
                “{selectedContribution.reflection}”
              </p>
            )}
            <p className="strengths-contribution-identity">
              {selectedContribution.displayName || "Anonymous"}
              {selectedContribution.countryCode && (
                <>
                  {" · "}
                  {getCountryDisplay(selectedContribution.countryCode).name}{" "}
                  <span aria-hidden="true">
                    {getCountryDisplay(selectedContribution.countryCode).flag}
                  </span>
                </>
              )}
            </p>
            <button type="button" onClick={closeContribution}>
              Close contribution
            </button>
          </article>
        )}
      </section>

      <section
        className="strengths-form-column"
        aria-label="Choose and share what you bring"
      >
        <form className="strengths-form card" onSubmit={submit}>
          <fieldset className="strengths-selection">
            <legend>Choose three qualities you recognise in yourself</legend>
            <p className="strengths-helper" aria-live="polite">
              {selectedStrengths.length} of 3 selected
              {selectedStrengths.length > 0 &&
                ` · ${selectedStrengths.join(", ")}`}
            </p>
            {characterStrengthGroups.map((group) => (
              <fieldset className="strengths-group" key={group.virtue}>
                <legend>{group.virtue}</legend>
                <div className="strengths-options">
                  {group.strengths.map((strength) => (
                    <label
                      className={[
                        "strength-option",
                        selectedStrengths.includes(strength) &&
                          "strength-option--selected",
                        !selectedStrengths.includes(strength) &&
                          selectedStrengths.length === 3 &&
                          "strength-option--disabled",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={strength}
                    >
                      <input
                        type="checkbox"
                        name="character-strength"
                        value={strength}
                        checked={selectedStrengths.includes(strength)}
                        disabled={
                          !selectedStrengths.includes(strength) &&
                          selectedStrengths.length === 3
                        }
                        onChange={(event) => {
                          if (!isCharacterStrength(strength)) return;
                          setSelectedStrengths((current) =>
                            event.target.checked
                              ? [...current, strength]
                              : current.filter((selected) => selected !== strength)
                          );
                        }}
                      />
                      <span>{strength}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </fieldset>

          <label htmlFor="strength-reflection">
            What does this combination look like in you?{" "}
            <span className="muted">(optional)</span>
          </label>
          <p className="strengths-helper">
            It can be something small and ordinary.
          </p>
          <textarea
            id="strength-reflection"
            maxLength={REFLECTION_MAX_LENGTH}
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="A small example from everyday life…"
          />

          <fieldset className="strengths-identity">
            <legend>How would you like this to appear?</legend>
            <label>
              <input
                type="radio"
                name="strengths-identity"
                value="anonymous"
                checked={identityChoice === "anonymous"}
                onChange={() => setIdentityChoice("anonymous")}
              />
              Anonymous
            </label>
            <label>
              <input
                type="radio"
                name="strengths-identity"
                value="firstName"
                checked={identityChoice === "firstName"}
                onChange={() => setIdentityChoice("firstName")}
              />
              First name
            </label>
          </fieldset>

          {identityChoice === "firstName" && (
            <label htmlFor="strengths-first-name">
              First name
              <input
                id="strengths-first-name"
                maxLength={40}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                required
              />
            </label>
          )}

          <label htmlFor="strengths-country">Country (optional)</label>
          <select
            id="strengths-country"
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
          >
            <option value="">Choose a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>

          <p className="strengths-privacy">
            Please don’t include full names or identifying information in your
            reflection.
          </p>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            My chosen qualities, reflection and display name may be shared
            after review.
          </label>
          <button
            className="button"
            disabled={busy || selectedStrengths.length !== 3}
          >
            {busy ? "Sharing…" : "Share what I bring"}
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>

        <section
          className="strengths-pending"
          aria-labelledby="strengths-pending-title"
        >
          <h2 id="strengths-pending-title">Your contributions</h2>
          {pending.length === 0 ? (
            <p>Your contributions awaiting approval will appear here.</p>
          ) : (
            <ul>
              {pending.map((contribution) => (
                <li key={contribution.key}>
                  <strong>{contribution.strengths.join(", ")}</strong>
                  {contribution.reflection && <p>{contribution.reflection}</p>}
                  <span>Awaiting approval</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
}
