import { env } from "cloudflare:workers";
import { desc,eq,sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { gratitudes } from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
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
    const rows = await getDb()
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
      .orderBy(desc(gratitudes.createdAt), desc(gratitudes.id))
      .limit(300);
    return Response.json(
      { gratitudes: groupGratitudeRows(rows).slice(0, 100) },
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
      status?: unknown;
    };
    const id = Number(body.id);
    const status =
      body.status === "approved" || body.status === "rejected"
        ? body.status
        : null;
    if (!status) {
      return Response.json(
        { error: "A valid id and status are required." },
        { status: 400 }
      );
    }

    await purgeStalePendingContributions(env.DB);
    if (status === "rejected") {
      const deletedIds = await deleteRejectedTextContribution(
        env.DB,
        "gratitude",
        id,
        typeof body.submissionId === "string" ? body.submissionId : null
      );
      if (deletedIds.length === 0) {
        return Response.json(
          { error: "Submission not found." },
          { status: 404 }
        );
      }
      return Response.json({ deletedIds });
    }

    const db = getDb();
    const approvedAt = status === "approved" ? sql`CURRENT_TIMESTAMP` : null;
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

    if (!Number.isInteger(id)) {
      return Response.json(
        { error: "A valid id and status are required." },
        { status: 400 }
      );
    }
    const [gratitude] = await db
      .update(gratitudes)
      .set({ status, approvedAt, ownerTokenHash: null })
      .where(eq(gratitudes.id, id))
      .returning({ id: gratitudes.id, status: gratitudes.status });
    return Response.json({ gratitude });
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
