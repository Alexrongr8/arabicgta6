import "server-only";

/** A configured backend is authoritative: unavailable is different from empty/not found. */
export class PublicReadError extends Error {
  constructor(readonly operation: string, cause?: unknown) {
    super("Public content is temporarily unavailable.", { cause });
    this.name = "PublicReadError";
  }
}

type ReadResult<T> = { data: T | null; error: unknown };
type ReadQuery<T> = { abortSignal(signal: AbortSignal): PromiseLike<ReadResult<T>> }
  | ((signal: AbortSignal) => PromiseLike<ReadResult<T>>);

/** Reuse one signal across stages of a read, particularly exact + partial search. */
export function publicReadSignal(milliseconds = 4000): AbortSignal {
  return AbortSignal.timeout(milliseconds);
}

export async function publicRead<T>(operation: string, query: ReadQuery<T>, signal = publicReadSignal()): Promise<T | null> {
  if (signal.aborted) throw new PublicReadError(operation);
  let abort: (() => void) | undefined;
  const deadline = new Promise<never>((_, reject) => {
    abort = () => reject(new PublicReadError(operation));
    signal.addEventListener("abort", abort, { once: true });
  });
  try {
    // The signal cancels the transport; the race also bounds an unresponsive transport.
    const request = typeof query === "function" ? query(signal) : query.abortSignal(signal);
    const { data, error } = await Promise.race([request, deadline]);
    if (error) throw new PublicReadError(operation, error);
    return data;
  } catch (error) {
    throw error instanceof PublicReadError ? error : new PublicReadError(operation, error);
  } finally {
    if (abort) signal.removeEventListener("abort", abort);
  }
}
