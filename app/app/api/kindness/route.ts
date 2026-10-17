import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { kindnessEntries } from "../../../db/schema";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";
import { purgeStalePendingContributions } from "../../../lib/privacy-retention";

export async function GET(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
    const ownerTokenHash = await getVisitorTokenHash(request);
    const ownPending = ownerTokenHash
      ? await getDb()
          .select({
            id: kindnessEntries.id,
            message: kindnessEntries.message,
            kind: kindnessEntries.kind,
            displayName: kindnessEntries.displayName,
            status: kindnessEntries.status,
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

    return privateVisitorJson({ entries: ownPending });
  } catch (error) {
    console.error("Unable to load the visitor's kindness stories.", error);
    return privateVisitorJson(
      { error: "Your kindness stories are temporarily unavailable." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
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
      });

    return privateVisitorJson(
      { entry },
      { status: 201 },
      identity.setCookie
    );
  } catch (error) {
    console.error("Unable to save a kindness story.", error);
    return Response.json(
      { error: "This kindness could not be shared right now. Please try again." },
      { status: 500 }
    );
  }
}
