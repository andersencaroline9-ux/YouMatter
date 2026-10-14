"use client";
import { useImpact } from "../lib/use-impact";

export default function ImpactBarometer() {
  const { impact, unavailable } = useImpact();
  const tallies = impact ? [
    { value: impact.gratitudesShared, label: impact.gratitudesShared === 1 ? "gratitude shared" : "gratitudes shared" },
    { value: impact.kindnessesNoticed, label: impact.kindnessesNoticed === 1 ? "kindness noticed" : "kindnesses noticed" },
    { value: impact.strengthsRecognised, label: impact.strengthsRecognised === 1 ? "strength recognised" : "strengths recognised" },
    { value: impact.totalApprovedContributions, label: impact.totalApprovedContributions === 1 ? "contribution" : "contributions" },
    { value: impact.treesActuallyPlanted, label: impact.treesActuallyPlanted === 1 ? "tree planted" : "trees planted" },
  ].filter(({ value }) => value > 0) : [];
  const nextTree = impact?.treesEarned === 0 ? "first" : "next";
  return <section className="together-impact" aria-labelledby="together-impact-title">
    <div className="together-impact__inner">
      <h2 id="together-impact-title">Together, so far</h2>
      {!impact ? <p role="status">{unavailable ? "Our collective tally is temporarily unavailable." : "Gathering what we’ve shared…"}</p> : <>
        {impact.totalApprovedContributions === 0 && <p className="together-impact__starting">We’re just getting started.</p>}
        {tallies.length > 0 && <dl className="together-impact__tallies">
          {tallies.map(({ value, label }) => <div key={label}>
            <dt>{label}</dt><dd>{value.toLocaleString("en")}</dd>
          </div>)}
        </dl>}
        <div className="together-impact__next">
          <p>{impact.contributionsUntilNextTree}{impact.totalApprovedContributions > 0 ? " more" : ""} {impact.contributionsUntilNextTree === 1 ? "contribution" : "contributions"} and together<br className="together-impact__line-break" /> we’ll fund our {nextTree} tree.</p>
        </div>
        <progress className="together-impact__progress" max={impact.contributionsPerTree} value={impact.towardNextTree} aria-label={`Contributions towards our ${nextTree} tree`} />
        <p className="together-impact__progress-label">{impact.towardNextTree} / {impact.contributionsPerTree}</p>
        {impact.treesFunded > impact.treesActuallyPlanted && <p className="together-impact__funded">
          {impact.treesFunded} {impact.treesFunded === 1 ? "tree funded" : "trees funded"} in total; planting is recorded separately.
        </p>}
      </>}
    </div>
  </section>;
}
