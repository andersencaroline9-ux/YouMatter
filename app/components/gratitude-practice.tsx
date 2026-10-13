"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { countries, getCountryDisplay } from "../lib/countries";

type Entry = {
  id: number;
  submissionId: string | null;
  messages: string[];
  displayName: string;
  countryCode: string | null;
  status: "pending" | "approved";
  createdAt: string;
  approvedAt: string | null;
};

type IdentityChoice = "anonymous" | "firstName";
type PlantVariant =
  | "red-campion"
  | "wood-anemone"
  | "oxeye-daisy"
  | "cowslip"
  | "cow-parsley"
  | "bluebell";

const plantVariants: PlantVariant[] = [
  "red-campion",
  "wood-anemone",
  "oxeye-daisy",
  "cowslip",
  "cow-parsley",
  "bluebell",
];

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function entryKey(entry: Entry) {
  return entry.submissionId ?? `legacy-${entry.id}`;
}

export default function GratitudePractice() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [messages, setMessages] = useState(["", "", ""]);
  const [identityChoice, setIdentityChoice] =
    useState<IdentityChoice>("anonymous");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gratitudes")
      .then((response) => response.json())
      .then((data) => setEntries(data.gratitudes ?? []));
  }, []);

  const approvedEntries = useMemo(
    () => entries.filter((entry) => entry.status === "approved"),
    [entries]
  );
  const pendingEntries = useMemo(
    () => entries.filter((entry) => entry.status === "pending"),
    [entries]
  );
  const plants = useMemo(
    () =>
      approvedEntries.slice(0, 24).map((entry) => {
        const hash = stableHash(entryKey(entry));
        return {
          entry,
          key: entryKey(entry),
          variant: plantVariants[hash % plantVariants.length],
          left: 5 + ((hash >>> 3) % 90),
          width: 76 + ((hash >>> 12) % 69),
          height: 128 + ((hash >>> 19) % 94),
          bottom: 8 + ((hash >>> 23) % 13),
          rotation: ((hash >>> 8) % 17) - 8,
          layer: 2 + ((hash >>> 27) % 5),
        };
      }),
    [approvedEntries]
  );

  const activeId = previewId ?? selectedId;
  const activeEntry =
    plants.find((plant) => plant.key === activeId)?.entry ?? null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    const clean = messages.map((message) => message.trim()).filter(Boolean);

    if (clean.length !== 3) {
      setNote("Please add three gratitudes.");
      return;
    }
    if (!consent) {
      setNote("Please confirm that your words may join the shared garden.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/gratitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: clean,
        displayName: identityChoice === "firstName" ? name : "",
        countryCode,
        consent,
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setNote(data.error ?? "The seeds could not be planted.");
      return;
    }

    setEntries((current) => [...data.gratitudes, ...current]);
    setMessages(["", "", ""]);
    setNote(
      "Thank you. Your seeds are saved and visible to you here as Awaiting approval. They will join the shared garden after review."
    );
  }

  return (
    <div className="practice-grid">
      <div className="practice card">
        <h2>Plant three small gratitudes.</h2>
        <p>
          They need not be profound. A warm cup. A message. A moment when your
          shoulders softened. Honest and specific is enough.
        </p>
        <form className="gratitude-form" onSubmit={submit}>
          {messages.map((message, index) => (
            <div key={index}>
              <label htmlFor={`g-${index}`}>Gratitude {index + 1}</label>
              <textarea
                id={`g-${index}`}
                maxLength={280}
                value={message}
                onChange={(event) =>
                  setMessages((current) =>
                    current.map((value, currentIndex) =>
                      currentIndex === index ? event.target.value : value
                    )
                  )
                }
                placeholder={
                  index === 0
                    ? "Today, I’m grateful for…"
                    : "One more small thing…"
                }
              />
            </div>
          ))}

          <fieldset className="gratitude-form__identity">
            <legend>How would you like this to appear?</legend>
            <label>
              <input
                type="radio"
                name="gratitude-identity"
                value="anonymous"
                checked={identityChoice === "anonymous"}
                onChange={() => setIdentityChoice("anonymous")}
              />
              Anonymous
            </label>
            <label>
              <input
                type="radio"
                name="gratitude-identity"
                value="firstName"
                checked={identityChoice === "firstName"}
                onChange={() => setIdentityChoice("firstName")}
              />
              First name
            </label>
          </fieldset>

          {identityChoice === "firstName" && (
            <label htmlFor="gratitude-first-name">
              First name
              <input
                id="gratitude-first-name"
                maxLength={40}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="given-name"
                required
              />
            </label>
          )}

          <label htmlFor="gratitude-country">Country (optional)</label>
          <select
            id="gratitude-country"
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

          <p className="gratitude-form__privacy">
            Keep it kind and protect other people’s privacy. Please don’t
            include full names or identifying details about someone else.
          </p>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            I’m happy for these words to appear in the shared garden after
            review.
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Planting…" : "Plant 3 seeds"}
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>
      </div>

      <div className="gratitude-garden-column">
        <div className="garden-wrap">
          <div className="garden-title">
            <strong>The garden we are growing</strong>
            <span className="garden-count" aria-live="polite">
              {approvedEntries.length}{" "}
              {approvedEntries.length === 1 ? "flower" : "flowers"}
            </span>
          </div>
          {plants.length === 0 && (
            <div className="empty-garden">
              <strong className="serif">
                The garden is waiting for its first flowers.
              </strong>
            </div>
          )}
          {plants.map((plant) => {
            const displayName = plant.entry.displayName || "Anonymous";
            const country = plant.entry.countryCode
              ? getCountryDisplay(plant.entry.countryCode)
              : null;
            return (
              <button
                key={plant.key}
                className="gratitude-plant"
                aria-label={`Explore gratitude from ${displayName}${country ? `, ${country.name}` : ""}`}
                aria-pressed={selectedId === plant.key}
                style={{
                  left: `${plant.left}%`,
                  bottom: `${plant.bottom}%`,
                  width: `${plant.width}px`,
                  height: `${plant.height}px`,
                  zIndex: plant.layer,
                  ["--plant-rotation" as string]: `${plant.rotation}deg`,
                }}
                onMouseEnter={() => setPreviewId(plant.key)}
                onMouseLeave={() => setPreviewId(null)}
                onFocus={() => setPreviewId(plant.key)}
                onBlur={() => setPreviewId(null)}
                onClick={() =>
                  setSelectedId((current) =>
                    current === plant.key ? null : plant.key
                  )
                }
              >
                <img
                  src={`/gratitude-plants/${plant.variant}.webp`}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          })}

          {activeEntry && (
            <section
              className="gratitude-detail"
              aria-label="Selected gratitude contribution"
              aria-live="polite"
            >
              <button
                className="gratitude-detail__close"
                type="button"
                aria-label="Close gratitude details"
                onClick={() => {
                  setSelectedId(null);
                  setPreviewId(null);
                }}
              >
                ×
              </button>
              <h3>
                {activeEntry.displayName || "Anonymous"}
                {activeEntry.countryCode && (
                  <>
                    {" · "}
                    {getCountryDisplay(activeEntry.countryCode).name}{" "}
                    <span aria-label={getCountryDisplay(activeEntry.countryCode).name}>
                      {getCountryDisplay(activeEntry.countryCode).flag}
                    </span>
                  </>
                )}
              </h3>
              <ol>
                {activeEntry.messages.map((message, index) => (
                  <li key={`${activeEntry.id}-${index}`}>{message}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {pendingEntries.length > 0 && (
          <section
            className="gratitude-pending"
            aria-labelledby="gratitude-pending-title"
          >
            <h3 id="gratitude-pending-title">
              Your contribution is awaiting approval
            </h3>
            {pendingEntries.map((entry) => (
              <ol key={entryKey(entry)}>
                {entry.messages.map((message, index) => (
                  <li key={`${entry.id}-${index}`}>{message}</li>
                ))}
              </ol>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
