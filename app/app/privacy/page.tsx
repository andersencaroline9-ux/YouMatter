import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy at You Matter",
  description:
    "What You Matter collects, what stays in your browser, how long it is kept and who helps run the website.",
};

const email = "hello@thisisyoumatter.com";

function Email() {
  return <a href={`mailto:${email}`}>{email}</a>;
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="privacy-page">
        <div className="shell privacy-content">
          <header className="privacy-hero">
            <p className="eyebrow">Privacy at You Matter</p>
            <h1 className="serif">
              If we don’t need your information, we don’t collect it.
            </h1>
            <p>
              You Matter is built around sharing small pieces of human
              experience — gratitude, kindness, strengths, dreams and how
              we’re doing.
            </p>
            <p>
              Some of what you share is intended to become part of something we
              create together. Some stays private. And some information is
              needed simply to make the website work.
            </p>
            <p>This page explains the difference.</p>
          </header>

          <section aria-labelledby="privacy-short">
            <h2 id="privacy-short" className="serif">The short version</h2>
            <p>We don’t sell your personal information.</p>
            <p>We don’t use your visit to build an advertising profile.</p>
            <p>
              At launch, we don’t use advertising trackers or analytics
              cookies.
            </p>
            <p>
              We only ask for information where there is a reason for it, and
              we’ve tried to make it clear when something you share may become
              public.
            </p>
          </section>

          <section aria-labelledby="privacy-contribute">
            <h2 id="privacy-contribute" className="serif">
              When you contribute to You Matter
            </h2>
            <p>
              Some of our Adventures invite you to add something to a
              collective experience — for example, a gratitude, an act of
              kindness, your strengths, a dream or a check-in.
            </p>
            <p>
              When you submit a contribution, it is reviewed before it can
              appear publicly.
            </p>
            <p>
              Depending on the Adventure, the contribution itself and optional
              information such as a display name or country may be shown to
              other visitors.
            </p>
            <p>
              Please don’t include information you wouldn’t be comfortable
              sharing publicly, including sensitive personal information about
              yourself or somebody else.
            </p>
            <p>Submitting something doesn’t guarantee that it will be published.</p>
            <p>
              We process these contributions because we have a legitimate
              interest in operating the participatory You Matter experiences
              that you have chosen to take part in.
            </p>
          </section>

          <section aria-labelledby="privacy-stays">
            <h2 id="privacy-stays" className="serif">What stays with you</h2>
            <p>Not everything you do here is sent to us.</p>
            <p>
              Some Adventures include private reflection exercises that happen
              only in your browser. Where that’s the case, those reflections
              aren’t submitted to You Matter.
            </p>
            <p>
              For example, the private reflection that leads into a
              contribution to the River of Dreams stays with you. Only the
              final dream you choose to submit is sent to us.
            </p>
            <p>We think that distinction matters.</p>
          </section>

          <section aria-labelledby="privacy-identifier">
            <h2 id="privacy-identifier" className="serif">
              A small technical identifier
            </h2>
            <p>
              Some of our interactive experiences use a randomly generated
              visitor identifier so that the website can make the contribution
              system work properly.
            </p>
            <p>
              The identifier isn’t your name, email address or an advertising
              ID. The version stored with submissions is technically protected
              using hashing.
            </p>
            <p>The associated browser cookie lasts for up to 90 days.</p>
            <p>
              The Contact form also uses a short-lived technical cookie,
              lasting up to one hour, to help us prevent automated spam.
            </p>
            <p>
              We use this only for the operation and integrity of the
              contribution experiences, not for advertising or profiling.
            </p>
          </section>

          <section aria-labelledby="privacy-retention">
            <h2 id="privacy-retention" className="serif">
              How long contributions stay
            </h2>
            <p>
              Pending contributions are generally removed after 90 days if they
              haven’t been dealt with.
            </p>
            <p>Rejected contributions are deleted.</p>
            <p>
              Approved contributions may remain as part of the collective You
              Matter experience. If you have shared something publicly and later
              want us to consider removing it, contact us at <Email />.
            </p>
            <p>
              Our automated housekeeping happens when relevant parts of the
              service are used, rather than at an exact moment on a particular
              day. That’s why we say information is generally removed after the
              periods described here.
            </p>
          </section>

          <section aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className="serif">When you contact us</h2>
            <p>
              If you use the Contact form, we collect your email address, your
              message and your name if you choose to provide it.
            </p>
            <p>
              We use that information to read and respond to your enquiry and
              to manage our correspondence with you.
            </p>
            <p>
              Contact-form messages are generally removed from the website’s
              contact system within 12 months.
            </p>
            <p>
              If you email <Email /> directly, that email is forwarded to and
              handled through our Microsoft Outlook email service.
            </p>
            <p>
              We process correspondence because we have a legitimate interest in
              being able to receive and respond to messages about You Matter and
              We Matter.
            </p>
          </section>

          <section aria-labelledby="privacy-reconnect">
            <h2 id="privacy-reconnect" className="serif">
              If you’re interested in RECONNECT
            </h2>
            <p>
              If you express interest in RECONNECT, we collect your first name
              and email address so that we can contact you about the
              experience.
            </p>
            <p>Your RECONNECT details aren’t displayed publicly.</p>
            <p>
              They are generally removed from our website system within 12
              months.
            </p>
            <p>
              Where you ask us to contact you about joining a paid experience,
              we process the information so that we can take steps at your
              request before potentially entering into an agreement with you.
            </p>
          </section>

          <section aria-labelledby="privacy-youtube">
            <h2 id="privacy-youtube" className="serif">YouTube</h2>
            <p>There’s a YouTube video on our About page.</p>
            <p>
              We deliberately don’t load the YouTube player when you arrive on
              the page. The preview image is served by You Matter.
            </p>
            <p>
              If you choose to press Play, content is then loaded from YouTube
              using YouTube’s privacy-enhanced domain. At that point,
              information about your interaction may be processed by
              YouTube/Google under their own terms and privacy practices.
            </p>
            <p>You don’t need to play the video to use You Matter.</p>
          </section>

          <section aria-labelledby="privacy-services">
            <h2 id="privacy-services" className="serif">
              The services behind the website
            </h2>
            <p>
              Like almost every website, You Matter relies on other companies to
              provide some of its technical infrastructure.
            </p>
            <p>
              We use Cloudflare for parts of the website’s hosting, data storage
              and technical infrastructure.
            </p>
            <p>We use Microsoft for our business email.</p>
            <p>
              If you choose to play our embedded video, Google/YouTube provides
              that video content.
            </p>
            <p>
              These providers may process information on our behalf or, in some
              circumstances, under their own terms.
            </p>
            <p>
              We don’t give these companies your information so that they can
              advertise You Matter to you.
            </p>
          </section>

          <section aria-labelledby="privacy-links">
            <h2 id="privacy-links" className="serif">Other websites</h2>
            <p>You Matter sometimes links to other websites.</p>
            <p>
              For example, Our Forest links to Tree-Nation so that you can
              independently see the trees we’ve funded.
            </p>
            <p>
              Following an external link takes you away from You Matter. The
              privacy practices of that website then apply.
            </p>
          </section>

          <section aria-labelledby="privacy-rights">
            <h2 id="privacy-rights" className="serif">Your rights</h2>
            <p>
              Data-protection law gives you rights over your personal
              information. Depending on the circumstances, these can include the
              right to:
            </p>
            <ul>
              <li>ask what personal information we hold about you</li>
              <li>have inaccurate information corrected</li>
              <li>ask for information to be deleted</li>
              <li>ask us to restrict how information is used</li>
              <li>object to certain uses of your information</li>
              <li>receive applicable information in a portable form</li>
            </ul>
            <p>
              These rights aren’t absolute in every situation, but if you’d like
              to exercise one of them, contact us at:
            </p>
            <p>
              <Email />
            </p>
            <p>
              If you’re unhappy with how we’ve handled your personal
              information, we’d like you to contact us first so we have an
              opportunity to resolve it.
            </p>
            <p>
              You also have the right to complain to the Danish Data Protection
              Agency,{" "}
              <a
                href="https://www.datatilsynet.dk/"
                target="_blank"
                rel="noreferrer"
              >
                Datatilsynet
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="privacy-responsible">
            <h2 id="privacy-responsible" className="serif">
              Who is responsible for your information?
            </h2>
            <p>
              You Matter is a project of We Matter, a registered Danish
              business.
            </p>
            <p>
              We Matter is responsible for the personal information described on
              this page.
            </p>
            <p>
              Questions about your information, or want to ask us to remove
              something?
            </p>
            <p>
              <Email />
            </p>
          </section>

          <section className="privacy-closing" aria-label="Our principle">
            <p>
              Privacy policies have a tendency to become very long explanations
              that nobody reads.
            </p>
            <p>So the principle we try to follow is much simpler:</p>
            <p className="privacy-closing__quote serif">
              “If we don’t need your information, we don’t collect it.”
            </p>
            <p>
              And if something changes in how You Matter uses personal
              information, we’ll update this page.
            </p>
            <p className="privacy-updated">Last updated: October 2026</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
