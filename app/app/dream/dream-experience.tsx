"use client";

import Link from "next/link";
import {
  type AnimationEvent,
  type CSSProperties,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const prompts = [
  "If nothing was stopping you, what would you really want?",
  "What would you love to experience?",
  "What would you love to create, do or contribute?",
  "Who would you love to become?",
  "If you were living a life that felt right for you, what might an ordinary day look like?",
];

type RiverResponse = {
  dreams?: unknown;
};

const streamStones = [
  { x: 25, y: 55, r: -13, s: 19, asset: 0, mobileX: 18, mobileY: 36, mobileSize: 13 },
  { x: 39, y: 65, r: 6, s: 23, asset: 5, mobileX: 50, mobileY: 35, mobileSize: 14 },
  { x: 52, y: 48, r: -5, s: 17, asset: 2, mobileX: 82, mobileY: 37, mobileSize: 12 },
  { x: 66, y: 57, r: 11, s: 21, asset: 7, mobileX: 30, mobileY: 55, mobileSize: 17 },
  { x: 80, y: 64, r: -8, s: 16, asset: 4, mobileX: 70, mobileY: 55, mobileSize: 16 },
  { x: 29, y: 69, r: 7, s: 25, asset: 1, mobileX: 18, mobileY: 74, mobileSize: 21 },
  { x: 47, y: 58, r: -12, s: 20, asset: 6, mobileX: 50, mobileY: 73, mobileSize: 23 },
  { x: 63, y: 69, r: 4, s: 24, asset: 3, mobileX: 82, mobileY: 74, mobileSize: 20 },
  { x: 82, y: 49, r: -3, s: 16, asset: 7, mobileX: 50, mobileY: 50, mobileSize: 13 },
];

const stoneAssets = [
  { src: "/dream-stone-01.png", aspect: 305 / 232 },
  { src: "/dream-stone-02.png", aspect: 272 / 260 },
  { src: "/dream-stone-03.png", aspect: 246 / 238 },
  { src: "/dream-stone-04.png", aspect: 290 / 200 },
  { src: "/dream-stone-05.png", aspect: 289 / 233 },
  { src: "/dream-stone-06.png", aspect: 275 / 236 },
  { src: "/dream-stone-07.png", aspect: 306 / 226 },
  { src: "/dream-stone-08.png", aspect: 268 / 237 },
];

type DreamStoneStyle = CSSProperties & {
  "--stone-image": string;
  "--stone-aspect": string;
  "--stone-x": string;
  "--stone-y": string;
  "--stone-rotation": string;
  "--stone-size": string;
  "--stone-mobile-x": string;
  "--stone-mobile-y": string;
  "--stone-mobile-size": string;
};

type ThrowMotionStyle = CSSProperties & {
  "--throw-x": string;
  "--throw-y": string;
  "--ripple-x": string;
  "--ripple-y": string;
};

type FlowStage = "arrival" | "reflection" | "transition" | "stream" | "dream" | "thrown";

function scrollToDreamElement(element: HTMLElement | null) {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  element?.scrollIntoView({ behavior, block: "start" });
}

export default function DreamExperience() {
  const [stage, setStage] = useState<FlowStage>("arrival");
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflections, setReflections] = useState<string[]>(
    () => prompts.map(() => "")
  );
  const [selectedDream, setSelectedDream] = useState<number | null>(null);
  const [riverDreams, setRiverDreams] = useState<string[] | null>(null);
  const [riverUnavailable, setRiverUnavailable] = useState(false);
  const riverRequestRef = useRef<Promise<string[]> | null>(null);
  const [dream, setDream] = useState("");
  const [throwing, setThrowing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [throwMotion, setThrowMotion] = useState({
    x: 0,
    y: 0,
    rippleX: 0,
    rippleY: 0,
  });
  const submissionInFlightRef = useRef(false);
  const throwFallbackRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const beginButtonRef = useRef<HTMLButtonElement>(null);
  const arrivalRef = useRef<HTMLElement>(null);
  const interruptionRef = useRef<HTMLElement>(null);
  const transitionRef = useRef<HTMLElement>(null);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const streamRef = useRef<HTMLElement>(null);
  const dreamRef = useRef<HTMLElement>(null);
  const selectedDreamRef = useRef<HTMLElement>(null);
  const selectedDreamHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectedStoneButtonRef = useRef<HTMLButtonElement>(null);
  const throwStageRef = useRef<HTMLElement>(null);
  const throwSceneRef = useRef<HTMLDivElement>(null);
  const throwStoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDream === null) return;
    selectedDreamHeadingRef.current?.focus();
    scrollToDreamElement(selectedDreamRef.current);
  }, [selectedDream]);

  useEffect(() => {
    if (!riverRequestRef.current) {
      riverRequestRef.current = fetch("/api/dream")
        .then(async (response) => {
          const data = (await response.json()) as RiverResponse;
          if (
            !response.ok ||
            !Array.isArray(data.dreams) ||
            !data.dreams.every((dream): dream is string => typeof dream === "string")
          ) {
            throw new Error("Unable to load the River of Dreams.");
          }
          return data.dreams;
        });
    }

    let active = true;
    riverRequestRef.current
      .then((dreams) => {
        if (active) setRiverDreams(dreams.slice(0, streamStones.length));
      })
      .catch(() => {
        if (active) setRiverUnavailable(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (throwFallbackRef.current !== null) {
        window.clearTimeout(throwFallbackRef.current);
      }
    },
    []
  );

  function begin() {
    scrollToDreamElement(arrivalRef.current);
  }

  function startReflection() {
    setStage("reflection");
    requestAnimationFrame(() => {
      promptRef.current?.focus();
      scrollToDreamElement(promptRef.current);
    });
  }

  function advanceReflection(nextIndex: number) {
    if (nextIndex >= prompts.length) {
      setStage("transition");
      requestAnimationFrame(() => scrollToDreamElement(transitionRef.current));
      return;
    }
    if (nextIndex < 0) return;
    setPromptIndex(nextIndex);
    requestAnimationFrame(() => {
      promptRef.current?.focus();
      scrollToDreamElement(promptRef.current);
    });
  }

  function continueToRiver() {
    setStage("stream");
    requestAnimationFrame(() => scrollToDreamElement(streamRef.current));
  }

  function continueToDream() {
    setStage("dream");
    setDream("");
    requestAnimationFrame(() => {
      scrollToDreamElement(dreamRef.current);
      document.getElementById("dream-stone-input")?.focus();
    });
  }

  function restart() {
    if (throwFallbackRef.current !== null) {
      window.clearTimeout(throwFallbackRef.current);
      throwFallbackRef.current = null;
    }
    setStage("arrival");
    setPromptIndex(0);
    setReflections(prompts.map(() => ""));
    setSelectedDream(null);
    setDream("");
    setThrowing(false);
    setSubmitting(false);
    setSubmissionError("");
    setThrowMotion({ x: 0, y: 0, rippleX: 0, rippleY: 0 });
    requestAnimationFrame(() => {
      beginButtonRef.current?.focus();
      scrollToDreamElement(heroRef.current);
    });
  }

  function updateReflection(value: string) {
    setReflections((current) =>
      current.map((answer, index) =>
        index === promptIndex ? value : answer
      )
    );
  }

  async function throwDream(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalDream = dream.trim();
    if (!finalDream || submitting || throwing || submissionInFlightRef.current) return;

    submissionInFlightRef.current = true;
    setSubmitting(true);
    setSubmissionError("");
    try {
      const response = await fetch("/api/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream: finalDream }),
      });
      if (response.status !== 201) {
        throw new Error("Dream submission was not acknowledged.");
      }

      setDream(finalDream);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showSuccess();
        return;
      }

      const scene = throwSceneRef.current?.getBoundingClientRect();
      const stone = throwStoneRef.current?.getBoundingClientRect();
      if (scene && stone) {
        const sourceX = stone.left + stone.width / 2 - scene.left;
        const sourceY = stone.top + stone.height / 2 - scene.top;
        const targetX = scene.width * 0.52;
        const targetY = scene.height * 0.7;
        setThrowMotion({
          x: targetX - sourceX,
          y: targetY - sourceY,
          rippleX: targetX,
          rippleY: targetY,
        });
      }
      setThrowing(true);
      throwFallbackRef.current = window.setTimeout(showSuccess, 2100);
    } catch {
      setSubmissionError(
        "We couldn’t send your dream just now. Your words are still here. Please try again."
      );
    } finally {
      submissionInFlightRef.current = false;
      setSubmitting(false);
    }
  }

  function showSuccess() {
    if (throwFallbackRef.current !== null) {
      window.clearTimeout(throwFallbackRef.current);
      throwFallbackRef.current = null;
    }
    setThrowing(false);
    setStage("thrown");
    requestAnimationFrame(() => {
      throwStageRef.current?.focus();
      scrollToDreamElement(throwStageRef.current);
    });
  }

  function finishThrow(event: AnimationEvent<HTMLDivElement>) {
    if (
      event.target instanceof Element &&
      event.target.matches(".dream-stone-preview__ripple--outer")
    ) {
      window.setTimeout(showSuccess, 180);
    }
  }

  return (
    <>
      <section
        className="dream-hero"
        ref={heroRef}
        aria-labelledby="dream-title"
      >
        <div className="dream-hero__image" aria-hidden="true" />
        <div className="dream-hero__shade" aria-hidden="true" />
        <div className="shell dream-hero__content">
          <p className="eyebrow">A You Matter adventure</p>
          <h1 id="dream-title">
            Give Yourself
            <br />
            Permission to Dream
          </h1>
          <p>Before you ask whether it’s possible, ask what you want.</p>
          <button
            className="dream-button dream-button--light"
            ref={beginButtonRef}
            onClick={begin}
          >
            Begin <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <nav className="dream-local-nav" aria-label="Dream adventure sections">
        <div className="shell">
          <a href="#dream-psychology">The why</a>
          <span aria-hidden="true">|</span>
          <a href="#dream-arrival">The practice</a>
        </div>
      </nav>

      <section className="dream-arrival" id="dream-arrival" ref={arrivalRef}>
        <div className="shell dream-narrow">
          <p>
            We spend a lot of time thinking about what is realistic.
          </p>
          <p>
            What we can afford. What makes sense. What other people might
            think. What we’re qualified for. What would fit around the life we
            already have.
          </p>
          <p>Those things matter.</p>
          <p>But they don’t have to be the first things we ask.</p>
          <p>For the next few minutes, we’re going to try something different.</p>
          <p className="dream-arrival__last">We’re going to dream first.</p>
        </div>
      </section>

      <section
        className="dream-interruption"
        id="dream-interruption"
        ref={interruptionRef}
        aria-labelledby="dream-interruption-title"
      >
        <div className="shell dream-narrow">
          <p className="eyebrow">The practice</p>
          <h2 id="dream-interruption-title">There’s often a “but”.</h2>
          <ul className="dream-but-list">
            <li>I’d love to do that, but...</li>
            <li>That would be amazing, except...</li>
            <li>I’ve always wanted to, but...</li>
            <li>Maybe one day, when...</li>
          </ul>
          <p>
            We can become so good at editing our dreams that sometimes we do it
            before we’ve even finished imagining them.
          </p>
          <p>And some of those buts are completely real.</p>
          <p>Money matters. Responsibilities matter. Circumstances matter.</p>
          <p>We’re not pretending otherwise.</p>
          <p>We’re just not inviting them in yet.</p>
          <p>
            For the next few minutes, separate two questions that normally
            arrive together:
          </p>
          <div className="dream-why__questions">
            <p>What do I want?</p>
            <p>Is it possible?</p>
          </div>
          <p>Right now, we’re only interested in the first one.</p>
          <p className="dream-but-pause">
            For the next few minutes, the “but” doesn’t get a vote.
          </p>
          <button className="dream-button" onClick={startReflection}>
            Take a few minutes <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {stage === "reflection" && (
        <section
          className="dream-reflection"
          id="dream-reflection"
          aria-labelledby="dream-prompt"
        >
          <div className="shell dream-narrow">
            <p className="eyebrow">A little space for yourself</p>
            <h2 className="dream-reflection__title">What would you want?</h2>
            <p className="dream-reflection__intro">
              There’s no plan to make. No answer to justify.
            </p>
            <p className="dream-private-note">
              These thoughts are just for you. They aren’t saved or shared.
            </p>
            <h2 id="dream-prompt" ref={promptRef} tabIndex={-1}>
              {prompts[promptIndex]}
            </h2>
            <label className="visually-hidden" htmlFor="dream-reflection-input">
              Private reflection. This stays in this page and is never saved.
            </label>
            <textarea
              id="dream-reflection-input"
              value={reflections[promptIndex]}
              onChange={(event) => updateReflection(event.target.value)}
              placeholder="Take your time. A few words or a whole page — whatever feels right."
              rows={7}
            />
            <p className="dream-private-note">
              Your answers stay in temporary page state only and disappear
              when you leave, reload or start again.
            </p>
            {promptIndex === prompts.length - 1 && (
              <div className="dream-reflection__closing">
                <p>
                  Don’t worry if your answers contradict each other, seem
                  unrealistic or aren’t fully formed.
                </p>
                <p>You don’t have to do anything with them.</p>
              </div>
            )}
            <div className="dream-reflection__actions">
              <button
                className="dream-text-button"
                disabled={promptIndex === 0}
                onClick={() => advanceReflection(promptIndex - 1)}
              >
                ← Back
              </button>
              <button
                className="dream-text-button"
                onClick={() => advanceReflection(promptIndex + 1)}
              >
                Skip
              </button>
              <button
                className="dream-button"
                onClick={() => advanceReflection(promptIndex + 1)}
              >
                {promptIndex === prompts.length - 1 ? "Continue" : "Next"}
                <span aria-hidden="true"> →</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "transition" && (
        <section className="dream-transition" ref={transitionRef} tabIndex={-1}>
          <div className="shell dream-narrow">
            <p className="eyebrow">Keep those thoughts for a moment.</p>
            <p>Dreams don’t always have to become goals.</p>
            <p>
              Sometimes there’s value simply in noticing what we’ve been
              quietly wanting.
            </p>
            <p>And you’re not the only person carrying things like these.</p>
            <p>Other people have dreams too.</p>
            <button className="dream-button" onClick={continueToRiver}>
              Visit the river <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {stage === "stream" && (
        <section
          className="dream-stream"
          id="dream-stream"
          ref={streamRef}
          aria-labelledby="dream-stream-title"
        >
          <div className="shell">
            <div className="dream-section-heading">
              <p className="eyebrow">Other people have dreams too</p>
              <h2 id="dream-stream-title">The River of Dreams</h2>
              <p>Every stone holds something someone has allowed themselves to want.</p>
              <p>Some are enormous.</p>
              <p>Some are wonderfully ordinary.</p>
              <p>Some might sound a little like yours.</p>
              <p>Choose a stone.</p>
              {riverDreams === null && !riverUnavailable && (
                <p className="dream-river-note" role="status">
                  The river is opening…
                </p>
              )}
              {riverUnavailable && (
                <p className="dream-river-note" role="status">
                  The River of Dreams is temporarily unavailable. Please try
                  again another time.
                </p>
              )}
              {riverDreams?.length === 0 && (
                <p className="dream-river-note" role="status">
                  The river is quiet for now. Its first dreams will appear here
                  after they’ve been reviewed.
                </p>
              )}
            </div>
            <div
              className="dream-stream__scene"
              role="group"
              aria-label="Choose a stone to discover a dream"
            >
              {streamStones.slice(0, riverDreams?.length ?? 0).map((stone, index) => {
                const asset = stoneAssets[stone.asset];
                const style: DreamStoneStyle = {
                  "--stone-image": `url("${asset.src}")`,
                  "--stone-aspect": `${asset.aspect}`,
                  "--stone-x": `${stone.x}%`,
                  "--stone-y": `${stone.y}%`,
                  "--stone-rotation": `${stone.r}deg`,
                  "--stone-size": `${stone.s}px`,
                  "--stone-mobile-x": `${stone.mobileX}%`,
                  "--stone-mobile-y": `${stone.mobileY}%`,
                  "--stone-mobile-size": `${stone.mobileSize}px`,
                };
                return (
                  <button
                    className={`dream-stream__stone${selectedDream === index ? " is-selected" : ""}`}
                    key={index}
                    type="button"
                    style={style}
                    data-mobile-row={Math.floor(index / 4)}
                    data-mobile-column={index % 4}
                    aria-label={`Dream stone ${index + 1}`}
                    aria-pressed={selectedDream === index}
                    onClick={(event) => {
                      setSelectedDream(index);
                      selectedStoneButtonRef.current = event.currentTarget;
                      if (selectedDream === index) {
                        selectedDreamHeadingRef.current?.focus();
                        scrollToDreamElement(selectedDreamRef.current);
                      }
                    }}
                  />
                );
              })}
            </div>
            {selectedDream !== null && (
              <article
                className="dream-reveal"
                aria-live="polite"
                aria-atomic="true"
                ref={selectedDreamRef}
              >
                <h3
                  className="eyebrow"
                  ref={selectedDreamHeadingRef}
                  tabIndex={-1}
                >
                  A dream in the river
                </h3>
                <blockquote>“{riverDreams[selectedDream]}”</blockquote>
                <button
                  className="dream-text-button"
                  onClick={() => {
                    setSelectedDream(null);
                    requestAnimationFrame(() =>
                      selectedStoneButtonRef.current?.focus()
                    );
                  }}
                >
                  Choose another stone <span aria-hidden="true">→</span>
                </button>
              </article>
            )}
            <div className="dream-stream__continue">
              <p>What would you add to the river?</p>
              <button className="dream-button" onClick={continueToDream}>
                Choose one thing <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "dream" && (
        <section
          className="dream-create"
          id="dream-practice"
          ref={dreamRef}
          aria-labelledby="dream-create-title"
        >
          <div className={`shell dream-create__inner${throwing ? " is-throwing" : ""}`}>
            <div
              className="dream-throw-scene"
              ref={throwSceneRef}
              aria-hidden="true"
              style={{
                "--throw-x": `${throwMotion.x}px`,
                "--throw-y": `${throwMotion.y}px`,
                "--ripple-x": `${throwMotion.rippleX}px`,
                "--ripple-y": `${throwMotion.rippleY}px`,
              } as ThrowMotionStyle}
              onAnimationEnd={finishThrow}
            >
              <div
                className="dream-stone-preview"
                ref={throwStoneRef}
              >
                {dream && <span>{dream}</span>}
              </div>
              <span className="dream-stone-preview__ripple dream-stone-preview__ripple--inner" />
              <span className="dream-stone-preview__ripple dream-stone-preview__ripple--outer" />
            </div>
            <div className="dream-create__copy">
              <h2 id="dream-create-title">What would you add to the river?</h2>
              <p>Choose one thing you’d like to allow yourself to want.</p>
              <form onSubmit={throwDream}>
                <label htmlFor="dream-stone-input">Your dream</label>
                <textarea
                  id="dream-stone-input"
                  value={dream}
                  required
                  maxLength={120}
                  rows={3}
                  placeholder="What would you like to allow yourself to want?"
                  onChange={(event) => setDream(event.target.value)}
                  disabled={submitting || throwing}
                  aria-describedby="dream-character-guidance dream-submission-privacy"
                />
                <div className="dream-create__guidance">
                  <p id="dream-character-guidance">
                    Up to 120 characters. Short and simple is enough.
                  </p>
                  <p aria-live="polite">{dream.length} / 120</p>
                </div>
                <p id="dream-submission-privacy" className="dream-prototype-privacy">
                  Your five reflection answers stay private. Only this final
                  dream is sent, and it’s reviewed before it can appear
                  anonymously in the River of Dreams.
                </p>
                <p className="dream-stone-guidance">
                  You don’t need to explain it.<br />
                  You don’t need to know how you’ll do it.<br />
                  You don’t need to make it realistic.<br />
                  Just name it.
                </p>
                {dream.trim() && (
                  <div className="dream-throw-words">
                    <p>There it is.</p>
                    <p>Not a plan.</p>
                    <p>Not a promise.</p>
                    <p>Just something you’ve allowed yourself to want.</p>
                  </div>
                )}
                {submissionError && (
                  <p className="dream-submit-error" role="alert">
                    {submissionError}
                  </p>
                )}
                <button
                  className="dream-button"
                  type="submit"
                  disabled={!dream.trim() || submitting || throwing}
                >
                  {submitting ? "Sending…" : "THROW IT IN"}
                  <span aria-hidden="true"> →</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {stage === "thrown" && (
        <>
          <section
            className="dream-ending"
            id="dream-thrown"
            ref={throwStageRef}
            aria-labelledby="dream-ending-title"
            tabIndex={-1}
          >
            <div className="shell dream-narrow">
              <p className="eyebrow">A quiet moment</p>
              <h2 id="dream-ending-title">There it is.</h2>
              <p>Your dream has been received.</p>
              <p>
                Before it joins the River of Dreams, I’ll take a quick look at
                it. This helps keep the river a kind and safe place for
                everyone.
              </p>
              <p>You don’t have to turn it into a goal today.</p>
              <p>You don’t have to make a plan.</p>
              <p>You don’t even have to know whether it’s possible.</p>
              <p>For now, you simply allowed yourself to want it.</p>
              <p className="dream-ending__last">
                Sometimes knowing what we want is a beginning.
              </p>
              <Link className="dream-button" href="/#adventures">
                Explore another adventure <span aria-hidden="true">→</span>
              </Link>
              <button
                className="dream-text-button dream-restart"
                type="button"
                onClick={restart}
              >
                Start again
              </button>
            </div>
          </section>

          <section
            className="dream-psychology"
            id="dream-psychology"
            aria-labelledby="dream-psychology-title"
          >
            <div className="shell dream-psychology__inner">
              <p className="eyebrow">The why</p>
              <h2 id="dream-psychology-title">Why start with dreaming?</h2>
              <p>
                Before we can move towards a life we want, it helps to have
                some idea of what we actually want.
              </p>
              <p>
                Coaching psychologist Richard Boyatzis describes something
                called the Ideal Self — our sense of who we’d like to become
                and the life we’d like to be living.
              </p>
              <p>
                Within his Intentional Change Theory, exploring this desired
                future comes before examining our current reality and working
                out what might need to change.
              </p>
              <p>In other words, there is a time for questions like:</p>
              <div className="dream-psychology__questions">
                <p>What’s realistic?</p>
                <p>What’s standing in my way?</p>
                <p>What would I need to change?</p>
                <p>How could I get there?</p>
              </div>
              <p>They’re important questions.</p>
              <p>They’re just not the first questions.</p>
              <p>
                Research into vision-focused coaching has also explored what
                happens when conversations about change begin with hopes,
                aspirations and a desired future rather than beginning with
                weaknesses or problems.
              </p>
              <p>
                The evidence doesn’t tell us that imagining something will
                make it happen.
              </p>
              <p>
                And this exercise isn’t about manifestation or pretending that
                real constraints don’t exist.
              </p>
              <p>It’s simply an invitation to spend a few minutes with a different question:</p>
              <blockquote>
                Before asking “How?”, what happens if we first ask “What do I
                want?”
              </blockquote>
              <p className="dream-psychology__motto">Dream first. Edit later.</p>

              <div className="dream-psychology__references">
                <h3>References</h3>
                <ul>
                  <li>
                    Boyatzis, R. E., &amp; Akrivou, K. (2006).{" "}
                    <cite>The ideal self as the driver of intentional change.</cite>{" "}
                    <em>Journal of Management Development, 25</em>(7), 624–642.{" "}
                    <a href="https://doi.org/10.1108/02621710610678454" target="_blank" rel="noreferrer">
                      https://doi.org/10.1108/02621710610678454
                    </a>
                  </li>
                  <li>
                    Boyatzis, R. E., Rochford, K., &amp; Taylor, S. N. (2015).{" "}
                    <cite>
                      The role of the positive emotional attractor in vision
                      and shared vision: Toward effective leadership,
                      relationships, and engagement.
                    </cite>{" "}
                    <em>Frontiers in Psychology, 6</em>, 670.{" "}
                    <a href="https://doi.org/10.3389/fpsyg.2015.00670" target="_blank" rel="noreferrer">
                      https://doi.org/10.3389/fpsyg.2015.00670
                    </a>
                  </li>
                  <li>
                    Howard, A. R. (2015).{" "}
                    <cite>
                      Coaching to vision versus coaching to improvement needs:
                      A preliminary investigation on the differential impacts
                      of fostering positive and negative emotion during real
                      time executive coaching sessions.
                    </cite>{" "}
                    <em>Frontiers in Psychology, 6</em>, 455.{" "}
                    <a href="https://doi.org/10.3389/fpsyg.2015.00455" target="_blank" rel="noreferrer">
                      https://doi.org/10.3389/fpsyg.2015.00455
                    </a>
                  </li>
                </ul>
                <p>
                  The River of Dreams is a You Matter-designed collective
                  experience informed by relevant theory and research; these
                  sources do not validate this specific exercise.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

    </>
  );
}
