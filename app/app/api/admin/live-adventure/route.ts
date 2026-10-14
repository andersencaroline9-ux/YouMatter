import { asc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { liveAdventureInterests } from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../../../lib/local-admin-auth-proof";

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
          reserve: index >= 15,
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
