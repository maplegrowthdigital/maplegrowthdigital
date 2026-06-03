"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  tidycal,
  userTimezone,
  type BookingType,
  type BookingQuestion,
  type Timeslot,
} from "../lib/tidycal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

type Step = 1 | 2 | 3 | 4;

interface ContactForm {
  name: string;
  email: string;
}

/** Strict question model the form layer uses. Built from BookingQuestion via normalize(). */
interface FormQuestion {
  id: string;
  /** Original label sent back to TidyCal as `question`. */
  label: string;
  kind: "text" | "textarea" | "select" | "multi-select" | "checkbox";
  required: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const startOfWeek = (offset = 0) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset * 7);
  return d;
};

// ===========================================================================
// Booking-type metadata helpers — read TidyCal's REAL field names with
// fallbacks to legacy/guessed names so other account shapes still work.
// ===========================================================================

const LOCATION_LABELS: Record<string, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  ms_teams: "Microsoft Teams",
  microsoft_teams: "Microsoft Teams",
  phone: "Phone call",
  in_person: "In person",
  custom: "Custom location",
};

function titleCase(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Friendly location label. Prefers `locations[]` (real TidyCal), falls back
 *  to legacy `location.type` if present. */
function effectiveLocation(t: BookingType): string | null {
  const src = t.locations?.[0]?.location_link_source;
  if (src) return LOCATION_LABELS[src] || titleCase(src);
  if (t.location?.type) return LOCATION_LABELS[t.location.type] || titleCase(t.location.type);
  return null;
}

/** Minimum notice in minutes — TidyCal's `booking_threshold_minutes` with
 *  fallback to `min_book_ahead_minutes`. */
function effectiveMinNoticeMinutes(t: BookingType): number | null {
  return t.booking_threshold_minutes ?? t.min_book_ahead_minutes ?? null;
}

/** Booking horizon in days — `latest_availability_days` with fallback. */
function effectiveMaxAheadDays(t: BookingType): number | null {
  return t.latest_availability_days ?? t.max_book_ahead_days ?? null;
}

function effectiveRequiresConfirmation(t: BookingType): boolean {
  return !!(t.approval_required ?? t.requires_confirmation);
}

/** Questions can land under several field names depending on the account /
 *  endpoint (list vs detail). Return the first non-empty array we find. */
function effectiveQuestions(t: BookingType): BookingQuestion[] {
  return t.booking_questions?.length
    ? t.booking_questions
    : t.questions?.length
    ? t.questions
    : t.custom_questions?.length
    ? t.custom_questions
    : [];
}

/** "12h notice", "24h notice", "30m notice". */
function formatLeadTime(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes}m notice`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h notice`;
  const days = Math.round(hours / 24);
  return `${days}d notice`;
}

/** "Up to 5 per day" — from TidyCal's booking_limit object. */
function formatBookingLimit(
  limit?: BookingType["booking_limit"]
): string | null {
  if (!limit) return null;
  const n = Number(limit.limit);
  if (!Number.isFinite(n) || n <= 0) return null;
  const per = (limit.per || "day").toLowerCase();
  return `Up to ${n} per ${per}`;
}

/**
 * Normalize a loose TidyCal question shape into a strict FormQuestion the
 * widget can render. Unknown question types fall back to a text input.
 */
function normalizeQuestion(raw: BookingQuestion, idx: number): FormQuestion {
  const label = (raw.label || raw.question || `Question ${idx + 1}`).trim();
  const t = (raw.type || "text").toLowerCase();

  let kind: FormQuestion["kind"] = "text";
  if (t.includes("textarea") || t.includes("long")) kind = "textarea";
  else if (t.includes("multi") && (t.includes("select") || t.includes("choice"))) kind = "multi-select";
  else if (t.includes("checkbox") && !t.includes("multi")) kind = "checkbox";
  else if (t.includes("select") || t.includes("radio") || t.includes("dropdown")) kind = "select";

  const options = (raw.options || []).map((o, i) => {
    if (typeof o === "string") return { value: o, label: o };
    return {
      value: o.value ?? o.label ?? String(i),
      label: o.label ?? o.value ?? String(i),
    };
  });

  return {
    id: raw.id != null ? String(raw.id) : `q-${idx}`,
    label,
    kind,
    required: !!raw.required,
    options,
    placeholder: raw.placeholder,
  };
}

// ===========================================================================
// Component
// ===========================================================================

export function BookingWidget() {
  const [step, setStep] = useState<Step>(1);
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([]);
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactForm>({ name: "", email: "" });
  /** Map of question id → answer (string for text/textarea/select; string[] for multi/checkbox). */
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  /** Fallback freeform notes shown only when there are no configured questions. */
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [weekSlots, setWeekSlots] = useState<Map<string, Timeslot[]>>(new Map());
  const [slotsError, setSlotsError] = useState<string>("");

  const viewportRef = useRef<HTMLDivElement>(null);
  const tz = useRef<string>(typeof window !== "undefined" ? userTimezone() : "UTC");

  // === Derived: normalized form questions for the selected type ===
  const formQuestions: FormQuestion[] = useMemo(() => {
    if (!bookingType) return [];
    const raw = effectiveQuestions(bookingType);
    return raw.map((q, i) => normalizeQuestion(q, i));
  }, [bookingType]);

  // === Derived: max week offset from real `latest_availability_days`. ===
  const maxWeekOffset = useMemo(() => {
    if (!bookingType) return 3;
    const maxDays = effectiveMaxAheadDays(bookingType);
    if (!maxDays || maxDays <= 0) return 3;
    return Math.max(0, Math.floor(maxDays / 7));
  }, [bookingType]);

  // === Derived: earliest allowable slot from `booking_threshold_minutes`. ===
  const minSlotTime = useMemo(() => {
    if (!bookingType) return Date.now();
    const m = effectiveMinNoticeMinutes(bookingType);
    if (!m || m <= 0) return Date.now();
    return Date.now() + m * 60_000;
  }, [bookingType]);

  // Load booking types on mount — filter to free meetings only for now.
  useEffect(() => {
    tidycal
      .getBookingTypes()
      .then((types) => {
        const free = types.filter((t) => {
          const n = Number(t.price);
          return !Number.isFinite(n) || n === 0;
        });
        setBookingTypes(free);
      })
      .catch(() => {
        // Swallow — the UI shows an empty type list which prompts retry.
      });
  }, []);

  // Load timeslots when type or week changes
  useEffect(() => {
    if (!bookingType) return;
    const start = startOfWeek(weekOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    setSlotsError("");
    tidycal
      .getTimeslots(bookingType.id, start.toISOString(), end.toISOString())
      .then((slots) => {
        // Filter out slots that violate the configured min lead-time.
        const filtered = slots.filter(
          (s) => new Date(s.starts_at).getTime() >= minSlotTime
        );
        const byDay = new Map<string, Timeslot[]>();
        filtered.forEach((s) => {
          const key = new Date(s.starts_at).toDateString();
          if (!byDay.has(key)) byDay.set(key, []);
          byDay.get(key)!.push(s);
        });
        setWeekSlots(byDay);
      })
      .catch(() => {
        setWeekSlots(new Map());
        setSlotsError(
          "We couldn't load times right now. Please try again in a moment."
        );
      });
  }, [bookingType, weekOffset, minSlotTime]);

  // Animate step cross-fade
  const previousStepRef = useRef<Step>(1);
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) {
        previousStepRef.current = step;
        return;
      }
      const goingForward = step > previousStepRef.current;
      previousStepRef.current = step;
      const incoming = viewportRef.current?.querySelector(".booking-step.is-active");
      if (incoming) {
        gsap.fromTo(
          incoming,
          { opacity: 0, x: goingForward ? 20 : -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: "expo.out",
            clearProps: "transform",
          }
        );
      }
    },
    { dependencies: [step] }
  );

  const goTo = (s: Step) => setStep(s);
  const goBack = () => setStep((step - 1) as Step);

  // === Step 1 — pick booking type ===
  // We commit to the list-data immediately so Step 2 starts loading slots
  // without delay, then enrich with the detail endpoint in the background
  // (questions and any other fields the list response omits). The shallow
  // merge means whatever the detail returns supplements — it doesn't
  // overwrite already-present fields with `undefined`.
  const pickType = (t: BookingType) => {
    setBookingType(t);
    setWeekOffset(0);
    setSelectedDay(null);
    setSelectedSlot(null);
    setAnswers({});
    setNotes("");
    goTo(2);

    tidycal
      .getBookingTypeDetail(t.id)
      .then((detail) => {
        if (!detail) return;
        setBookingType((prev) => {
          if (!prev || prev.id !== t.id) return prev;
          // Merge — detail fields take precedence over list fields
          // because the detail endpoint typically returns the same data
          // plus extras (questions, more granular settings).
          return { ...prev, ...detail };
        });
      })
      .catch(() => {
        // Swallow — questions/extras stay hidden if the detail call fails.
      });
  };

  // === Step 2 — pick day & slot ===
  const start = startOfWeek(weekOffset);
  const lastDay = new Date(start);
  lastDay.setDate(start.getDate() + 6);
  const rangeLabel = `${start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} — ${lastDay.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const days: Array<{
    date: Date;
    key: string;
    slotCount: number;
    isWeekend: boolean;
  }> = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = day.toDateString();
    const dow = day.getDay();
    days.push({
      date: day,
      key,
      slotCount: weekSlots.get(key)?.length || 0,
      isWeekend: dow === 0 || dow === 6,
    });
  }
  const activeSlots = selectedDay ? weekSlots.get(selectedDay) || [] : [];

  const pickSlot = (slotIso: string) => {
    setSelectedSlot(slotIso);
    goTo(3);
  };

  // === Step 3 — details form ===
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  /** Answer for a given question — string for single-value kinds, string[] for multi. */
  const getAnswer = (q: FormQuestion): string | string[] => {
    const v = answers[q.id];
    if (v != null) return v;
    return q.kind === "multi-select" ? [] : "";
  };

  const setAnswer = (q: FormQuestion, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const validateAnswers = (): string | null => {
    for (const q of formQuestions) {
      if (!q.required) continue;
      const v = answers[q.id];
      const empty =
        v == null ||
        (typeof v === "string" && v.trim().length === 0) ||
        (Array.isArray(v) && v.length === 0);
      if (empty) return `Please answer: ${q.label}`;
    }
    return null;
  };

  const buildBookingQuestionsPayload = (): { question: string; answer: string }[] => {
    if (formQuestions.length === 0) {
      // Backward-compat: when no questions configured, send the optional notes field.
      return notes.trim() ? [{ question: "Notes", answer: notes.trim() }] : [];
    }
    return formQuestions
      .map((q) => {
        const v = getAnswer(q);
        const answer = Array.isArray(v) ? v.join(", ") : String(v).trim();
        return { question: q.label, answer };
      })
      .filter((p) => p.answer.length > 0);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (contact.name.trim().length < 2) {
      setFormError("Please enter your name.");
      return;
    }
    if (!isValidEmail(contact.email.trim())) {
      setFormError("Please enter a valid email.");
      return;
    }
    const answerErr = validateAnswers();
    if (answerErr) {
      setFormError(answerErr);
      return;
    }
    if (!bookingType || !selectedSlot) return;
    setSubmitting(true);
    try {
      await tidycal.createBooking(bookingType.id, {
        name: contact.name.trim(),
        email: contact.email.trim(),
        timezone: tz.current,
        starts_at: selectedSlot,
        booking_questions: buildBookingQuestionsPayload(),
      });
      goTo(4);
      window.dispatchEvent(new CustomEvent("celebrate:burst"));
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setBookingType(null);
    setWeekOffset(0);
    setSelectedDay(null);
    setSelectedSlot(null);
    setContact({ name: "", email: "" });
    setAnswers({});
    setNotes("");
    setFormError("");
    goTo(1);
  };

  // Confirmation + summary copy — read via helpers so they prefer
  // TidyCal's real field names with legacy fallbacks.
  const locationLabel = bookingType ? effectiveLocation(bookingType) : null;
  const noticeLabel = bookingType
    ? formatLeadTime(effectiveMinNoticeMinutes(bookingType))
    : null;
  const requiresConfirmation = bookingType
    ? effectiveRequiresConfirmation(bookingType)
    : false;
  const locationSource =
    bookingType?.locations?.[0]?.location_link_source ??
    bookingType?.location?.type ??
    null;
  const isVideoLocation =
    locationSource === "google_meet" ||
    locationSource === "zoom" ||
    locationSource === "ms_teams" ||
    locationSource === "microsoft_teams";

  return (
    <div className="booking-widget" data-booking-widget>
      <div className="booking-widget__head">
        <div className="booking-widget__status">
          <span className="booking-widget__dot" aria-hidden="true" />
          <span>Available this week</span>
        </div>
        <ol className="booking-widget__steps" role="list">
          {(["Type", "Time", "Details", "Done"] as const).map((label, i) => {
            const n = (i + 1) as Step;
            const cls =
              "booking-step-dot" +
              (n === step ? " is-active" : "") +
              (n < step ? " is-done" : "");
            return (
              <li key={label} className={cls}>
                <span>{n}</span>
                {label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="booking-widget__viewport" ref={viewportRef}>
        {/* === Step 1 === */}
        {step === 1 && (
          <section className="booking-step is-active" aria-label="Choose booking type">
            <header className="booking-step__head">
              <h3 className="booking-step__title">What kind of conversation?</h3>
              <p className="booking-step__sub">
                Pick the format that fits where you are.
              </p>
            </header>
            <ul className="booking-types" role="list">
              {bookingTypes.map((t) => {
                const loc = effectiveLocation(t);
                const notice = formatLeadTime(effectiveMinNoticeMinutes(t));
                const questionCount = effectiveQuestions(t).length;
                const limit = formatBookingLimit(t.booking_limit);
                const requiresConfirm = effectiveRequiresConfirmation(t);
                const hasMeta = loc || notice || questionCount > 0 || limit || requiresConfirm;
                const priceNum = Number(t.price);
                const isFree = !Number.isFinite(priceNum) || priceNum === 0;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className="booking-type"
                      onClick={() => pickType(t)}
                    >
                      <div className="booking-type__head">
                        <span className="booking-type__title">{t.title}</span>
                        <span className="booking-type__duration">
                          {t.duration_minutes} min
                        </span>
                      </div>
                      {/* TidyCal descriptions are rich HTML — render as innerHTML. */}
                      <div
                        className="booking-type__desc"
                        dangerouslySetInnerHTML={{ __html: t.description }}
                      />
                      {hasMeta && (
                        <ul className="booking-type__meta" role="list">
                          {loc && (
                            <li className="booking-type__meta-chip">
                              <span aria-hidden="true" className="booking-type__meta-icon">●</span>
                              {loc}
                            </li>
                          )}
                          {notice && (
                            <li className="booking-type__meta-chip">
                              <span aria-hidden="true" className="booking-type__meta-icon">●</span>
                              {notice}
                            </li>
                          )}
                          {questionCount > 0 && (
                            <li className="booking-type__meta-chip">
                              <span aria-hidden="true" className="booking-type__meta-icon">●</span>
                              {questionCount} quick question{questionCount === 1 ? "" : "s"}
                            </li>
                          )}
                          {limit && (
                            <li className="booking-type__meta-chip">
                              <span aria-hidden="true" className="booking-type__meta-icon">●</span>
                              {limit}
                            </li>
                          )}
                          {requiresConfirm && (
                            <li className="booking-type__meta-chip booking-type__meta-chip--soft">
                              <span aria-hidden="true" className="booking-type__meta-icon">●</span>
                              Manual confirmation
                            </li>
                          )}
                        </ul>
                      )}
                      <div className="booking-type__foot">
                        {isFree ? (
                          <span className="booking-type__price booking-type__price--free">
                            Free
                          </span>
                        ) : (
                          <span className="booking-type__price">
                            ${priceNum} {t.currency_code}
                          </span>
                        )}
                        <span className="booking-type__cta">
                          Select <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* === Step 2 === */}
        {step === 2 && (
          <section className="booking-step is-active" aria-label="Pick a time">
            <header className="booking-step__head">
              <button
                type="button"
                className="booking-step__back"
                onClick={goBack}
              >
                <span aria-hidden="true">←</span><span>Back</span>
              </button>
              <h3 className="booking-step__title">Pick a time</h3>
              <p className="booking-step__sub">
                Times shown in <span className="booking-tz">{tz.current}</span>
                {noticeLabel ? <> · {noticeLabel} required</> : null}
              </p>
            </header>
            <div className="booking-cal">
              <div className="booking-cal__nav">
                <button
                  type="button"
                  className="booking-cal__nav-btn"
                  onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                  disabled={weekOffset <= 0}
                  aria-label="Previous week"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <span className="booking-cal__range">{rangeLabel}</span>
                <button
                  type="button"
                  className="booking-cal__nav-btn"
                  onClick={() =>
                    setWeekOffset((w) => Math.min(maxWeekOffset, w + 1))
                  }
                  disabled={weekOffset >= maxWeekOffset}
                  aria-label="Next week"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <ol className="booking-cal__days" role="list">
                {days.map((d) => {
                  const disabled = d.slotCount === 0;
                  const cls =
                    "cal-day" +
                    (disabled ? " is-disabled" : "") +
                    (d.key === selectedDay ? " is-active" : "");
                  return (
                    <li
                      key={d.key}
                      className={cls}
                      onClick={() => {
                        if (!disabled) {
                          setSelectedDay(d.key);
                          setSelectedSlot(null);
                        }
                      }}
                    >
                      <span className="cal-day__name">
                        {d.date.toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="cal-day__num">{d.date.getDate()}</span>
                      <span className="cal-day__count">
                        {d.isWeekend
                          ? "—"
                          : d.slotCount > 0
                          ? `${d.slotCount} slot${d.slotCount === 1 ? "" : "s"}`
                          : "Full"}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="booking-cal__slots">
                {slotsError ? (
                  <p className="booking-cal__empty">{slotsError}</p>
                ) : activeSlots.length === 0 ? (
                  <p className="booking-cal__empty">
                    Select a day to see available times.
                  </p>
                ) : (
                  <div className="cal-slots">
                    {activeSlots.map((s) => (
                      <button
                        key={s.starts_at}
                        type="button"
                        className="cal-slot"
                        onClick={() => pickSlot(s.starts_at)}
                      >
                        {formatTime(new Date(s.starts_at))}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* === Step 3 === */}
        {step === 3 && (
          <section className="booking-step is-active" aria-label="Your details">
            <header className="booking-step__head">
              <button
                type="button"
                className="booking-step__back"
                onClick={goBack}
              >
                <span aria-hidden="true">←</span><span>Back</span>
              </button>
              <h3 className="booking-step__title">Confirm and connect</h3>
            </header>
            <div className="booking-summary">
              <div>
                <div className="booking-summary__type">
                  {bookingType?.title} · {bookingType?.duration_minutes} min
                  {locationLabel ? ` · ${locationLabel}` : ""}
                </div>
                {selectedSlot && (
                  <div className="booking-summary__time">
                    {formatDay(new Date(selectedSlot))} at{" "}
                    {formatTime(new Date(selectedSlot))} ({tz.current})
                  </div>
                )}
              </div>
              <button
                type="button"
                className="booking-summary__edit"
                onClick={() => goTo(2)}
              >
                Change time
              </button>
            </div>
            <form className="booking-form" onSubmit={submitBooking} noValidate>
              <label className="booking-field">
                <span className="booking-field__label">Full name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Jane Cooper"
                  value={contact.name}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                />
              </label>
              <label className="booking-field">
                <span className="booking-field__label">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                />
              </label>

              {/* === Dynamic TidyCal booking questions === */}
              {formQuestions.length > 0
                ? formQuestions.map((q) => (
                    <BookingQuestionField
                      key={q.id}
                      question={q}
                      value={getAnswer(q)}
                      onChange={(v) => setAnswer(q, v)}
                    />
                  ))
                : (
                  <label className="booking-field booking-field--full">
                    <span className="booking-field__label">
                      What would you like to discuss?{" "}
                      <span className="booking-field__opt">Optional</span>
                    </span>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="A few sentences about your goals, channels, or where you're stuck."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </label>
                )}

              <p className="booking-form__msg" aria-live="polite">
                {formError}
              </p>
              <div className="booking-form__actions">
                <button
                  type="submit"
                  className="btn btn--primary btn--large"
                  data-magnetic
                  disabled={submitting}
                >
                  <span>{submitting ? "Confirming…" : "Confirm booking"}</span>
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* === Step 4 === */}
        {step === 4 && (
          <section className="booking-step is-active" aria-label="Confirmation">
            <div className="booking-confirm">
              <div className="booking-confirm__check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="booking-confirm__title">
                {requiresConfirmation ? "Almost there." : "You're booked."}
              </h3>
              <p className="booking-confirm__details">
                Your <strong>{bookingType?.title}</strong> is set for
                <br />
                {selectedSlot && (
                  <>
                    <strong>{formatDay(new Date(selectedSlot))}</strong> at{" "}
                    <strong>{formatTime(new Date(selectedSlot))}</strong>.
                  </>
                )}
              </p>

              <ul className="booking-confirm__meta" role="list">
                {locationLabel && (
                  <li>
                    <span aria-hidden="true" className="booking-confirm__meta-dot">●</span>
                    {locationLabel}
                    {isVideoLocation
                      ? " — link in your confirmation email"
                      : null}
                  </li>
                )}
                <li>
                  <span aria-hidden="true" className="booking-confirm__meta-dot">●</span>
                  {requiresConfirmation
                    ? "We'll review and confirm shortly. Watch your inbox."
                    : "Calendar invite is on its way."}
                </li>
                {noticeLabel && !requiresConfirmation && (
                  <li>
                    <span aria-hidden="true" className="booking-confirm__meta-dot">●</span>
                    Need to reschedule? Use the link in your email up to{" "}
                    {noticeLabel.replace(" notice", "")} before.
                  </li>
                )}
              </ul>

              <button
                type="button"
                className="btn btn--link"
                onClick={restart}
              >
                <span>Book another</span><span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// Field renderer for a single booking question
// ===========================================================================

interface BookingQuestionFieldProps {
  question: FormQuestion;
  value: string | string[];
  onChange: (v: string | string[]) => void;
}

function BookingQuestionField({ question: q, value, onChange }: BookingQuestionFieldProps) {
  const labelEl = (
    <span className="booking-field__label">
      {q.label}{" "}
      {!q.required && <span className="booking-field__opt">Optional</span>}
    </span>
  );

  if (q.kind === "textarea") {
    return (
      <label className="booking-field booking-field--full">
        {labelEl}
        <textarea
          name={q.id}
          rows={3}
          required={q.required}
          placeholder={q.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (q.kind === "select" && q.options.length > 0) {
    return (
      <fieldset className="booking-field booking-field--full booking-field--choice">
        <legend className="booking-field__label">
          {q.label}{" "}
          {!q.required && <span className="booking-field__opt">Optional</span>}
        </legend>
        <div className="booking-choice-list" role="radiogroup">
          {q.options.map((opt) => (
            <label key={opt.value} className="booking-choice">
              <input
                type="radio"
                name={q.id}
                value={opt.value}
                required={q.required}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (q.kind === "multi-select" && q.options.length > 0) {
    const current = Array.isArray(value) ? value : [];
    const toggle = (v: string) => {
      if (current.includes(v)) onChange(current.filter((x) => x !== v));
      else onChange([...current, v]);
    };
    return (
      <fieldset className="booking-field booking-field--full booking-field--choice">
        <legend className="booking-field__label">
          {q.label}{" "}
          {!q.required && <span className="booking-field__opt">Optional</span>}
        </legend>
        <div className="booking-choice-list">
          {q.options.map((opt) => (
            <label key={opt.value} className="booking-choice booking-choice--check">
              <input
                type="checkbox"
                name={q.id}
                value={opt.value}
                checked={current.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (q.kind === "checkbox") {
    const checked = value === "true" || value === "1";
    return (
      <label className="booking-field booking-field--full booking-field--single-check">
        <input
          type="checkbox"
          name={q.id}
          required={q.required}
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? "true" : "")}
        />
        <span className="booking-field__label">
          {q.label}{" "}
          {!q.required && <span className="booking-field__opt">Optional</span>}
        </span>
      </label>
    );
  }

  // Default: text input
  return (
    <label className="booking-field booking-field--full">
      {labelEl}
      <input
        type="text"
        name={q.id}
        required={q.required}
        placeholder={q.placeholder}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
