"use client";

import { FormEvent, useEffect, useState } from "react";
import KindnessStories from "./kindness-stories";

export type KindnessEntry = {
  id: number;
  message: string;
  kind: "gave" | "received" | "witnessed";
  displayName: string;
  status?: "pending" | "approved";
};

export default function KindnessPractice() {
  const [entries, setEntries] = useState<KindnessEntry[]>([]);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<KindnessEntry["kind"]>("witnessed");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/kindness")
      .then(async (response) => {
        const data = (await response.json()) as { entries?: KindnessEntry[] };
        if (!response.ok) throw new Error();
        return data;
      })
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setNote("The kindness wall is temporarily unavailable."));
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
        entry: KindnessEntry;
      };
      if (!response.ok) {
        setNote(data.error ?? "This kindness could not be shared.");
        return;
      }

      setEntries((current) => [{ ...data.entry, status: "pending" }, ...current]);
      setMessage("");
      setNote(
        "Thank you for sharing this kindness. It’s saved and visible to you here as Awaiting approval. It will join the Kindness Tree after review."
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
        <p className="eyebrow">Your daily experiment · one small act</p>
        <h2 id="kindness-form-title">Notice kindness in motion.</h2>
        <p>
          Share one kind action you gave, received or witnessed today. Ordinary
          kindness counts: holding a door, making tea, checking in.
        </p>
        <form className="gratitude-form" onSubmit={submit}>
          <label>
            I…
            <select
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as KindnessEntry["kind"])
              }
            >
              <option value="gave">gave kindness</option>
              <option value="received">received kindness</option>
              <option value="witnessed">witnessed kindness</option>
            </select>
          </label>
          <label>
            The kind action
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
            These words may appear in the Kindness Tree after review. I have
            removed identifying details.
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Sharing…" : "Share a kindness"}
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>
      </div>

      <section className="kindness-pending" aria-labelledby="kindness-pending-title">
        <h2 id="kindness-pending-title">Your kindness stories</h2>
        <p>After review, approved stories will join the Kindness Tree.</p>
        <KindnessStories
          entries={entries.filter((entry) => entry.status === "pending")}
          emptyMessage="Your stories awaiting approval will appear here after you share."
          id="kindness-pending"
        />
      </section>
    </div>
  );
}
