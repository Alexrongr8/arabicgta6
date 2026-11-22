/** Deployment attestations only. Keep both off until configuration, recipient review and a delivery test are complete. */
export function digestEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.DIGEST_ENABLED === "true" && env.DIGEST_DELIVERY_VERIFIED === "true";
}
