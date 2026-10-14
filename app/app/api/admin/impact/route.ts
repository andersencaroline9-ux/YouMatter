import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { impactAccounting } from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import { isTreeAccounting } from "../../../../lib/impact";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../../../lib/local-admin-auth-proof";

const headers = { "Cache-Control": "private, no-store" };
async function denied(request: Request) {
  const auth = await authorizeAdmin(request.headers.get("cf-access-jwt-assertion"), request.headers.get(LOCAL_ADMIN_PROOF_HEADER));
  return auth.authorized ? null : Response.json({ error: auth.message }, { status: auth.status, headers });
}
export async function GET(request: Request) {
  const rejection = await denied(request);
  if (rejection) return rejection;
  try {
    const [record] = await getDb().select().from(impactAccounting).where(eq(impactAccounting.id, 1));
    if (!record) throw new Error("Missing accounting record.");
    return Response.json(record, { headers });
  } catch {
    return Response.json({ error: "Unable to load confirmed tree totals." }, { status: 503, headers });
  }
}
export async function PATCH(request: Request) {
  const rejection = await denied(request);
  if (rejection) return rejection;
  let body: unknown;
  try { body = await request.json(); } catch {
    return Response.json({ error: "Check the tree totals." }, { status: 400, headers });
  }
  if (!isTreeAccounting(body)) {
    return Response.json({ error: "Use non-negative whole numbers. Planted trees cannot exceed funded trees." }, { status: 400, headers });
  }
  try {
    const [record] = await getDb().update(impactAccounting).set({
      treesFunded: body.treesFunded, treesPlanted: body.treesPlanted, updatedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(impactAccounting.id, 1)).returning();
    if (!record) throw new Error("Missing accounting record.");
    return Response.json(record, { headers });
  } catch {
    return Response.json({ error: "Unable to save confirmed tree totals." }, { status: 503, headers });
  }
}
