import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { natureEntries } from "../../../db/schema";
import {
  NATURE_MOSAIC_PUBLIC_ENABLED,
  natureMosaicDisabledResponse,
} from "../../../lib/nature-mosaic-flag";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";

function validImage(bytes: Uint8Array) {
  const jpeg =
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return jpeg ? "image/jpeg" : png ? "image/png" : webp ? "image/webp" : null;
}

export async function GET(request: Request) {
  if (!NATURE_MOSAIC_PUBLIC_ENABLED) return natureMosaicDisabledResponse();
  try {
    const db = getDb();
    const approved = await db
      .select({
        id: natureEntries.id,
        caption: natureEntries.caption,
        displayName: natureEntries.displayName,
        status: natureEntries.status,
        createdAt: natureEntries.createdAt,
        approvedAt: natureEntries.approvedAt,
      })
      .from(natureEntries)
      .where(eq(natureEntries.status, "approved"))
      .orderBy(desc(natureEntries.approvedAt), desc(natureEntries.id))
      .limit(80);

    const ownerTokenHash = await getVisitorTokenHash(request);
    const ownPending = ownerTokenHash
      ? await db
          .select({
            id: natureEntries.id,
            caption: natureEntries.caption,
            displayName: natureEntries.displayName,
            status: natureEntries.status,
            createdAt: natureEntries.createdAt,
            approvedAt: natureEntries.approvedAt,
          })
          .from(natureEntries)
          .where(
            and(
              eq(natureEntries.status, "pending"),
              eq(natureEntries.ownerTokenHash, ownerTokenHash)
            )
          )
          .orderBy(desc(natureEntries.id))
      : [];

    const entries = [...approved, ...ownPending]
      .sort(
        (left, right) =>
          right.createdAt.localeCompare(left.createdAt) || right.id - left.id
      )
      .map((entry) => ({
        ...entry,
        imageUrl: `/api/nature/${entry.id}/image`,
      }));
    return privateVisitorJson({ entries });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the tree.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!NATURE_MOSAIC_PUBLIC_ENABLED) return natureMosaicDisabledResponse();
  let objectKey = "";
  try {
    const form = await request.formData();
    const photo = form.get("photo");
    if (!(photo instanceof File)) {
      return Response.json({ error: "Choose a photograph." }, { status: 400 });
    }
    if (photo.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Please choose an image smaller than 5 MB." },
        { status: 400 }
      );
    }
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const contentType = validImage(bytes);
    if (!contentType) {
      return Response.json(
        { error: "Only genuine JPEG, PNG or WebP image files are accepted." },
        { status: 400 }
      );
    }
    if (form.get("consent") !== "yes") {
      return Response.json(
        { error: "Consent is required before adding the photograph." },
        { status: 400 }
      );
    }

    const caption = String(form.get("caption") ?? "").trim().slice(0, 240);
    const displayName =
      String(form.get("displayName") ?? "").trim().slice(0, 40) ||
      "Anonymous";
    const identity = await createVisitorSubmissionIdentity(request);
    objectKey = `nature/${crypto.randomUUID()}`;
    await env.BUCKET.put(objectKey, bytes, {
      httpMetadata: {
        contentType,
        cacheControl: "private, no-store",
      },
    });
    const [entry] = await getDb()
      .insert(natureEntries)
      .values({
        objectKey,
        caption,
        displayName,
        ownerTokenHash: identity.tokenHash,
        status: "pending",
      })
      .returning({
        id: natureEntries.id,
        caption: natureEntries.caption,
        displayName: natureEntries.displayName,
        status: natureEntries.status,
        createdAt: natureEntries.createdAt,
        approvedAt: natureEntries.approvedAt,
      });

    return privateVisitorJson(
      { entry },
      { status: 201 },
      identity.setCookie
    );
  } catch (error) {
    if (objectKey) await env.BUCKET.delete(objectKey).catch(() => {});
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The photograph could not be stored.",
      },
      { status: 500 }
    );
  }
}
