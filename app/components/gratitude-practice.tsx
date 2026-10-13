"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { countries } from "../lib/countries";

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
        <div
          className="garden-wrap"
          style={{ minHeight: "600px" }}
        >
          <div className="garden-title">
            <strong>The garden we are growing</strong>
            <span className="garden-count" aria-live="polite">
              {approvedEntries.length}{" "}
              {approvedEntries.length === 1
                ? "approved contribution"
                : "approved contributions"}
            </span>
          </div>
          {approvedEntries.length === 0 && (
            <div className="empty-garden">
              <strong className="serif">
                The garden is waiting for its first flowers.
              </strong>
            </div>
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
