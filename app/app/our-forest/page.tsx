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

const treeNationForestUrl = "https://tree-nation.com/profile/youmatter";

type ForestIconName =
  | "trees"
  | "community"
  | "sapling"
  | "gratitude"
  | "kindness"
  | "strengths"
  | "dreams"
  | "checkin";

function ForestLineIcon({ name }: { name: ForestIconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.5,
  };

  if (name === "trees") {
    return (
      <svg viewBox="0 0 52 42" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M14 37V18m-7 19V25m24 12V16m7 21V25" />
          <path d="M5 20c0-4 3-7 7-7 0-5 4-9 9-9s9 4 9 9c4 0 7 3 7 7 0 4-3 7-7 7H12c-4 0-7-3-7-7Z" />
          <path d="M2 25c0-3 2-5 5-5m3 8 4-4m16 2 5-5m-24 2 4 4" />
          <path d="M12 39h29" />
        </g>
      </svg>
    );
  }

  if (name === "community") {
    return (
      <svg viewBox="0 0 52 42" aria-hidden="true" focusable="false">
        <g {...common}>
          <circle cx="26" cy="10" r="5" />
          <circle cx="12" cy="17" r="4" />
          <circle cx="40" cy="17" r="4" />
          <path d="M16 36v-5c0-6 4-10 10-10s10 4 10 10v5H16Z" />
          <path d="M3 35v-4c0-5 3-8 8-8 2 0 4 1 5 2m33 10v-4c0-5-3-8-8-8-2 0-4 1-5 2M3 35h46" />
        </g>
      </svg>
    );
  }

  if (name === "sapling") {
    return (
      <svg viewBox="0 0 52 42" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M26 38V17m0 12c0-7-5-11-12-11 0 7 4 11 12 11Zm0-6c0-7 5-11 12-11 0 7-4 11-12 11Z" />
          <path d="M26 18c-6-2-8-7-5-13 6 2 8 7 5 13Zm0 0c6-2 8-7 5-13-6 2-8 7-5 13ZM16 38h20" />
        </g>
      </svg>
    );
  }

  if (name === "gratitude") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M20 35V19m0 9c-6 0-9-4-9-9 6 0 9 3 9 9Zm0-5c6 0 9-4 9-9-6 0-9 3-9 9Z" />
          <path d="M20 3c2 0 3 3 3 6 3-3 6-4 7-2s-1 5-4 7c4 0 7 2 6 4s-4 3-8 2c2 3 2 6 0 7s-4-2-4-6c-2 4-5 6-7 4s0-5 3-8c-4 1-7 0-7-2s3-4 7-4c-3-3-4-6-2-8s5 0 6 4c1-3 2-4 4-4" />
          <circle cx="20" cy="18" r="2" />
        </g>
      </svg>
    );
  }

  if (name === "kindness") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M20 33S5 24 5 14c0-5 7-8 11-3l4 5 4-5c4-5 11-2 11 3 0 10-15 19-15 19Z" />
          <path d="M10 20h6l3-5 4 11 3-6h4" />
        </g>
      </svg>
    );
  }

  if (name === "strengths") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="m5 29 9-16 6 10 5-7 10 13H5Z" />
          <path d="m11 29 8-7 5 4 5-4m-20 9h27" />
          <path d="m14 13 2 3m9 0 2 3" />
        </g>
      </svg>
    );
  }

  if (name === "dreams") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <g {...common}>
          <path d="M4 12c7 0 7 7 14 7s7-7 14-7h4M4 20c7 0 7 7 14 7s7-7 14-7h4M4 28c7 0 7 7 14 7s7-7 14-7h4" />
          <path d="M23 6h.01M31 4h.01m-3 6h.01" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g {...common}>
        <circle cx="20" cy="20" r="7" />
        <path d="M20 3v5m0 24v5M3 20h5m24 0h5M8 8l4 4m16 16 4 4m0-24-4 4m-16 16-4 4" />
      </g>
    </svg>
  );
}

function ForestArrow() {
  return (
    <svg
      className="our-forest__arrow"
      viewBox="0 0 72 28"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 18C20 3 46 3 65 15m0 0-8-1m8 1-4-7" />
    </svg>
  );
}

const participationOptions = [
  {
    category: "GRATITUDE",
    title: "Plant something in the Gratitude Garden.",
    description: "Share three things you’re grateful for.",
    action: "Go to Gratitude",
    href: "/gratitude",
    icon: "gratitude" as const,
  },
  {
    category: "KINDNESS",
    title: "Add a kindness.",
    description: "Share a kindness you gave, received or witnessed.",
    action: "Add kindness",
    href: "/kindness",
    icon: "kindness" as const,
  },
  {
    category: "STRENGTHS",
    title: "Explore your strengths.",
    description: "Choose three strengths you recognise in yourself.",
    action: "Explore",
    href: "/strengths",
    icon: "strengths" as const,
  },
  {
    category: "DREAMS",
    title: "Add a dream to the River of Dreams.",
    description: "Give yourself permission to dream.",
    action: "Add a dream",
    href: "/dream",
    icon: "dreams" as const,
  },
  {
    category: "CHECK IN",
    title: "Share how you’re doing.",
    description: "A small check-in counts too.",
    action: "Check in",
    href: "/how-are-you-doing",
    icon: "checkin" as const,
  },
];

export default function OurForestPage() {
  return (
    <>
      <SiteHeader />
      <main className="our-forest">
        <section className="our-forest__hero" aria-labelledby="our-forest-title">
          <div className="our-forest__hero-image" aria-hidden="true" />
          <div className="our-forest__hero-shade" aria-hidden="true" />
          <div className="our-forest__hero-content">
            <div className="our-forest__story">
              <p className="our-forest__eyebrow">Our Forest</p>
              <h1 id="our-forest-title">
                We funded the first ten.
                <br />
                {" "}From here, we need your help.
              </h1>
              <div className="our-forest__explanation">
                <p>
                  Before You Matter opened its doors, we funded our first ten
                  trees through Tree-Nation.
                </p>
                <p>Not because ten trees will change the world.</p>
                <p>
                  But because we didn’t want to ask you to begin something we
                  weren’t willing to begin ourselves.
                </p>
              </div>
            </div>

            <div
              className="our-forest__mechanism"
              aria-label="Ten founding trees are separate from the community contribution total. Every 50 eligible approved contributions funds one more tree."
            >
              <div className="our-forest__step our-forest__step--founding">
                <ForestLineIcon name="trees" />
                <strong>10</strong>
                <span className="our-forest__step-label">Founding trees</span>
                <span>Mt. Elgon, Uganda</span>
              </div>
              <ForestArrow />
              <div className="our-forest__step">
                <ForestLineIcon name="community" />
                <strong>{CONTRIBUTIONS_PER_TREE}</strong>
                <span className="our-forest__step-label">Small contributions</span>
              </div>
              <ForestArrow />
              <div className="our-forest__step">
                <ForestLineIcon name="sapling" />
                <strong>1</strong>
                <span className="our-forest__step-label">Real tree</span>
                <span>Funded through Tree-Nation</span>
              </div>
            </div>

            <nav className="our-forest__actions" aria-label="Forest actions">
              <a
                className="our-forest__button our-forest__button--primary"
                href={treeNationForestUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                See our forest <span aria-hidden="true">↗</span>
              </a>
              <Link
                className="our-forest__button our-forest__button--light"
                href="/#adventures"
              >
                Choose an adventure <span aria-hidden="true">→</span>
              </Link>
            </nav>
          </div>
        </section>

        <section
          className="our-forest__participate"
          aria-labelledby="participate-title"
        >
          <div className="our-forest__participate-content">
            <div className="our-forest__introduction">
              <h2 id="participate-title">Now it’s your turn.</h2>
              <p>You don’t need to donate money.</p>
              <p>You don’t need to plant a tree.</p>
              <p className="our-forest__just-take-part">
                You just need to take part.
              </p>
            </div>

            <nav
              className="our-forest__choices"
              aria-label="Choose how to take part"
            >
              {participationOptions.map((option) => (
                <Link
                  className="our-forest__choice"
                  href={option.href}
                  key={option.category}
                >
                  <span className="our-forest__choice-illustration" aria-hidden="true">
                    <ForestLineIcon name={option.icon} />
                  </span>
                  <span className="our-forest__choice-category">
                    {option.category}
                  </span>
                  <strong>{option.title}</strong>
                  <span className="our-forest__choice-description">
                    {option.description}
                  </span>
                  <span className="our-forest__choice-action">
                    {option.action} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <p className="our-forest__collective-effect">
            Every time our community reaches another {CONTRIBUTIONS_PER_TREE}{" "}
            eligible approved contributions, we fund another tree and our
            forest grows in another place around the world.
          </p>
          <div className="our-forest__closing">
            <p>You matter. We matter. And small things add up.</p>
            <div className="our-forest__signature">
              <span>You Matter. We Matter. What we do matters.</span>
              <span>We Matter - Established October 2026</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
