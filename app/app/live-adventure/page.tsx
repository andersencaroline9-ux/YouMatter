import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import LiveAdventureWaitingList from "./waiting-list";
import "./live-adventure.css";

export default function LiveAdventurePage() {
  return (
    <>
      <SiteHeader />
      <main className="live-adventure-page">
        <section className="live-adventure-hero">
          <div className="shell live-adventure-hero__content">
            <p className="eyebrow">
              A small guided group experience · 18+ only
            </p>
            <h1>30 Days in Nature</h1>
            <p className="live-adventure-tagline">
              15 people. One shared experience.
            </p>
            <p className="live-adventure-hero__intro">
              Spend 30 minutes in nature every day for 30 days, with a little
              structure and a small group alongside you.
            </p>
            <ul className="live-adventure-details" aria-label="Pilot details">
              <li>30 days</li>
              <li>30 minutes in nature each day</li>
              <li>15 people</li>
              <li>$44 pilot price</li>
            </ul>
            <a
              className="live-adventure-hero__link"
              href="#live-adventure-signup"
            >
              Join the waiting list
            </a>
          </div>
        </section>

        <section
          className="live-adventure-signup shell"
          id="live-adventure-signup"
          aria-labelledby="live-adventure-signup-title"
        >
          <div className="live-adventure-invitation">
            <p className="eyebrow">Start with interest</p>
            <h2 id="live-adventure-signup-title">Join the waiting list</h2>
            <p>
              Share your first name and email. Joining the waiting list doesn’t
              commit you to anything, and you won’t be asked for payment yet.
            </p>
            <p className="live-adventure-aim">
              We aim to begin within about a month, once there’s enough
              interest.
            </p>
          </div>
          <LiveAdventureWaitingList />
        </section>

        <section
          className="live-adventure-section shell"
          aria-labelledby="daily-practice-title"
        >
          <div className="live-adventure-section__intro">
            <p className="eyebrow">The daily practice</p>
            <h2 id="daily-practice-title">Thirty minutes. Outside. Noticing.</h2>
            <p>
              For 30 days, spend at least 30 minutes outside in nature each day.
              It can be a local park, a garden, a tree-lined street, or
              somewhere wilder.
            </p>
          </div>
          <div className="live-adventure-practice card">
            <h3>During that time</h3>
            <ul>
              <li>No podcast, scrolling, work, or multitasking.</li>
              <li>No need to exercise or achieve anything.</li>
              <li>Walking, sitting, or standing under a tree are all fine.</li>
            </ul>
            <p>
              Bring your camera or phone to take a photograph if you like. It’s
              a way to notice and check in—not a reason to scroll or consume
              content.
            </p>
            <p>
              This isn’t a photography challenge. There’s no expectation of
              beautiful pictures. The point is being there, paying attention,
              noticing.
            </p>
          </div>
        </section>

        <section
          className="live-adventure-section live-adventure-section--soft"
          aria-labelledby="group-experience-title"
        >
          <div className="shell">
            <div className="live-adventure-section__intro">
              <p className="eyebrow">The group experience</p>
              <h2 id="group-experience-title">A little company along the way</h2>
            </div>
            <div className="live-adventure-stages">
              <article>
                <p className="live-adventure-stage-label">Before we begin</p>
                <h3>Opening group call</h3>
                <p>
                  Meet the other participants, hear how the practice works, and
                  get ready for the month.
                </p>
              </article>
              <article>
                <p className="live-adventure-stage-label">During the 30 days</p>
                <h3>Private WhatsApp group</h3>
                <p>
                  Share a daily photograph or brief check-in if you wish. No
                  long reflections or performance—just connection and gentle
                  accountability.
                </p>
              </article>
              <article>
                <p className="live-adventure-stage-label">At the end</p>
                <h3>Closing group call</h3>
                <p>
                  A chance to look back together on what the month was like.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="live-adventure-section shell live-adventure-why">
          <div className="live-adventure-section__intro">
            <p className="eyebrow">Why nature?</p>
            <h2>Make room to notice the natural world.</h2>
          </div>
          <div>
            <p>
              Research has associated contact with nature with aspects of
              wellbeing. This adventure offers a simple structure for making
              intentional time with nature part of everyday life. People’s
              experiences differ, and this is not a promise of a particular
              outcome.
            </p>
            <ul className="live-adventure-sources" aria-label="Further reading">
              <li>
                <a
                  href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00976/full"
                  target="_blank"
                  rel="noreferrer"
                >
                  Capaldi, Dopko &amp; Zelenski (2014), nature connectedness and
                  happiness
                </a>
              </li>
              <li>
                <a
                  href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0149777"
                  target="_blank"
                  rel="noreferrer"
                >
                  Richardson et al. (2016), 30 Days Wild
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="live-adventure-section live-adventure-section--soft">
          <div className="shell live-adventure-practical">
            <div>
              <p className="eyebrow">A clear invitation</p>
              <h2>What it is—and what it isn’t</h2>
              <p>
                A guided wellbeing experience informed by positive psychology,
                and a small shared practice in everyday life. It isn’t therapy,
                medical treatment, a formal research study, or a photography
                course.
              </p>
              <p>
                <strong>This pilot is for adults aged 18 and over.</strong>
              </p>
            </div>
            <div>
              <p className="eyebrow">The pilot</p>
              <h2>$44</h2>
              <p>
                The pilot price covers the opening call, the 30-day guided
                experience, the private group space, and the closing call.
              </p>
            </div>
          </div>
        </section>

        <section
          className="live-adventure-next shell"
          aria-labelledby="next-steps-title"
        >
          <div>
            <p className="eyebrow">After the waiting list</p>
            <h2 id="next-steps-title">What happens next?</h2>
          </div>
          <ol>
            <li>Join with your first name and email. There’s no commitment.</li>
            <li>No payment is taken when you join the waiting list.</li>
            <li>
              Once there’s enough interest, Caroline will contact the first
              group with the next step.
            </li>
            <li>Payment happens separately later; joining the list is not payment.</li>
            <li>
              The experience begins once 15 people are genuinely confirmed.
            </li>
          </ol>
          <p>
            The aim is to begin within about a month once there’s enough
            interest. Adding your name means you’re interested, not that you
            have a confirmed place.
          </p>
          <a
            className="live-adventure-bottom-link"
            href="#live-adventure-signup"
          >
            Return to the waiting list
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
