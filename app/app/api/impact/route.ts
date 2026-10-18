import { count, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { dreamSubmissions, gratitudes, homepageCheckins, impactAccounting, kindnessEntries, strengthsEntries } from "../../../db/schema";
import { calculateImpact, countEligibleGratitudeGroups, countEligibleStrengthsGroups } from "../../../lib/impact";

export async function GET() {
  try {
    const db = getDb();
    // One D1 batch provides a consistent snapshot. No feed limits or visual sampling.
    const [gratitude, kindness, strengths, dreams, checkins, accounting] = await db.batch([
      db.select({
        submissionId: gratitudes.submissionId,
        status: gratitudes.status,
        count: count(),
        validMessageCount: count(
          sql`CASE WHEN length(trim(${gratitudes.message})) > 0 THEN 1 END`
        ),
      })
        .from(gratitudes).groupBy(gratitudes.submissionId, gratitudes.status),
      db.select({ count: count() }).from(kindnessEntries).where(eq(kindnessEntries.status, "approved")),
      db.select({ strength: strengthsEntries.strength, count: count() }).from(strengthsEntries)
        .where(eq(strengthsEntries.status, "approved")).groupBy(strengthsEntries.strength),
      db.select({ count: count() }).from(dreamSubmissions)
        .where(eq(dreamSubmissions.status, "approved")),
      db.select({ count: count() }).from(homepageCheckins)
        .where(eq(homepageCheckins.status, "approved")),
      db.select({ treesFunded: impactAccounting.treesFunded, treesPlanted: impactAccounting.treesPlanted })
        .from(impactAccounting).where(eq(impactAccounting.id, 1)),
    ]);
    if (!accounting[0]) throw new Error("Tree accounting has not been initialised.");
    return Response.json(calculateImpact(
      countEligibleGratitudeGroups(gratitude), kindness[0].count,
      countEligibleStrengthsGroups(strengths), dreams[0].count,
      accounting[0].treesFunded, accounting[0].treesPlanted,
      checkins[0].count,
    ), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Unable to load aggregate impact.", error);
    return Response.json({ error: "Our collective tally is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
