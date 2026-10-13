"use client";

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
type Data = {
  gratitude: GratitudeEntry[];
  kindness: TextEntry[];
  nature: NatureEntry[];
};

export default function AdminPage() {
  const [data, setData] = useState<Data>({
    gratitude: [],
    kindness: [],
    nature: [],
  });
  const [note, setNote] = useState("Loading submissions…");

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then((response) => response.json())
      .then((result) => {
        if (result.error) setNote(result.error);
        else {
          setData(result);
          setNote("");
        }
      })
      .catch(() => setNote("Unable to load submissions."));
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
    const result = await response.json();
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
    submissionId?: string | null
  ) => (
    <div className="admin-actions">
      <button
        className="approve"
        onClick={() => decide(type, id, "approved", submissionId)}
      >
        Approve
      </button>
      <button
        onClick={() => decide(type, id, "rejected", submissionId)}
      >
        Reject &amp; remove
      </button>
    </div>
  );

  return (
    <main className="admin">
      <div className="shell">
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
                  {actions("nature", item.id)}
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
                {actions("kindness", item.id)}
              </article>
            ))}
          </div>
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
                  {actions("gratitude", item.id, item.submissionId)}
                </article>
              );
            })}
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
