import { env } from "cloudflare:workers";
import {
  LIVE_ADVENTURE_WAITLIST_CAPACITY,
} from "../../../lib/live-adventure-cohort";
import {
  purgeExpiredReconnectInterests,
} from "../../../lib/privacy-retention";
import {
  PUBLIC_JSON_BODY_LIMIT_BYTES,
  readJsonBody,
  RequestBodyTooLargeError,
} from "../../../lib/request-json";

const FIRST_NAME_MAX_LENGTH = 40;
const EMAIL_MAX_LENGTH = 254;
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

async function getInterestCount() {
  if (!env.DB) throw new Error("D1 binding is unavailable.");
  const result = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM live_adventure_interests"
  ).first<{ total: number }>();
  if (!result) throw new Error("Waiting-list count is unavailable.");
  return result.total;
}

export async function GET() {
  try {
    await purgeExpiredReconnectInterests(env.DB);
    return Response.json(
      {
        isFull:
          (await getInterestCount()) >= LIVE_ADVENTURE_WAITLIST_CAPACITY,
      },
      {
        headers: PRIVATE_HEADERS,
      }
    );
  } catch {
    return Response.json(
      { error: "The waiting-list status is temporarily unavailable." },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJsonBody(request, PUBLIC_JSON_BODY_LIMIT_BYTES);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof RequestBodyTooLargeError
            ? "The submission is too large."
            : "Enter your first name and email address.",
      },
      {
        status: error instanceof RequestBodyTooLargeError ? 413 : 400,
        headers: PRIVATE_HEADERS,
      }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      { error: "Enter your first name and email address." },
      { status: 400, headers: PRIVATE_HEADERS }
    );
  }

  const values = body as { name?: unknown; email?: unknown };
  const name = typeof values.name === "string" ? values.name.trim() : "";
  if (
    !name ||
    name.length > FIRST_NAME_MAX_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(name)
  ) {
    return Response.json(
      { error: "Enter a first name of 40 characters or fewer." },
      { status: 400, headers: PRIVATE_HEADERS }
    );
  }

  const email =
    typeof values.email === "string" ? values.email.trim().toLowerCase() : "";
  if (
    email.length > EMAIL_MAX_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return Response.json(
      { error: "Enter a valid email address." },
      { status: 400, headers: PRIVATE_HEADERS }
    );
  }

  try {
    if (!env.DB) throw new Error("D1 binding is unavailable.");
    await purgeExpiredReconnectInterests(env.DB);

    const inserted = await env.DB.prepare(
      `INSERT INTO live_adventure_interests (name, email)
       SELECT ?, ?
       WHERE (SELECT COUNT(*) FROM live_adventure_interests) < ?
       ON CONFLICT(email) DO NOTHING
       RETURNING id`
    )
      .bind(name, email, LIVE_ADVENTURE_WAITLIST_CAPACITY)
      .first<{ id: number }>();

    if (!inserted) {
      if ((await getInterestCount()) >= LIVE_ADVENTURE_WAITLIST_CAPACITY) {
        return Response.json(
          { error: "This group’s waiting list is currently full." },
          { status: 409, headers: PRIVATE_HEADERS }
        );
      }
    }

    return Response.json(
      { success: true },
      { status: 201, headers: PRIVATE_HEADERS }
    );
  } catch {
    return Response.json(
      { error: "We couldn’t add you just now. Please try again." },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
