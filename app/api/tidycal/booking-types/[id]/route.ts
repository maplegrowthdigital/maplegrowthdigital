import { NextRequest, NextResponse } from "next/server";
import { mock } from "../../../../../lib/tidycal-mock";
import { sanitizeHtml } from "../../../../../lib/sanitize-html";

/**
 * GET /api/tidycal/booking-types/[id]
 *
 * Proxies TidyCal's GET /booking-types/{id} with the server-only
 * TIDYCAL_TOKEN. Used by the BookingWidget to enrich the selected
 * booking type with fields that aren't returned by the list endpoint —
 * notably the configured `booking_questions` (or whichever field name
 * TidyCal uses on this account/plan).
 *
 * The `description` field is run through `sanitizeHtml` before being
 * sent to the client (rendered via dangerouslySetInnerHTML).
 *
 * Cached 5 minutes — like the list route.
 *
 * Mock fallback when TIDYCAL_TOKEN is absent so dev keeps working.
 */

const BASE = process.env.TIDYCAL_BASE_URL || "https://tidycal.com/api";

export const revalidate = 300;

/**
 * Clean the description field on either { data: {...} } or a bare
 * booking-type object (TidyCal returns one or the other depending on
 * the endpoint version).
 */
function sanitizeDescription(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const obj = payload as { data?: unknown };
  const target = obj.data ?? obj;
  if (target && typeof target === "object") {
    const t = target as { description?: unknown };
    if (typeof t.description === "string") {
      const clean = sanitizeHtml(t.description);
      if (obj.data) {
        obj.data = { ...t, description: clean };
        return obj;
      }
      return { ...t, description: clean };
    }
  }
  return payload;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const token = process.env.TIDYCAL_TOKEN;

  if (!token) {
    const found = mock.getBookingType(id);
    if (!found) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(sanitizeDescription({ data: found }));
  }

  const url = `${BASE}/booking-types/${id}`;
  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
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
        { error: `TidyCal returned ${upstream.status}`, upstream: body },
        { status: upstream.status }
      );
    }

    return NextResponse.json(sanitizeDescription(body));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}
