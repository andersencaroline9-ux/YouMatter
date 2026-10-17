"use client";
import { CONTRIBUTIONS_PER_TREE } from "../lib/impact";
import type { ImpactSummary } from "../lib/impact";

type PhysicalImpactProps = {
  impact: ImpactSummary | null;
  unavailable: boolean;
};

export default function PhysicalImpact({
  impact,
  unavailable,
}: PhysicalImpactProps) {
  return <section className="impact-section">
    <div className="impact-copy">
      <p className="eyebrow">From digital seeds to real roots</p>
      <h2>Every {CONTRIBUTIONS_PER_TREE} approved contributions help fund one tree.</h2>
      <p>Each approved contribution from Gratitude, Kindness, Strengths or Dream becomes part of something larger. We commit to funding one tree for every {CONTRIBUTIONS_PER_TREE} eligible contributions.</p>
      <p>Contributions earn a commitment. Trees are counted as planted only after planting has been confirmed.</p>
    </div>
    <div className="impact-meter" aria-live="polite">
      {impact ? <>
        <p>{impact.totalApprovedContributions} approved {impact.totalApprovedContributions === 1 ? "contribution" : "contributions"} together</p>
        <p>{impact.treesActuallyPlanted} {impact.treesActuallyPlanted === 1 ? "tree planted" : "trees planted"}</p>
        <p>{impact.contributionsUntilNextTree} more {impact.contributionsUntilNextTree === 1 ? "contribution" : "contributions"} until the next tree we commit to fund</p>
      </> : <p role="status">{unavailable ? "Our collective tally is temporarily unavailable." : "Gathering our collective tally…"}</p>}
    </div>
  </section>;
}
