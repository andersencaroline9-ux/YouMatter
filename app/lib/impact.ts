import { isCharacterStrengthSelection, parseStoredCharacterStrengths } from "./character-strengths";
export { countEligibleGratitudeGroups } from "./gratitude-eligibility";

export const CONTRIBUTIONS_PER_TREE = 50;
type StrengthsCount = { strength: string; count: number };

/** Rows are already approval-filtered and grouped by their stored selection. */
export function countEligibleStrengthsGroups(rows: readonly StrengthsCount[]) {
  return rows.reduce((total, row) =>
    total + (isCharacterStrengthSelection(parseStoredCharacterStrengths(row.strength)) ? row.count : 0), 0);
}

export function calculateImpact(
  gratitudeContributions: number, kindnessContributions: number, strengthsContributions: number,
  dreamContributions: number, treesFunded: number, treesActuallyPlanted: number,
) {
  const totalApprovedContributions = gratitudeContributions + kindnessContributions
    + strengthsContributions + dreamContributions;
  const towardNextTree = totalApprovedContributions % CONTRIBUTIONS_PER_TREE;
  return {
    gratitudesShared: gratitudeContributions,
    kindnessesNoticed: kindnessContributions,
    strengthsRecognised: strengthsContributions,
    dreamsShared: dreamContributions,
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
