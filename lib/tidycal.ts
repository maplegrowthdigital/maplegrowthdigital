/**
 * TidyCal client — calls our own Next.js API routes (`/api/tidycal/*`)
 * which inject the server-only TIDYCAL_TOKEN.
 *
 * If TIDYCAL_TOKEN is not configured on the server, the route handlers
 * gracefully fall back to mock data (`lib/tidycal-mock.ts`) so local dev
 * works without any env setup.
 *
 * This module is safe to import from client components — no tokens here.
 */

/**
 * A single custom question configured on a booking type in TidyCal.
 *
 * The shape coming back from the API is loose — field names and types
 * vary slightly across accounts/plans. Everything is optional; the
 * widget's normalizer (in `components/BookingWidget.tsx`) maps it to
 * a strict form-field model and falls back to a text input for any
 * unknown question type.
 */
export interface BookingQuestion {
  id?: number;
  /** The question label shown to the user. */
  question?: string;
  /** Some payloads use `label` instead of `question`. */
  label?: string;
  /** TidyCal's question type. Common values: text, textarea, long_text,
   *  select, single_select, radio, multi_select, multiselect, checkbox.
   *  Treat as a free string and normalize. */
  type?: string;
  required?: boolean;
  /** Either array of strings or array of `{value, label}`. */
  options?: Array<string | { value?: string; label?: string }>;
  placeholder?: string;
}

/**
 * Per-booking-type location entry. TidyCal returns an array — usually
 * one item per configured location (google_meet / zoom / phone / etc).
 *
 * `location_link_source` is the actual provider key ("google_meet",
 * "zoom", "ms_teams", "phone", "in_person"). `location_option` is a
 * TidyCal-internal grouping like "location_option_online".
 */
interface BookingTypeLocation {
  id?: number;
  location_link?: string | null;
  location_link_source?: string | null;
  location_option?: string | null;
}

/** Legacy/alternate location shape some accounts return — kept for safety. */
interface BookingLocation {
  type?: string;
  value?: string;
}

/**
 * Booking-type record as returned by TidyCal's GET /booking-types and
 * GET /booking-types/{id} endpoints.
 *
 * Field names below are TidyCal's REAL field names (verified against
 * an actual account response). The widget reads them via
 * "effective" helpers that also fall back to a few legacy names in
 * case other accounts/plans return alternate shapes.
 */
export interface BookingType {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  price: number | string;
  currency_code: string;

  // === REAL TidyCal field names ===
  /** Array of configured locations. Usually 1 entry. */
  locations?: BookingTypeLocation[];
  /** Min lead-time in minutes before a slot can be booked. */
  booking_threshold_minutes?: number;
  /** Booking horizon in days — how far in advance can be booked. */
  latest_availability_days?: number;
  /** Buffer minutes added between bookings. */
  padding_minutes?: number;
  /** e.g. { limit: "5", per: "day" } — caps. */
  booking_limit?: {
    limit?: number | string;
    per?: string;
  } | null;
  /** Manual approval flag. */
  approval_required?: boolean;
  /** Whether to publicly show remaining seats. */
  display_seats_remaining?: boolean;
  /** Max attendees per slot (usually 1). */
  max_bookings?: number;
  /** UI confirmation method ("calendar" | etc). */
  confirmation_method?: string;

  // === Possibly returned only by the detail endpoint ===
  /** Configured questions to ask the booker. May come from the
   *  per-type detail endpoint rather than the list. */
  booking_questions?: BookingQuestion[];
  /** Alternate question field names some accounts use. */
  questions?: BookingQuestion[];
  custom_questions?: BookingQuestion[];

  // === Legacy/guess names — kept as fallback ===
  location?: BookingLocation;
  min_book_ahead_minutes?: number;
  max_book_ahead_days?: number;
  padding_before_minutes?: number;
  padding_after_minutes?: number;
  max_per_day?: number;
  max_per_week?: number;
  requires_confirmation?: boolean;
}

export interface Timeslot {
  starts_at: string; // ISO
  ends_at: string;   // ISO
}

interface BookingPayload {
  name: string;
  email: string;
  timezone: string;
  starts_at: string; // ISO
  booking_questions?: { question: string; answer: string }[];
}

interface BookingResponse {
  id: number;
  booking_type_id: number;
  starts_at: string;
  contact: { name: string; email: string };
}

export const userTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto";

const json = async <T,>(res: Response): Promise<T> => {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
};

export const tidycal = {
  async getBookingTypes(): Promise<BookingType[]> {
    const res = await fetch("/api/tidycal/booking-types");
    const body = await json<{ data: BookingType[] }>(res);
    return body.data;
  },

  /**
   * Fetch a single booking type by id. Some accounts return additional
   * fields here that aren't in the list endpoint (notably the configured
   * booking questions). Returns null on any error — callers should treat
   * absence as "no extra data" and proceed with what they have.
   */
  async getBookingTypeDetail(id: number): Promise<BookingType | null> {
    try {
      const res = await fetch(`/api/tidycal/booking-types/${id}`);
      if (!res.ok) return null;
      const body = (await res.json()) as { data?: BookingType } | BookingType;
      // TidyCal sometimes wraps in { data: ... }, sometimes not.
      const t = (body as { data?: BookingType }).data ?? (body as BookingType);
      return t ?? null;
    } catch {
      return null;
    }
  },

  async getTimeslots(
    bookingTypeId: number,
    startsAt: string,
    endsAt: string
  ): Promise<Timeslot[]> {
    const qs = new URLSearchParams({
      booking_type_id: String(bookingTypeId),
      starts_at: startsAt,
      ends_at: endsAt,
    }).toString();
    const res = await fetch(`/api/tidycal/timeslots?${qs}`);
    const body = await json<{ data: Timeslot[] }>(res);
    return body.data;
  },

  /**
   * Get the next available slot.
   * If no `bookingTypeId` is passed, auto-picks the first booking type
   * returned by the account (handy for the "Next available" badge that
   * doesn't care which type).
   */
  async getNextAvailable(bookingTypeId?: number): Promise<Timeslot | null> {
    let typeId = bookingTypeId;
    if (typeId == null) {
      const types = await this.getBookingTypes();
      if (types.length === 0) return null;
      typeId = types[0].id;
    }
    // Window: now → +28 days. The route handler caches; we just pick the first slot.
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 28);
    const slots = await this.getTimeslots(
      typeId,
      now.toISOString(),
      end.toISOString()
    );
    return slots[0] || null;
  },

  async createBooking(
    bookingTypeId: number,
    payload: BookingPayload
  ): Promise<BookingResponse> {
    const res = await fetch("/api/tidycal/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_type_id: bookingTypeId,
        ...payload,
      }),
    });
    if (res.status === 409) {
      throw new Error("That slot was just taken. Please pick another time.");
    }
    const body = await json<{ data: BookingResponse }>(res);
    return body.data;
  },
};
