import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./about.css";

export const metadata: Metadata = {
  title: "About Caroline — You Matter",
  description:
    "The questions and experiences that led Caroline to create You Matter.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <section className="about-introduction" aria-labelledby="about-title">
          <div className="about-introduction__portrait">
            <Image
              src="/caroline-with-dog.png"
              alt="Caroline sitting beside her dog outdoors among rocks and trees."
              width={1276}
              height={666}
              priority
              unoptimized
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>
          <div className="about-introduction__copy">
            <h1 id="about-title">Hi. I’m Caroline.</h1>
            <p>For fourteen years, I worked in banking.</p>
            <p>
              I had a good job. A good life. A family I love. And I live on a
              beautiful little island in the Baltic Sea.
            </p>
            <p>And somewhere along the way, I started wondering:</p>
            <p className="about-introduction__question">
              Is this really how I want to spend my life?
            </p>
            <p>Not because everything was terrible.</p>
            <p>It wasn’t.</p>
            <p>
              But I had become very good at doing the things I was supposed to
              do, while feeling increasingly disconnected from some of the
              things that made me feel most alive.
            </p>
            <p className="about-introduction__turn">
              So I quit. And started again.
            </p>
          </div>
        </section>

        <section
          className="about-story about-story--questions"
          aria-labelledby="about-questions-title"
        >
          <div className="about-story__copy">
            <h2 id="about-questions-title">
              I didn’t quit because I had a brilliant plan.
            </h2>
            <p>I really didn’t.</p>
            <p>
              I wanted more time to write. More time outside. More time with my
              family. More space to learn and create.
            </p>
            <p>And I had questions.</p>
            <div className="about-questions">
              <p>What actually makes a good life?</p>
              <p>
                Why do some things make us feel alive while others slowly drain
                us?
              </p>
              <p>What makes life meaningful?</p>
              <p>What helps us feel that we matter?</p>
              <p>
                And what happens when we reconnect — with ourselves, with other
                people, with nature, and perhaps with something larger than
                ourselves?
              </p>
            </div>
            <p>
              Those questions eventually led me to study for a Master’s in
              Applied Positive Psychology.
            </p>
            <p>And they led me here.</p>
          </div>
          <div
            className="about-story__photo about-story__photo--path"
            role="img"
            aria-label="A sunlit woodland path leading deeper into the forest."
          />
        </section>

        <section
          className="about-story about-story--why"
          aria-labelledby="about-why-title"
        >
          <div
            className="about-story__photo about-story__photo--garden"
            role="img"
            aria-label="A quiet woodland clearing in warm light."
          />
          <div className="about-story__copy">
            <h2 id="about-why-title">Why You Matter?</h2>
            <p>
              One of the things I love about positive psychology is that some of
              its ideas are surprisingly ordinary.
            </p>
            <p className="about-ordinary-ideas">
              Gratitude.
              <br />
              Kindness.
              <br />
              Strengths.
              <br />
              Connection.
              <br />
              Nature.
              <br />
              Meaning.
              <br />
              Hope.
            </p>
            <p>
              Things humans have been doing, noticing and wondering about for a
              very long time.
            </p>
            <p>
              But now we also have decades of research asking what these things
              actually have to do with how we live and how we feel.
            </p>
            <p>
              I didn’t want to build another website where I simply told you
              about that research.
            </p>
            <p className="about-story__emphasis">
              I wanted somewhere we could try it.
            </p>
          </div>
        </section>

        <section
          className="about-collective"
          aria-labelledby="about-collective-title"
        >
          <div className="about-collective__copy">
            <h2 id="about-collective-title">
              You matter. We matter.
              <br />
              What we do matters.
            </h2>
            <p>Every experience here starts with one person.</p>
            <p>You notice something you’re grateful for.</p>
            <p>You recognise a kindness.</p>
            <p>You think about what you bring.</p>
            <p>You spend some time outside.</p>
            <p>Something small happens in you.</p>
            <p>But then you add your experience to those of other people.</p>
            <p>And suddenly it isn’t only yours anymore.</p>
            <p>It becomes part of us.</p>
            <p>
              And when enough of those tiny contributions come together, I want
              them to reach beyond this website and do something in the world
              too.
            </p>
            <p>
              That’s why every 50 eligible approved contributions funds the
              planting of a tree.
            </p>
          </div>
          <div className="about-collective__moments" aria-label="You, us, world">
            <figure>
              <div
                className="about-collective__image about-collective__image--you"
                aria-hidden="true"
              />
              <figcaption>
                <strong>YOU</strong>
                <span>A small action.</span>
              </figcaption>
            </figure>
            <span className="about-collective__arrow" aria-hidden="true">
              →
            </span>
            <figure>
              <div
                className="about-collective__image about-collective__image--us"
                aria-hidden="true"
              />
              <figcaption>
                <strong>US</strong>
                <span>A growing community.</span>
              </figcaption>
            </figure>
            <span className="about-collective__arrow" aria-hidden="true">
              →
            </span>
            <figure>
              <div
                className="about-collective__image about-collective__image--world"
                aria-hidden="true"
              />
              <figcaption>
                <strong>WORLD</strong>
                <span>Something changes.</span>
              </figcaption>
            </figure>
          </div>
          <p className="about-collective__closing">
            That’s the idea at the heart of You Matter.
            <br />
            Not that everything is about you.
            <br />
            But that you are part of everything.
          </p>
        </section>

        <section
          className="about-story about-story--still-learning"
          aria-labelledby="about-learning-title"
        >
          <div
            className="about-story__photo about-story__photo--landscape"
            role="img"
            aria-label="A tree overlooking a sunlit landscape and the water."
          />
          <div className="about-story__copy">
            <h2 id="about-learning-title">I’m still figuring this out too.</h2>
            <p>I’m not here because I’ve mastered happiness.</p>
            <p>I haven’t.</p>
            <p>
              I’m a mum, a wife, a writer, a student, a person who sometimes has
              wonderful days and sometimes absolutely does not.
            </p>
            <p>I’m learning as I go.</p>
            <p>
              You Matter is partly what I’m learning through my Master’s, partly
              what I’ve learned from changing my own life, and partly an
              experiment:
            </p>
            <p className="about-story__question">
              What happens when we stop just reading about living well and
              actually give some of it a go?
            </p>
            <p>I’m glad you’re here.</p>
            <p className="about-signature">Caroline</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
