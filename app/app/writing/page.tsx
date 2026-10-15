import type { Metadata } from "next";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import WritingCollection from "../../components/writing-collection";
import "./writing.css";

export const metadata: Metadata = {
  title: "Writing — You Matter",
  description:
    "Stories, thoughts and pieces about being human: connection, gratitude, meaning, nature, work and love.",
};

export default function WritingPage() {
  return (
    <>
      <SiteHeader />
      <main className="writing-page writing-index-page">
        <section className="writing-hero" aria-labelledby="writing-title">
          <div className="writing-hero__content">
            <h1 id="writing-title">Writing</h1>
            <p className="writing-hero__lead">
              Stories, thoughts and pieces about being human.
            </p>
            <p className="writing-hero__copy">
              Connection, gratitude, meaning, nature, work, love — and the
              strange business of trying to live a good life.
            </p>
          </div>
        </section>

        <div className="writing-index-content">
          <WritingCollection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
