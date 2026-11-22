/** Weekly newsletter. Default/--dry is an offline seed preview; --send also requires both readiness flags. */
import "./lib/env";
import { Resend } from "resend";
import { db } from "./lib/db";
import { SEED_ITEMS } from "../data/seed";
import { runDigest } from "./lib/digest";

runDigest(process.argv.slice(2), process.env, {
  db,
  seed: () => SEED_ITEMS,
  send: (key, message, idempotencyKey) => new Resend(key).emails.send(message, { idempotencyKey, signal: AbortSignal.timeout(15_000) }),
}).catch((error) => {
  console.error(error instanceof Error ? error.message : "Digest failed; review required.");
  process.exitCode = 1;
});
