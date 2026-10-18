"use client";

import {
  CSSProperties,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { countries, getCountryDisplay } from "../lib/countries";
import { gratitudeClearings } from "../lib/gratitude-clearings";
import { gratitudePlantingPositions } from "../lib/gratitude-planting-layout";
import {
  gratitudePlantVariants,
  type GratitudePlantVariant,
} from "../lib/gratitude-plant-variants";
import type { ImpactSummary } from "../lib/impact";
import PrivacyLink from "./privacy-link";

type Entry = {
  key: string;
  messages: string[];
  displayName: string;
  countryCode: string | null;
  status: "pending" | "approved";
};

type PublicEntry = Omit<Entry, "key" | "status">;

type GratitudesResponse = {
  gratitudes?: PublicEntry[];
  pending?: PublicEntry[];
  error?: string;
};

type GratitudePracticeProps = {
  impact: ImpactSummary | null;
  impactUnavailable: boolean;
};

type IdentityChoice = "anonymous" | "firstName";
const currentClearing = gratitudeClearings[0];
const plantVariants = [
  "woodAnemone",
  "bluebell",
  "redCampion",
  "cowslip",
  "oxeyeDaisy",
  "foxglove",
] as const satisfies readonly GratitudePlantVariant[];
const clearingStyle = {
  minHeight: "600px",
  "--clearing-image": `url("${currentClearing.image}")`,
} as CSSProperties;

export default function GratitudePractice({
  impact,
  impactUnavailable,
}: GratitudePracticeProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [gardenLoaded, setGardenLoaded] = useState(false);
  const [gardenUnavailable, setGardenUnavailable] = useState(false);
  const [messages, setMessages] = useState(["", "", ""]);
  const [identityChoice, setIdentityChoice] =
    useState<IdentityChoice>("anonymous");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedEntryKey, setSelectedEntryKey] = useState<string | null>(
    null
  );
  const feedRequestRef = useRef<Promise<GratitudesResponse> | null>(null);
  const selectedFlowerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!feedRequestRef.current) {
      feedRequestRef.current = fetch("/api/gratitudes")
        .then(async (response) => {
          const data = (await response.json()) as GratitudesResponse;
          if (!response.ok) throw new Error();
          return data;
        });
    }

    let active = true;
    feedRequestRef.current
      .then((data) => {
        if (!active) return;
        setEntries([
          ...(data.gratitudes ?? []).map((entry, index) => ({
            ...entry,
            key: `approved-${index}`,
            status: "approved" as const,
          })),
          ...(data.pending ?? []).map((entry, index) => ({
            ...entry,
            key: `pending-${index}`,
            status: "pending" as const,
          })),
        ]);
        setGardenLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setGardenLoaded(true);
        setGardenUnavailable(true);
        setNote("The garden is temporarily unavailable.");
      });

    return () => {
      active = false;
    };
  }, []);

  const approvedEntries = useMemo(
    () => entries.filter((entry) => entry.status === "approved"),
    [entries]
  );
  const pendingEntries = useMemo(
    () => entries.filter((entry) => entry.status === "pending"),
    [entries]
  );
  const flowerEntries = useMemo(
    () =>
      [...approvedEntries]
        .filter((entry) => entry.messages.length === 3)
        .slice(0, gratitudePlantingPositions.length),
    [approvedEntries]
  );
  const selectedEntry = flowerEntries.find(
    (entry) => entry.key === selectedEntryKey
  );
  const selectedCountry = selectedEntry?.countryCode
    ? getCountryDisplay(selectedEntry.countryCode)
    : null;

  useEffect(() => {
    if (!selectedEntry) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSelectedEntryKey(null);
      selectedFlowerRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedEntry]);

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
    try {
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
      const data = (await response.json()) as GratitudesResponse;
      if (!response.ok) {
        setNote(data.error ?? "The seeds could not be planted.");
        return;
      }

      setEntries((current) => [
        ...(data.gratitudes ?? []).map((entry) => ({
          ...entry,
          key: crypto.randomUUID(),
          status: "pending" as const,
        })),
        ...current,
      ]);
      setMessages(["", "", ""]);
      setNote(
        "Thank you. Your seeds are saved and visible to you here as Awaiting approval. They will join the shared garden after review."
      );
    } catch {
      setNote("The seeds could not be planted right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="practice-grid">
      <div className="practice card">
        <h2 id="gratitude-entry-heading">Plant three small gratitudes.</h2>
        <p className="gratitude-reassurance">
          <strong>Having a difficult day?</strong>
          You don&apos;t have to pretend everything is wonderful to practise
          gratitude. Sometimes it&apos;s enough to notice one small thing that
          made today a little easier.
        </p>
        <p>
          They need not be profound. A comforting drink. A message. A moment
          when your shoulders softened. Honest and specific is enough.
        </p>
        <form className="gratitude-form" onSubmit={submit}>
          <div
            className="gratitude-entry-group"
            role="group"
            aria-labelledby="gratitude-entry-heading"
            aria-describedby="gratitude-entry-required"
          >
            <span className="visually-hidden" id="gratitude-entry-required">
              All three entries are required.
            </span>
            {messages.map((message, index) => (
              <div key={index}>
                <label htmlFor={`g-${index}`}>Gratitude {index + 1}</label>
                <textarea
                  id={`g-${index}`}
                  maxLength={280}
                  aria-required="true"
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
          </div>

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
            If approved, these three gratitudes and the name you choose (or
            Anonymous) may appear in the shared garden. Your country will
            appear too if you provide one.
          </label>
          <PrivacyLink />
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
          data-clearing-id={currentClearing.id}
          style={clearingStyle}
        >
          <div className="garden-title">
            <strong>The garden we are growing</strong>
            <span className="garden-count" aria-live="polite">
              {impact
                ? `${impact.gratitudesShared} ${
                    impact.gratitudesShared === 1
                      ? "approved contribution"
                      : "approved contributions"
                  }`
                : impactUnavailable
                  ? "Total unavailable"
                  : "Gathering total…"}
            </span>
          </div>
          {flowerEntries.map((entry, index) => {
            const position = gratitudePlantingPositions[index];
            const variant = plantVariants[index % plantVariants.length];
            const key = entry.key;
            const plantStyle = {
              "--plant-x": `${position.x}%`,
              "--plant-y": `${position.y}%`,
              "--plant-mobile-x": `${position.mobile.x}%`,
              "--plant-mobile-y": `${position.mobile.y}%`,
              "--plant-z-index": position.zIndex,
              "--plant-width-desktop": `${18 * position.scale}%`,
              "--plant-width-tablet": `${15.5 * position.scale}%`,
              "--plant-width-mobile": `${30 * (position.mobileScale ?? position.scale)}%`,
              "--plant-rotation": `${position.rotation}deg`,
            } as CSSProperties & Record<`--${string}`, string | number>;

            return (
              <button
                key={key}
                ref={(button) => {
                  if (selectedEntryKey === key) selectedFlowerRef.current = button;
                }}
                type="button"
                className={`gratitude-plant gratitude-plant--${position.depth}`}
                style={plantStyle}
                data-plant-position={position.id}
                data-plant-variant={variant}
                aria-label={`Read three gratitudes shared by ${entry.displayName}`}
                aria-pressed={selectedEntryKey === key}
                aria-controls={
                  selectedEntryKey === key ? "gratitude-detail" : undefined
                }
                aria-expanded={selectedEntryKey === key}
                onClick={(event) => {
                  selectedFlowerRef.current = event.currentTarget;
                  setSelectedEntryKey(key);
                }}
              >
                <img src={gratitudePlantVariants[variant]} alt="" />
              </button>
            );
          })}
          {selectedEntry && (
            <section
              className="gratitude-detail"
              id="gratitude-detail"
              role="region"
              aria-live="polite"
              aria-labelledby="gratitude-detail-title"
            >
              <button
                className="gratitude-detail__close"
                type="button"
                aria-label="Close gratitude card"
                onClick={() => {
                  setSelectedEntryKey(null);
                  selectedFlowerRef.current?.focus();
                }}
              >
                ×
              </button>
              <h3 id="gratitude-detail-title">
                Three things someone was grateful for
              </h3>
              <ol>
                {selectedEntry.messages.map((message, index) => (
                  <li key={`${selectedEntry.key}-${index}`}>{message}</li>
                ))}
              </ol>
              <p className="gratitude-detail__identity">
                {selectedEntry.displayName}
                {selectedCountry && (
                  <>
                    {" · "}
                    {selectedCountry.name}{" "}
                    <span aria-hidden="true">{selectedCountry.flag}</span>
                  </>
                )}
              </p>
            </section>
          )}
          {gardenLoaded &&
            !gardenUnavailable &&
            impact?.gratitudesShared === 0 &&
            flowerEntries.length === 0 && (
              <div className="empty-garden">
                <strong className="serif">
                  The garden is waiting for its first flowers.
                </strong>
              </div>
            )}
        </div>

        {gardenLoaded &&
          !gardenUnavailable &&
          impact &&
          impact.gratitudesShared > flowerEntries.length && (
          <p className="garden-capacity-note">
            {impact.gratitudesShared - flowerEntries.length} approved{" "}
            {impact.gratitudesShared - flowerEntries.length === 1
              ? "contribution is"
              : "contributions are"}{" "}
            not shown in this clearing.
          </p>
        )}

        {pendingEntries.length > 0 && (
          <section
            className="gratitude-pending"
            aria-labelledby="gratitude-pending-title"
          >
            <h3 id="gratitude-pending-title">
              Your contribution is awaiting approval
            </h3>
            {pendingEntries.map((entry) => (
              <ol key={entry.key}>
                {entry.messages.map((message, index) => (
                  <li key={`${entry.key}-${index}`}>{message}</li>
                ))}
              </ol>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
