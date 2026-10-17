import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./what-is-this.css";

const ideas = [
  "Gratitude",
  "Kindness",
  "Strengths",
  "Connection",
  "Nature",
  "Meaning",
];

type AdventureCard = {
  href: string;
  title: string;
  idea: string;
  description: string;
  image: string;
  flower?: string;
  imageClass?: string;
  alt: string;
};

const adventures: AdventureCard[] = [
  {
    href: "/gratitude",
    title: "Gratitude Garden",
    idea: "A gratitude becomes a flower.",
    description: "Share what you’re grateful for and add a flower to our garden.",
    image: "/gratitude-clearing-base-temporary.png",
    flower: "/gratitude-plants/wood-anemone.png",
    alt: "A sunlit woodland clearing in the Gratitude Garden.",
  },
  {
    href: "/kindness",
    title: "The Kindness Tree",
    idea: "An act of kindness becomes a leaf.",
    description: "Share a real act of kindness and add a leaf to our tree.",
    image: "/kindness-tree.png",
    alt: "The large old tree used in the Kindness adventure.",
  },
  {
    href: "/strengths",
    title: "The Strengths We Bring",
    idea: "Your strengths become a stone.",
    description: "Choose three strengths and add a stone to our wall.",
    image: "/strengths-shelter.png",
    alt: "A woodland shelter built from branches, the current shared Strengths image.",
  },
  {
    href: "/dream",
    title: "Give Yourself Permission to Dream",
    idea: "A dream becomes a stone in the river.",
    description: "Put one dream into words and add it to the River of Dreams.",
    image: "/dream-stone-01.png",
    imageClass: "what-is-this__adventure-image--dream",
    alt: "A photographic Dream Stone from the River of Dreams.",
  },
];

export default function WhatIsThisPage() {
  return (
    <>
      <SiteHeader />
      <main className="what-is-this">
        <section className="what-is-this__hero" aria-labelledby="what-title">
          <img
            className="what-is-this__hero-image"
            src="/homepage-banner-path.png"
            alt=""
          />
          <div className="what-is-this__hero-shade" aria-hidden="true" />
          <div className="shell what-is-this__hero-content">
            <h1 id="what-title">What is this?</h1>
            <p>
              You Matter is a place to try small things that research suggests
              can help us live well — and see what happens when we do them
              together.
            </p>
          </div>
        </section>

        <section
          className="what-is-this__idea"
          aria-labelledby="idea-title"
        >
          <div className="shell what-is-this__idea-content">
            <h2 id="idea-title">Small actions. A bigger picture.</h2>
            <p className="what-is-this__psychology">
              Positive psychology studies what helps people and communities
              thrive.
              <br />
              Some of what researchers have discovered is surprisingly
              ordinary:
            </p>
            <ul className="what-is-this__ideas" aria-label="Everyday ideas">
              {ideas.map((idea) => <li key={idea}>{idea}</li>)}
            </ul>

            <p className="what-is-this__try">
              Here, you don’t just read about these ideas.
              <br />
              <strong>You try them.</strong>
            </p>
            <p className="what-is-this__supporting">
              Choose an adventure. Do something small. Notice what happens. And,
              if you want to, add your contribution to what other people are
              creating here.
            </p>
          </div>
        </section>

        <section className="what-is-this__adventures" aria-label="The adventures">
          <div className="shell what-is-this__adventure-list">
            {adventures.map(
              ({
                href,
                title,
                idea,
                description,
                image,
                flower,
                imageClass,
                alt,
              }) => (
                <article className="what-is-this__adventure" key={href}>
                  <Link
                    className={`what-is-this__adventure-image${imageClass ? ` ${imageClass}` : ""}`}
                    href={href}
                    aria-label={`Explore ${title}`}
                  >
                    <img src={image} alt={alt} />
                    {flower && (
                      <img
                        className="what-is-this__adventure-flower"
                        src={flower}
                        alt=""
                      />
                    )}
                  </Link>
                  <h3><Link href={href}>{title}</Link></h3>
                  <p className="what-is-this__adventure-idea">{idea}</p>
                  <p>{description}</p>
                </article>
              )
            )}
          </div>
        </section>

        <section
          className="what-is-this__model"
          aria-label="How an individual action becomes something shared"
        >
          <div className="shell what-is-this__model-steps">
            <div className="what-is-this__model-step">
              <span>YOU</span>
              <p>Try something</p>
            </div>
            <span className="what-is-this__model-arrow" aria-hidden="true">→</span>
            <div className="what-is-this__model-step">
              <span>US</span>
              <p>Contribute something</p>
            </div>
            <span className="what-is-this__model-arrow" aria-hidden="true">→</span>
            <div className="what-is-this__model-step">
              <span>WORLD</span>
              <p>Build something together</p>
            </div>
          </div>
        </section>

        <section
          className="what-is-this__impact"
          aria-labelledby="what-is-this-impact-title"
        >
          <div className="shell what-is-this__impact-content">
            <h2 id="what-is-this-impact-title">
              And together, it becomes something real.
            </h2>
            <div className="what-is-this__impact-equation">
              <p>
                <strong>50</strong>
                <span>eligible approved contributions</span>
              </p>
              <span className="what-is-this__impact-arrow" aria-hidden="true">→</span>
              <p>
                <strong>1</strong>
                <span>tree planting funded</span>
              </p>
            </div>
            <p className="what-is-this__impact-detail">
              We commit to funding one tree for every 50 eligible approved
              contributions shared across Gratitude Garden, The Kindness Tree,
              The Strengths We Bring and Give Yourself Permission to Dream.
              Each eligible approved form counts once: a
              three-message Gratitude submission, one Kindness story, a
              three-strength Strengths submission, or one Dream Stone.
            </p>
          </div>
        </section>

        <section className="what-is-this__closing" aria-labelledby="closing-title">
          <div className="shell what-is-this__closing-content">
            <h2 id="closing-title">Because this is the idea behind You Matter:</h2>
            <p className="what-is-this__motto">
              You matter. We matter. What we do matters.
            </p>
            <p>
              You don’t need to be particularly happy, positive, spiritual or
              sorted to be here.
            </p>
            <p className="what-is-this__curious">Just curious.</p>
            <Link className="button what-is-this__cta" href="/#adventures">
              Choose an adventure <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
