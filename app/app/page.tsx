export default function Home() {
  return (
    <>
      <header className="site-header forest-home__header">
        <nav className="shell nav" aria-label="Main navigation">
          <a className="brand" href="#top">
            You Matter.
          </a>
          <div className="nav-links">
            <a href="#adventures">Choose your adventure</a>
            <a href="#why">The idea</a>
          </div>
        </nav>
      </header>

      <main className="forest-home" id="top">
        <section className="forest-entrance" aria-labelledby="forest-title">
          <div className="shell forest-entrance__content">
            <h1 id="forest-title">You Matter.</h1>
            <p className="forest-entrance__subtitle">
              But this isn’t about you.
            </p>
            <p className="forest-entrance__prompt">Choose your adventure.</p>
            <a className="forest-enter-link" href="#adventures">
              Enter the forest <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="forest-trail"
          id="adventures"
        >
          <div className="forest-fork" id="forest-fork">
            <nav className="shell forest-fork__paths" aria-label="Choose a path">
              <a className="forest-path-choice" href="/gratitude">
                <span className="forest-path-choice__direction">
                  The path to the left
                </span>
                <strong>Gratitude Garden</strong>
                <span>Notice something good. Leave it here.</span>
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
              </a>
            </nav>
          </div>
        </section>

        <section className="forest-crossroads" id="forest-next">
          <nav className="shell forest-crossroads__paths" aria-label="Choose another adventure">
            <a className="forest-crossroads__choice" href="/kindness">
              <strong>The Kindness Tree</strong>
              <span>Discover the kindness happening around us.</span>
            </a>
            <a
              className="forest-crossroads__choice forest-crossroads__choice--right"
              href="/strengths"
            >
              <strong>What Do You Bring?</strong>
              <span>
                See what different people bring when we build something
                together.
              </span>
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
              15 people. One shared experience.
            </p>
            <p className="forest-live-trailhead__description">
              A 30-day guided wellbeing experience built around spending 30
              minutes in nature every day — together with 14 other people.
            </p>
            <ul className="forest-live-trailhead__details" aria-label="Adventure details">
              <li><strong>30 days</strong></li>
              <li><strong>30 minutes a day</strong></li>
              <li><strong>15 people</strong></li>
              <li><strong>$11</strong></li>
            </ul>
            <p className="forest-live-trailhead__status">
              Waiting for the first adventurers
            </p>
            <a className="forest-live-trailhead__link" href="/live-adventure">
              Join the adventure <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <aside className="forest-impact shell" aria-labelledby="forest-impact-title">
          <div>
            <p className="eyebrow">Growing together</p>
            <h2 id="forest-impact-title">
              — of 50 contributions towards our next tree
            </h2>
          </div>
          <div>
            <p>
              Every 50 approved contributions across You Matter will fund the
              planting of one real tree.
            </p>
            <p className="forest-impact__note">
              The cross-adventure approved total is not available yet; this
              count is a temporary placeholder.
            </p>
          </div>
        </aside>

        <section className="truth-strip" id="why">
          <div className="shell truth-inner">
            <div>
              <p className="eyebrow">The idea</p>
              <h2>Wellbeing is personal. It is also collective.</h2>
            </div>
            <div className="truth-copy">
              Positive psychology studies the conditions and practices that
              can help people and communities flourish. These adventures
              translate three research areas into tiny, repeatable
              actions—then make their collective effect visible.{" "}
              <strong>
                This is an invitation to experiment, not a promise to fix your
                life.
              </strong>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="intro">
              <p className="eyebrow">The rhythm</p>
              <h2>Understand. Practise. Contribute.</h2>
            </div>
            <div className="how">
              <div className="step">
                <b>01</b>
                <h3>Meet the why</h3>
                <p>
                  Begin with a plain-English introduction to what research
                  suggests—and what it cannot promise.
                </p>
              </div>
              <div className="step">
                <b>02</b>
                <h3>Try one small action</h3>
                <p>
                  The practice is deliberately simple enough to fit inside an
                  ordinary, imperfect day.
                </p>
              </div>
              <div className="step">
                <b>03</b>
                <h3>Become part of the whole</h3>
                <p>
                  Your contribution joins a garden, mosaic or wall shaped by
                  many different lives.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer forest-home__footer">
        <div className="shell footer-inner">
          <a className="brand" href="#top">
            You Matter.
          </a>
          <span>Evidence-informed. Human. Shared.</span>
          <a href="/nature">Nature Mosaic</a>
          <a href="/kindness">Built From Kindness</a>
          <a href="/admin">Review submissions</a>
        </div>
      </footer>
    </>
  );
}
