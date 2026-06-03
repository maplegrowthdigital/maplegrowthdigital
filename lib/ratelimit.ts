import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Upstash-backed rate limiting for public POST endpoints.
 *
 * Why separate limiters per surface? So burst usage on the booking flow
 * doesn't eat into the newsletter signup budget — and so the analytics
 * dashboard can show which surface gets the most pressure.
 *
 * Env var resolution — depending on how Upstash was connected:
 *
 *   Direct Upstash dashboard / `@upstash/redis` defaults:
 *     UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *
 *   Vercel Marketplace integration (legacy KV-style names, because
 *   Vercel KV was Upstash under the hood):
 *     KV_REST_API_URL + KV_REST_API_TOKEN
 *
 * We accept either pair so the same code works regardless of which path
 * was used to connect. If neither pair is present (local dev without
 * Upstash), every limiter becomes a no-op that always passes.
 */

const restUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const restToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const hasUpstash = Boolean(restUrl) && Boolean(restToken);

// Shared Redis client — Upstash REST is connectionless so this is safe
// to reuse across function instances. Constructed explicitly (vs
// Redis.fromEnv()) so we can support either naming convention above.
const redis = hasUpstash
  ? new Redis({ url: restUrl!, token: restToken! })
  : null;

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const passthrough = (): LimitResult => ({
  success: true,
  limit: Infinity,
  remaining: Infinity,
  reset: 0,
});

/**
 * Build a slidingWindow limiter. If Upstash isn't configured, return a
 * stub that always succeeds (local dev convenience).
 */
function build(
  prefix: string,
  tokens: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`
) {
  if (!redis) {
    return {
      limit: async (_id: string): Promise<LimitResult> => passthrough(),
      enabled: false as const,
    };
  }
  const r = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
    prefix: `mgd:rl:${prefix}`,
  });
  return {
    limit: (id: string) => r.limit(id) as Promise<LimitResult>,
    enabled: true as const,
  };
}

// Per-surface limits — tune as needed once we see real traffic.
// Newsletter: 3 attempts per 10 min (most legitimate users sign up once).
export const newsletterLimit = build("newsletter", 3, "10 m");

// Configure wizard: 5 submissions per hour (long enough to redo if needed,
// short enough to throttle spammers).
export const configureLimit = build("configure", 5, "1 h");

// TidyCal bookings: 5 attempts per 5 min — covers honest retries on
// "slot just taken" errors but blocks abuse.
export const bookingsLimit = build("bookings", 5, "5 m");

/**
 * Extract the requester's IP address from request headers. Vercel sets
 * x-forwarded-for and x-real-ip. Falls back to "anonymous" so requests
 * without an identifiable IP still hit the limiter (shared bucket).
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}
