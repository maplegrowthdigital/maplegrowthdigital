/**
 * TidyCal mock — used by `/api/tidycal/*` route handlers as a fallback
 * when `TIDYCAL_TOKEN` isn't configured (local dev without API setup).
 *
 * Server-only — never import from client components.
 */

import "server-only";

export interface BookingQuestion {
  id?: number;
  question?: string;
  label?: string;
  type?: string;
  required?: boolean;
  options?: Array<string | { value?: string; label?: string }>;
  placeholder?: string;
}

export interface BookingTypeLocation {
  id?: number;
  location_link?: string | null;
  location_link_source?: string | null;
  location_option?: string | null;
}
export interface BookingLocation {
  type?: string;
  value?: string;
}

export interface BookingType {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  price: number | string;
  currency_code: string;
  // Real TidyCal field names
  locations?: BookingTypeLocation[];
  booking_threshold_minutes?: number;
  latest_availability_days?: number;
  padding_minutes?: number;
  booking_limit?: { limit?: number | string; per?: string } | null;
  approval_required?: boolean;
  display_seats_remaining?: boolean;
  max_bookings?: number;
  // Sometimes from detail endpoint
  booking_questions?: BookingQuestion[];
  questions?: BookingQuestion[];
  custom_questions?: BookingQuestion[];
  // Legacy / guessed fallbacks
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

export interface BookingPayload {
  name: string;
  email: string;
  timezone: string;
  starts_at: string; // ISO
  booking_questions?: { question: string; answer: string }[];
}

export interface BookingResponse {
  id: number;
  booking_type_id: number;
  starts_at: string;
  contact: { name: string; email: string };
}

const BOOKING_TYPES: BookingType[] = [
  {
    id: 1,
    title: "Discovery call",
    description:
      "A 15-minute intro to understand your goals, channels, and what's stuck. Honest, no sales theatre.",
    duration_minutes: 15,
    price: 0,
    currency_code: "USD",
    // Real TidyCal field names so mock matches real-account shape
    locations: [{ location_link_source: "google_meet", location_option: "location_option_online" }],
    booking_threshold_minutes: 60,
    latest_availability_days: 28,
    padding_minutes: 5,
    approval_required: false,
    booking_questions: [
      {
        id: 11,
        question: "What's your website?",
        type: "text",
        required: true,
        placeholder: "https://yoursite.com",
      },
      {
        id: 12,
        question: "Anything specific you'd like us to come prepared on?",
        type: "textarea",
        required: false,
        placeholder: "A few sentences is plenty.",
      },
    ],
  },
  {
    id: 2,
    title: "Strategy session",
    description:
      "A 45-minute working session — we'll review your funnel and leave you with prioritized next steps.",
    duration_minutes: 45,
    price: 0,
    currency_code: "USD",
    locations: [{ location_link_source: "google_meet", location_option: "location_option_online" }],
    booking_threshold_minutes: 1440, // 24h notice
    latest_availability_days: 21,
    padding_minutes: 10,
    booking_limit: { limit: 5, per: "day" },
    approval_required: true,
    booking_questions: [
      {
        id: 21,
        question: "What's your website?",
        type: "text",
        required: true,
        placeholder: "https://yoursite.com",
      },
      {
        id: 22,
        question: "Where are you in your growth journey?",
        type: "single_select",
        required: true,
        options: [
          "Pre-launch",
          "Live, just starting to scale",
          "Established, optimizing",
          "Established, looking to grow",
        ],
      },
      {
        id: 23,
        question: "Which channels matter most? (pick any)",
        type: "multi_select",
        required: false,
        options: ["SEO", "Paid (Google/Meta)", "Email/Lifecycle", "Content", "Brand/Creative", "Web/CRO"],
      },
      {
        id: 24,
        question: "Anything else we should know?",
        type: "textarea",
        required: false,
        placeholder: "Context, constraints, weird preferences — anything.",
      },
    ],
  },
];

// Deterministic-ish pseudo-random so the same booking type returns
// a stable timeslot map for the session.
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i)) * 16777619;
  return Math.abs(h);
};
const rand = (seed: string) => (hash(seed) % 1000) / 1000;

const buildSlots = (bt: BookingType): Timeslot[] => {
  const slots: Timeslot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = 0; d < 28; d++) {
    const day = new Date(today);
    day.setDate(today.getDate() + d);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;
    for (let h = 9; h < 17; h++) {
      for (let m = 0; m < 60; m += bt.duration_minutes) {
        if (h * 60 + m + bt.duration_minutes > 17 * 60) break;
        const seed = `${bt.id}-${day.toDateString()}-${h}:${m}`;
        const isPast = d === 0 && h < new Date().getHours() + 2;
        const isTaken = rand(seed) < 0.35;
        if (isPast || isTaken) continue;
        const start = new Date(day);
        start.setHours(h, m, 0, 0);
        slots.push({
          starts_at: start.toISOString(),
          ends_at: new Date(start.getTime() + bt.duration_minutes * 60000).toISOString(),
        });
      }
    }
  }
  return slots;
};

let _slotsByType: Map<number, Timeslot[]> | null = null;
const slotsByType = () => {
  if (!_slotsByType) {
    _slotsByType = new Map(BOOKING_TYPES.map((bt) => [bt.id, buildSlots(bt)]));
  }
  return _slotsByType;
};

export const mock = {
  getBookingTypes(): BookingType[] {
    return BOOKING_TYPES;
  },
  getBookingType(bookingTypeId: number): BookingType | null {
    return BOOKING_TYPES.find((t) => t.id === Number(bookingTypeId)) ?? null;
  },
  getTimeslots(bookingTypeId: number, startsAt: string, endsAt: string): Timeslot[] {
    const all = slotsByType().get(Number(bookingTypeId)) || [];
    const s = new Date(startsAt).getTime();
    const e = new Date(endsAt).getTime();
    return all.filter((t) => {
      const ts = new Date(t.starts_at).getTime();
      return ts >= s && ts < e;
    });
  },
  createBooking(bookingTypeId: number, payload: BookingPayload): BookingResponse {
    // No network simulation here — the proxy route adds latency consistency
    return {
      id: Math.floor(Math.random() * 90000) + 10000,
      booking_type_id: bookingTypeId,
      starts_at: payload.starts_at,
      contact: { name: payload.name, email: payload.email },
    };
  },
};
