import { NextResponse } from "next/server";
import { mock } from "../../../../lib/tidycal-mock";
import { sanitizeHtml } from "../../../../lib/sanitize-html";

/**
 * GET /api/tidycal/booking-types
 *
 * Proxies to TidyCal's GET /booking-types with the server-only
 * TIDYCAL_TOKEN. If the token isn't configured, returns mock data
 * so local dev keeps working.
 *
 * Booking-type descriptions are run through `sanitizeHtml` before
 * being sent to the client (the BookingWidget renders them via
 * dangerouslySetInnerHTML).
 *
 * Cached for 5 minutes — booking types change rarely.
 */

const BASE = process.env.TIDYCAL_BASE_URL || "https://tidycal.com/api";

export const revalidate = 300;

/**
 * Clean each booking-type's description field. We accept either the
 * raw array or the { data: [...] } envelope that TidyCal returns.
 */
function sanitizeDescriptions(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  const obj = payload as { data?: unknown };
  const list = Array.isArray(obj.data) ? obj.data : null;
  if (!list) return payload;
  obj.data = list.map((item) => {
    if (!item || typeof item !== "object") return item;
    const t = item as { description?: unknown };
    if (typeof t.description === "string") {
      return { ...t, description: sanitizeHtml(t.description) };
    }
    return item;
  });
  return obj;
}

export async function GET() {
  const token = process.env.TIDYCAL_TOKEN;

  if (!token) {
    return NextResponse.json(
      sanitizeDescriptions({ data: mock.getBookingTypes() })
    );
  }

  const url = `${BASE}/booking-types`;
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
        {
          error: `TidyCal returned ${upstream.status}`,
          upstream: body,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(sanitizeDescriptions(body));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}
