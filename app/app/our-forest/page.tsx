import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { CONTRIBUTIONS_PER_TREE } from "../../lib/impact";
import "./our-forest.css";

export const metadata: Metadata = {
  title: "Our Forest — You Matter",
  description:
    "Small actions become something tangible in the world. Every 50 eligible approved contributions funds another tree.",
};

const treeNationForestUrl = "https://tree-nation.com/profile/caroline-carmody";

function TreeNationLink({ closing = false }: { closing?: boolean }) {
  const label = closing
    ? "VISIT OUR TREE-NATION FOREST"
    : "SEE OUR TREES";

  return (
    <div className="our-forest__tree-nation-link">
      <a
        className="our-forest__button"
        href={treeNationForestUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens in a new tab)`}
      >
        {label} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export default function OurForestPage() {
  return (
    <>
      <SiteHeader />
      <main className="our-forest">
        <section className="our-forest__hero" aria-labelledby="our-forest-title">
          <div className="our-forest__hero-image" aria-hidden="true" />
          <div className="our-forest__hero-shade" aria-hidden="true" />
          <div className="our-forest__hero-copy">
            <p className="our-forest__eyebrow">Our Forest</p>
            <h1 id="our-forest-title">
              <span className="our-forest__hero-headline-line">
                We funded the first ten.
              </span>{" "}
              <span className="our-forest__hero-headline-line">
                From here, we need your help.
              </span>
            </h1>
            <p>
              Before You Matter opened its doors, we funded our first ten trees
              through Tree-Nation.
            </p>
            <p>Not because ten trees will change the world.</p>
            <p>
              But because we didn’t want to ask you to begin something we
              weren’t willing to begin ourselves.
            </p>
            <p>This is where our forest starts.</p>
          </div>
        </section>

        <section className="our-forest__founding" aria-labelledby="founding-title">
          <div className="our-forest__founding-copy">
            <h2 id="founding-title">The first ten</h2>
            <p className="our-forest__location">Mt. Elgon, Uganda</p>
            <p>
              Ten founding trees, funded through Tree-Nation before the first
              You Matter adventure began.
            </p>
            <TreeNationLink />
          </div>
        </section>

        <section className="our-forest__participate" aria-labelledby="participate-title">
          <div className="our-forest__participate-content">
            <div className="our-forest__participate-copy">
              <h2 id="participate-title">Now it’s your turn.</h2>
              <p>You don’t need to donate money.</p>
              <p>You don’t need to plant a tree.</p>
              <p className="our-forest__just-take-part">Just take part.</p>
              <ul>
                <li>
                  <Link href="/gratitude">
                    Plant something in the Gratitude Garden.
                  </Link>
                </li>
                <li>
                  <Link href="/kindness">Add a kindness to the Kindness Tree.</Link>
                </li>
                <li>
                  <Link href="/strengths">Recognise the strengths you bring.</Link>
                </li>
                <li>
                  <Link href="/dream">
                    Throw a dream into the River of Dreams.
                  </Link>
                </li>
              </ul>
              <p className="our-forest__commitment">
                Every {CONTRIBUTIONS_PER_TREE} eligible approved contributions
                funds another tree.
              </p>
            </div>

            <div
              className="our-forest__sequence"
              role="group"
              aria-label="50 small contributions lead to one real tree somewhere in the world"
            >
              <p>
                <strong>{CONTRIBUTIONS_PER_TREE}</strong>
                <span>small contributions</span>
              </p>
              <span className="our-forest__sequence-arrow" aria-hidden="true">↓</span>
              <p>
                <strong>1</strong>
                <span>real tree</span>
              </p>
              <span className="our-forest__sequence-arrow" aria-hidden="true">↓</span>
              <p>
                <strong>Somewhere</strong>
                <span>in the world</span>
              </p>
            </div>
          </div>
        </section>

        <section className="our-forest__world" aria-labelledby="world-title">
          <div className="our-forest__world-location">
            <span>Our first location</span>
            <strong>Mt. Elgon</strong>
            <span>Uganda · 10 founding trees funded</span>
          </div>
          <div className="our-forest__world-copy">
            <h2 id="world-title">A forest around the world</h2>
            <p>We started in Uganda.</p>
            <p>
              Each time the You Matter community earns another tree, we’ll
              choose another Tree-Nation planting location where possible.
            </p>
            <p>
              Little by little, we’ll watch our forest spread across the world.
            </p>
          </div>
        </section>

        <section className="our-forest__evidence" aria-labelledby="evidence-title">
          <div className="our-forest__evidence-copy">
            <h2 id="evidence-title">See the real forest</h2>
            <p>
              We don’t want you to simply take our word for it.
            </p>
            <p>
              Our trees are funded through Tree-Nation, where you can see the
              forest we’re growing and follow its progress.
            </p>
            <TreeNationLink closing />
          </div>
        </section>

        <section className="our-forest__closing" aria-label="Our shared purpose">
          <div className="our-forest__closing-image" aria-hidden="true" />
          <div className="our-forest__closing-shade" aria-hidden="true" />
          <p>
            You matter.
            <br />
            We matter.
            <br />
            And small things add up.
            <span className="our-forest__origin">
              We Matter - Established October 2026
            </span>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
