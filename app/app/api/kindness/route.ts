import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { kindnessEntries } from "../../../db/schema";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const approved = await db
      .select({
        id: kindnessEntries.id,
        message: kindnessEntries.message,
        kind: kindnessEntries.kind,
        displayName: kindnessEntries.displayName,
        status: kindnessEntries.status,
        createdAt: kindnessEntries.createdAt,
        approvedAt: kindnessEntries.approvedAt,
      })
      .from(kindnessEntries)
      .where(eq(kindnessEntries.status, "approved"))
      .orderBy(desc(kindnessEntries.approvedAt), desc(kindnessEntries.id))
      .limit(80);

    const ownerTokenHash = await getVisitorTokenHash(request);
    const ownPending = ownerTokenHash
      ? await db
          .select({
            id: kindnessEntries.id,
            message: kindnessEntries.message,
            kind: kindnessEntries.kind,
            displayName: kindnessEntries.displayName,
            status: kindnessEntries.status,
            createdAt: kindnessEntries.createdAt,
            approvedAt: kindnessEntries.approvedAt,
          })
          .from(kindnessEntries)
          .where(
            and(
              eq(kindnessEntries.status, "pending"),
              eq(kindnessEntries.ownerTokenHash, ownerTokenHash)
            )
          )
          .orderBy(desc(kindnessEntries.id))
      : [];

    const entries = [...approved, ...ownPending].sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) || right.id - left.id
    );
    return privateVisitorJson({ entries });
  } catch {
    return Response.json(
      { error: "The kindness wall is temporarily unavailable." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: unknown;
      kind?: unknown;
      displayName?: unknown;
      consent?: unknown;
    };
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const kind =
      body.kind === "gave" ||
      body.kind === "received" ||
      body.kind === "witnessed"
        ? body.kind
        : null;
    if (!message || message.length > 320) {
      return Response.json(
        { error: "Add a kind action in 320 characters or fewer." },
        { status: 400 }
      );
    }
    if (!kind) {
      return Response.json(
        { error: "Choose whether you gave, received or witnessed the kindness." },
        { status: 400 }
      );
    }
    if (body.consent !== true) {
      return Response.json(
        { error: "Consent is required before adding the words." },
        { status: 400 }
      );
    }

    const displayName =
      typeof body.displayName === "string" && body.displayName.trim()
        ? body.displayName.trim().slice(0, 40)
        : "Anonymous";
    const identity = await createVisitorSubmissionIdentity(request);
    const [entry] = await getDb()
      .insert(kindnessEntries)
      .values({
        message,
        kind,
        displayName,
        ownerTokenHash: identity.tokenHash,
        status: "pending",
      })
      .returning({
        id: kindnessEntries.id,
        message: kindnessEntries.message,
        kind: kindnessEntries.kind,
        displayName: kindnessEntries.displayName,
        status: kindnessEntries.status,
        createdAt: kindnessEntries.createdAt,
        approvedAt: kindnessEntries.approvedAt,
      });

    return privateVisitorJson(
      { entry },
      { status: 201 },
      identity.setCookie
    );
  } catch {
    return Response.json(
      { error: "This kindness could not be shared right now. Please try again." },
      { status: 500 }
    );
  }
}
