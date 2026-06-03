import { NextRequest, NextResponse } from "next/server";
import { resend, resendConfig } from "../../../lib/resend";
import { newsletterLimit, clientIp } from "../../../lib/ratelimit";
import { verifyTurnstile } from "../../../lib/turnstile";

/**
 * POST /api/newsletter
 *
 * Body: {
 *   email: string,
 *   firstName?: string,
 *   honeypot?: string,
 *   turnstileToken?: string,
 * }
 *
 * Defense layers (in order):
 *   1. Honeypot — silent 200 if filled (bots learn nothing).
 *   2. Upstash rate limit — 3 attempts per IP per 10 min.
 *   3. Cloudflare Turnstile — token verified against Cloudflare's API.
 *   4. Email format validation.
 *   5. Resend audience write.
 *
 * Idempotent — if the contact already exists, Resend's error is treated
 * as 200 (alreadySubscribed: true).
 *
 * Not cached. Public route.
 */
export const dynamic = "force-dynamic";

const isValidEmail = (s: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

interface NewsletterPayload {
  email?: string;
  firstName?: string;
  /** Honeypot field — bots auto-fill; humans don't see it. Reject if present. */
  honeypot?: string;
  /** Cloudflare Turnstile token from the client widget. */
  turnstileToken?: string;
}

export async function POST(req: NextRequest) {
  // 1. Parse + validate input
  let body: NewsletterPayload;
  try {
    body = (await req.json()) as NewsletterPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 1. Honeypot — silently accept (200) so bots don't learn anything.
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. Rate limit by IP.
  const ip = clientIp(req);
  const limit = await newsletterLimit.limit(ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        error: "Too many attempts. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.reset),
        },
      }
    );
  }

  // 3. Turnstile CAPTCHA verification.
  const cap = await verifyTurnstile(body.turnstileToken, ip);
  if (!cap.ok) {
    return NextResponse.json(
      { error: "CAPTCHA verification failed. Please try again." },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const firstName = (body.firstName ?? "").trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // 2. Server-side config checks
  if (!resendConfig.hasApiKey) {
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 503 }
    );
  }
  if (!resendConfig.audienceId) {
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 503 }
    );
  }

  // 3. Add to Resend Audience
  try {
    const result = await resend.contacts.create({
      audienceId: resendConfig.audienceId,
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
    });

    // Resend SDK shape: { data, error }. Treat "already exists" as success.
    if (result.error) {
      const msg = result.error.message ?? "";
      const alreadySubscribed = /already exists|already subscribed/i.test(msg);
      if (alreadySubscribed) {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      return NextResponse.json(
        {
          error: "We couldn't sign you up just now. Please try again.",
          // Upstream Resend error surfaced so DevTools Network tab shows
          // the real cause (visible only on failure responses, not on
          // successful subscribes).
          upstream: {
            name: result.error.name,
            message: result.error.message,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "We couldn't sign you up just now. Please try again.",
        upstream: {
          name: "exception",
          message: err instanceof Error ? err.message : String(err),
        },
      },
      { status: 502 }
    );
  }
}
