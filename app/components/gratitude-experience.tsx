"use client";

import type { ReactNode } from "react";
import GratitudePractice from "./gratitude-practice";
import PhysicalImpact from "./physical-impact";
import { useImpact } from "../lib/use-impact";

type GratitudeExperienceProps = {
  children: ReactNode;
};

export default function GratitudeExperience({
  children,
}: GratitudeExperienceProps) {
  const { impact, unavailable } = useImpact();

  return (
    <>
      <section
        className="gratitude-clearing__practice practice-section section"
        id="practice"
        aria-label="Gratitude practice and shared garden"
      >
        <div className="shell">
          <GratitudePractice
            impact={impact}
            impactUnavailable={unavailable}
          />
        </div>
      </section>
      {children}
      <PhysicalImpact impact={impact} unavailable={unavailable} />
    </>
  );
}
