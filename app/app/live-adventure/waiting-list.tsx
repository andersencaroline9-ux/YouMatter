"use client";

import { FormEvent, useEffect, useState } from "react";
import PrivacyLink from "../../components/privacy-link";

type PublicStatus = {
  isFull: boolean;
};

type SignupResponse = {
  error?: string;
};

export default function LiveAdventureWaitingList() {
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [waitingListFull, setWaitingListFull] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/live-adventure")
      .then(async (response) => {
        const data = (await response.json()) as PublicStatus & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error ?? "Waiting-list status is unavailable.");
        }
        return data;
      })
      .then((data) => {
        setStatus(data);
        setWaitingListFull(data.isFull);
        setStatusLoaded(true);
      })
      .catch(() => {
        setStatusLoaded(true);
        setStatusError("Waiting-list status is temporarily unavailable.");
      });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/live-adventure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = (await response.json()) as SignupResponse;
      if (!response.ok) {
        setMessage(data.error ?? "We couldn’t add you just now. Please try again.");
        if (response.status === 409) {
          setWaitingListFull(true);
          setStatusLoaded(true);
        }
        return;
      }

      setMessage(
        "Thanks for your interest in RECONNECT. Caroline will be in touch if a place becomes available. No payment has been taken."
      );
      setName("");
      setEmail("");
    } catch {
      setMessage("We couldn’t add you just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const isFull = waitingListFull || status?.isFull === true;

  return (
    <div className="live-adventure-waitlist">
      {!isFull && (status || !statusLoaded) && (
        <p className="live-adventure-count" aria-live="polite">
          {!statusLoaded
            ? "Checking current availability…"
            : "Places are currently available."}
        </p>
      )}
      {statusError && <p className="live-adventure-status-error">{statusError}</p>}
      {isFull ? (
        <p className="live-adventure-full">
          This group’s waiting list is currently full.
        </p>
      ) : (
        <form className="live-adventure-form card" onSubmit={submit}>
          <label htmlFor="live-adventure-name">First name</label>
          <input
            id="live-adventure-name"
            name="name"
            type="text"
            autoComplete="given-name"
            maxLength={40}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor="live-adventure-email">Email</label>
          <input
            id="live-adventure-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PrivacyLink />
          <button className="button" disabled={busy}>
            {busy ? "Joining…" : "Join the waiting list"}
          </button>
          <p className="live-adventure-form-note" role="status">
            {message}
          </p>
        </form>
      )}
      <p className="live-adventure-form-note">
        We’ll use your name and email only to contact you about RECONNECT. Your
        details won’t be displayed publicly.
      </p>
    </div>
  );
}
