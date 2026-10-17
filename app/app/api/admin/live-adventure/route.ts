import { env } from "cloudflare:workers";
import { asc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { liveAdventureInterests } from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import { isLiveAdventureReservePosition } from "../../../../lib/live-adventure-cohort";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../../../lib/local-admin-auth-proof";
import {
  deleteReconnectInterest,
  purgeExpiredReconnectInterests,
} from "../../../../lib/privacy-retention";

export async function GET(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion"),
    request.headers.get(LOCAL_ADMIN_PROOF_HEADER)
  );
  if (!authorization.authorized) {
    return Response.json(
      { error: authorization.message },
      {
        status: authorization.status,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  try {
    await purgeExpiredReconnectInterests(env.DB);
    const rows = await getDb()
      .select({
        id: liveAdventureInterests.id,
        name: liveAdventureInterests.name,
        email: liveAdventureInterests.email,
        createdAt: liveAdventureInterests.createdAt,
      })
      .from(liveAdventureInterests)
      .orderBy(asc(liveAdventureInterests.id))
      .limit(20);

    return Response.json(
      {
        entries: rows.map((entry, index) => ({
          ...entry,
          reserve: isLiveAdventureReservePosition(index + 1),
        })),
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch {
    return Response.json(
      { error: "Unable to load the Live Adventure waiting list." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}

export async function DELETE(request: Request) {
  const authorization = await authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion"),
    request.headers.get(LOCAL_ADMIN_PROOF_HEADER)
  );
  if (!authorization.authorized) {
    return Response.json(
      { error: authorization.message },
      {
        status: authorization.status,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "A valid waiting-list entry id is required." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    !("id" in body) ||
    typeof body.id !== "number" ||
    !Number.isSafeInteger(body.id) ||
    body.id <= 0
  ) {
    return Response.json(
      { error: "A valid waiting-list entry id is required." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  try {
    const deleted = await deleteReconnectInterest(env.DB, body.id);
    if (!deleted) {
      return Response.json(
        { error: "Waiting-list entry not found." },
        { status: 404, headers: { "Cache-Control": "private, no-store" } }
      );
    }
    return Response.json(
      { deleted: true },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch {
    return Response.json(
      { error: "Unable to delete the waiting-list entry." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
