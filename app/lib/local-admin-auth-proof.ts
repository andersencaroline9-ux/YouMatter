export const LOCAL_ADMIN_PROOF_HEADER = "x-youmatter-local-admin-proof";

const PROOF_LIFETIME_SECONDS = 15;

export async function createLocalAdminProof(secret: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(timestamp)
  );

  return `${timestamp}.${toHex(new Uint8Array(signature))}`;
}

export async function verifyLocalAdminProof(
  proof: string | null,
  secret: string
): Promise<boolean> {
  if (!proof || proof.length > 80) return false;

  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(proof);
  if (!match) return false;

  const timestamp = Number(match[1]);
  const now = Math.floor(Date.now() / 1000);
  if (
    timestamp > now + 2 ||
    timestamp < now - PROOF_LIFETIME_SECONDS
  ) {
    return false;
  }

  try {
    const key = await importHmacKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromHex(match[2]),
      new TextEncoder().encode(match[1])
    );
  } catch {
    return false;
  }
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function fromHex(value: string): ArrayBuffer {
  const bytes = new Uint8Array(new ArrayBuffer(value.length / 2));
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes.buffer;
}
