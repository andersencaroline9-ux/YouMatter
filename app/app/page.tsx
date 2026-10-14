import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import HomeWelcome from "./home-welcome";
import "./home-welcome.css";

export default function Home() {
  return (
    <>
      <SiteHeader home />

      <main className="forest-home" id="top">
        <HomeWelcome />

        <section
          className="home-forest-invitation"
          id="forest-invitation"
          aria-labelledby="forest-invitation-title"
        >
          <div className="shell home-forest-invitation__content">
            <p className="eyebrow">A place to begin</p>
            <h2 id="forest-invitation-title">Fancy trying something?</h2>
            <p>Start wherever you’re curious.</p>
            <a className="forest-enter-link" href="#adventures">
              Enter the forest <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="forest-trail" id="adventures">
          <div className="forest-fork" id="forest-fork">
            <div className="shell forest-fork__intro">
              <p className="eyebrow">Choose your adventure</p>
              <h2>Small things to try, whenever you’re ready.</h2>
            </div>
            <nav className="shell forest-fork__paths" aria-label="Choose a path">
              <a className="forest-path-choice" href="/gratitude">
                <span className="forest-path-choice__direction">
                  A quieter path
                </span>
                <strong>Gratitude Garden</strong>
                <span>Notice more of what’s good.</span>
              </a>
              <a
                className="forest-path-choice forest-path-choice--forward"
                href="#forest-next"
              >
                <span className="forest-path-choice__direction">
                  The main trail
                </span>
                <strong>
                  Keep walking <span aria-hidden="true">↓</span>
                </strong>
                <span>There are a few more ways to explore.</span>
              </a>
            </nav>
          </div>
        </section>

        <section className="forest-crossroads" id="forest-next">
          <nav
            className="shell forest-crossroads__paths"
            aria-label="Choose another adventure"
          >
            <a className="forest-crossroads__choice" href="/kindness">
              <strong>The Kindness Tree</strong>
              <span>Notice the good happening between us.</span>
            </a>
            <a
              className="forest-crossroads__choice forest-crossroads__choice--right"
              href="/strengths"
            >
              <strong>What Do You Bring?</strong>
              <span>Notice what’s already good in you.</span>
            </a>
          </nav>
        </section>

        <section
          className="forest-live-trailhead"
          aria-labelledby="live-trailhead-title"
        >
          <div className="shell forest-live-trailhead__content">
            <p className="eyebrow">Live Adventure</p>
            <h2 id="live-trailhead-title">30 Days in Nature</h2>
            <p className="forest-live-trailhead__tagline">
              Make a little more room for nature.
            </p>
            <p className="forest-live-trailhead__description">
              Spend 30 minutes outside each day and see what you notice —
              together with 14 other people.
            </p>
            <ul
              className="forest-live-trailhead__details"
              aria-label="Adventure details"
            >
              <li><strong>30 days</strong></li>
              <li><strong>30 minutes a day</strong></li>
              <li><strong>15 people</strong></li>
              <li><strong>$44</strong></li>
            </ul>
            <a className="forest-live-trailhead__link" href="/live-adventure">
              Join the adventure <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="truth-strip" id="why">
          <div className="shell truth-inner">
            <div>
              <p className="eyebrow">The idea</p>
              <h2>Wellbeing is personal. It is also collective.</h2>
            </div>
            <div className="truth-copy">
              <a className="forest-idea-link" href="/what-is-this">
                What is this? <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <aside
          className="forest-impact shell"
          aria-labelledby="forest-impact-title"
        >
          <div>
            <p className="eyebrow">Growing together</p>
            <h2 id="forest-impact-title">
              Small contributions can reach beyond this forest.
            </h2>
          </div>
          <div>
            <p>
              For every 50 approved contributions across You Matter, we commit
              to funding the planting of one tree.
            </p>
          </div>
        </aside>
      </main>

      <SiteFooter />
    </>
  );
}
