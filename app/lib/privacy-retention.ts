type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
};

type D1DatabaseLike = {
  prepare(query: string): D1Statement;
};

function requireDatabase(database: D1DatabaseLike | undefined): D1DatabaseLike {
  if (!database) throw new Error("D1 binding is unavailable.");
  return database;
}

const PENDING_CONTRIBUTION_TABLES = [
  "gratitudes",
  "kindness_entries",
  "strengths_entries",
  "dream_submissions",
  "homepage_checkins",
] as const;

const REJECTABLE_CONTRIBUTION_TABLES = {
  gratitude: "gratitudes",
  kindness: "kindness_entries",
  strengths: "strengths_entries",
  dreams: "dream_submissions",
  checkins: "homepage_checkins",
} as const;

export type RejectableContributionType =
  keyof typeof REJECTABLE_CONTRIBUTION_TABLES;

function cutoffTimestamp(months: number, now: Date): string {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() - months;
  const day = now.getUTCDate();
  const targetMonth = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(
    Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() + 1, 0)
  ).getUTCDate();
  targetMonth.setUTCDate(Math.min(day, lastDay));
  targetMonth.setUTCHours(
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    0
  );
  return targetMonth.toISOString().slice(0, 19).replace("T", " ");
}

function cutoffTimestampDays(days: number, now: Date): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export function pendingContributionCutoffTimestamp(now = new Date()): string {
  return cutoffTimestampDays(90, now);
}

export function retentionCutoffTimestamp(
  retentionMonths: number,
  now = new Date()
): string {
  if (!Number.isInteger(retentionMonths) || retentionMonths <= 0) {
    throw new RangeError("Retention months must be a positive integer.");
  }
  return cutoffTimestamp(retentionMonths, now);
}

export async function purgeStalePendingContributions(
  database: D1DatabaseLike | undefined,
  now = new Date()
): Promise<void> {
  const db = requireDatabase(database);
  const cutoff = pendingContributionCutoffTimestamp(now);
  for (const table of PENDING_CONTRIBUTION_TABLES) {
    await db
      .prepare(
        `DELETE FROM ${table}
         WHERE status = 'pending' AND created_at < ?`
      )
      .bind(cutoff)
      .run();
  }
}

export async function purgeExpiredReconnectInterests(
  database: D1DatabaseLike | undefined,
  now = new Date()
): Promise<void> {
  await requireDatabase(database)
    .prepare(
      `DELETE FROM live_adventure_interests
       WHERE created_at < ?`
    )
    .bind(retentionCutoffTimestamp(12, now))
    .run();
}

export async function purgeExpiredContactMessages(
  database: D1DatabaseLike | undefined,
  now = new Date()
): Promise<void> {
  await requireDatabase(database)
    .prepare(
      `DELETE FROM contact_messages
       WHERE created_at < ?`
    )
    .bind(retentionCutoffTimestamp(12, now))
    .run();
}

export async function deleteRejectedTextContribution(
  database: D1DatabaseLike | undefined,
  type: RejectableContributionType,
  id: number,
  submissionId?: string | null
): Promise<number[]> {
  const db = requireDatabase(database);
  const table = REJECTABLE_CONTRIBUTION_TABLES[type];
  const statement =
    type === "gratitude" &&
    submissionId &&
    submissionId.length > 0 &&
    submissionId.length <= 64
      ? db
          .prepare(`DELETE FROM ${table} WHERE submission_id = ? RETURNING id`)
          .bind(submissionId)
      : db
          .prepare(`DELETE FROM ${table} WHERE id = ? RETURNING id`)
          .bind(id);
  const result = await statement.all<{ id: number }>();
  return result.results.map(({ id: deletedId }) => deletedId);
}

export async function deleteReconnectInterest(
  database: D1DatabaseLike | undefined,
  id: number
): Promise<boolean> {
  const result = await requireDatabase(database)
    .prepare("DELETE FROM live_adventure_interests WHERE id = ? RETURNING id")
    .bind(id)
    .first<{ id: number }>();
  return result !== null;
}

export async function deleteContactMessage(
  database: D1DatabaseLike | undefined,
  id: number
): Promise<boolean> {
  const result = await requireDatabase(database)
    .prepare("DELETE FROM contact_messages WHERE id = ? RETURNING id")
    .bind(id)
    .first<{ id: number }>();
  return result !== null;
}
