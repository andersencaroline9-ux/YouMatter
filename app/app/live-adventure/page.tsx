import {
  Eye,
  Leaf,
  MessageCircle,
  Sun,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import LiveAdventureWaitingList from "./waiting-list";
import "./live-adventure.css";

const connections = [
  {
    title: "TO NATURE",
    description: "Step outside and reconnect with the natural world.",
    Icon: Leaf,
  },
  {
    title: "TO YOURSELF",
    description: "Notice what you see, hear and feel.",
    Icon: Eye,
  },
  {
    title: "TO OTHERS",
    description: "Share your experience with a small, supportive group.",
    Icon: UsersRound,
  },
  {
    title: "TO SOMETHING LARGER",
    description: "Explore the possibility of feeling part of something beyond yourself.",
    Icon: Sun,
  },
];

const dailySteps = [
  {
    title: "Go outside",
    description:
      "Spend at least 30 minutes in nature each day, on your own and without technology or other distractions such as scrolling, podcasts or work.",
    note: "Your phone can come with you if you’re using it as a camera.",
  },
  {
    title: "Notice",
    description:
      "Pay attention to what catches your eye, what you hear and what you feel.",
    note: "There’s nothing you need to achieve.",
  },
  {
    title: "Bring it back",
    description:
      "Share one photograph, observation or reflection with your group each day.",
    note:
      "Daily sharing is part of the experience. The photograph is not the activity; paying attention is.",
  },
  {
    title: "Connect",
    description:
      "See what the other nine people noticed in their corner of the world.",
    note:
      "Respond, reflect and become part of a small community sharing this experience with you.",
  },
];

export default function LiveAdventurePage() {
  return (
    <>
      <SiteHeader />
      <main className="reconnect-page">
        <section className="reconnect-hero" aria-labelledby="reconnect-title">
          <div className="reconnect-hero-copy">
            <p className="reconnect-eyebrow">
              A 30-DAY NATURE &amp; CONNECTION EXPERIENCE
            </p>
            <h1 id="reconnect-title">RECONNECT</h1>
            <p className="reconnect-subtitle">30 DAYS IN NATURE</p>
            <p className="reconnect-promise">
              Go outside alone. Come back with something to share.
            </p>
            <p className="reconnect-description">
              For 30 days, spend 30 minutes a day in nature on your own. Then
              bring something you noticed back to a small group of 10 people
              doing the same in their own corner of the world.
            </p>

            <p className="reconnect-facts">
              <strong>10 people</strong>
              <span aria-hidden="true">·</span>
              <strong>30 days</strong>
              <span aria-hidden="true">·</span>
              <strong>30 minutes a day</strong>
              <span aria-hidden="true">·</span>
              <strong>$44</strong>
            </p>
            <p className="reconnect-eligibility">
              Adults 18+ <span aria-hidden="true">·</span> Online{" "}
              <span aria-hidden="true">·</span> Participate wherever you live
            </p>
            <a className="reconnect-hero-cta" href="#reconnect-waitlist">
              Join the waiting list <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="reconnect-hero-image">
            <Image
              src="/forest-live-trailhead-temporary.jpg"
              alt="A quiet path winding through a sunlit forest."
              fill
              priority
              sizes="(max-width: 820px) 100vw, 49vw"
            />
            <div className="reconnect-people-mark" aria-label="A small community of 10 people">
              <strong>10</strong>
              <span>people</span>
              <small>a small community</small>
            </div>

            <div className="reconnect-image-offer">
              <ul className="reconnect-offer-facts" aria-label="What the experience includes">
                <li>
                  <MessageCircle aria-hidden="true" size={23} strokeWidth={1.5} />
                  <strong>Private WhatsApp</strong>
                  <span>community</span>
                </li>
                <li>
                  <UsersRound aria-hidden="true" size={23} strokeWidth={1.5} />
                  <strong>Opening gathering</strong>
                  <span>online</span>
                </li>
                <li>
                  <Sun aria-hidden="true" size={23} strokeWidth={1.5} />
                  <strong>Daily prompts</strong>
                  <span>throughout the month</span>
                </li>
                <li>
                  <span className="reconnect-screen-icon" aria-hidden="true">
                    <UsersRound size={23} strokeWidth={1.5} />
                  </span>
                  <strong>Closing gathering</strong>
                  <span>online</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="reconnect-connections-section"
          aria-labelledby="reconnect-connections-title"
        >
          <div className="reconnect-connections-inner">
            <div className="reconnect-connections-heading">
              <p className="reconnect-eyebrow">The experience</p>
              <h2 id="reconnect-connections-title">Four ways to reconnect.</h2>
            </div>
            <ul className="reconnect-connections" aria-label="Ways to reconnect">
              {connections.map(({ title, description, Icon }) => (
                <li key={title}>
                  <span className="reconnect-connection-icon" aria-hidden="true">
                    <Icon size={25} strokeWidth={1.6} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="reconnect-how-section" aria-labelledby="reconnect-how-title">
          <div className="reconnect-how">
            <p className="reconnect-eyebrow">Your daily rhythm</p>
            <h2 id="reconnect-how-title">How it works</h2>
            <ol>
              {dailySteps.map(({ title, description, note }, index) => (
                <li key={title}>
                  <span className={`reconnect-step-number reconnect-step-number--${index + 1}`}>
                    {index + 1}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p className="reconnect-step-note">{note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="reconnect-section reconnect-small-group"
          aria-labelledby="reconnect-small-group-title"
        >
          <div className="reconnect-section-heading">
            <p className="reconnect-eyebrow">Small by design</p>
            <h2 id="reconnect-small-group-title">Why only 10 people?</h2>
          </div>
          <div className="reconnect-section-copy">
            <p>
              Because this isn’t meant to feel like social media. Over 30 days,
              you can begin to recognise the people you’re sharing the
              experience with: where they go, what catches their attention, the
              tree somebody keeps returning to, the beach another person walks
              along, or the tiny things someone else notices.
            </p>
            <p className="reconnect-pull-quote">
              You’re not joining an audience. You’re joining a small group.
            </p>
            <p>
              Your daily contribution helps create the experience for everyone
              else. Your time in nature is yours. The experience around it is
              shared.
            </p>
          </div>
        </section>

        <section
          className="reconnect-value"
          aria-labelledby="reconnect-value-title"
        >
          <div className="reconnect-section reconnect-value-inner">
            <div className="reconnect-section-heading">
              <p className="reconnect-eyebrow">The experience around the practice</p>
              <h2 id="reconnect-value-title">What the pilot includes</h2>
              <p>
                Nature is free. The $44 pilot is for the shared structure and
                support around making time for it.
              </p>
            </div>
            <ul className="reconnect-inclusions">
              <li>A clear 30-day rhythm and daily prompts from Caroline.</li>
              <li>A deliberately small, private WhatsApp community.</li>
              <li>An opening and a closing online gathering.</li>
              <li>Facilitation and gentle support throughout the month.</li>
              <li>
                A daily practice done individually, then shared with the
                group—and seeing nature through nine other people’s experiences.
              </li>
            </ul>
          </div>
        </section>

        <section
          className="reconnect-section reconnect-possibility"
          aria-labelledby="reconnect-possibility-title"
        >
          <div className="reconnect-section-heading">
            <p className="reconnect-eyebrow">An open question</p>
            <h2 id="reconnect-possibility-title">What might 30 days change?</h2>
          </div>
          <div className="reconnect-section-copy">
            <p>
              Perhaps you notice more. Perhaps going outside becomes something
              you look forward to. Perhaps seeing what somebody else notices
              changes what you notice yourself.
            </p>
            <p>
              Perhaps you feel more connected to nature, other people or
              yourself. Everyone’s experience is different. That’s what we’re
              going to explore.
            </p>
          </div>
        </section>

        <section
          className="reconnect-evidence"
          aria-labelledby="reconnect-evidence-title"
        >
          <div className="reconnect-section reconnect-evidence-inner">
            <div>
              <p className="reconnect-eyebrow">The thinking behind it</p>
              <h2 id="reconnect-evidence-title">Evidence-informed, not a promise.</h2>
            </div>
            <div>
              <p>
                RECONNECT is partly inspired by Hamann and Ivtzan’s research
                exploring a daily 30-minute nature practice over 30 days. This
                experience is not a replication of that study, and it does not
                promise the same outcomes.
              </p>
              <p>
                You Matter adds a deliberate community and connection
                component: participants practise individually, then share what
                they noticed with one another. Research on nature connection
                and wellbeing is evolving; people’s experiences vary, and this
                is not therapy or medical treatment.
              </p>
              <ul className="reconnect-sources" aria-label="Further reading">
                <li>
                  <a
                    href="https://ojs-dev.mruni.eu/ojs/social-inquiry-into-well-being-a/article/view/4444"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hamann &amp; Ivtzan (2016), nature experience and wellbeing
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00976/full"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Capaldi, Dopko &amp; Zelenski (2014), nature connectedness
                  </a>
                </li>
                <li>
                  <a
                    href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0149777"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Richardson et al. (2016), 30 Days Wild
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className="reconnect-section reconnect-faq"
          aria-labelledby="reconnect-faq-title"
        >
          <div className="reconnect-section-heading">
            <p className="reconnect-eyebrow">A gentle practice</p>
            <h2 id="reconnect-faq-title">A few things you might be wondering.</h2>
          </div>
          <div className="reconnect-faq-answer">
            <h3>What if I miss a day?</h3>
            <p>Then you miss a day. Come back tomorrow.</p>
            <p>
              The intention is daily participation, but life happens. Missing
              a day doesn’t erase the days you’ve already done, and it doesn’t
              remove you from the group. This isn’t 75 Hard: Woodland Edition.
            </p>
          </div>
        </section>

        <section
          className="reconnect-signup"
          id="reconnect-waitlist"
          aria-labelledby="reconnect-waitlist-title"
        >
          <div className="reconnect-section reconnect-signup-inner">
            <div className="reconnect-signup-copy">
              <p className="reconnect-eyebrow">A small group, wherever you are</p>
              <h2 id="reconnect-waitlist-title">Make space to reconnect.</h2>
              <p>
                Join the interest list for the next RECONNECT group. It’s a
                first step, not a commitment; no payment is taken when you
                register.
              </p>
              <p>
                Caroline will contact people in order as the 10-person group
                takes shape. Entries 11–20 are held on the reserve list.
              </p>
              <p className="reconnect-signup-detail">
                $44 pilot price <span aria-hidden="true">·</span> Adults 18+{" "}
                <span aria-hidden="true">·</span> Online
              </p>
            </div>
            <LiveAdventureWaitingList />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
