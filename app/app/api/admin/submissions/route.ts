import { env } from "cloudflare:workers";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import {
  gratitudes,
  dreamSubmissions,
  homepageCheckins,
  kindnessEntries,
  natureEntries,
  strengthsEntries,
} from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import {
  isCharacterStrengthSelection,
  parseStoredCharacterStrengths,
} from "../../../../lib/character-strengths";
import { groupGratitudeRows } from "../../../../lib/gratitude-submissions";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../../../lib/local-admin-auth-proof";
import {
  deleteRejectedTextContribution,
  purgeStalePendingContributions,
} from "../../../../lib/privacy-retention";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion"),
    request.headers.get(LOCAL_ADMIN_PROOF_HEADER)
  );
  if (!authorization.authorized) {
    return Response.json(
      { error: authorization.message },
      { status: authorization.status, headers: PRIVATE_HEADERS }
    );
  }

  try {
    await purgeStalePendingContributions(env.DB);
    const db = getDb();
    const [gratitude, nature, kindness, strengths, checkins, dreams] = await Promise.all([
      db
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
        .orderBy(desc(gratitudes.createdAt))
        .limit(300),
      db
        .select({
          id: natureEntries.id,
          caption: natureEntries.caption,
          displayName: natureEntries.displayName,
          status: natureEntries.status,
          createdAt: natureEntries.createdAt,
          approvedAt: natureEntries.approvedAt,
        })
        .from(natureEntries)
        .orderBy(desc(natureEntries.createdAt))
        .limit(100),
      db
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
        .orderBy(desc(kindnessEntries.createdAt))
        .limit(100),
      db
        .select({
          id: strengthsEntries.id,
          strength: strengthsEntries.strength,
          reflection: strengthsEntries.reflection,
          displayName: strengthsEntries.displayName,
          countryCode: strengthsEntries.countryCode,
          status: strengthsEntries.status,
          createdAt: strengthsEntries.createdAt,
          approvedAt: strengthsEntries.approvedAt,
        })
        .from(strengthsEntries)
        .orderBy(desc(strengthsEntries.createdAt))
        .limit(100),
      db
        .select({
          id: homepageCheckins.id,
          rating: homepageCheckins.rating,
          comment: homepageCheckins.comment,
          displayName: homepageCheckins.displayName,
          countryCode: homepageCheckins.countryCode,
          status: homepageCheckins.status,
          createdAt: homepageCheckins.createdAt,
          approvedAt: homepageCheckins.approvedAt,
        })
        .from(homepageCheckins)
        .orderBy(desc(homepageCheckins.createdAt))
        .limit(100),
      db
        .select({
          id: dreamSubmissions.id,
          dream: dreamSubmissions.dream,
          status: dreamSubmissions.status,
          createdAt: dreamSubmissions.createdAt,
          approvedAt: dreamSubmissions.approvedAt,
        })
        .from(dreamSubmissions)
        .orderBy(desc(dreamSubmissions.createdAt))
        .limit(200),
    ]);
    const groupedStrengths = strengths.map(({ strength, ...entry }) => ({
      ...entry,
      strengths: parseStoredCharacterStrengths(strength),
    }));
    return Response.json(
      {
        gratitude: groupGratitudeRows(gratitude).slice(0, 100),
        nature: nature.map((row) => ({
          ...row,
          imageUrl: `/api/admin/nature/${row.id}/image`,
        })),
        kindness,
        strengths: groupedStrengths,
        checkins,
        dreams,
      },
      { headers: PRIVATE_HEADERS }
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load submissions.",
      },
      { status: 500, headers: PRIVATE_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion"),
    request.headers.get(LOCAL_ADMIN_PROOF_HEADER)
  );
  if (!authorization.authorized) {
    return Response.json(
      { error: authorization.message },
      { status: authorization.status }
    );
  }

  try {
    const body = (await request.json()) as {
      id?: unknown;
      submissionId?: unknown;
      type?: unknown;
      status?: unknown;
    };
    const id = Number(body.id);
    const status =
      body.status === "approved" || body.status === "rejected"
        ? body.status
        : null;
    if (!Number.isInteger(id) || !status) {
      return Response.json(
        { error: "A valid submission and decision are required." },
        { status: 400 }
      );
    }

    if (
      body.type === "checkins" ||
      body.type === "strengths" ||
      body.type === "gratitude" ||
      body.type === "kindness" ||
      body.type === "dreams"
    ) {
      await purgeStalePendingContributions(env.DB);
    }
    if (
      status === "rejected" &&
      (body.type === "checkins" ||
        body.type === "strengths" ||
        body.type === "gratitude" ||
        body.type === "kindness" ||
        body.type === "dreams")
    ) {
      const deletedIds = await deleteRejectedTextContribution(
        env.DB,
        body.type,
        id,
        typeof body.submissionId === "string" ? body.submissionId : null
      );
      if (deletedIds.length === 0) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      return Response.json({ deletedIds });
    }

    const db = getDb();
    const approvedAt = status === "approved" ? sql`CURRENT_TIMESTAMP` : null;
    if (body.type === "checkins") {
      const [entry] = await db
        .update(homepageCheckins)
        .set({ status, approvedAt, ownerTokenHash: null })
        .where(eq(homepageCheckins.id, id))
        .returning({
          id: homepageCheckins.id,
          status: homepageCheckins.status,
        });
      if (!entry) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      return Response.json({ entry });
    }
    if (body.type === "strengths") {
      const [current] = await db
        .select({
          strength: strengthsEntries.strength,
        })
        .from(strengthsEntries)
        .where(eq(strengthsEntries.id, id))
        .limit(1);
      if (!current) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      const sequenceEligible = isCharacterStrengthSelection(
        parseStoredCharacterStrengths(current.strength)
      );
      const [entry] = await db
        .update(strengthsEntries)
        .set({
          status,
          approvedAt,
          ownerTokenHash: null,
          ...(status === "approved" && sequenceEligible
            ? {
                contributionSequence: sql`COALESCE(
                  ${strengthsEntries.contributionSequence},
                  (
                    SELECT COALESCE(MAX(contribution_sequence), 0) + 1
                    FROM strengths_entries
                  )
                )`,
              }
            : {}),
        })
        .where(eq(strengthsEntries.id, id))
        .returning({
          id: strengthsEntries.id,
          status: strengthsEntries.status,
        });
      if (!entry) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      return Response.json({ entry });
    }
    if (body.type === "gratitude") {
      if (
        typeof body.submissionId === "string" &&
        body.submissionId.length > 0 &&
        body.submissionId.length <= 64
      ) {
        const entries = await db
          .update(gratitudes)
          .set({ status, approvedAt, ownerTokenHash: null })
          .where(eq(gratitudes.submissionId, body.submissionId))
          .returning({ id: gratitudes.id, status: gratitudes.status });
        if (entries.length === 0) {
          return Response.json(
            { error: "Submission not found." },
            { status: 404 }
          );
        }
        return Response.json({ entries });
      }
      const [entry] = await db
        .update(gratitudes)
        .set({ status, approvedAt, ownerTokenHash: null })
        .where(eq(gratitudes.id, id))
        .returning({ id: gratitudes.id, status: gratitudes.status });
      return Response.json({ entry });
    }
    if (body.type === "kindness") {
      const [entry] = await db
        .update(kindnessEntries)
        .set({ status, approvedAt, ownerTokenHash: null })
        .where(eq(kindnessEntries.id, id))
        .returning({
          id: kindnessEntries.id,
          status: kindnessEntries.status,
        });
      return Response.json({ entry });
    }
    if (body.type === "dreams") {
      const [entry] = await db
        .update(dreamSubmissions)
        .set({
          status,
          approvedAt:
            status === "approved"
              ? sql`COALESCE(${dreamSubmissions.approvedAt}, CURRENT_TIMESTAMP)`
              : null,
        })
        .where(eq(dreamSubmissions.id, id))
        .returning({
          id: dreamSubmissions.id,
          status: dreamSubmissions.status,
        });
      if (!entry) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      return Response.json({ entry });
    }
    if (body.type === "nature") {
      const [current] = await db
        .select({ objectKey: natureEntries.objectKey })
        .from(natureEntries)
        .where(eq(natureEntries.id, id))
        .limit(1);
      if (!current) {
        return Response.json({ error: "Submission not found." }, { status: 404 });
      }
      const [entry] = await db
        .update(natureEntries)
        .set({ status, approvedAt, ownerTokenHash: null })
        .where(eq(natureEntries.id, id))
        .returning({ id: natureEntries.id, status: natureEntries.status });
      if (status === "rejected") await env.BUCKET.delete(current.objectKey);
      return Response.json({ entry });
    }

    return Response.json({ error: "Unknown submission type." }, { status: 400 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update submission.",
      },
      { status: 500 }
    );
  }
}
