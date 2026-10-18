"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { getCountryDisplay, countries } from "../../lib/countries";
import {
  characterStrengthGroups,
  isCharacterStrength,
  isCharacterStrengthSelection,
  type CharacterStrength,
} from "../../lib/character-strengths";
import { useImpact } from "../../lib/use-impact";
import ImpactBarometer from "../../components/impact-barometer";
import PrivacyLink from "../../components/privacy-link";

const CHARACTER_STRENGTH_DESCRIPTIONS: Record<CharacterStrength, string> = {
  Creativity: "Finding new ways to do or think about things.",
  Curiosity: "Wanting to explore, discover and understand.",
  Judgment: "Thinking things through and considering different perspectives.",
  "Love of Learning": "Enjoying discovering new things and developing knowledge.",
  Perspective: "Seeing the bigger picture and helping others do the same.",
  Bravery: "Doing what matters, even when it’s frightening.",
  Perseverance: "Keeping going when things get difficult.",
  Honesty: "Being truthful and genuine with yourself and others.",
  Zest: "Approaching life with energy and enthusiasm.",
  Love: "Valuing and nurturing close relationships.",
  Kindness: "Caring about others and acting on that care.",
  "Social Intelligence": "Understanding people’s feelings and social situations.",
  Teamwork: "Working with others towards something shared.",
  Fairness: "Treating people fairly and without favouritism.",
  Leadership: "Helping people work together towards a common goal.",
  Forgiveness: "Being willing to let go of resentment.",
  Humility:
    "Recognising your worth without needing to be the centre of attention.",
  Prudence: "Thinking ahead and making considered choices.",
  "Self-Regulation": "Managing your feelings, impulses and actions.",
  "Appreciation of Beauty & Excellence":
    "Noticing and appreciating beauty, skill and excellence.",
  Gratitude: "Recognising and appreciating the good in your life.",
  Hope: "Believing that a better future is possible and working towards it.",
  Humor: "Finding reasons to laugh and helping others smile.",
  Spirituality:
    "Finding meaning through a connection to something larger than yourself.",
};

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
      <header className="strengths-intro" aria-labelledby="strengths-title">
        <p className="eyebrow">A shared adventure</p>
        <h1 id="strengths-title">The Strengths We Bring</h1>
        <p className="strengths-intro-lead">
          None of us brings everything. Together, we bring a lot.
        </p>
        <div className="strengths-intro-copy">
          <p>
            We all have different qualities that shape how we move through the
            world, how we connect with people and what we contribute to the
            lives around us.
          </p>
          <p>
            Some of those qualities are so familiar to us that we barely notice
            them.
          </p>
          <p>
            This little adventure is an invitation to stop and recognise three
            of yours.
          </p>
        </div>
        <p className="strengths-intro-supporting">
          It’s not a test. There are no scores, and there are no right answers.
        </p>
      </header>

      <nav className="strengths-local-nav" aria-label="Strengths sections">
        <a href="#why">The why</a>
        <span aria-hidden="true">|</span>
        <a href="#practice">The practice</a>
      </nav>

      <section
        className="strengths-wall"
        aria-labelledby="strengths-wall-title"
      >
        <h2 id="strengths-wall-title" className="strengths-wall-heading">
          Look what we bring.
        </h2>
        <div className="strengths-wall-intro">
          <p>Each stone represents one person’s combination of three strengths.</p>
          <p>Choose a stone to discover what somebody else brings.</p>
        </div>
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
                  if (element) {
                    stoneButtonRefs.current.set(contribution.key, element);
                  } else {
                    stoneButtonRefs.current.delete(contribution.key);
                  }
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
            <p
              className="strengths-wall-empty"
              role={contributionsLoadError ? "status" : undefined}
            >
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
            {impact.strengthsRecognised} approved{" "}
            {impact.strengthsRecognised === 1
              ? "contribution"
              : "contributions"}
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
        {(impact?.strengthsRecognised ?? 0) >
          STRENGTHS_WALL_POSITIONS.length && (
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
        className="strengths-why strengths-section"
        id="why"
        aria-labelledby="strengths-why-title"
        tabIndex={-1}
      >
        <h2 id="strengths-why-title">
          We’re very good at noticing what we’re not good at.
        </h2>
        <p>
          The things we struggle with. The things we wish we could change. The
          things other people seem to do better.
        </p>
        <p>But what about the good things we already bring?</p>
        <p>
          Positive psychology explores what helps people flourish and live
          meaningful, fulfilling lives.
        </p>
        <p>
          One way researchers have approached this is through character
          strengths — qualities such as curiosity, kindness, perseverance and
          humour.
        </p>
        <p className="strengths-why-question">
          What might happen if we gave those qualities a little more attention?
        </p>
      </section>

      <section
        className="strengths-practice-section strengths-section"
        id="practice"
        aria-labelledby="strengths-practice-title"
        tabIndex={-1}
      >
        <div className="strengths-practice-intro">
          <p className="eyebrow">The practice</p>
          <h2 id="strengths-practice-title">What do you bring?</h2>
          <p>Choose three strengths you recognise in yourself.</p>
          <p>
            Not necessarily the ones you’re best at. Just three that feel like
            you.
          </p>
          <p>
            Think about how you behave, what matters to you and how you show up
            for other people.
          </p>
          <p>
            You don’t have to be brilliant at something for it to be one of your
            strengths.
          </p>
        </div>

        <section
          className="strengths-form-column"
          aria-label="Choose and share your strengths"
        >
          <form className="strengths-form card" onSubmit={submit}>
            <fieldset
              className="strengths-selection"
              aria-describedby="strengths-selection-requirement"
            >
              <legend>Choose three strengths you recognise in yourself</legend>
              <span
                className="visually-hidden"
                id="strengths-selection-requirement"
              >
                A selection is required. Choose exactly three strengths.
              </span>
              <p className="strengths-helper" aria-live="polite">
                {selectedStrengths.length} of 3 selected
                {selectedStrengths.length > 0 &&
                  ` · ${selectedStrengths.join(", ")}`}
              </p>
              {characterStrengthGroups.map((group) => (
                <fieldset className="strengths-group" key={group.virtue}>
                  <legend>{group.virtue}</legend>
                  <div className="strengths-options">
                    {group.strengths.map((strength) => {
                      const selected = selectedStrengths.includes(strength);
                      const disabled = !selected && selectedStrengths.length === 3;
                      const strengthId = `strength-${strength
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`;
                      const descriptionId = `${strengthId}-description`;
                      return (
                        <label
                          className={[
                            "strength-option",
                            selected && "strength-option--selected",
                            disabled && "strength-option--disabled",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={strength}
                        >
                          <input
                            type="checkbox"
                            name="character-strength"
                            value={strength}
                            checked={selected}
                            disabled={disabled}
                            aria-labelledby={strengthId}
                            aria-describedby={descriptionId}
                            onChange={(event) => {
                              if (!isCharacterStrength(strength)) return;
                              setSelectedStrengths((current) =>
                                event.target.checked
                                  ? [...current, strength]
                                  : current.filter(
                                      (choice) => choice !== strength
                                    )
                              );
                            }}
                          />
                          <span className="strength-option-copy">
                            <span id={strengthId}>{strength}</span>
                            <small id={descriptionId}>
                              {CHARACTER_STRENGTH_DESCRIPTIONS[strength]}
                            </small>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </fieldset>

            {selectedStrengths.length === 3 && (
              <section
                className="strengths-selected"
                aria-labelledby="strengths-selected-title"
              >
                <h3 id="strengths-selected-title">
                  These are three strengths you recognise in yourself.
                </h3>
                <ul>
                  {selectedStrengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </section>
            )}

            <label htmlFor="strength-reflection">
              What does this combination look like in you?{" "}
              <span className="muted">(optional)</span>
            </label>
            <p className="strengths-helper">
              Perhaps it’s how you approach a problem, care for someone or make
              an ordinary day a little better.
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
              Please don’t include full names or identifying information in
              your reflection.
            </p>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              If approved, your three selected strengths, optional reflection,
              chosen name (or Anonymous) and country, if provided, may appear
              publicly in our shared landscape. Every contribution is reviewed
              before appearing publicly.
            </label>
            <PrivacyLink />
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
            <h3 id="strengths-pending-title">Your contributions</h3>
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
      </section>

      <section
        className="strengths-science-section"
        aria-labelledby="strengths-science-title"
      >
        <h2 id="strengths-science-title">Why do character strengths matter?</h2>
        <p>
          Character strengths are positive qualities reflected in how we think,
          feel and behave.
        </p>
        <p>
          Researchers Christopher Peterson and Martin Seligman helped develop a
          classification of 24 character strengths, organised into six broad
          virtues.
        </p>
        <p>
          The framework gives us a shared language for recognising qualities
          such as kindness, creativity, courage and gratitude.
        </p>
        <p>
          Research has explored relationships between character strengths,
          strengths use and aspects of wellbeing. This does not mean that
          choosing strengths in this activity is a validated intervention or
          produces a particular outcome.
        </p>

        <h3>Why three?</h3>
        <p>
          Choosing three is a You Matter design choice, not a scientifically
          established ideal number. Three is enough to encourage reflection
          without turning the experience into a lengthy assessment, and it
          allows each contribution to become one combination in the collective
          landscape.
        </p>

        <h3>Is this a strengths assessment?</h3>
        <p>
          No. This is a short reflective activity inspired by the VIA
          classification. It does not measure strengths, identify signature
          strengths or provide a validated psychological profile.
        </p>
        <p>
          If you’d like to explore your strengths through a formal assessment,
          you can visit the official VIA Institute survey.
        </p>
        <a
          href="https://www.viacharacter.org/survey/account/register"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the official VIA Character Strengths Survey
        </a>

        <details className="strengths-science">
          <summary>Research and references</summary>
          <ul className="strengths-references">
            <li>
              Peterson, C., &amp; Seligman, M. E. P. (2004).{" "}
              <em>
                Character Strengths and Virtues: A Handbook and Classification.
              </em>{" "}
              Oxford University Press.{" "}
              <a
                href="https://global.oup.com/academic/product/character-strengths-and-virtues-9780195167016"
                target="_blank"
                rel="noopener noreferrer"
              >
                Publisher ↗
              </a>
            </li>
            <li>
              Niemiec, R. M., &amp; Pearce, R. (2021).{" "}
              <em>
                The Practice of Character Strengths: Unifying Definitions,
                Principles, and Exploration of What’s Soaring, Emerging, and
                Ripe With Potential in Science and in Practice.
              </em>{" "}
              Frontiers in Psychology, 11, Article 590220.{" "}
              <a
                href="https://doi.org/10.3389/fpsyg.2020.590220"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI ↗
              </a>
            </li>
          </ul>
        </details>
      </section>

      <section
        className="strengths-ending"
        aria-labelledby="strengths-ending-title"
      >
        <h2 id="strengths-ending-title">One person. Three strengths. One stone.</h2>
        <p>
          A contribution keeps its three strengths together because that
          combination is personal to the person who chose them.
        </p>
        <p>
          Every approved contribution adds one stone to the shared landscape.
          Every person brings something different.
        </p>
        <p>
          We don’t all need to be good at the same things. None of us brings
          everything. Together, we bring a lot.
        </p>
        <p>
          We need to recognise what we each bring — and what becomes possible
          when we bring it together.
        </p>
        <p className="strengths-ending-signoff">
          You Matter. We Matter. What we do matters.
        </p>
      </section>

      <ImpactBarometer />
    </div>
  );
}
