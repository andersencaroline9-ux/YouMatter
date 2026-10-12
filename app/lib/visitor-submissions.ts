const SECURE_VISITOR_COOKIE = "__Host-youmatter-visitor";
const LOCAL_VISITOR_COOKIE = "youmatter-visitor";
const VISITOR_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type VisitorSubmissionIdentity = {
  tokenHash: string;
  setCookie: string | null;
};

export async function getVisitorTokenHash(
  request: Request
): Promise<string | null> {
  const { cookieName } = cookieSettings(request);
  const token = readVisitorToken(request, cookieName);
  return token ? hashVisitorToken(token) : null;
}

export async function createVisitorSubmissionIdentity(
  request: Request
): Promise<VisitorSubmissionIdentity> {
  const { cookieName, secure } = cookieSettings(request);
  const existingToken = readVisitorToken(request, cookieName);
  if (existingToken) {
    return {
      tokenHash: await hashVisitorToken(existingToken),
      setCookie: null,
    };
  }

  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = encodeBase64Url(tokenBytes);
  const tokenHash = await hashVisitorToken(token);
  return {
    tokenHash,
    setCookie: `${cookieName}=${token}; Path=/; Max-Age=${VISITOR_COOKIE_MAX_AGE};${secure ? " Secure;" : ""} HttpOnly; SameSite=Lax`,
  };
}

export function privateVisitorJson(
  body: unknown,
  init: ResponseInit = {},
  setCookie: string | null = null
): Response {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "private, no-store");
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return Response.json(body, { ...init, headers });
}

function cookieSettings(request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  return {
    secure,
    cookieName: secure ? SECURE_VISITOR_COOKIE : LOCAL_VISITOR_COOKIE,
  };
}

function readVisitorToken(request: Request, cookieName: string): string | null {
  const cookies = request.headers.get("cookie")?.split(";") ?? [];
  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");
    if (separator < 0 || cookie.slice(0, separator).trim() !== cookieName) {
      continue;
    }

    const token = cookie.slice(separator + 1).trim();
    return VISITOR_TOKEN_PATTERN.test(token) ? token : null;
  }
  return null;
}

async function hashVisitorToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  return encodeBase64Url(new Uint8Array(digest));
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
