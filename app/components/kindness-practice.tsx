"use client";

import { FormEvent, useEffect, useState } from "react";

type Entry = {
  id: number;
  message: string;
  kind: "gave" | "received" | "witnessed";
  displayName: string;
  status?: "pending" | "approved";
};

export default function KindnessPractice() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<Entry["kind"]>("witnessed");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);

  useEffect(() => {
    fetch("/api/kindness")
      .then((response) => response.json())
      .then((data) => setEntries(data.entries ?? []));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) {
      setNote("Tell us about one small act of kindness.");
      return;
    }
    if (!consent) {
      setNote("Please confirm that the words may join the shared wall.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/kindness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, kind, displayName: name, consent }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setNote(data.error ?? "The brick could not be added.");
      return;
    }

    setEntries((current) => [{ ...data.entry, status: "pending" }, ...current]);
    setMessage("");
    setNote(
      "Thank you. Your kindness brick is saved and visible to you here as Awaiting approval. It will join the shared wall after review."
    );
  }

  return (
    <div className="practice-grid">
      <div className="practice card">
        <p className="eyebrow">Your daily experiment · one small act</p>
        <h2>Notice kindness in motion.</h2>
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
                setKind(event.target.value as Entry["kind"])
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
            These words may appear in the shared wall after review. I have
            removed identifying details.
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Building…" : "Add one brick"}
          </button>
          <p className="form-note" role="status">
            {note}
          </p>
        </form>
      </div>

      <div className="wall-panel">
        <div className="creation-heading">
          <div>
            <p className="eyebrow">Our collective creation</p>
            <h2>The wall we are building</h2>
          </div>
          <span>{entries.length} kind actions</span>
        </div>
        <div className="kindness-wall">
          {entries.length === 0 && (
            <p className="empty-wall">One small kindness can lay the first brick.</p>
          )}
          {entries.slice(0, 48).map((entry, index) => (
            <button
              key={`${entry.status}-${entry.id}`}
              className={`kindness-brick row-${index % 3}`}
              onClick={() => setSelected(entry)}
              style={{ opacity: entry.status === "pending" ? 0.72 : 1 }}
            >
              <small>{entry.kind}</small>
              {entry.status === "pending" && (
                <small className="approval-status">Awaiting approval</small>
              )}
              <span>{entry.message}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="wall-note">
            <button onClick={() => setSelected(null)}>×</button>
            <p>“{selected.message}”</p>
            <span>
              — {selected.displayName} · kindness {selected.kind}
              {selected.status === "pending" ? " · Awaiting approval" : ""}
            </span>
          </div>
        )}
        <p className="creation-caption">
          A single brick can feel small. Together, these actions become visible
          evidence of the kind of world people are already helping to build.
        </p>
      </div>
    </div>
  );
}
