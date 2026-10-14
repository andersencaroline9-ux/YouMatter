import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import GratitudePractice from "../../components/gratitude-practice";
import PhysicalImpact from "../../components/physical-impact";

export default function GratitudePage() {
  return (
    <>
      <SiteHeader />
      <nav className="shell adventure-local-nav" aria-label="Gratitude Garden">
        <a href="#practice">The practice</a>
      </nav>

      <main className="gratitude-clearing">
        <section
          className="gratitude-clearing__hero"
          aria-labelledby="gratitude-title"
        >
          <div className="shell gratitude-clearing__hero-content">
            <Link className="gratitude-clearing__return" href="/">
              ← Return to the forest trail
            </Link>
            <h1 id="gratitude-title">Gratitude Garden</h1>
            <p>Notice something good. Leave it here.</p>
          </div>
        </section>

        <section className="gratitude-clearing__why" aria-labelledby="gratitude-why-title">
          <div className="shell gratitude-clearing__why-content">
            <h2 id="gratitude-why-title">Why gratitude?</h2>
            <p>
              Good things can be surprisingly easy to miss. Gratitude is the
              simple practice of deliberately noticing what is already good in
              our lives — from the very small to the deeply meaningful. Research
              in positive psychology suggests that practising gratitude can
              help us pay more attention to positive experiences and appreciate
              them more fully.
            </p>
            <p>
              You don’t need to feel grateful for everything. The invitation
              here is simply to notice three things that feel good, helpful or
              meaningful today.
            </p>
            <details className="gratitude-clearing__science">
              <summary>Curious about the science?</summary>
              <p>
                The research behind this adventure is being developed alongside
                Caroline’s MSc studies in Applied Positive Psychology.
                References and a deeper evidence summary will be added here.
              </p>
            </details>
          </div>
        </section>

        <section
          className="gratitude-clearing__practice practice-section section"
          id="practice"
          aria-label="Gratitude practice and shared garden"
        >
          <div className="shell">
            <GratitudePractice />
            <PhysicalImpact />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
