"use client";
import { useEffect, useState } from "react";
import type { ImpactSummary } from "./impact";

export function useImpact() {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/impact", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Impact unavailable.");
        return await response.json() as ImpactSummary;
      })
      .then((data) => { if (active) setImpact(data); })
      .catch(() => { if (active) setUnavailable(true); });
    return () => { active = false; };
  }, []);
  return { impact, unavailable };
}
