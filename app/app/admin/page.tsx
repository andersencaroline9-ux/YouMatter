"use client";

import AdminTreeAccounting from "../../components/admin-tree-accounting";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCountryDisplay } from "../../lib/countries";

type TextEntry = {
  id: number;
  message: string;
  displayName: string;
  status: string;
  createdAt: string;
  countryCode?: string | null;
  kind?: string;
};
type GratitudeEntry = Omit<TextEntry, "message"> & {
  messages: string[];
  submissionId: string | null;
};
type NatureEntry = {
  id: number;
  caption: string;
  displayName: string;
  status: string;
  createdAt: string;
  imageUrl: string;
};
type StrengthsEntry = {
  id: number;
  strengths: string[];
  reflection: string | null;
  displayName: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  countryCode: string | null;
};
type CheckinEntry = {
  id: number;
  rating: number;
  comment: string | null;
  displayName: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  countryCode: string | null;
};
type LiveAdventureInterest = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  reserve: boolean;
};
type ContactMessage = {
  id: number;
  name: string | null;
  email: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};
type Data = {
  gratitude: GratitudeEntry[];
  kindness: TextEntry[];
  nature: NatureEntry[];
  strengths: StrengthsEntry[];
  checkins: CheckinEntry[];
};

export default function AdminPage() {
  const [data, setData] = useState<Data>({
    gratitude: [],
    kindness: [],
    nature: [],
    strengths: [],
    checkins: [],
  });
  const [note, setNote] = useState("Loading submissions…");
  const [liveInterests, setLiveInterests] = useState<
    LiveAdventureInterest[]
  >([]);
  const [liveInterestNote, setLiveInterestNote] = useState(
    "Loading the waiting list…"
  );
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactNote, setContactNote] = useState("Loading Contact messages…");
  const [contactPendingId, setContactPendingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(async (response) => (await response.json()) as Data & { error?: string })
      .then((result) => {
        if (result.error) setNote(result.error);
        else {
          setData(result);
          setNote("");
        }
      })
      .catch(() => setNote("Unable to load submissions."));
  }, []);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then(async (response) => {
        const result = (await response.json()) as {
          messages?: ContactMessage[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load Contact messages.");
        }
        return result;
      })
      .then((result) => {
        setContactMessages(result.messages ?? []);
        setContactNote("");
      })
      .catch((error: unknown) => {
        setContactNote(
          error instanceof Error
            ? error.message
            : "Unable to load Contact messages."
        );
      });
  }, []);

  useEffect(() => {
    fetch("/api/admin/live-adventure")
      .then(async (response) => {
        const result = (await response.json()) as {
          entries?: LiveAdventureInterest[];
          error?: string;
        };
        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load the waiting list.");
        }
        return result;
      })
      .then((result) => {
        setLiveInterests(result.entries ?? []);
        setLiveInterestNote("");
      })
      .catch((error: unknown) => {
        setLiveInterestNote(
          error instanceof Error
            ? error.message
            : "Unable to load the waiting list."
        );
      });
  }, []);

  async function decide(
    type: keyof Data,
    id: number,
    status: "approved" | "rejected",
    submissionId?: string | null
  ) {
    const response = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, submissionId, status }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setNote(result.error ?? "Unable to update.");
      return;
    }
    setData((current) => ({
      ...current,
      [type]: current[type].map((item) =>
        type === "gratitude" && submissionId
          ? "submissionId" in item && item.submissionId === submissionId
            ? { ...item, status }
            : item
          : item.id === id
            ? { ...item, status }
            : item
      ),
    }) as Data);
  }

  const actions = (
    type: keyof Data,
    id: number,
    status: string,
    submissionId?: string | null
  ) => (
    <div className="admin-actions">
      {status === "approved" ? (
        <span role="status">
          <strong>Approved ✓</strong>
        </span>
      ) : (
        <button
          className="approve"
          onClick={() => decide(type, id, "approved", submissionId)}
        >
          Approve
        </button>
      )}
      <button
        onClick={() => decide(type, id, "rejected", submissionId)}
      >
        Reject &amp; remove
      </button>
    </div>
  );

  async function updateContactMessage(id: number, read: boolean) {
    setContactPendingId(id);
    setContactNote("");
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      const result = (await response.json()) as {
        message?: { id: number; readAt: string | null };
        error?: string;
      };
      if (!response.ok || !result.message) {
        throw new Error(result.error ?? "Unable to update the Contact message.");
      }
      const updatedMessage = result.message;
      setContactMessages((current) =>
        current.map((item) =>
          item.id === id ? { ...item, readAt: updatedMessage.readAt } : item
        )
      );
    } catch (error: unknown) {
      setContactNote(
        error instanceof Error
          ? error.message
          : "Unable to update the Contact message."
      );
    } finally {
      setContactPendingId(null);
    }
  }

  async function deleteContactMessage(item: ContactMessage) {
    if (
      !window.confirm(
        `Delete the message from ${item.name?.trim() || item.email}? This cannot be undone.`
      )
    ) {
      return;
    }
    setContactPendingId(item.id);
    setContactNote("");
    try {
      const response = await fetch("/api/admin/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, confirm: true }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Unable to delete the Contact message.");
      }
      setContactMessages((current) =>
        current.filter((message) => message.id !== item.id)
      );
    } catch (error: unknown) {
      setContactNote(
        error instanceof Error
          ? error.message
          : "Unable to delete the Contact message."
      );
    } finally {
      setContactPendingId(null);
    }
  }

  return (
    <main className="admin">
      <div className="shell">
        <AdminTreeAccounting />
        <Link className="back-link" href="/#adventures">
          ← Back to the adventures
        </Link>
        <p className="eyebrow" style={{ marginTop: 48 }}>
          Private review queue
        </p>
        <h1>Protect the shared space</h1>
        <p className="admin-intro">
          Nothing reaches the garden, tree or wall before approval. Reject
          nudity, sexual or violent imagery, hate, advertising, personal
          information, identifiable people, and anything that feels unsafe or
          unrelated. Rejected images are deleted from storage.
        </p>
        {note && <p className="form-note">{note}</p>}

        <section className="admin-section">
          <h2>RECONNECT — Waiting List</h2>
          <p className="muted">
            Interest only—not paid or confirmed participation. Entries 1–10
            are the initial cohort; entries 11–20 are reserves.
          </p>
          {liveInterestNote && (
            <p className="form-note">{liveInterestNote}</p>
          )}
          {!liveInterestNote && liveInterests.length === 0 && (
            <p className="muted">No one has joined the waiting list yet.</p>
          )}
          {(["group", "reserve"] as const).map((section) => {
            const entries = liveInterests.filter(
              (entry) =>
                entry.reserve === (section === "reserve")
            );
            if (entries.length === 0) return null;
            return (
              <div className="admin-waitlist-group" key={section}>
                <h3>
                  {section === "group"
                    ? "Initial cohort (entries 1–10)"
                    : "Reserve list (entries 11–20)"}
                </h3>
                <ol>
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <strong>{entry.name}</strong>
                      {" · "}
                      <a href={`mailto:${entry.email}`}>{entry.email}</a>
                      {" · Joined "}
                      {new Date(
                        `${entry.createdAt.replace(" ", "T")}Z`
                      ).toLocaleDateString()}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </section>

        <section className="admin-section">
          <h2>
            Nature photographs{" "}
            <span>
              {data.nature.filter((item) => item.status === "pending").length}{" "}
              pending
            </span>
          </h2>
          <div className="admin-gallery">
            {data.nature.map((item) => (
              <article className="admin-photo card" key={item.id}>
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Nature submission awaiting review"}
                />
                <div>
                  <p>{item.caption || "No caption"}</p>
                  <span className="muted">
                    {item.displayName} · {item.status}
                  </span>
                  {actions("nature", item.id, item.status)}
                </div>
              </article>
            ))}
          </div>
          {!note && data.nature.length === 0 && (
            <p className="muted">No nature photographs yet.</p>
          )}
        </section>

        <section className="admin-section">
          <h2>
            Kindness actions{" "}
            <span>
              {data.kindness.filter((item) => item.status === "pending").length}{" "}
              pending
            </span>
          </h2>
          <div className="admin-table">
            {data.kindness.map((item) => (
              <article className="admin-row card" key={item.id}>
                <div>
                  <p className="serif">“{item.message}”</p>
                  <span className="muted">
                    {item.displayName} · {item.kind} · {item.status}
                  </span>
                </div>
                {actions("kindness", item.id, item.status)}
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>
            The Strengths We Bring{" "}
            <span>
              {data.strengths.filter((item) => item.status === "pending").length}{" "}
              pending
            </span>
          </h2>
          <div className="admin-table">
            {data.strengths.map((item) => {
              const country = item.countryCode
                ? getCountryDisplay(item.countryCode)
                : null;
              return (
                <article className="admin-row card" key={item.id}>
                  <div>
                    <p className="serif">
                      <strong>{item.strengths.join(", ")}</strong>
                    </p>
                    {item.reflection && <p>“{item.reflection}”</p>}
                    <span className="muted">
                      {item.displayName}
                      {country && (
                        <>
                          {" · "}
                          {country.name}{" "}
                          <span aria-hidden="true">{country.flag}</span>
                        </>
                      )}{" "}
                      · {item.status}
                    </span>
                  </div>
                  {actions("strengths", item.id, item.status)}
                </article>
              );
            })}
          </div>
          {!note && data.strengths.length === 0 && (
            <p className="muted">No strengths contributions yet.</p>
          )}
        </section>

        <section className="admin-section">
          <h2>
            Homepage check-ins{" "}
            <span>
              {data.checkins.filter((item) => item.status === "pending").length}{" "}
              pending
            </span>
          </h2>
          <div className="admin-table">
            {data.checkins.map((item) => {
              const country = item.countryCode
                ? getCountryDisplay(item.countryCode)
                : null;
              return (
                <article className="admin-row card" key={item.id}>
                  <div>
                    <p className="serif">
                      <strong>{item.rating}/10</strong>
                    </p>
                    {item.comment && <p>“{item.comment}”</p>}
                    <span className="muted">
                      {item.displayName}
                      {country && (
                        <>
                          {" · "}
                          {country.name}{" "}
                          <span aria-hidden="true">{country.flag}</span>
                        </>
                      )}{" "}
                      · {item.status}
                    </span>
                  </div>
                  {actions("checkins", item.id, item.status)}
                </article>
              );
            })}
          </div>
          {!note && data.checkins.length === 0 && (
            <p className="muted">No homepage check-ins yet.</p>
          )}
        </section>

        <section className="admin-section">
          <h2>
            Gratitudes{" "}
            <span>
              {data.gratitude.filter((item) => item.status === "pending").length}{" "}
              pending
            </span>
          </h2>
          <div className="admin-table">
            {data.gratitude.map((item) => {
              const country = item.countryCode
                ? getCountryDisplay(item.countryCode)
                : null;
              return (
                <article className="admin-row card" key={item.submissionId ?? item.id}>
                  <div>
                    <ul className="admin-gratitude-messages">
                      {item.messages.map((message, index) => (
                        <li className="serif" key={`${item.id}-${index}`}>
                          “{message}”
                        </li>
                      ))}
                    </ul>
                    <span className="muted">
                      {item.displayName}
                      {country && (
                        <>
                          {" · "}
                          {country.name}{" "}
                          <span aria-hidden="true">{country.flag}</span>
                        </>
                      )}{" "}
                      · {item.status}
                    </span>
                  </div>
                  {actions("gratitude", item.id, item.status, item.submissionId)}
                </article>
              );
            })}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="contact-inbox-title">
          <h2 id="contact-inbox-title">
            Contact inbox{" "}
            <span>{contactMessages.filter((item) => !item.readAt).length} unread</span>
          </h2>
          {contactNote && (
            <p className="form-note" role="status">
              {contactNote}
            </p>
          )}
          {!contactNote && contactMessages.length === 0 && (
            <p className="muted">No Contact messages.</p>
          )}
          <div className="admin-table">
            {contactMessages.map((item) => (
              <article
                className={`admin-row card contact-admin-row${item.readAt ? "" : " contact-admin-row--unread"}`}
                key={item.id}
              >
                <div className="contact-admin-message">
                  <p className="contact-admin-identity">
                    <strong>{item.name?.trim() || "Anonymous/No name"}</strong>
                    {" · "}
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </p>
                  <p className="contact-admin-body">{item.message}</p>
                  <span className="muted">
                    Received{" "}
                    {new Date(
                      `${item.createdAt.replace(" ", "T")}Z`
                    ).toLocaleString()}{" "}
                    · {item.readAt ? "Read" : "Unread"}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    disabled={contactPendingId === item.id}
                    onClick={() => updateContactMessage(item.id, !item.readAt)}
                  >
                    {item.readAt ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    disabled={contactPendingId === item.id}
                    onClick={() => deleteContactMessage(item)}
                  >
                    Delete…
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="admin-warning">
          <strong>Keep the shared space protected</strong>
          <p>
            This review queue requires a verified Cloudflare Access identity on
            the administrator allowlist. Add automated text/image screening,
            rate limits and visitor reporting before public launch. Human
            approval should remain the final gate.
          </p>
        </aside>
      </div>
    </main>
  );
}
