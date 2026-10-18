import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { homepageCheckins } from "../../../db/schema";
import { normalizeCountryCode } from "../../../lib/countries";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";
import {
  PUBLIC_JSON_BODY_LIMIT_BYTES,
  readJsonBody,
  RequestBodyTooLargeError,
} from "../../../lib/request-json";
import { purgeStalePendingContributions } from "../../../lib/privacy-retention";

const COMMENT_MAX_LENGTH = 240;
const FIRST_NAME_MAX_LENGTH = 40;
const PUBLIC_CHECKIN_LIMIT = 100;

export async function GET(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
    const db = getDb();
    const checkins = await db
      .select({
        rating: homepageCheckins.rating,
        comment: homepageCheckins.comment,
        displayName: homepageCheckins.displayName,
        countryCode: homepageCheckins.countryCode,
      })
      .from(homepageCheckins)
      .where(eq(homepageCheckins.status, "approved"))
      .orderBy(desc(homepageCheckins.approvedAt), desc(homepageCheckins.id))
      .limit(PUBLIC_CHECKIN_LIMIT);

    const ownerTokenHash = await getVisitorTokenHash(request);
    const pending = ownerTokenHash
      ? await db
          .select({
            rating: homepageCheckins.rating,
            comment: homepageCheckins.comment,
            displayName: homepageCheckins.displayName,
            countryCode: homepageCheckins.countryCode,
          })
          .from(homepageCheckins)
          .where(
            and(
              eq(homepageCheckins.status, "pending"),
              eq(homepageCheckins.ownerTokenHash, ownerTokenHash)
            )
          )
          .orderBy(desc(homepageCheckins.id))
          .limit(PUBLIC_CHECKIN_LIMIT)
      : [];

    return privateVisitorJson({ checkins, pending });
  } catch (error) {
    console.error("GET /api/home-checkins failed.", error);
    return Response.json(
      { error: "The community check-ins are temporarily unavailable." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await readJsonBody(
      request,
      PUBLIC_JSON_BODY_LIMIT_BYTES
    );
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Check your check-in details." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof RequestBodyTooLargeError
            ? "The check-in is too large."
            : "Check your check-in details.",
      },
      { status: error instanceof RequestBodyTooLargeError ? 413 : 400 }
    );
  }

  const rating = body.rating;
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 10
  ) {
    return Response.json(
      { error: "Choose a whole number from 1 to 10." },
      { status: 400 }
    );
  }

  if (
    body.comment !== undefined &&
    body.comment !== null &&
    typeof body.comment !== "string"
  ) {
    return Response.json(
      { error: "Your comment must be text." },
      { status: 400 }
    );
  }
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  if (comment.length > COMMENT_MAX_LENGTH) {
    return Response.json(
      { error: `Keep your comment to ${COMMENT_MAX_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  let displayName: string;
  if (body.identityChoice === "anonymous") {
    displayName = "Anonymous";
  } else if (body.identityChoice === "firstName") {
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    if (!firstName || firstName.length > FIRST_NAME_MAX_LENGTH) {
      return Response.json(
        { error: "Enter a first name of 40 characters or fewer." },
        { status: 400 }
      );
    }
    displayName = firstName;
  } else {
    return Response.json(
      { error: "Choose Anonymous or First name." },
      { status: 400 }
    );
  }

  const country = normalizeCountryCode(body.countryCode);
  if (!country.valid) {
    return Response.json(
      { error: "Please choose a country from the list." },
      { status: 400 }
    );
  }
  if (body.consent !== true) {
    return Response.json(
      { error: "Consent is required before sharing your check-in." },
      { status: 400 }
    );
  }

  try {
    await purgeStalePendingContributions(env.DB);
    const identity = await createVisitorSubmissionIdentity(request);
    const [checkin] = await getDb()
      .insert(homepageCheckins)
      .values({
        rating,
        comment: comment || null,
        displayName,
        countryCode: country.countryCode,
        ownerTokenHash: identity.tokenHash,
        status: "pending",
      })
      .returning({
        rating: homepageCheckins.rating,
        comment: homepageCheckins.comment,
        displayName: homepageCheckins.displayName,
        countryCode: homepageCheckins.countryCode,
      });

    return privateVisitorJson(
      { checkin },
      { status: 201 },
      identity.setCookie
    );
  } catch (error) {
    console.error("POST /api/home-checkins failed.", error);
    return Response.json(
      {
        error:
          "Your check-in could not be shared right now. Please try again.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
