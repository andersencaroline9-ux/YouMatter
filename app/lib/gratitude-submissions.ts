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

export type GratitudeSubmission = Omit<GratitudeRow, "message"> & {
  messages: string[];
};

export function groupGratitudeRows(rows: GratitudeRow[]): GratitudeSubmission[] {
  const groups = new Map<string, GratitudeRow[]>();

  for (const row of rows) {
    const key = row.submissionId ?? `legacy-${row.id}`;
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }

  return [...groups.entries()]
    .map(([key, group]) => {
      const ordered = group.toSorted((left, right) => left.id - right.id);
      const first = ordered[0];
      return {
        id: Math.min(...ordered.map((row) => row.id)),
        submissionId: key.startsWith("legacy-") ? null : key,
        messages: ordered.map((row) => row.message),
        displayName: first.displayName,
        countryCode: first.countryCode,
        status: first.status,
        createdAt: first.createdAt,
        approvedAt: first.approvedAt,
      };
    })
    .toSorted(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) || right.id - left.id
    );
}
