"use client";

import { CONTRIBUTIONS_PER_TREE } from "../lib/impact";
import { useImpact } from "../lib/use-impact";

export default function ImpactBarometer() {
  const { impact, unavailable } = useImpact();

  return (
    <section className="approved-impact" aria-labelledby="home-impact-title">
      <div
        className="approved-impact__photo"
        role="img"
        aria-label="A quiet woodland clearing in late afternoon light"
      />
      <div className="approved-impact__content">
        <h2 id="home-impact-title">Your small action becomes<br />part of something bigger.</h2>
        <p className="approved-impact__intro">
          Every gratitude, kindness and strengths contribution joins what other people have created here.
        </p>
        {!impact ? (
          <p className="approved-impact__status" role="status">
            {unavailable
              ? "Our shared total is temporarily unavailable."
              : "Gathering what we’ve shared…"}
          </p>
        ) : (
          <>
            <div className="approved-impact__numbers">
              <p>
                <strong>
                  {impact.totalApprovedContributions === 0
                    ? "We’re just getting started."
                    : impact.totalApprovedContributions.toLocaleString("en")}
                </strong>
                {impact.totalApprovedContributions > 0 && (
                  <span>contributions<br />together</span>
                )}
              </p>
              <p>
                <strong>{impact.towardNextTree} / {impact.contributionsPerTree}</strong>
                <span>towards our<br />next tree</span>
              </p>
            </div>
            <progress
              max={impact.contributionsPerTree}
              value={impact.towardNextTree}
              aria-label={`${impact.towardNextTree} of ${impact.contributionsPerTree} eligible contributions towards our next tree`}
            />
          </>
        )}
        <p className="approved-impact__commitment">
          For every {CONTRIBUTIONS_PER_TREE} eligible contributions, You Matter funds the planting of a tree.
        </p>
        <p className="approved-impact__model">You → Us → World</p>
      </div>
    </section>
  );
}
