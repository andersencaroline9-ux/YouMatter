import type { Metadata } from "next";
import "./kindness.css";
import AdventureShell from "../../components/adventure-shell";
import KindnessDiscovery from "../../components/kindness-discovery";
import KindnessPractice from "../../components/kindness-practice";
import ImpactBarometer from "../../components/impact-barometer";

export const metadata: Metadata = {
  title: "The Kindness Tree — You Matter",
};

export default function KindnessPage() {
  return (
    <AdventureShell
      title="The Kindness Tree"
      discovery={<KindnessDiscovery />}
      heroContent={
        <div className="kindness-hero-copy">
          <p>Kindness is happening all around us.</p>
          <p>
            Sometimes we’re the ones giving it. Sometimes we’re receiving it.
            And sometimes we’re lucky enough to witness it.
          </p>
          <p>
            This is a place to notice those moments — and share them with
            others.
          </p>
          <p>Once approved, every kindness shared becomes a leaf on our tree.</p>
        </div>
      }
      practiceBeforeWhy
      whyContent={
        <div className="kindness-explanation">
          <h2>Why kindness?</h2>
          <p>
            Kindness doesn’t only matter to the person receiving it.
          </p>
          <p>
            Research suggests that performing acts of kindness can benefit the
            wellbeing of the person giving them, too.
          </p>
          <p>
            Research across prosocial behaviour and wellbeing has generally
            found a positive relationship, although the effects are modest and
            vary across studies and different forms of wellbeing.
          </p>

          <h3>You don’t have to be the one doing it.</h3>
          <p>Research has also explored what happens when people observe kindness.</p>
          <p>
            One study comparing several kindness activities included acts of
            kindness towards friends, acts towards strangers and observing acts
            of kindness. Participants across the kindness activities reported
            increases in happiness, with no meaningful differences found
            between the activity groups.
          </p>
          <p>
            This is one reason The Kindness Tree includes kindness you have
            witnessed as well as kindness you have given or received.
          </p>
          <p>
            We’re not asking people to demonstrate how generous they are.
            We’re inviting them to pay attention to kindness already happening
            around them.
          </p>

          <h3>Why share it?</h3>
          <p>Kindness happens between us.</p>
          <p>
            When we share these experiences, we give other people another
            opportunity to notice them too.
          </p>
          <p>
            Research into responses to witnessing moral goodness sometimes uses
            the term “moral elevation” — an uplifting response that can be
            associated with motivation towards prosocial behaviour.
          </p>
          <p>One person’s experience can become something another person notices.</p>
          <p>That is the heart of this adventure.</p>

          <h3>Why a tree?</h3>
          <p>One leaf doesn’t make a tree.</p>
          <p>
            Each story represents an ordinary moment when someone gave,
            received or witnessed kindness.
          </p>
          <p>On its own, it might seem small.</p>
          <p>
            Together, these stories remind us how much happens between people
            every day.
          </p>
          <p>You Matter. We Matter. What we do matters.</p>

          <details className="sources kindness-sources">
            <summary>Curious about the research?</summary>
            <ul>
              <li>
                Curry, O. S., Rowland, L. A., Van Lissa, C. J., Zlotowitz, S.,
                McAlaney, J., &amp; Whitehouse, H. (2018). Happy to help? A
                systematic review and meta-analysis of the effects of
                performing acts of kindness on the well-being of the actor.
                <em> Journal of Experimental Social Psychology, 76</em>,
                320–329.{" "}
                <a
                  href="https://doi.org/10.1016/j.jesp.2018.02.014"
                  target="_blank"
                  rel="noreferrer"
                >
                  DOI ↗
                </a>
              </li>
              <li>
                Rowland, L., &amp; Curry, O. S. (2019). A range of kindness
                activities boost happiness. <em>The Journal of Social
                Psychology, 159</em>(3), 340–343.{" "}
                <a
                  href="https://doi.org/10.1080/00224545.2018.1469461"
                  target="_blank"
                  rel="noreferrer"
                >
                  DOI ↗
                </a>
              </li>
              <li>
                Hui, B. P. H., Ng, J. C. K., Berzaghi, E., Cunningham-Amos, L.
                A., &amp; Kogan, A. (2020). Rewards of kindness? A meta-analysis
                of the link between prosociality and well-being.{" "}
                <em>Psychological Bulletin, 146</em>(12), 1084–1116.{" "}
                <a
                  href="https://doi.org/10.1037/bul0000298"
                  target="_blank"
                  rel="noreferrer"
                >
                  DOI ↗
                </a>
              </li>
            </ul>
            <p>
              Research findings vary, and kindness is not a guaranteed route to
              feeling better. These studies help explain why noticing, giving
              and witnessing kindness are interesting areas of positive
              psychology research.
            </p>
          </details>
        </div>
      }
      impact={<ImpactBarometer />}
    >
      <KindnessPractice />
    </AdventureShell>
  );
}
