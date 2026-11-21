import { CHALLENGES, type Challenge } from "../../data/challenges";

/** Days since epoch in Riyadh time (UTC+3), so content flips at local midnight. */
export function riyadhDayNumber(now = Date.now()): number {
  return Math.floor((now + 3 * 3600e3) / 864e5);
}

export function pickDaily<T>(list: T[], salt = 0, now?: number): T | null {
  if (!list.length) return null;
  const n = riyadhDayNumber(now) + salt;
  // simple deterministic shuffle so consecutive days aren't neighbours in the list
  return list[(n * 7919) % list.length];
}

export function weeklyChallenge(now?: number): Challenge {
  const week = Math.floor((riyadhDayNumber(now) + 3) / 7); // weeks start on Sunday
  return CHALLENGES[week % CHALLENGES.length];
}
