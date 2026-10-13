export type GratitudeRow = {
  id: number;
  message: string;
  displayName: string;
  countryCode: string | null;
  submissionId: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt: string | null;
};

export type GratitudeStatus = GratitudeRow["status"] | "mixed";

export type GratitudeSubmission = Omit<GratitudeRow, "message" | "status"> & {
  messages: string[];
  status: GratitudeStatus;
};

export function groupGratitudeRows(rows: GratitudeRow[]): GratitudeSubmission[] {
  const groups = new Map<string, GratitudeRow[]>();

  for (const row of rows) {
    const key = row.submissionId ?? `legacy-${row.id}`;
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }

  return [...groups.values()]
    .map((group) => {
      const ordered = [...group].sort((left, right) => left.id - right.id);
      const first = ordered[0];
      const statuses = new Set(ordered.map((row) => row.status));
      return {
        id: Math.min(...ordered.map((row) => row.id)),
        submissionId: first.submissionId,
        messages: ordered.map((row) => row.message),
        displayName: first.displayName,
        countryCode: first.countryCode,
        status: statuses.size === 1 ? first.status : "mixed",
        createdAt: first.createdAt,
        approvedAt: first.approvedAt,
      };
    })
    .sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) || right.id - left.id
    );
}

export type GratitudeStatusCount = {
  submissionId: string | null;
  status: GratitudeRow["status"];
  count: number;
};

export function countApprovedGratitudeContributions(
  rows: GratitudeStatusCount[]
) {
  let legacyApprovedCount = 0;
  const grouped = new Map<
    string,
    { total: number; approved: number }
  >();

  for (const row of rows) {
    if (row.submissionId === null) {
      if (row.status === "approved") legacyApprovedCount += row.count;
      continue;
    }

    const counts = grouped.get(row.submissionId) ?? {
      total: 0,
      approved: 0,
    };
    counts.total += row.count;
    if (row.status === "approved") counts.approved += row.count;
    grouped.set(row.submissionId, counts);
  }

  return (
    legacyApprovedCount +
    [...grouped.values()].filter(
      (group) => group.total === 3 && group.approved === 3
    ).length
  );
}
