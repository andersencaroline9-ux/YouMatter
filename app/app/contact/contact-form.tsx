"use client";

import { useEffect, useState } from "react";

type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

export default function ContactForm() {
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  async function startSession() {
    setSessionReady(false);
    setSessionError("");
    try {
      const response = await fetch("/api/contact/session", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to prepare the contact form.");
      setSessionReady(true);
    } catch {
      setSessionError("The form could not be prepared. Please try again.");
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/contact/session", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to prepare the contact form.");
        if (active) setSessionReady(true);
      })
      .catch(() => {
        if (active) {
          setSessionError("The form could not be prepared. Please try again.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          message: values.get("message"),
          company: values.get("company"),
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };
      if (!response.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        else setFormError(result.error ?? "Your message could not be sent.");
        return;
      }
      setSent(true);
    } catch {
      setFormError("Your message could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="contact-success" role="status" aria-live="polite">
        <h2 className="serif">Thank you. Your message is on its way.</h2>
        <p>I’ll get back to you as soon as I can.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-field">
        <label htmlFor="contact-name">Name <span>Optional</span></label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
        />
        {fieldErrors.name && (
          <p className="contact-error" id="contact-name-error">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
        />
        {fieldErrors.email && (
          <p className="contact-error" id="contact-email-error">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          maxLength={5000}
          required
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message
              ? "contact-message-help contact-message-error"
              : "contact-message-help"
          }
        />
        <p className="contact-help" id="contact-message-help">
          Up to 5,000 characters.
        </p>
        {fieldErrors.message && (
          <p className="contact-error" id="contact-message-error">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Leave this field empty</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className="contact-privacy">
        Your message, email and optional name are stored privately so I can
        respond. They won’t be published or used to sign you up for anything.
      </p>
      {sessionError && (
        <div className="contact-error" role="alert">
          {sessionError}{" "}
          <button type="button" className="contact-retry" onClick={startSession}>
            Try again
          </button>
        </div>
      )}
      {formError && (
        <p className="contact-error" role="alert">
          {formError}
        </p>
      )}
      <button
        className="button"
        type="submit"
        disabled={!sessionReady || submitting}
      >
        {submitting
          ? "Sending…"
          : sessionReady
            ? "Send message"
            : "Preparing form…"}
      </button>
    </form>
  );
}
