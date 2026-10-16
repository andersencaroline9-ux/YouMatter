"use client";

import Link from "next/link";
import {
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

const prototypeDreams = [
  "Write a children's book.",
  "Live somewhere I can see the sea.",
  "Have enough time to paint.",
  "Start my own business.",
  "Travel with my children.",
  "Fall in love again.",
  "Make music.",
  "Feel at home somewhere.",
  "Spend more time outdoors.",
  "Create something that outlives me.",
  "Work less and live more.",
  "Learn to play the piano.",
];

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

type FlowStage = "arrival" | "reflection" | "stream" | "dream" | "thrown";

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
  const [dream, setDream] = useState("");
  const [throwing, setThrowing] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const beginButtonRef = useRef<HTMLButtonElement>(null);
  const interruptionRef = useRef<HTMLElement>(null);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const streamRef = useRef<HTMLElement>(null);
  const dreamRef = useRef<HTMLElement>(null);
  const selectedDreamRef = useRef<HTMLElement>(null);
  const selectedDreamHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectedStoneButtonRef = useRef<HTMLButtonElement>(null);
  const throwStageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selectedDream === null) return;
    selectedDreamHeadingRef.current?.focus();
    scrollToDreamElement(selectedDreamRef.current);
  }, [selectedDream]);

  function begin() {
    scrollToDreamElement(interruptionRef.current);
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
      setStage("stream");
      requestAnimationFrame(() => scrollToDreamElement(streamRef.current));
      return;
    }
    if (nextIndex < 0) return;
    setPromptIndex(nextIndex);
    requestAnimationFrame(() => {
      promptRef.current?.focus();
      scrollToDreamElement(promptRef.current);
    });
  }

  function continueToDream() {
    setStage("dream");
    setDream("");
    requestAnimationFrame(() => {
      dreamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("dream-stone-input")?.focus();
    });
  }

  function restart() {
    setStage("arrival");
    setPromptIndex(0);
    setReflections(prompts.map(() => ""));
    setSelectedDream(null);
    setDream("");
    setThrowing(false);
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

  function throwDream(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dream.trim() || throwing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("thrown");
      requestAnimationFrame(() => {
        throwStageRef.current?.focus();
        scrollToDreamElement(throwStageRef.current);
      });
      return;
    }
    setThrowing(true);
  }

  function finishThrow() {
    if (!throwing) return;
    setThrowing(false);
    setStage("thrown");
    requestAnimationFrame(() => {
      throwStageRef.current?.focus();
      scrollToDreamElement(throwStageRef.current);
    });
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
            Give yourself
            <br />
            permission to dream
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
        <span className="dream-hero__note">
          Prototype landscape · a real Bornholm stream photograph is still needed
        </span>
      </section>

      <nav className="dream-local-nav" aria-label="Dream adventure sections">
        <div className="shell">
          <a href="#dream-title">The dream</a>
          <span aria-hidden="true">|</span>
          <a href="#dream-interruption">Before you begin</a>
        </div>
      </nav>

      <section
        className="dream-interruption"
        id="dream-interruption"
        ref={interruptionRef}
        aria-labelledby="dream-interruption-title"
      >
        <div className="shell dream-narrow">
          <p className="eyebrow">Before you begin</p>
          <h2 id="dream-interruption-title">
            How quickly do you edit your own dreams?
          </h2>
          <ul className="dream-but-list">
            <li>I’d love to, but…</li>
            <li>If money wasn’t an issue, but…</li>
            <li>One day I’d like to, but…</li>
            <li>That would be amazing, but…</li>
          </ul>
          <p className="dream-but-pause">
            For the next few minutes,
            <br />
            the “but” doesn’t get a vote.
          </p>
          <div className="dream-why">
            <p className="eyebrow">The why</p>
            <h3>Before you make the plan, dream.</h3>
            <p>
              When we think about changing our lives, two questions have a habit
              of arriving together:
            </p>
            <div className="dream-why__questions">
              <p>What do I want?</p>
              <p>Is it possible?</p>
            </div>
            <p>
              Sometimes the second question arrives so quickly that we never
              really answer the first.
            </p>
            <ul className="dream-why__but-list">
              <li>I’d love to, but…</li>
              <li>That would be amazing, except…</li>
              <li>Maybe one day, but…</li>
            </ul>
            <p>Coaching psychology offers another place to begin.</p>
            <p>
              One approach to intentional change begins with what researchers
              call the Ideal Self: an image of the person you would like to
              become and the future you would like to move towards.
            </p>
            <p>
              Only later does the work turn towards where you are now, what
              might stand in the way and what you might actually do about it.
            </p>
            <p>That’s what we’re borrowing here.</p>
            <p className="dream-why__emphasis">Not the whole process. Just the beginning.</p>
            <p>
              For the next few minutes, you don’t need a plan. You don’t need
              to know whether it’s realistic. You don’t need to know how you’d
              make it happen.
            </p>
            <p>We’re separating those two questions.</p>
            <p className="dream-why__emphasis">What do I want?</p>
            <p>That’s it.</p>
            <p className="dream-why__motto">Dream first. Edit later.</p>
          </div>
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
            <p className="dream-step-count" aria-live="polite">
              Reflection {promptIndex + 1} of {prompts.length}
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
              Just for you. These words stay in this page and disappear when you
              leave or reload.
            </p>
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
                {promptIndex === prompts.length - 1
                  ? "Continue to the river"
                  : "Next"}
                <span aria-hidden="true"> →</span>
              </button>
            </div>
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
              <p>Choose a stone.</p>
              <p className="dream-prototype-note">
                Prototype sample — these are not real submissions.
              </p>
            </div>
            <div
              className="dream-stream__scene"
              role="group"
              aria-label="Choose a stone to discover a dream"
            >
              {streamStones.map((stone, index) => {
                const text = prototypeDreams[index];
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
                    key={text}
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
                <blockquote>“{prototypeDreams[selectedDream]}”</blockquote>
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
                Choose one dream <span aria-hidden="true">→</span>
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
          <div className="shell dream-create__inner">
            <div className="dream-create__copy">
              <p className="eyebrow">What would you add to the river?</p>
              <h2 id="dream-create-title">Your dream stone</h2>
              <p>Now choose one dream.</p>
              <p>You don’t need to explain it. You don’t need to know how.</p>
              <p>Just put it into words.</p>
              <form onSubmit={throwDream}>
                <label htmlFor="dream-stone-input">One dream, in your words</label>
                <textarea
                  id="dream-stone-input"
                  value={dream}
                  required
                  maxLength={120}
                  rows={3}
                  placeholder="What would you really want?"
                  onChange={(event) => setDream(event.target.value)}
                  aria-describedby="dream-character-guidance dream-prototype-privacy"
                />
                <div className="dream-create__guidance">
                  <p id="dream-character-guidance">
                    Up to 120 characters. Short and simple is enough.
                  </p>
                  <p aria-live="polite">{dream.length} / 120</p>
                </div>
                <p id="dream-prototype-privacy" className="dream-prototype-privacy">
                  Prototype only: this dream is not sent or saved. It will
                  disappear when you leave or reload.
                </p>
                <button
                  className="dream-button"
                  type="submit"
                  disabled={!dream.trim() || throwing}
                >
                  {throwing ? "Letting it go…" : "Throw it in"}
                  <span aria-hidden="true"> →</span>
                </button>
              </form>
            </div>

            <div
              className={`dream-stone-preview${throwing ? " is-throwing" : ""}${stage === "thrown" ? " is-gone" : ""}`}
              aria-hidden="true"
              onAnimationEnd={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.matches(".dream-stone-preview__ripple--two")
                ) {
                  finishThrow();
                }
              }}
            >
              <div className="dream-stone-preview__water">
                <span className="dream-stone-preview__ripple dream-stone-preview__ripple--one" />
                <span className="dream-stone-preview__ripple dream-stone-preview__ripple--two" />
              </div>
              <div className="dream-stone-preview__stone">
                <span>{dream || "Your words, right here"}</span>
              </div>
              <p className="dream-stone-preview__caption">A stone in the making</p>
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
              <p>You don’t have to turn this into a plan today.</p>
              <p>For now, you were simply allowed to want it.</p>
              <p className="dream-ending__last">
                Sometimes knowing what we want is a beginning.
              </p>
              <p className="dream-prototype-note">
                This prototype did not save or submit your dream.
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
            aria-labelledby="dream-psychology-title"
          >
            <div className="shell dream-psychology__inner">
              <p className="eyebrow">The psychology</p>
              <h2 id="dream-psychology-title">Dreaming isn’t the same as doing.</h2>
              <p>
                Imagining a desired future isn’t, by itself, a recipe for
                making it happen.
              </p>
              <p>
                Research on goal pursuit suggests that if we decide to pursue
                something, engaging with present reality — including the
                obstacles between here and there — matters.
              </p>
              <p>This adventure deliberately comes before that.</p>
              <p>Because before you can ask:</p>
              <blockquote>How do I get there?</blockquote>
              <p>there’s another question worth answering:</p>
              <blockquote>Where would I actually like to go?</blockquote>

              <div className="dream-psychology__ideal">
                <h3>The Ideal Self</h3>
                <p>
                  This adventure is partly inspired by research in coaching
                  psychology on the Ideal Self and Intentional Change Theory.
                </p>
                <p>
                  The Ideal Self describes a desired future: who we would like
                  to become, how we would like to live, and the hopes and
                  aspirations that help form that picture.
                </p>
                <p>
                  Within Intentional Change Theory, exploring that desired
                  future is an early part of a much larger process of change.
                </p>
                <p>This adventure doesn’t attempt to take you through that whole process.</p>
                <p>It simply gives you somewhere to begin.</p>
              </div>

              <div className="dream-psychology__references">
                <h3>Further reading</h3>
                <ul>
                  <li>
                    Boyatzis, R. E. &amp; Akrivou, K. (2006).{" "}
                    <cite>The ideal self as the driver of intentional change.</cite>
                  </li>
                  <li>
                    Oettingen’s related literature on mental contrasting,
                    positive fantasies, desired futures and goal pursuit.
                  </li>
                  <li>
                    Best Possible Self research in positive psychology, related
                    work on imagining a desired future.
                  </li>
                </ul>
                <p>
                  These are starting points for the ideas described above. The
                  five-question exercise and the River of Dreams are You Matter
                  experience design; these sources do not test this specific
                  adventure.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

    </>
  );
}
