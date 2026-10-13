import { count } from "drizzle-orm";
import { getDb } from "../../../db";
import { gratitudes } from "../../../db/schema";
import { countApprovedGratitudeContributions } from "../../../lib/gratitude-submissions";

export async function GET() {
  try {
    const rows = await getDb()
      .select({
        submissionId: gratitudes.submissionId,
        status: gratitudes.status,
        count: count(),
      })
      .from(gratitudes)
      .groupBy(gratitudes.submissionId, gratitudes.status);
    const total = countApprovedGratitudeContributions(rows);

    return Response.json({
      gratitudeTotal: total,
      towardNextTree: total % 100,
      treesUnlocked: Math.floor(total / 100),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load impact progress.",
      },
      { status: 500 }
    );
  }
}
