export type GratitudeCount = {
  submissionId: string | null;
  status: string;
  count: number;
  validMessageCount: number;
};

export function countEligibleGratitudeGroups(
  rows: readonly GratitudeCount[]
) {
  const groups = new Map<
    string,
    { total: number; approved: number; validApproved: number }
  >();
  for (const row of rows) {
    if (row.submissionId === null) continue;
    const group = groups.get(row.submissionId) ?? {
      total: 0,
      approved: 0,
      validApproved: 0,
    };
    group.total += row.count;
    if (row.status === "approved") {
      group.approved += row.count;
      group.validApproved += row.validMessageCount;
    }
    groups.set(row.submissionId, group);
  }
  return [...groups.values()].filter(
    (group) =>
      group.total === 3 && group.approved === 3 && group.validApproved === 3
  ).length;
}
