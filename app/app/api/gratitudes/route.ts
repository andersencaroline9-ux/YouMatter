import { env } from "cloudflare:workers";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { gratitudes } from "../../../db/schema";
import { normalizeCountryCode } from "../../../lib/countries";
import {
  groupGratitudeRows,
  type GratitudeSubmission,
} from "../../../lib/gratitude-submissions";
import { gratitudePlantingPositions } from "../../../lib/gratitude-planting-layout";
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

function publicSubmissions(submissions: GratitudeSubmission[]) {
  return submissions.map(
    ({ messages, displayName, countryCode }) => ({
      messages,
      displayName,
      countryCode,
    })
  );
}

export async function GET(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
    const db = getDb();
    const sampledSubmissionRows = await db
      .select({
        submissionId: gratitudes.submissionId,
      })
      .from(gratitudes)
      .where(sql`${gratitudes.submissionId} IS NOT NULL`)
      .groupBy(gratitudes.submissionId)
      .having(sql`
        COUNT(*) = 3
        AND SUM(CASE WHEN ${gratitudes.status} = 'approved' THEN 1 ELSE 0 END) = 3
        AND SUM(CASE WHEN length(trim(${gratitudes.message})) > 0 THEN 1 ELSE 0 END) = 3
      `)
      .orderBy(sql`random()`)
      .limit(gratitudePlantingPositions.length);

    const sampledSubmissionIds = sampledSubmissionRows
      .map(({ submissionId }) => submissionId)
      .filter((submissionId): submissionId is string => submissionId !== null);
    const approvedRows = sampledSubmissionIds.length > 0
      ? await db
          .select({
            id: gratitudes.id,
            message: gratitudes.message,
            displayName: gratitudes.displayName,
            countryCode: gratitudes.countryCode,
            submissionId: gratitudes.submissionId,
            status: gratitudes.status,
            createdAt: gratitudes.createdAt,
            approvedAt: gratitudes.approvedAt,
          })
          .from(gratitudes)
          .where(
            and(
              inArray(gratitudes.submissionId, sampledSubmissionIds),
              eq(gratitudes.status, "approved")
            )
          )
          .orderBy(desc(gratitudes.approvedAt), desc(gratitudes.id))
      : [];
    const sampleOrder = new Map(
      sampledSubmissionIds.map((submissionId, index) => [submissionId, index])
    );
    const approvedEntries = groupGratitudeRows(approvedRows)
      .filter(
        (submission) =>
          submission.submissionId !== null && submission.messages.length === 3
      )
      .sort(
        (left, right) => {
          const leftIndex =
            sampleOrder.get(left.submissionId ?? "") ?? Number.MAX_SAFE_INTEGER;
          const rightIndex =
            sampleOrder.get(right.submissionId ?? "") ?? Number.MAX_SAFE_INTEGER;
          return leftIndex - rightIndex;
        }
      );

    const ownerTokenHash = await getVisitorTokenHash(request);
    const ownPending = ownerTokenHash
      ? await db
          .select({
            id: gratitudes.id,
            message: gratitudes.message,
            displayName: gratitudes.displayName,
            countryCode: gratitudes.countryCode,
            submissionId: gratitudes.submissionId,
            status: gratitudes.status,
            createdAt: gratitudes.createdAt,
            approvedAt: gratitudes.approvedAt,
          })
          .from(gratitudes)
          .where(
            and(
              eq(gratitudes.status, "pending"),
              eq(gratitudes.ownerTokenHash, ownerTokenHash)
            )
          )
          .orderBy(desc(gratitudes.id))
          .limit(180)
      : [];

    return privateVisitorJson({
      gratitudes: publicSubmissions(approvedEntries),
      pending: publicSubmissions(groupGratitudeRows(ownPending)),
    });
  } catch {
    return Response.json(
      { error: "The garden is temporarily unavailable." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await readJsonBody(request, PUBLIC_JSON_BODY_LIMIT_BYTES);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof RequestBodyTooLargeError
            ? "The submission is too large."
            : "Please send a valid Gratitude submission.",
      },
      { status: error instanceof RequestBodyTooLargeError ? 413 : 400 }
    );
  }

  try {
    await purgeStalePendingContributions(env.DB);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return Response.json(
        { error: "Please send a valid Gratitude submission." },
        { status: 400 }
      );
    }

    const body = payload as Record<string, unknown>;
    if (!Array.isArray(body.messages)) {
      return Response.json(
        { error: "Please submit exactly three gratitudes." },
        { status: 400 }
      );
    }
    if (!body.messages.every((message) => typeof message === "string")) {
      return Response.json(
        { error: "Each gratitude must be text." },
        { status: 400 }
      );
    }
    const messages = body.messages.map((message) => message.trim());
    if (messages.length !== 3) {
      return Response.json(
        { error: "Please submit exactly three gratitudes." },
        { status: 400 }
      );
    }
    if (messages.some((message) => message.length === 0)) {
      return Response.json(
        { error: "Please add a gratitude in all three fields." },
        { status: 400 }
      );
    }
    if (messages.some((message) => message.length > 280)) {
      return Response.json(
        { error: "Each gratitude must be 280 characters or fewer." },
        { status: 400 }
      );
    }
    if (
      body.displayName !== undefined &&
      typeof body.displayName !== "string"
    ) {
      return Response.json(
        { error: "Please use text for your display name." },
        { status: 400 }
      );
    }
    if (
      body.countryCode !== undefined &&
      body.countryCode !== null &&
      typeof body.countryCode !== "string"
    ) {
      return Response.json(
        { error: "Please choose a valid country." },
        { status: 400 }
      );
    }
    if (body.consent !== true) {
      return Response.json(
        { error: "Consent is required before planting." },
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

    const rawName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";
    const displayName = rawName.slice(0, 40) || "Anonymous";
    const identity = await createVisitorSubmissionIdentity(request);
    const submissionId = crypto.randomUUID();
    const rows = await getDb()
      .insert(gratitudes)
      .values(
        messages.map((message) => ({
          message,
          displayName,
          countryCode: country.countryCode,
          submissionId,
          ownerTokenHash: identity.tokenHash,
          status: "pending" as const,
        }))
      )
      .returning({
        id: gratitudes.id,
        message: gratitudes.message,
        displayName: gratitudes.displayName,
        countryCode: gratitudes.countryCode,
        submissionId: gratitudes.submissionId,
        status: gratitudes.status,
        createdAt: gratitudes.createdAt,
        approvedAt: gratitudes.approvedAt,
      });

    return privateVisitorJson(
      { gratitudes: publicSubmissions(groupGratitudeRows(rows)) },
      { status: 201 },
      identity.setCookie
    );
  } catch {
    return Response.json(
      { error: "The seeds could not be planted right now. Please try again." },
      { status: 500 }
    );
  }
}
