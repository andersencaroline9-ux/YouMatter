import { env } from "cloudflare:workers";
import { and, eq, or } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { natureEntries } from "../../../../../db/schema";
import {
  NATURE_MOSAIC_PUBLIC_ENABLED,
  natureMosaicDisabledResponse,
} from "../../../../../lib/nature-mosaic-flag";
import { getVisitorTokenHash } from "../../../../../lib/visitor-submissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!NATURE_MOSAIC_PUBLIC_ENABLED) return natureMosaicDisabledResponse();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return new Response("Not found", { status: 404 });
  }

  const ownerTokenHash = await getVisitorTokenHash(request);
  const visibility = ownerTokenHash
    ? or(
        eq(natureEntries.status, "approved"),
        and(
          eq(natureEntries.status, "pending"),
          eq(natureEntries.ownerTokenHash, ownerTokenHash)
        )
      )
    : eq(natureEntries.status, "approved");
  const [row] = await getDb()
    .select({
      objectKey: natureEntries.objectKey,
      status: natureEntries.status,
    })
    .from(natureEntries)
    .where(and(eq(natureEntries.id, numericId), visibility))
    .limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  const object = await env.BUCKET.get(row.objectKey);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers({ "X-Content-Type-Options": "nosniff" });
  object.writeHttpMetadata(headers);
  headers.set(
    "Cache-Control",
    row.status === "approved" ? "public, max-age=3600" : "private, no-store"
  );
  return new Response(object.body, { headers });
}
