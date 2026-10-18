export const PUBLIC_JSON_BODY_LIMIT_BYTES = 8_192;

export class RequestBodyTooLargeError extends Error {}

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    /^\d+$/.test(contentLength) &&
    Number(contentLength) > maxBytes
  ) {
    throw new RequestBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("A request body is required.");

  const decoder = new TextDecoder("utf-8", { fatal: true });
  let rawBody = "";
  let bytesRead = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new RequestBodyTooLargeError();
      }
      rawBody += decoder.decode(value, { stream: true });
    }
    rawBody += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(rawBody) as unknown;
}
