import Link from "next/link";
import SiteHeader from "../components/site-header";
import ImpactBarometer from "../components/impact-barometer";
import "./home-approved.css";

const adventures = [
  {
    title: "Gratitude Garden",
    href: "/gratitude",
    image: "gratitude",
    description: <>Plant three things you’re<br />grateful for.</>,
  },
  {
    title: "Built From Kindness",
    href: "/kindness",
    image: "kindness",
    description: <>Add a kindness<br />to the tree.</>,
  },
  {
    title: "What Do You Bring?",
    href: "/strengths",
    image: "strengths",
    description: <>Recognise three<br />strengths you bring.</>,
  },
  {
    title: "30 Days in Nature",
    href: "/live-adventure",
    image: "nature",
    description: <>Join the next<br />live adventure.</>,
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader home />
      <main className="approved-home">
        <section className="approved-hero" aria-labelledby="home-title">
          <div className="approved-hero__content">
            <h1 id="home-title">You Matter.</h1>
            <p>You matter. We matter. What we do matters.</p>
            <a href="#adventures">Explore the adventures <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="approved-why" aria-labelledby="home-why-title">
          <div className="approved-why__copy">
            <h2 id="home-why-title">What if a few small things<br />{" "}could make life feel a little better?</h2>
            <p className="approved-why__ideas">Gratitude. Kindness. Strengths. Connection. Nature. Meaning.</p>
            <p>Positive psychology has discovered surprisingly simple things that can support how we live.</p>
            <p>Here, you don’t just read about them. You try them.</p>
          </div>
          <div className="approved-why__photo" role="img" aria-label="A sunlit path through woodland" />
        </section>

        <section className="approved-adventures" id="adventures" aria-labelledby="home-adventures-title">
          <div className="approved-adventures__heading">
            <h2 id="home-adventures-title">Choose an adventure</h2>
            <Link href="#adventures">Explore all adventures <span aria-hidden="true">→</span></Link>
          </div>
          <div className="approved-adventures__grid">
            {adventures.map((adventure) => (
              <article className="approved-adventure" key={adventure.href}>
                <Link className="approved-adventure__link" href={adventure.href}>
                  <span
                    className={`approved-adventure__photo approved-adventure__photo--${adventure.image}`}
                    aria-hidden="true"
                  />
                  <span className="approved-adventure__title">{adventure.title}</span>
                  <span className="approved-adventure__description">{adventure.description}</span>
                  <span className="approved-adventure__arrow" aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <ImpactBarometer />

        <footer className="approved-closing" aria-label="Our shared purpose">
          <p>You matter. We matter. What we do matters.</p>
        </footer>
      </main>
    </>
  );
}
