import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import GratitudeExperience from "../../components/gratitude-experience";

export const metadata: Metadata = {
  title: "Gratitude Garden — You Matter",
};

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
              Our minds are remarkably good at noticing what&apos;s wrong.
              What&apos;s missing. What hasn&apos;t gone according to plan.
            </p>
            <p>
              And while noticing problems is useful, sometimes we forget to
              notice what&apos;s going right.
            </p>
            <p>
              Gratitude gives us an opportunity to pay attention to the good
              things in our lives — big or small, extraordinary or completely
              ordinary.
            </p>
            <p>
              And there&apos;s some interesting science behind why that matters.
            </p>
          </div>
        </section>

        <GratitudeExperience>
          <section className="gratitude-clearing__why" aria-label="Explore the science of gratitude">
            <div className="shell gratitude-clearing__why-content">
              <section aria-labelledby="gratitude-happier-title">
                <h3 id="gratitude-happier-title">Can gratitude make us happier?</h3>
                <p>Researchers have been exploring that question for decades.</p>
                <p>
                  In one well-known study, psychologists Robert Emmons and Michael
                  McCullough asked participants to regularly write down things
                  they were grateful for.
                </p>
                <p>
                  Compared with people completing other reflection exercises,
                  those practising gratitude reported improvements in some
                  measures of wellbeing, particularly positive emotions.
                </p>
                <p>
                  More recent research has brought together findings from many
                  different studies.
                </p>
                <p className="gratitude-clearing__science-emphasis">
                  The overall picture?
                </p>
                <p>
                  Practising gratitude can make a small but meaningful difference
                  to how we feel.
                </p>
                <p>
                  Not for everyone. Not every time. And certainly not as a magical
                  solution to life&apos;s difficulties.
                </p>
                <p>
                  But sometimes, deliberately noticing what&apos;s good can help us
                  experience a little more of it.
                </p>
              </section>

            <section aria-labelledby="gratitude-three-title">
              <h3 id="gratitude-three-title">Why three things?</h3>
              <p>
                Because sometimes the first thing we&apos;re grateful for comes
                easily.
              </p>
              <p>The second might require a little more thought.</p>
              <p>
                And by the third, we might find ourselves noticing something we
                would otherwise have overlooked.
              </p>
              <p>It doesn&apos;t have to be something extraordinary.</p>
              <p>A conversation. A cup of coffee. Someone remembering your name.</p>
              <p>
                The point isn&apos;t to pretend everything is good. It&apos;s to
                notice the good that is there.
              </p>
            </section>

            <section aria-labelledby="gratitude-garden-title">
              <h3 id="gratitude-garden-title">And why a garden?</h3>
              <p>
                Because gratitude doesn&apos;t have to be something we practise
                alone.
              </p>
              <p>
                When you plant your three gratitudes, they become a flower in
                our shared garden.
              </p>
              <p>And as more people contribute, the garden grows.</p>
              <p>
                Each flower represents someone, somewhere, who stopped for a
                moment to notice something good.
              </p>
              <p>Different lives. Different experiences. Different reasons to be grateful.</p>
              <p>
                A little reminder that while our experiences are individual,
                we&apos;re part of something bigger.
              </p>
            </section>

            <details className="gratitude-clearing__science">
              <summary>Curious about the research?</summary>
              <ol>
                <li>
                  <p>
                    Emmons, R. A., &amp; McCullough, M. E. (2003).{" "}
                    <cite>
                      Counting blessings versus burdens: An experimental
                      investigation of gratitude and subjective well-being in
                      daily life.
                    </cite>{" "}
                    Journal of Personality and Social Psychology, 84(2),
                    377–389.
                  </p>
                  <a
                    href="https://doi.org/10.1037/0022-3514.84.2.377"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://doi.org/10.1037/0022-3514.84.2.377
                  </a>
                  <p>
                    A foundational experimental investigation of gratitude
                    listing and subjective wellbeing.
                  </p>
                </li>
                <li>
                  <p>
                    Wood, A. M., Froh, J. J., &amp; Geraghty, A. W. A. (2010).{" "}
                    <cite>
                      Gratitude and well-being: A review and theoretical
                      integration.
                    </cite>{" "}
                    Clinical Psychology Review, 30(7), 890–905.
                  </p>
                  <a
                    href="https://doi.org/10.1016/j.cpr.2010.03.005"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://doi.org/10.1016/j.cpr.2010.03.005
                  </a>
                  <p>
                    A review exploring gratitude, psychological wellbeing and
                    possible explanations for their relationship.
                  </p>
                </li>
                <li>
                  <p>
                    Choi, H., Cha, Y., McCullough, M. E., Coles, N. A., &amp;
                    Oishi, S. (2025).{" "}
                    <cite>
                      A meta-analysis of the effectiveness of gratitude
                      interventions on well-being across cultures.
                    </cite>{" "}
                    Proceedings of the National Academy of Sciences, 122(28),
                    e2425193122.
                  </p>
                  <a
                    href="https://doi.org/10.1073/pnas.2425193122"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://doi.org/10.1073/pnas.2425193122
                  </a>
                  <p>
                    A meta-analysis of 145 papers involving 24,804 participants
                    across 28 countries, finding small average improvements in
                    wellbeing, with variation between studies and countries.
                  </p>
                </li>
              </ol>
            </details>
            </div>
          </section>
        </GratitudeExperience>
      </main>

      <SiteFooter />
    </>
  );
}
