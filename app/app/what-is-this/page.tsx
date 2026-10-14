import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./what-is-this.css";

const adventures = [
  {
    href: "/gratitude",
    title: "Gratitude Garden",
    description: "A gratitude becomes part of a garden.",
  },
  {
    href: "/kindness",
    title: "The Kindness Tree",
    description: "A kindness becomes one story held by the tree.",
  },
  {
    href: "/strengths",
    title: "What Do You Bring?",
    description: "A strength becomes something brought to a shared shelter.",
  },
  {
    href: "/live-adventure",
    title: "30 Days in Nature — Live",
    description:
      "People practise individually as part of a small shared experience.",
  },
];

export default function WhatIsThisPage() {
  return (
    <>
      <SiteHeader />
      <main className="what-is-this">
        <header className="what-is-this__hero">
          <div className="shell what-is-this__hero-content">
            <p className="eyebrow">The idea</p>
            <h1>
              You Matter.
              <span>You matter. We matter. What we do matters.</span>
            </h1>
            <p className="what-is-this__opening">
              You matter. Of course you do. And none of us exists in isolation.
            </p>
          </div>
        </header>

        <section
          className="what-is-this__section shell what-is-this__intro"
          aria-labelledby="what-is-this-intro-title"
        >
          <h2 id="what-is-this-intro-title">We are part of one another.</h2>
          <p>
            Our wellbeing is shaped by more than what happens inside us. It is
            also connected to our relationships, our communities, the natural
            world, what we contribute, and the things that give life meaning.
          </p>
        </section>

        <section
          className="what-is-this__section what-is-this__soft"
          aria-labelledby="positive-psychology-title"
        >
          <div className="shell what-is-this__two-column">
            <div>
              <p className="eyebrow">A starting point</p>
              <h2 id="positive-psychology-title">
                What helps people flourish?
              </h2>
            </div>
            <div>
              <p>
                Positive psychology asks what can strengthen wellbeing, make
                life feel meaningful, and help people and communities flourish.
                Research suggests that practices such as noticing what we
                appreciate, acting with kindness, recognising our strengths,
                and spending time in nature are associated with aspects of
                wellbeing.
              </p>
              <p>
                You Matter takes these ideas out of the page and makes them
                experiences you can try. Each adventure is a small invitation,
                not a promise of a particular result.
              </p>
            </div>
          </div>
        </section>

        <section
          className="what-is-this__section"
          aria-labelledby="me-us-world-title"
        >
          <div className="shell">
            <div className="what-is-this__section-heading">
              <p className="eyebrow">The movement</p>
              <h2 id="me-us-world-title">It starts with you. Then it grows.</h2>
            </div>
            <div className="what-is-this__movement">
              <article>
                <span className="what-is-this__step">01</span>
                <h3>It starts with you.</h3>
                <p>
                  You notice something. Remember something. Choose something.
                  Practise something. Contribute something.
                </p>
              </article>
              <article>
                <span className="what-is-this__step">02</span>
                <h3>Then it becomes part of us.</h3>
                <p>
                  Your contribution does not have to remain isolated. It joins
                  the contributions of other people and becomes part of a
                  shared place.
                </p>
              </article>
              <article>
                <span className="what-is-this__step">03</span>
                <h3>Together, it can reach beyond the website.</h3>
                <p>
                  For every 50 approved contributions across You Matter, we
                  commit to funding the planting of one tree. This is a
                  commitment for contributions to work towards—not a claim that
                  trees have already been funded or planted.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="what-is-this__section what-is-this__why"
          aria-labelledby="why-not-about-you-title"
        >
          <div className="shell what-is-this__why-content">
            <p className="eyebrow">The meaning</p>
            <h2 id="why-not-about-you-title">But this isn’t about you.</h2>
            <p className="what-is-this__why-lead">Not because you don’t matter.</p>
            <p>
              You matter enormously. And so does everyone else. Flourishing is
              not only an individual project. A meaningful life can include
              connection, contribution, belonging, relationships, nature,
              community, and care for something beyond our immediate concerns.
            </p>
            <p>
              The phrase is an invitation to hold both things together: your
              life matters, and it is connected to other lives.
            </p>
          </div>
        </section>

        <section
          className="what-is-this__section shell"
          aria-labelledby="adventures-as-places-title"
        >
          <div className="what-is-this__section-heading">
            <p className="eyebrow">Small actions, shared places</p>
            <h2 id="adventures-as-places-title">
              One contribution becomes part of something larger.
            </h2>
          </div>
          <ul className="what-is-this__adventures">
            {adventures.map(({ href, title, description }) => (
              <li key={href}>
                <Link href={href}>
                  <span>{title}</span>
                  <span>{description}</span>
                  <span className="what-is-this__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="what-is-this__forest"
          aria-labelledby="forest-metaphor-title"
        >
          <div className="shell what-is-this__forest-content">
            <p className="eyebrow">A place to wander</p>
            <h2 id="forest-metaphor-title">Why a forest?</h2>
            <p>
              The forest is more than decoration. It gives you somewhere to
              wander, discover, and contribute. A garden, a tree, a shelter, and
              a trail are different ways of seeing individual actions become
              part of shared environments—rooted in a photographed, imperfect,
              living world.
            </p>
          </div>
        </section>

        <section className="what-is-this__invitation" aria-labelledby="try-title">
          <div className="shell">
            <p className="eyebrow">Your invitation</p>
            <h2 id="try-title">You can keep reading about it.</h2>
            <p>Or you can see what happens when you take part.</p>
            <nav aria-label="Go straight to the adventures">
              {adventures.map(({ href, title }) => (
                <Link className="button secondary" href={href} key={href}>
                  {title}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
