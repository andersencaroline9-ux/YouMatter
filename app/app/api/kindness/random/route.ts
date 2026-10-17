import { env } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { kindnessEntries } from "../../../../db/schema";
import { purgeStalePendingContributions } from "../../../../lib/privacy-retention";

export async function GET() {
  try {
    await purgeStalePendingContributions(env.DB);
    const [story] = await getDb()
      .select({
        message: kindnessEntries.message,
        kind: kindnessEntries.kind,
        displayName: kindnessEntries.displayName,
      })
      .from(kindnessEntries)
      .where(eq(kindnessEntries.status, "approved"))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return Response.json(
      { story: story ?? null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Unable to find a kindness story.", error);
    return Response.json(
      { error: "A kindness story could not be loaded right now." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
