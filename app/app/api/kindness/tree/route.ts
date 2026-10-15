import { count, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { kindnessEntries } from "../../../../db/schema";
import { KINDNESS_TREE_STORY_LIMIT } from "../../../../lib/kindness";

export async function GET() {
  try {
    const db = getDb();
    const [totals, stories] = await db.batch([
      db
        .select({ count: count() })
        .from(kindnessEntries)
        .where(eq(kindnessEntries.status, "approved")),
      db
        .select({
          message: kindnessEntries.message,
          kind: kindnessEntries.kind,
          displayName: kindnessEntries.displayName,
        })
        .from(kindnessEntries)
        .where(eq(kindnessEntries.status, "approved"))
        .orderBy(sql`RANDOM()`)
        .limit(KINDNESS_TREE_STORY_LIMIT),
    ]);

    return Response.json(
      {
        stories,
        hasMore: totals[0].count > stories.length,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Unable to load kindness stories for the tree.", error);
    return Response.json(
      { error: "Kindness stories are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
