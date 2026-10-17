"use client";

import Link from "next/link";
import { useImpact } from "../lib/use-impact";

export default function HomeForestStatus() {
  const { impact, unavailable } = useImpact();

  return (
    <aside className="approved-hero__forest-status" aria-label="Our Forest status">
      <p className="approved-hero__forest-eyebrow">Our Forest</p>
      <p className="approved-hero__forest-funded">10 trees funded</p>
      <p className="approved-hero__forest-progress" aria-live="polite">
        {impact
          ? `${impact.contributionsUntilNextTree} more contributions until the next tree`
          : unavailable
            ? "Our collective tally is temporarily unavailable."
            : "Gathering our collective tally…"}
      </p>
      <p className="approved-hero__forest-note">Not money. Participation.</p>
      <Link className="approved-hero__forest-link" href="/our-forest">
        See the forest <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
