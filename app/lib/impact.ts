import { isCharacterStrengthSelection, parseStoredCharacterStrengths } from "./character-strengths";

export const CONTRIBUTIONS_PER_TREE = 50;
type GratitudeCount = { submissionId: string | null; status: string; count: number };
type StrengthsCount = { strength: string; count: number };

/** Complete approved three-message groups only; mixed/legacy rows stay intact. */
export function countEligibleGratitudeGroups(rows: readonly GratitudeCount[]) {
  const groups = new Map<string, { total: number; approved: number }>();
  for (const row of rows) {
    if (row.submissionId === null) continue;
    const group = groups.get(row.submissionId) ?? { total: 0, approved: 0 };
    group.total += row.count;
    if (row.status === "approved") group.approved += row.count;
    groups.set(row.submissionId, group);
  }
  return [...groups.values()].filter((group) => group.total === 3 && group.approved === 3).length;
}

/** Rows are already approval-filtered and grouped by their stored selection. */
export function countEligibleStrengthsGroups(rows: readonly StrengthsCount[]) {
  return rows.reduce((total, row) =>
    total + (isCharacterStrengthSelection(parseStoredCharacterStrengths(row.strength)) ? row.count : 0), 0);
}

export function calculateImpact(
  gratitudeContributions: number, kindnessContributions: number, strengthsContributions: number,
  treesFunded: number, treesActuallyPlanted: number,
) {
  const totalApprovedContributions = gratitudeContributions + kindnessContributions + strengthsContributions;
  const towardNextTree = totalApprovedContributions % CONTRIBUTIONS_PER_TREE;
  return {
    gratitudesShared: gratitudeContributions,
    kindnessesNoticed: kindnessContributions,
    strengthsRecognised: strengthsContributions,
    totalApprovedContributions,
    treesEarned: Math.floor(totalApprovedContributions / CONTRIBUTIONS_PER_TREE),
    treesFunded, treesActuallyPlanted, towardNextTree,
    contributionsUntilNextTree: CONTRIBUTIONS_PER_TREE - towardNextTree,
    contributionsPerTree: CONTRIBUTIONS_PER_TREE,
  };
}
export type ImpactSummary = ReturnType<typeof calculateImpact>;

export function isTreeAccounting(value: unknown): value is { treesFunded: number; treesPlanted: number } {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Number.isSafeInteger(record.treesFunded) && Number.isSafeInteger(record.treesPlanted)
    && (record.treesFunded as number) >= 0 && (record.treesPlanted as number) >= 0
    && (record.treesPlanted as number) <= (record.treesFunded as number);
}
