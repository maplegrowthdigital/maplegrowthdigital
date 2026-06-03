import { NextRequest, NextResponse } from "next/server";
import { mock } from "../../../../lib/tidycal-mock";
import { bookingsLimit, clientIp } from "../../../../lib/ratelimit";

/**
 * POST /api/tidycal/bookings
 *
 * Body: {
 *   booking_type_id: number,
 *   starts_at: string (ISO),
 *   name: string,
 *   email: string,
 *   timezone: string,
 *   booking_questions?: Array<{ question, answer }>
 * }
 *
 * Proxies to TidyCal's POST /booking-types/{id}/bookings with the
 * server-only TIDYCAL_TOKEN. Validates required input before forwarding.
 *
 * Rate-limited: 5 attempts per IP per 5 min. Honest "slot just taken"
 * retries are accommodated; scripted abuse is throttled.
 *
 * No Turnstile here — the widget is multi-step (browse types → pick day
 * → pick slot → enter details) which makes the POST naturally less
 * abusable than a one-click form.
 */

const BASE = process.env.TIDYCAL_BASE_URL || "https://tidycal.com/api";

export const dynamic = "force-dynamic";

interface BookingRequest {
  booking_type_id: number;
  starts_at: string;
  name: string;
  email: string;
  timezone: string;
  booking_questions?: Array<{ question: string; answer: string }>;
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isValidIso = (s: string) => !Number.isNaN(new Date(s).getTime());

export async function POST(req: NextRequest) {
  // Rate limit by IP — covers honest retries on "slot just taken" errors
  // (5 per 5 min budget) while throttling scripted abuse.
  const ip = clientIp(req);
  const limit = await bookingsLimit.limit(ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        error: "Too many booking attempts. Please wait a few minutes.",
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

  let body: BookingRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    booking_type_id,
    starts_at,
    name,
    email,
    timezone,
    booking_questions,
  } = body;

  if (
    !booking_type_id ||
    !Number.isFinite(Number(booking_type_id)) ||
    Number(booking_type_id) <= 0
  ) {
    return NextResponse.json(
      { error: "booking_type_id is required" },
      { status: 400 }
    );
  }
  if (!starts_at || !isValidIso(starts_at)) {
    return NextResponse.json(
      { error: "starts_at must be a valid ISO date string" },
      { status: 400 }
    );
  }
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "name is required (min 2 chars)" },
      { status: 400 }
    );
  }
  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }
  if (!timezone || typeof timezone !== "string") {
    return NextResponse.json(
      { error: "timezone is required" },
      { status: 400 }
    );
  }

  const token = process.env.TIDYCAL_TOKEN;

  if (!token) {
    // Mock booking — simulate latency for consistent UX with real API
    await new Promise((r) => setTimeout(r, 900));
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { error: "That slot was just taken. Please pick another time." },
        { status: 409 }
      );
    }
    return NextResponse.json({
      data: mock.createBooking(Number(booking_type_id), {
        name: name.trim(),
        email: email.trim(),
        timezone,
        starts_at,
        booking_questions,
      }),
    });
  }

  // TidyCal requires dates without milliseconds (Y-m-d\TH:i:s\Z)
  const startsAtTidyCal = starts_at.replace(/\.\d+Z$/, "Z");

  try {
    const upstream = await fetch(
      `${BASE}/booking-types/${Number(booking_type_id)}/bookings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          starts_at: startsAtTidyCal,
          name: name.trim(),
          email: email.trim(),
          timezone,
          ...(booking_questions ? { booking_questions } : {}),
        }),
        cache: "no-store",
      }
    );

    // TidyCal returns 409 when the slot was just taken
    if (upstream.status === 409) {
      return NextResponse.json(
        { error: "That slot was just taken. Please pick another time." },
        { status: 409 }
      );
    }

    const text = await upstream.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `TidyCal returned ${upstream.status}`, upstream: body },
        { status: upstream.status }
      );
    }
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}
