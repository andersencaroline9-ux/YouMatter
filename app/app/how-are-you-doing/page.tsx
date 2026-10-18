import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import HomeCheckinExperience from "../home-checkin-experience";
import "../home-welcome.css";
import "./how-are-you-doing.css";

export const metadata: Metadata = {
  title: "How are you doing? — You Matter",
  description:
    "Pause for a moment, check in with yourself, and see how others are doing too.",
};

export default function HowAreYouDoingPage() {
  return (
    <>
      <SiteHeader />
      <main className="how-are-you-doing">
        <HomeCheckinExperience />
        <section
          className="how-are-you-doing__wellbeing"
          aria-labelledby="wellbeing-title"
        >
          <div className="how-are-you-doing__wellbeing-intro">
            <h2 id="wellbeing-title">Happiness is only part of the picture.</h2>
            <div>
              <p>You can feel happy without necessarily feeling fulfilled.</p>
              <p>And you can live a meaningful life without feeling happy every day.</p>
              <p>Psychologists explore wellbeing in different ways.</p>
              <p>
                Some research focuses on hedonic wellbeing — happiness, pleasure,
                emotions and life satisfaction.
              </p>
              <p>
                Other research looks at eudaimonic wellbeing — meaning, purpose,
                personal growth and fulfilling relationships.
              </p>
              <p>Neither tells the whole story.</p>
              <p className="how-are-you-doing__question">
                So, what would you like to explore?
              </p>
            </div>
          </div>
          <div className="how-are-you-doing__concepts">
            <article>
              <h3>Hedonic wellbeing</h3>
              <p className="how-are-you-doing__concept-summary">Feeling good.</p>
              <p>Positive emotions, pleasure and satisfaction with life.</p>
            </article>
            <article>
              <h3>Eudaimonic wellbeing</h3>
              <p className="how-are-you-doing__concept-summary">Living well.</p>
              <p>Meaning, purpose, personal growth and fulfilling relationships.</p>
            </article>
          </div>
          <details className="how-are-you-doing__reference">
            <summary>Further reading on wellbeing</summary>
            <p>
              Ryan, R. M., &amp; Deci, E. L. (2001).{" "}
              <cite>
                On Happiness and Human Potentials: A Review of Research on
                Hedonic and Eudaimonic Well-Being.
              </cite>{" "}
              Annual Review of Psychology, 52, 141–166.{" "}
              <a
                href="https://doi.org/10.1146/annurev.psych.52.1.141"
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI ↗
              </a>
            </p>
          </details>
        </section>

        <section
          className="how-are-you-doing__resources"
          aria-labelledby="wellbeing-resources-title"
        >
          <div className="how-are-you-doing__section-heading">
            <h2 id="wellbeing-resources-title">Explore your wellbeing</h2>
            <p>
              Choose a questionnaire to learn more about a different aspect of your
              wellbeing. These are established tools from positive psychology
              researchers.
            </p>
          </div>
          <div className="how-are-you-doing__resource-list">
            <article className="how-are-you-doing__resource">
              <p className="how-are-you-doing__resource-category">
                Hedonic wellbeing
              </p>
              <h3>Life satisfaction</h3>
              <p className="how-are-you-doing__resource-question">
                How satisfied am I with my life?
              </p>
              <p className="how-are-you-doing__resource-instrument">
                Satisfaction With Life Scale (SWLS)
              </p>
              <p>
                Life satisfaction isn’t quite the same as happiness. It’s about
                stepping back and considering how you feel about your life as a
                whole.
              </p>
              <ul className="how-are-you-doing__resource-meta">
                <li>5 questions</li>
                <li>~1 minute</li>
                <li>Ed Diener and colleagues</li>
              </ul>
              <a
                href="https://eddiener.com/satisfaction-with-life-scale-swls/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore life satisfaction <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </article>

            <article className="how-are-you-doing__resource">
              <p className="how-are-you-doing__resource-category">
                Eudaimonic wellbeing
              </p>
              <h3>Flourishing</h3>
              <p className="how-are-you-doing__resource-question">
                Am I flourishing?
              </p>
              <p className="how-are-you-doing__resource-instrument">
                Flourishing Scale
              </p>
              <p>
                Flourishing is about more than feeling good. It includes purpose,
                supportive relationships, competence and optimism.
              </p>
              <ul className="how-are-you-doing__resource-meta">
                <li>8 questions</li>
                <li>~2 minutes</li>
                <li>Ed Diener and colleagues</li>
              </ul>
              <a
                href="https://eddiener.com/flourishing-scale-fs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore flourishing <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </article>

            <article className="how-are-you-doing__resource">
              <p className="how-are-you-doing__resource-category">
                Eudaimonic wellbeing
              </p>
              <h3>Meaning</h3>
              <p className="how-are-you-doing__resource-question">
                Does my life feel meaningful?
              </p>
              <p className="how-are-you-doing__resource-instrument">
                Meaning in Life Questionnaire (MLQ)
              </p>
              <p>
                Meaning is fascinating because experiencing meaning and searching
                for meaning aren’t necessarily the same thing. You can experience
                both.
              </p>
              <ul className="how-are-you-doing__resource-meta">
                <li>10 questions</li>
                <li>~5 minutes</li>
                <li>Michael Steger and colleagues</li>
              </ul>
              <a
                href="https://ppc.sas.upenn.edu/node/213"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore meaning <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </article>

            <article className="how-are-you-doing__resource">
              <p className="how-are-you-doing__resource-category">
                Multidimensional wellbeing
              </p>
              <h3>Overall wellbeing</h3>
              <p className="how-are-you-doing__resource-question">
                What does my overall wellbeing look like?
              </p>
              <p className="how-are-you-doing__resource-instrument">
                PERMA Profiler
              </p>
              <p>
                This questionnaire explores several dimensions of wellbeing,
                including positive emotion, engagement, relationships, meaning and
                accomplishment.
              </p>
              <ul className="how-are-you-doing__resource-meta">
                <li>23 questions</li>
                <li>~10 minutes</li>
                <li>Margaret Kern and colleagues</li>
              </ul>
              <a
                href="https://www.peggykern.org/questionnaires.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore your wellbeing <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </article>
          </div>
        </section>

        <section
          className="how-are-you-doing__reflection"
          aria-labelledby="reflection-title"
        >
          <div>
            <h2 id="reflection-title">What did you notice?</h2>
            <p>Did anything surprise you?</p>
            <p>Was there something you hadn’t thought about before?</p>
            <p>Is there something you’d like a little more of in your life?</p>
          </div>
          <div className="how-are-you-doing__reflection-note">
            <p>You don’t need to share your answers with anyone.</p>
            <p>This is just for you.</p>
          </div>
        </section>

        <section
          className="how-are-you-doing__pathways"
          aria-labelledby="pathways-title"
        >
          <div className="how-are-you-doing__section-heading">
            <h2 id="pathways-title">What if you tried something?</h2>
            <p>Understanding ourselves can be interesting.</p>
            <p>
              But sometimes the most interesting discoveries happen when we
              actually do something differently.
            </p>
          </div>
          <div className="how-are-you-doing__pathway-list">
            <Link href="/gratitude" className="how-are-you-doing__pathway">
              <span
                className="how-are-you-doing__pathway-photo how-are-you-doing__pathway-photo--gratitude"
                aria-hidden="true"
              />
              <span className="how-are-you-doing__pathway-label">
                Noticing more of what’s good
              </span>
              <span className="how-are-you-doing__pathway-title">
                Gratitude Garden <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link href="/kindness" className="how-are-you-doing__pathway">
              <span
                className="how-are-you-doing__pathway-photo how-are-you-doing__pathway-photo--kindness"
                aria-hidden="true"
              />
              <span className="how-are-you-doing__pathway-label">
                Recognising kindness and connection
              </span>
              <span className="how-are-you-doing__pathway-title">
                The Kindness Tree <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link href="/strengths" className="how-are-you-doing__pathway">
              <span
                className="how-are-you-doing__pathway-photo how-are-you-doing__pathway-photo--strengths"
                aria-hidden="true"
              />
              <span className="how-are-you-doing__pathway-label">
                Discovering what you bring
              </span>
              <span className="how-are-you-doing__pathway-title">
                The Strengths We Bring <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </section>

        <section className="how-are-you-doing__closing" aria-label="A closing thought">
          <p>However you’re doing today,<br />you matter.</p>
        </section>
      </main>
    </>
  );
}
