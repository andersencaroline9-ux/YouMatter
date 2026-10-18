import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { contactMessages } from "../../../db/schema";
import { purgeExpiredContactMessages } from "../../../lib/privacy-retention";
import {
  readJsonBody,
  RequestBodyTooLargeError,
} from "../../../lib/request-json";

const MAX_BODY_BYTES = 24_000;
const MIN_COMPLETION_MS = 2_500;
const MAX_COMPLETION_MS = 60 * 60 * 1000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clearSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `contact_started_at=; Max-Age=0; Path=/api/contact; HttpOnly; SameSite=Strict${secure}`;
}

function response(
  body: object,
  status: number,
  request: Request,
  clearSession = false
) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (clearSession) {
    headers.set("Set-Cookie", clearSessionCookie(request));
  }
  return Response.json(body, { status, headers });
}

function sessionStartedAt(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("contact_started_at="))
    ?.slice("contact_started_at=".length);
  if (!value || !/^\d{13}$/.test(value)) return null;
  const timestamp = Number(value);
  const elapsed = Date.now() - timestamp;
  return elapsed >= MIN_COMPLETION_MS && elapsed <= MAX_COMPLETION_MS
    ? timestamp
    : null;
}

export async function POST(request: Request) {
  const startedAt = sessionStartedAt(request);
  if (startedAt === null) {
    return response(
      { error: "Please refresh the form and try again." },
      400,
      request,
      true
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return response({ error: "The message is too large." }, 413, request, true);
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return response({ error: "The message is too large." }, 413, request, true);
    }
    return response({ error: "Please check the form and try again." }, 400, request);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return response({ error: "Please check the form and try again." }, 400, request);
  }

  const payload = body as Record<string, unknown>;
  if (
    Object.keys(payload).some(
      (key) => !["name", "email", "message", "company"].includes(key)
    )
  ) {
    return response({ error: "Please check the form and try again." }, 400, request);
  }

  if (payload.company !== undefined && typeof payload.company !== "string") {
    return response({ error: "Please check the form and try again." }, 400, request);
  }
  if (typeof payload.company === "string" && payload.company.trim()) {
    return response({ success: true }, 200, request, true);
  }

  const errors: Record<string, string> = {};
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  if (payload.name !== undefined && typeof payload.name !== "string") {
    errors.name = "Please enter a valid name.";
  }
  if (!email) {
    errors.email = "Please enter your email address.";
  } else {
    if (
      email.length > MAX_EMAIL_LENGTH ||
      /[\r\n\u0000-\u001f\u007f]/.test(email) ||
      !EMAIL_PATTERN.test(email)
    ) {
      errors.email = "Please enter a valid email address.";
    }
  }
  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Your message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }
  if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Your name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return response({ fieldErrors: errors }, 400, request);
  }

  try {
    await purgeExpiredContactMessages(env.DB);
    const db = getDb();
    await db.insert(contactMessages).values({
      name: name || null,
      email,
      message,
    });
    return response({ success: true }, 200, request, true);
  } catch {
    return response(
      { error: "Your message could not be sent. Please try again later." },
      503,
      request
    );
  }
}
