import { env } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { dreamSubmissions } from "../../../db/schema";
import { purgeStalePendingContributions } from "../../../lib/privacy-retention";
import {
  readJsonBody,
  RequestBodyTooLargeError,
} from "../../../lib/request-json";

const MAX_BODY_BYTES = 4_096;
const RIVER_STONE_COUNT = 9;

function privateResponse(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  try {
    await purgeStalePendingContributions(env.DB);
    const dreams = await getDb()
      .select({ dream: dreamSubmissions.dream })
      .from(dreamSubmissions)
      .where(eq(dreamSubmissions.status, "approved"))
      .orderBy(sql`RANDOM()`)
      .limit(RIVER_STONE_COUNT);
    return privateResponse({ dreams: dreams.map((entry) => entry.dream) });
  } catch {
    console.error("Unable to load approved dreams for the river.");
    return privateResponse(
      { error: "The River of Dreams is temporarily unavailable." },
      503
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJsonBody(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return privateResponse({ error: "The dream is too large." }, 413);
    }
    return privateResponse(
      { error: "Please check your dream and try again." },
      400
    );
  }

  if (
    !isRecord(body) ||
    Object.keys(body).some((key) => key !== "dream") ||
    typeof body.dream !== "string"
  ) {
    return privateResponse(
      { error: "Please send only your dream text." },
      400
    );
  }

  const dream = body.dream.trim();
  if (!dream || dream.length > 120) {
    return privateResponse(
      { error: "Add a dream in 120 characters or fewer." },
      400
    );
  }

  try {
    await purgeStalePendingContributions(env.DB);
    await getDb().insert(dreamSubmissions).values({ dream });
    return privateResponse({ success: true }, 201);
  } catch {
    console.error("Unable to save a Dream Stone.");
    return privateResponse(
      { error: "Your dream could not be shared right now. Please try again." },
      500
    );
  }
}
