import Link from "next/link";
import SiteHeader from "../components/site-header";
import ImpactBarometer from "../components/impact-barometer";
import "./home-approved.css";

const adventures = [
  {
    title: "Gratitude Garden",
    href: "/gratitude",
    image: "gratitude",
    tagline: "Notice what’s good.",
    description: "Plant three things you’re grateful for.",
  },
  {
    title: "The Kindness Tree",
    href: "/kindness",
    image: "kindness",
    tagline: "Notice how kindness moves between us.",
    description: "Share a kindness you’ve given, received or witnessed.",
  },
  {
    title: "The Strengths We Bring",
    href: "/strengths",
    image: "strengths",
    tagline: "Recognise what you bring.",
    description: "Choose three strengths you recognise in yourself.",
  },
  {
    title: "Give Yourself Permission to Dream",
    href: "/dream",
    image: "dream",
    tagline: "Before you ask whether it’s possible, ask what you want.",
    description: "Put one dream into words and add it to the River of Dreams.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader home />
      <main className="approved-home">
        <section className="approved-hero" aria-labelledby="home-title">
          <div className="approved-hero__content">
            <h1 id="home-title">YOU MATTER.</h1>
            <p>Don't you waste it.</p>
            <p className="approved-hero__tagline">Small adventures inspired by the science of living well.</p>
            <p className="approved-hero__description">
              Try gratitude, kindness, strengths, dreams and nature — and add your experience to something we’re creating together.
            </p>
            <a href="#adventures">Choose an adventure <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="approved-why" aria-labelledby="home-why-title">
          <div className="approved-why__copy">
            <h2 id="home-why-title">What if living well is something we can practise?</h2>
            <p>Positive psychology studies what helps people and communities flourish.</p>
            <p>Here, you don’t just read about the research. You try it.</p>
            <p className="approved-why__sequence">TRY SOMETHING → SHARE SOMETHING → BECOME PART OF SOMETHING</p>
            <p className="approved-why__aside"><em>Some adventures take two minutes. Others last 30 days.</em></p>
          </div>
          <div className="approved-why__photo" role="img" aria-label="A sunlit path through woodland" />
        </section>

        <section className="approved-adventures" id="adventures" aria-labelledby="home-adventures-title">
          <div className="approved-adventures__heading">
            <h2 id="home-adventures-title">Choose an adventure</h2>
            <p>Small interactive experiences inspired by the science of living well.</p>
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
                  <span className="approved-adventure__tagline"><em>{adventure.tagline}</em></span>
                  <span className="approved-adventure__description">{adventure.description}</span>
                  <span className="approved-adventure__arrow" aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
          <h2 className="approved-reconnect__heading">Want to go further?</h2>
          <p className="approved-reconnect__supporting">
            A 30-day guided experience combining nature, reflection and connection.
          </p>
          <article className="approved-reconnect">
            <Link
              className="approved-reconnect__image"
              href="/live-adventure"
              aria-label="Explore RECONNECT"
            />
            <div className="approved-reconnect__content">
              <h3>RECONNECT</h3>
              <p className="approved-reconnect__subtitle">30 Days in Nature</p>
              <p className="approved-reconnect__facts">
                10 PEOPLE <span aria-hidden="true">·</span> 30 DAYS{" "}
                <span aria-hidden="true">·</span> 30 MINUTES A DAY{" "}
                <span aria-hidden="true">·</span> $44
              </p>
              <p className="approved-reconnect__description">
                Go outside alone. Come back with something to share.
              </p>
              <Link className="approved-reconnect__link" href="/live-adventure">
                Explore RECONNECT <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </section>

        <ImpactBarometer />

        <footer className="approved-closing" aria-label="Our shared purpose">
          <p>You matter. We matter. What we do matters.</p>
        </footer>
      </main>
    </>
  );
}
