import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { contactMessages } from "../../../../db/schema";
import { authorizeAdmin } from "../../../../lib/admin-auth";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../../../lib/local-admin-auth-proof";

async function authorize(request: Request) {
  return authorizeAdmin(
    request.headers.get("cf-access-jwt-assertion"),
    request.headers.get(LOCAL_ADMIN_PROOF_HEADER)
  );
}

function privateResponse(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  const authorization = await authorize(request);
  if (!authorization.authorized) {
    return privateResponse(
      { error: authorization.message },
      authorization.status
    );
  }

  try {
    const db = getDb();
    await db
      .delete(contactMessages)
      .where(sql`${contactMessages.createdAt} < datetime('now', '-12 months')`);
    const messages = await db
      .select({
        id: contactMessages.id,
        name: contactMessages.name,
        email: contactMessages.email,
        message: contactMessages.message,
        createdAt: contactMessages.createdAt,
        readAt: contactMessages.readAt,
      })
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt), desc(contactMessages.id))
      .limit(200);
    return privateResponse({ messages });
  } catch {
    return privateResponse(
      { error: "Unable to load Contact messages." },
      503
    );
  }
}

export async function PATCH(request: Request) {
  const authorization = await authorize(request);
  if (!authorization.authorized) {
    return privateResponse(
      { error: authorization.message },
      authorization.status
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return privateResponse({ error: "A valid message id is required." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return privateResponse({ error: "A valid message id is required." }, 400);
  }
  const { id, read } = body as { id?: unknown; read?: unknown };
  if (
    typeof id !== "number" ||
    !Number.isSafeInteger(id) ||
    (read !== true && read !== false)
  ) {
    return privateResponse({ error: "A valid message id and read state are required." }, 400);
  }

  try {
    const [updated] = await getDb()
      .update(contactMessages)
      .set({ readAt: read ? sql`CURRENT_TIMESTAMP` : null })
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id, readAt: contactMessages.readAt });
    if (!updated) {
      return privateResponse({ error: "Contact message not found." }, 404);
    }
    return privateResponse({ message: updated });
  } catch {
    return privateResponse({ error: "Unable to update the Contact message." }, 503);
  }
}

export async function DELETE(request: Request) {
  const authorization = await authorize(request);
  if (!authorization.authorized) {
    return privateResponse(
      { error: authorization.message },
      authorization.status
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return privateResponse({ error: "A valid message id is required." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return privateResponse({ error: "A valid message id is required." }, 400);
  }
  const { id, confirm } = body as { id?: unknown; confirm?: unknown };
  if (typeof id !== "number" || !Number.isSafeInteger(id) || confirm !== true) {
    return privateResponse(
      { error: "Confirm deletion of the Contact message." },
      400
    );
  }

  try {
    const [deleted] = await getDb()
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id });
    if (!deleted) {
      return privateResponse({ error: "Contact message not found." }, 404);
    }
    return privateResponse({ deleted: true });
  } catch {
    return privateResponse({ error: "Unable to delete the Contact message." }, 503);
  }
}
