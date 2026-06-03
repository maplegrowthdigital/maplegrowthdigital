import { NextRequest, NextResponse } from "next/server";
import { mock } from "../../../../lib/tidycal-mock";

/**
 * GET /api/tidycal/timeslots?booking_type_id=N&starts_at=ISO&ends_at=ISO
 *
 * Proxies to TidyCal's GET /booking-types/{id}/timeslots with the
 * server-only TIDYCAL_TOKEN. Falls back to mock data when no token.
 *
 * Cached for 60s — timeslot availability changes minute-to-minute as
 * other people book; 60s is a reasonable freshness window without
 * hammering the API.
 */

const BASE = process.env.TIDYCAL_BASE_URL || "https://tidycal.com/api";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingTypeId = searchParams.get("booking_type_id");
  const startsAt = searchParams.get("starts_at");
  const endsAt = searchParams.get("ends_at");

  if (!bookingTypeId || !startsAt || !endsAt) {
    return NextResponse.json(
      { error: "Missing booking_type_id, starts_at, or ends_at" },
      { status: 400 }
    );
  }

  const idNum = Number(bookingTypeId);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return NextResponse.json(
      { error: "Invalid booking_type_id" },
      { status: 400 }
    );
  }

  const token = process.env.TIDYCAL_TOKEN;

  if (!token) {
    return NextResponse.json({
      data: mock.getTimeslots(idNum, startsAt, endsAt),
    });
  }

  // TidyCal requires dates in strict ISO without milliseconds (Y-m-d\TH:i:s\Z),
  // but JS's Date.toISOString() always includes ".NNN" milliseconds. Strip them.
  const toTidyCalDate = (iso: string) => iso.replace(/\.\d+Z$/, "Z");

  const upstreamUrl =
    `${BASE}/booking-types/${idNum}/timeslots?` +
    new URLSearchParams({
      starts_at: toTidyCalDate(startsAt),
      ends_at: toTidyCalDate(endsAt),
    }).toString();

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    const text = await upstream.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: `TidyCal returned ${upstream.status}`,
          upstream: body,
        },
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
