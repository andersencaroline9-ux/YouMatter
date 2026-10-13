import { env } from "cloudflare:workers";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import {
  gratitudes,
  kindnessEntries,
  natureEntries,
} from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import { groupGratitudeRows } from "../../../../lib/gratitude-submissions";

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion")
  );
  if (!authorization.authorized) {
    return Response.json(
      { error: authorization.message },
      { status: authorization.status }
    );
  }

  try {
    const db = getDb();
    const [gratitude, nature, kindness] = await Promise.all([
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
    ]);
    return Response.json({
      gratitude: groupGratitudeRows(gratitude).slice(0, 100),
      nature: nature.map((row) => ({
        ...row,
        imageUrl: `/api/admin/nature/${row.id}/image`,
      })),
      kindness,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load submissions.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion")
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

    const db = getDb();
    const approvedAt = status === "approved" ? sql`CURRENT_TIMESTAMP` : null;
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
