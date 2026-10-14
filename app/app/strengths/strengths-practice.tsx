"use client";

import { FormEvent, useEffect, useState } from "react";
import { countries } from "../../lib/countries";
import {
  characterStrengthGroups,
  isCharacterStrength,
  isCharacterStrengthSelection,
} from "../../lib/character-strengths";

type StrengthContribution = {
  key: string;
  strengths: string[];
  reflection: string | null;
  displayName: string;
  countryCode: string | null;
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
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [identityChoice, setIdentityChoice] =
    useState<IdentityChoice>("anonymous");
  const [firstName, setFirstName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

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
          ...(data.contributions ?? []).map((contribution, index) => ({
            ...contribution,
            key: `approved-${index}`,
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
      });
  }, []);

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
      </section>

      <section
        className="strengths-shelter"
        aria-labelledby="strengths-shelter-caption"
      >
        <figure>
          <img
            src="/strengths-shelter.png"
            alt="A rough woodland shelter made from branches, standing among trees and leaf-covered ground."
          />
          <figcaption id="strengths-shelter-caption">
            None of us brings everything. Together, we bring a lot.
          </figcaption>
        </figure>
        {contributionsLoaded &&
          !contributions.some(
            (contribution) => contribution.status === "approved"
          ) && (
            <p className="strengths-shelter-empty">
              The shelter is waiting for what people bring.
            </p>
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
            What do these qualities look like in you?{" "}
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
