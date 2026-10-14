"use client";

import { type FormEvent, useState } from "react";
import { countries } from "../lib/countries";
import ImpactBarometer from "../components/impact-barometer";
import HomeCommunityTree from "./home-community-tree";

type IdentityChoice = "anonymous" | "firstName";

const COMMENT_MAX_LENGTH = 240;

export default function HomeWelcome() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [identityChoice, setIdentityChoice] =
    useState<IdentityChoice>("anonymous");
  const [firstName, setFirstName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (rating === null) {
      setError("Choose the number that feels right for you today.");
      return;
    }
    if (!consent) {
      setError("Please confirm your check-in may be shared after review.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/home-checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          identityChoice,
          firstName: identityChoice === "firstName" ? firstName : "",
          countryCode,
          consent,
        }),
      });
      const data = (await response.json()) as {
        checkin?: unknown;
        error?: string;
      };
      if (!response.ok || !data.checkin) {
        setError(data.error ?? "Your check-in could not be shared right now.");
        return;
      }
      setShared(true);
    } catch (submitError: unknown) {
      console.error("Unable to share homepage check-in.", submitError);
      setError("Your check-in could not be shared right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="home-front-door"
      aria-labelledby="forest-title"
      id="welcome"
    >
      <div className="forest-entrance">
        <div className="shell forest-entrance__content">
          <div className="home-banner-identity">
            <h1 id="forest-title">YOU MATTER.</h1>
            <p className="forest-entrance__subtitle">You matter. We matter. What we do matters.</p>
          </div>
          <ImpactBarometer />
        </div>
      </div>
      <div className="home-welcome" data-checkin-open={rating !== null && !shared}>
        <div className="shell home-welcome__inner">
          <section
            className="home-checkin"
            aria-labelledby="home-welcome-title"
          >
            {!shared ? (
              <>
                <h2 id="home-welcome-title">
                  How are you doing today?
                  <span>Really.</span>
                </h2>

                <form className="home-checkin__form" onSubmit={submit}>
                  <fieldset className="home-checkin__rating">
                    <legend className="visually-hidden">
                      How are you doing today, from 1 to 10?
                    </legend>
                    <div className="home-checkin__numbers">
                      {Array.from({ length: 10 }, (_, index) => index + 1).map(
                        (value) => (
                          <label
                            className="home-checkin__number"
                            key={value}
                            data-selected={rating === value}
                          >
                            <input
                              type="radio"
                              name="home-checkin-rating"
                              value={value}
                              checked={rating === value}
                              onChange={() => setRating(value)}
                            />
                            <span>{value}</span>
                          </label>
                        )
                      )}
                    </div>
                    <div className="home-checkin__endpoints" aria-hidden="true">
                      <span>1 = having a really hard day</span>
                      <span>10 = having a really good day</span>
                    </div>
                  </fieldset>

                  {rating !== null && (
                    <div className="home-checkin__details">
                      <label htmlFor="home-checkin-comment">
                        <span>Want to tell us why?</span>
                        <span className="home-checkin__optional">
                          You don’t have to.
                        </span>
                      </label>
                      <textarea
                        id="home-checkin-comment"
                        maxLength={COMMENT_MAX_LENGTH}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Anything you feel like sharing…"
                      />
                      <p className="home-checkin__privacy">
                        Keep it short; please don’t include identifying details.
                      </p>

                      <fieldset className="home-checkin__identity">
                        <legend>How should we show your check-in?</legend>
                        <label>
                          <input
                            type="radio"
                            name="home-checkin-identity"
                            value="anonymous"
                            checked={identityChoice === "anonymous"}
                            onChange={() => setIdentityChoice("anonymous")}
                          />
                          Anonymous
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="home-checkin-identity"
                            value="firstName"
                            checked={identityChoice === "firstName"}
                            onChange={() => setIdentityChoice("firstName")}
                          />
                          First name
                        </label>
                      </fieldset>

                      {identityChoice === "firstName" && (
                        <label
                          className="home-checkin__first-name"
                          htmlFor="home-checkin-first-name"
                        >
                          First name
                          <input
                            id="home-checkin-first-name"
                            autoComplete="given-name"
                            maxLength={40}
                            required
                            value={firstName}
                            onChange={(event) =>
                              setFirstName(event.target.value)
                            }
                          />
                        </label>
                      )}

                      <label
                        className="home-checkin__country-label"
                        htmlFor="home-checkin-country"
                      >
                        Country <span>(optional)</span>
                      </label>
                      <select
                        id="home-checkin-country"
                        value={countryCode}
                        onChange={(event) =>
                          setCountryCode(event.target.value)
                        }
                      >
                        <option value="">No country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>

                      <label className="home-checkin__consent">
                        <input
                          type="checkbox"
                          checked={consent}
                          required
                          onChange={(event) =>
                            setConsent(event.target.checked)
                          }
                        />
                        <span>
                          My check-in may be shared publicly after it has been
                          reviewed.
                        </span>
                      </label>

                      {error && (
                        <p className="home-checkin__error" role="alert">
                          {error}
                        </p>
                      )}

                      <button
                        className="home-checkin__submit"
                        type="submit"
                        disabled={busy}
                      >
                        {busy ? "Sharing…" : "Share how I’m doing"}
                      </button>
                    </div>
                  )}
                </form>
            </>
          ) : (
            <div
              className="home-checkin__thanks"
              role="status"
              aria-live="polite"
            >
              <h2 id="home-welcome-title">Thanks for telling us.</h2>
              <p>However you’re doing today, you’re welcome here.</p>
              <p className="home-checkin__privacy">
                Your check-in will join the others once it’s been reviewed.
              </p>
              <a href="#forest-invitation">Or just wander on →</a>
            </div>
          )}

          {!shared && (
            <a className="home-checkin__skip" href="#forest-invitation">
              Or just wander on →
            </a>
          )}
          </section>

          <HomeCommunityTree />

          <section
            className="home-welcome__why"
            aria-labelledby="home-welcome-why-title"
          >
            <h2 id="home-welcome-why-title">
              What if a few small things could make life feel a little better?
            </h2>
            <p>
              Life can be a lot. We get busy, overwhelmed, disconnected —
              sometimes rushing through the very life we&apos;re trying to enjoy.
            </p>
            <p>But research into human wellbeing has found something interesting:</p>
            <p><strong>
              Some of the things that help us live well are surprisingly simple.
            </strong></p>
            <p>Gratitude. Kindness. Strengths. Connection. Nature. Meaning.</p>
            <p><strong>This is a place to actually try them.</strong></p>
            <p>
              Choose something that speaks to you. Give it a go. Add your
              experience to what other people are creating. And see what you notice.
            </p>
            <p>
              Everything here is inspired by positive psychology — the science
              of what helps people and communities thrive.
            </p>
            <p><strong>You might discover something that helps.</strong></p>
            <p className="home-welcome__closing">
              No promises of a perfect life. Just some interesting science, a
              little curiosity and an invitation to give something a go.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
