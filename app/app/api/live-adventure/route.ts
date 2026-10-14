import { env } from "cloudflare:workers";

const PUBLIC_TARGET = 15;
const WAITING_LIST_CAPACITY = 20;
const FIRST_NAME_MAX_LENGTH = 40;
const EMAIL_MAX_LENGTH = 254;
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

function publicCount(total: number) {
  return {
    interestCount: Math.min(total, PUBLIC_TARGET),
    publicTarget: PUBLIC_TARGET,
    waitingListFull: total >= WAITING_LIST_CAPACITY,
    reserveActive: total >= PUBLIC_TARGET,
  };
}

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
    return Response.json(publicCount(await getInterestCount()), {
      headers: PRIVATE_HEADERS,
    });
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
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Enter your first name and email address." },
      { status: 400, headers: PRIVATE_HEADERS }
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

    const inserted = await env.DB.prepare(
      `INSERT INTO live_adventure_interests (name, email)
       SELECT ?, ?
       WHERE (SELECT COUNT(*) FROM live_adventure_interests) < ?
       ON CONFLICT(email) DO NOTHING
       RETURNING id`
    )
      .bind(name, email, WAITING_LIST_CAPACITY)
      .first<{ id: number }>();

    if (!inserted) {
      const existing = await env.DB.prepare(
        "SELECT id FROM live_adventure_interests WHERE email = ? LIMIT 1"
      )
        .bind(email)
        .first<{ id: number }>();
      if (existing) {
        return Response.json(
          {
            alreadyRegistered: true,
            message: "You’re already on the waiting list.",
          },
          { headers: PRIVATE_HEADERS }
        );
      }
      return Response.json(
        { error: "This group’s waiting list is currently full." },
        { status: 409, headers: PRIVATE_HEADERS }
      );
    }

    const position = await env.DB.prepare(
      "SELECT COUNT(*) AS position FROM live_adventure_interests WHERE id <= ?"
    )
      .bind(inserted.id)
      .first<{ position: number }>();
    if (!position) throw new Error("Waiting-list position is unavailable.");

    return Response.json(
      { reserve: position.position > PUBLIC_TARGET },
      { status: 201, headers: PRIVATE_HEADERS }
    );
  } catch {
    return Response.json(
      { error: "We couldn’t add you just now. Please try again." },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
