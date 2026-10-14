import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { gratitudes } from "../../../db/schema";
import { normalizeCountryCode } from "../../../lib/countries";
import {
  groupGratitudeRows,
  type GratitudeSubmission,
} from "../../../lib/gratitude-submissions";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";

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
    const db = getDb();
    const approved = await db
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
      .where(eq(gratitudes.status, "approved"))
      .orderBy(desc(gratitudes.approvedAt), desc(gratitudes.id))
      .limit(183);

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

    const approvedEntries = groupGratitudeRows(approved)
      .filter(
        (submission) =>
          !submission.submissionId || submission.messages.length === 3
      )
      .slice(0, 60);
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
  try {
    const body = (await request.json()) as {
      messages?: unknown;
      displayName?: unknown;
      countryCode?: unknown;
      consent?: unknown;
    };
    const messages = Array.isArray(body.messages)
      ? body.messages.map(String).map((value) => value.trim()).filter(Boolean)
      : [];
    if (messages.length !== 3) {
      return Response.json(
        { error: "Please submit exactly three gratitudes." },
        { status: 400 }
      );
    }
    if (messages.some((message) => message.length > 280)) {
      return Response.json(
        { error: "Each gratitude must be 280 characters or fewer." },
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
