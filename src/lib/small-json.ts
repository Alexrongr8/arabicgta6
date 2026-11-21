export class RequestBodyError extends Error {
  constructor(public readonly status: number) { super("Invalid request body"); }
}

/** Bound streamed bodies too: Content-Length alone is not a trustworthy size limit. */
export async function smallJson(request: Request, maxBytes = 4096, timeoutMs = 2000): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new RequestBodyError(415);
  }
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new RequestBodyError(413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError(400);
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      void reader.cancel().catch(() => {});
      reject(new RequestBodyError(408));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      (async () => {
        const chunks: Uint8Array[] = [];
        let size = 0;
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > maxBytes) {
            void reader.cancel().catch(() => {});
            throw new RequestBodyError(413);
          }
          chunks.push(value);
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
        catch { throw new RequestBodyError(400); }
      })(),
      deadline,
    ]);
  } finally {
    clearTimeout(timeout);
    try { reader.releaseLock(); } catch {}
  }
}
