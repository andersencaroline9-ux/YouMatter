"use client";

import { FormEvent, useEffect, useState } from "react";
import type { KindnessCategory, PendingKindnessEntry } from "../lib/kindness";
import KindnessStories from "./kindness-stories";

export default function KindnessPractice() {
  const [entries, setEntries] = useState<PendingKindnessEntry[]>([]);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<KindnessCategory>("witnessed");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/kindness", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { entries?: PendingKindnessEntry[] };
        if (!response.ok) throw new Error("Your kindness stories are temporarily unavailable.");
        return data;
      })
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setNote("Your kindness stories are temporarily unavailable."));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) {
      setNote("Tell us about one small act of kindness.");
      return;
    }
    if (!consent) {
      setNote("Please confirm that the words may join the Kindness Tree.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/kindness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, kind, displayName: name, consent }),
      });
      const data = (await response.json()) as {
        error?: string;
        entry: PendingKindnessEntry;
      };
      if (!response.ok) {
        setNote(data.error ?? "This kindness could not be shared.");
        return;
      }

      setEntries((current) => [data.entry, ...current]);
      setMessage("");
      setNote(
        "Thank you for noticing.\nYour kindness has been shared with us and is waiting for review.\nOnce approved, it can become another leaf on our tree.\nSmall moments. Many people. One growing story."
      );
    } catch {
      setNote("This kindness could not be shared right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="kindness-practice-layout">
      <div className="practice card" aria-labelledby="kindness-form-title">
        <p className="eyebrow">A moment between people</p>
        <h2 id="kindness-form-title">What kindness have you noticed?</h2>
        <div className="kindness-practice-intro">
          <p>
            Think about a moment of kindness. It doesn’t have to be
            extraordinary.
          </p>
          <p>
            Perhaps someone helped when they didn’t have to. Someone made you
            feel seen. Or you noticed a small gesture between two strangers.
          </p>
          <p className="kindness-privacy-note">
            You can share anonymously. Please avoid including identifying
            details about other people. Every story is reviewed before
            appearing on the Kindness Tree.
          </p>
        </div>
        <form className="gratitude-form" onSubmit={submit}>
          <fieldset className="kindness-categories">
            <legend>Was it something you…</legend>
            <label>
              <input
                type="radio"
                name="kindness-category"
                value="gave"
                checked={kind === "gave"}
                onChange={() => setKind("gave")}
              />
              <span>
                <strong>GAVE</strong>
                <small>A kindness you showed someone else.</small>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="kindness-category"
                value="received"
                checked={kind === "received"}
                onChange={() => setKind("received")}
              />
              <span>
                <strong>RECEIVED</strong>
                <small>Something kind someone did for you.</small>
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="kindness-category"
                value="witnessed"
                checked={kind === "witnessed"}
                onChange={() => setKind("witnessed")}
              />
              <span>
                <strong>WITNESSED</strong>
                <small>A kindness you saw between other people.</small>
              </span>
            </label>
          </fieldset>
          <label>
            Tell us what happened.
            <textarea
              maxLength={320}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Someone noticed that…"
            />
          </label>
          <label>
            Name or pseudonym <span className="muted">(optional)</span>
            <input
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Anonymous"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            If approved, my kindness story and chosen display name or
            pseudonym may appear publicly on the Kindness Tree. I have removed
            identifying details about other people.
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Sharing…" : "Share a kindness"}
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>
      </div>

      <section
        className="kindness-pending"
        aria-labelledby="kindness-pending-title"
      >
        <h2 id="kindness-pending-title">Your kindness stories</h2>
        <p>Stories are private to you here while they wait for review.</p>
        <KindnessStories
          entries={entries.filter((entry) => entry.status === "pending")}
          emptyMessage="Your stories awaiting approval will appear here after you share."
          id="kindness-pending"
        />
      </section>
    </div>
  );
}
