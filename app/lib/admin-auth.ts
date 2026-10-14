import { env } from "cloudflare:workers";
import { verifyLocalAdminProof } from "./local-admin-auth-proof";

type AccessJwk = JsonWebKey & {
  alg: "RS256";
  kid: string;
  kty: "RSA";
  use: "sig";
};

type AccessClaims = {
  aud: string | string[];
  email: string;
  exp: number;
  iss: string;
  nbf?: number;
};

export type AdminAuthorization =
  | { authorized: true; email: string }
  | { authorized: false; status: 401 | 403 | 503; message: string };

const CLOCK_SKEW_SECONDS = 30;
const KEY_CACHE_MS = 5 * 60 * 1000;
const KEY_REFRESH_COOLDOWN_MS = 30 * 1000;
const jwksCache = new Map<
  string,
  { expiresAt: number; lastForcedRefreshAt: number; keys: AccessJwk[] }
>();

export async function authorizeAdmin(
  assertion: string | null,
  localAdminProof: string | null
): Promise<AdminAuthorization> {
  const localAdminSecret = env.LOCAL_ADMIN_MARKER_SECRET;
  if (
    localAdminSecret &&
    (await verifyLocalAdminProof(localAdminProof, localAdminSecret))
  ) {
    return { authorized: true, email: "local-admin@youmatter.test" };
  }

  const issuer = getTeamIssuer(env.CF_ACCESS_TEAM_DOMAIN);
  const audience = env.CF_ACCESS_AUD?.trim();
  const allowedEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (
    !issuer ||
    !audience ||
    allowedEmails.length === 0
  ) {
    return {
      authorized: false,
      status: 503,
      message: "Admin authorization is not configured.",
    };
  }

  if (!assertion || assertion.length > 16_384) {
    return unauthorized();
  }

  const token = parseJwt(assertion);
  if (!token || token.header.alg !== "RS256" || !token.header.kid) {
    return unauthorized();
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    token.claims.iss !== issuer ||
    !hasAudience(token.claims.aud, audience) ||
    token.claims.exp <= now - CLOCK_SKEW_SECONDS ||
    (token.claims.nbf !== undefined &&
      token.claims.nbf > now + CLOCK_SKEW_SECONDS)
  ) {
    return unauthorized();
  }

  let keys = await getAccessKeys(issuer);
  if (!keys) return unavailable();
  let key = keys.find((candidate) => candidate.kid === token.header.kid);
  if (!key) {
    keys = await getAccessKeys(issuer, true);
    if (!keys) return unavailable();
    key = keys.find((candidate) => candidate.kid === token.header.kid);
  }
  if (!key) return unauthorized();

  let signatureIsValid: boolean;
  try {
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    signatureIsValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      token.signature,
      token.signedContent
    );
  } catch (error) {
    console.error("Cloudflare Access assertion verification failed.", error);
    return unavailable();
  }

  if (!signatureIsValid) return unauthorized();

  const email = token.claims.email.trim().toLowerCase();
  if (!allowedEmails.includes(email)) {
    return {
      authorized: false,
      status: 403,
      message: "Administrator access is not allowed.",
    };
  }

  return { authorized: true, email };
}

function unauthorized(): AdminAuthorization {
  return {
    authorized: false,
    status: 401,
    message: "A valid Cloudflare Access identity is required.",
  };
}

function unavailable(): AdminAuthorization {
  return {
    authorized: false,
    status: 503,
    message: "Admin identity verification is temporarily unavailable.",
  };
}

function hasAudience(audience: string | string[], expected: string): boolean {
  return Array.isArray(audience)
    ? audience.includes(expected)
    : audience === expected;
}

function getTeamIssuer(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const issuer = new URL(value.trim());
    if (
      issuer.protocol !== "https:" ||
      !issuer.hostname.endsWith(".cloudflareaccess.com") ||
      issuer.port ||
      issuer.pathname !== "/" ||
      issuer.search ||
      issuer.hash ||
      issuer.username ||
      issuer.password
    ) {
      return null;
    }
    return issuer.origin;
  } catch {
    return null;
  }
}

function parseJwt(value: string): {
  claims: AccessClaims;
  header: { alg?: string; kid?: string };
  signature: Uint8Array;
  signedContent: Uint8Array;
} | null {
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const headerBytes = decodeBase64Url(parts[0]);
  const claimsBytes = decodeBase64Url(parts[1]);
  const signature = decodeBase64Url(parts[2]);
  if (!headerBytes || !claimsBytes || !signature) return null;

  try {
    const header: unknown = JSON.parse(new TextDecoder().decode(headerBytes));
    const claims: unknown = JSON.parse(new TextDecoder().decode(claimsBytes));
    if (
      !isRecord(header) ||
      !isRecord(claims) ||
      typeof header.alg !== "string" ||
      typeof header.kid !== "string" ||
      typeof claims.iss !== "string" ||
      typeof claims.email !== "string" ||
      typeof claims.exp !== "number" ||
      !Number.isFinite(claims.exp) ||
      (claims.nbf !== undefined &&
        (typeof claims.nbf !== "number" || !Number.isFinite(claims.nbf)))
    ) {
      return null;
    }

    const audience = parseAudience(claims.aud);
    if (!audience) return null;

    const parsedClaims: AccessClaims = {
      aud: audience,
      email: claims.email,
      exp: claims.exp,
      iss: claims.iss,
      ...(typeof claims.nbf === "number" ? { nbf: claims.nbf } : {}),
    };

    return {
      header: { alg: header.alg, kid: header.kid },
      claims: parsedClaims,
      signature,
      signedContent: new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    };
  } catch {
    return null;
  }
}

function parseAudience(value: unknown): string | string[] | null {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return null;

  const audiences: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") return null;
    audiences.push(item);
  }
  return audiences.length > 0 ? audiences : null;
}

function decodeBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;

  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAccessJwk(value: unknown): value is AccessJwk {
  return (
    isRecord(value) &&
    value.kty === "RSA" &&
    value.use === "sig" &&
    value.alg === "RS256" &&
    typeof value.kid === "string" &&
    value.kid.length > 0 &&
    typeof value.n === "string" &&
    typeof value.e === "string"
  );
}

async function getAccessKeys(
  issuer: string,
  refresh = false
): Promise<AccessJwk[] | null> {
  const url = new URL("/cdn-cgi/access/certs", issuer).toString();
  const cached = jwksCache.get(url);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    if (
      !refresh ||
      now - cached.lastForcedRefreshAt < KEY_REFRESH_COOLDOWN_MS
    ) {
      return cached.keys;
    }
    cached.lastForcedRefreshAt = now;
  }

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (error) {
    console.error("Could not fetch Cloudflare Access public keys.", error);
    return null;
  }
  if (!response.ok) {
    console.error(
      `Cloudflare Access public-key endpoint returned ${response.status}.`
    );
    return null;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    console.error("Cloudflare Access returned invalid public-key data.", error);
    return null;
  }
  if (!isRecord(body) || !Array.isArray(body.keys)) {
    console.error("Cloudflare Access returned an unexpected public-key set.");
    return null;
  }

  const keys = body.keys.filter(isAccessJwk);
  if (keys.length === 0) {
    console.error("Cloudflare Access returned no supported signing keys.");
    return null;
  }
  jwksCache.set(url, {
    keys,
    expiresAt: Date.now() + KEY_CACHE_MS,
    lastForcedRefreshAt: refresh ? Date.now() : 0,
  });
  return keys;
}
