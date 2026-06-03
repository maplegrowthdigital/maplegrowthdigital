import "server-only";

/**
 * Cloudflare Turnstile server-side token verification.
 *
 * Flow:
 *   1. Client renders the Turnstile widget → user solves (often invisibly).
 *   2. Widget produces a single-use token via its `callback`.
 *   3. Client submits the token alongside form data.
 *   4. Server POSTs the token + secret to Cloudflare → gets ok/fail.
 *
 * Env vars:
 *   TURNSTILE_SECRET_KEY — required for verification.
 *
 * If TURNSTILE_SECRET_KEY is unset (local dev without Cloudflare),
 * `verifyTurnstile` returns true so forms still work. Production must
 * have the key set or the protection is silently disabled.
 */

const SECRET = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface VerifyResult {
  ok: boolean;
  /** Cloudflare error codes (https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) */
  errors?: string[];
}

/**
 * Verify a Turnstile token against Cloudflare. Returns { ok: true } if
 * the token is valid, or { ok: false, errors } if not.
 *
 * Pass the user's IP as `remoteip` for the verification call — Cloudflare
 * uses it as one of the bot-detection signals.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string
): Promise<VerifyResult> {
  // No secret configured → skip verification (dev mode).
  if (!SECRET) return { ok: true };

  if (!token) {
    return { ok: false, errors: ["missing-input-response"] };
  }

  try {
    const body = new URLSearchParams({
      secret: SECRET,
      response: token,
    });
    if (remoteIp && remoteIp !== "anonymous") {
      body.append("remoteip", remoteIp);
    }

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      // Cloudflare's verification endpoint is well-cached on their side;
      // we still want a fresh check per submit so no caching here.
      cache: "no-store",
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (data.success) return { ok: true };
    return { ok: false, errors: data["error-codes"] ?? ["verify-failed"] };
  } catch {
    // Network error talking to Cloudflare — fail closed to be safe.
    return { ok: false, errors: ["network-error"] };
  }
}
