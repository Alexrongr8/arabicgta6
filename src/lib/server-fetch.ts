/** A per-request network deadline; preserve cancellation from the caller. */
export function serverFetch(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 5000): Promise<Response> {
  const inherited = init?.signal ?? (input instanceof Request ? input.signal : undefined);
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = inherited ? AbortSignal.any([inherited, timeout]) : timeout;
  return fetch(input, { ...init, signal });
}
