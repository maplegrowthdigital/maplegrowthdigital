"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useModalState } from "../global/ModalProvider";
import { Turnstile } from "../global/Turnstile";
import { SERVICE_CATALOG } from "../../lib/services";

interface OptionItem {
  id: string;
  title: string;
  sub: string;
}

const STAGES: OptionItem[] = [
  { id: "pre-launch", title: "Pre-launch", sub: "Building something new" },
  { id: "early", title: "Early growth", sub: "Under $1M ARR / revenue" },
  { id: "scaling", title: "Scaling", sub: "$1M – $10M ARR" },
  { id: "established", title: "Established", sub: "$10M+ ARR" },
];

const GOALS: OptionItem[] = [
  { id: "acquire", title: "Acquire customers", sub: "Net-new pipeline" },
  { id: "launch", title: "Launch a product", sub: "GTM motion + brand lift" },
  { id: "cro", title: "Improve conversion", sub: "More from existing traffic" },
  { id: "brand", title: "Build the brand", sub: "Awareness + positioning" },
  { id: "retain", title: "Retain & expand", sub: "Existing customer revenue" },
  { id: "other", title: "Something else", sub: "Tell us about it" },
];

const BUDGETS: OptionItem[] = [
  { id: "under5", title: "Under $5K", sub: "per month" },
  { id: "5to15", title: "$5K – $15K", sub: "per month" },
  { id: "15to30", title: "$15K – $30K", sub: "per month" },
  { id: "30plus", title: "$30K+", sub: "per month" },
  { id: "project", title: "Project-based", sub: "fixed scope" },
];

type Step = 1 | 2 | 3 | 4 | 5;

export function ConfigureWizard() {
  const { isOpen } = useModalState("configure");

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [stage, setStage] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  // Honeypot — visually hidden + tab-disabled in the JSX below.
  // Bots auto-fill, humans don't see it. Server rejects (silent 200) if set.
  const [honeypot, setHoneypot] = useState("");
  // Cloudflare Turnstile token — populated by widget on step 5.
  const [turnstileToken, setTurnstileToken] = useState("");

  // Reset every time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setStage(null);
    setGoal(null);
    setServices([]);
    setBudget(null);
    setName("");
    setEmail("");
    setNote("");
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
    setHoneypot("");
    setTurnstileToken("");
  }, [isOpen]);

  const canAdvance = () => {
    if (step === 1) return !!stage;
    if (step === 2) return !!goal;
    if (step === 3) return services.length > 0;
    if (step === 4) return !!budget;
    if (step === 5) return name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return false;
  };

  const next = async () => {
    if (step < 5) {
      setStep((step + 1) as Step);
      return;
    }
    if (!canAdvance()) return;
    setSubmitting(true);
    setSubmitError("");

    // Build the payload — we serialise the picked id+title for each step so
    // the email is human-readable on the receiving end without needing any
    // lookup against the catalogs.
    const pickedStage = STAGES.find((s) => s.id === stage);
    const pickedGoal = GOALS.find((g) => g.id === goal);
    const pickedBudget = BUDGETS.find((b) => b.id === budget);
    const pickedServices = services
      .map((id) => {
        const s = SERVICE_CATALOG.find((sv) => sv.id === id);
        return s ? { id: s.id, title: s.title } : null;
      })
      .filter((s): s is { id: string; title: string } => s !== null);

    try {
      const res = await fetch("/api/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: pickedStage
            ? { id: pickedStage.id, title: pickedStage.title }
            : null,
          goal: pickedGoal
            ? { id: pickedGoal.id, title: pickedGoal.title }
            : null,
          services: pickedServices,
          budget: pickedBudget
            ? { id: pickedBudget.id, title: pickedBudget.title }
            : null,
          name: name.trim(),
          email: email.trim(),
          note: note.trim(),
          honeypot,
          turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setSubmitError(
          data.error || "Something went wrong. Please try again."
        );
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);
      window.dispatchEvent(new CustomEvent("celebrate:burst"));
    } catch {
      setSubmitError("Network error. Please try again in a moment.");
      setSubmitting(false);
    }
  };
  const back = () => setStep((Math.max(1, step - 1)) as Step);

  const toggleService = (id: string) =>
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const servicesSummary =
    services.length === 0
      ? "—"
      : services
          .map((id) => SERVICE_CATALOG.find((s) => s.id === id)?.title)
          .filter(Boolean)
          .join(", ");

  const stageTitle = STAGES.find((s) => s.id === stage)?.title || "—";
  const goalTitle = GOALS.find((g) => g.id === goal)?.title || "—";
  const budgetTitle = BUDGETS.find((b) => b.id === budget)?.title || "—";

  const firstName = name.split(" ")[0] || "friend";

  return (
    <Modal name="configure" variant="wizard" ariaLabelledBy="configure-title">
      <header className="modal__head">
        <span className="modal__eyebrow">Configure your engagement</span>
        <h2 className="modal__title" id="configure-title">
          Let's build a partnership that fits.
        </h2>
        <ol className="wizard-steps" role="list">
          {(["Stage", "Goal", "Services", "Budget", "Contact"] as const).map(
            (label, i) => {
              const n = (i + 1) as Step;
              const cls =
                "wizard-step-dot" +
                (!submitted && n === step ? " is-active" : "") +
                (submitted || n < step ? " is-done" : "");
              return (
                <li key={label} className={cls}>
                  <span>{n}</span>
                  {label}
                </li>
              );
            }
          )}
        </ol>
      </header>

      <div className="modal__body wizard-body">
        {submitted ? (
          <div className="wizard-confirm">
            <div className="wizard-confirm__check" aria-hidden="true">
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
            <h3 className="wizard-confirm__title">Thanks, {firstName}.</h3>
            <p className="wizard-confirm__sub">
              We'll review what you shared and get back within{" "}
              <strong>1 business day</strong> with a tailored plan and proposed
              team.
            </p>
          </div>
        ) : (
          <div className="wizard-pane is-active">
            {step === 1 && (
              <>
                <h3 className="wizard-pane__title">Where are you, today?</h3>
                <p className="wizard-pane__sub">
                  Pick the closest fit — shapes the team and the cadence we'd
                  propose.
                </p>
                <div className="wizard-options wizard-options--two">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`wizard-option${stage === s.id ? " is-selected" : ""}`}
                      onClick={() => setStage(s.id)}
                    >
                      <span className="wizard-option__title">{s.title}</span>
                      <span className="wizard-option__sub">{s.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h3 className="wizard-pane__title">
                  What's the goal for the next 90 days?
                </h3>
                <p className="wizard-pane__sub">
                  We'll bias the plan toward the metric you actually care about.
                </p>
                <div className="wizard-options wizard-options--two">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`wizard-option${goal === g.id ? " is-selected" : ""}`}
                      onClick={() => setGoal(g.id)}
                    >
                      <span className="wizard-option__title">{g.title}</span>
                      <span className="wizard-option__sub">{g.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h3 className="wizard-pane__title">
                  Which services would you like in?
                </h3>
                <p className="wizard-pane__sub">
                  Pick all that apply. We'll suggest the right team in step 5.
                </p>
                <div className="wizard-chips">
                  {SERVICE_CATALOG.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`wizard-chip${services.includes(s.id) ? " is-selected" : ""}`}
                      onClick={() => toggleService(s.id)}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h3 className="wizard-pane__title">
                  What's your investment comfort range?
                </h3>
                <p className="wizard-pane__sub">
                  Ranges, not commitments. Used to size the team correctly.
                </p>
                <div className="wizard-options wizard-options--two">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`wizard-option${budget === b.id ? " is-selected" : ""}`}
                      onClick={() => setBudget(b.id)}
                    >
                      <span className="wizard-option__title">{b.title}</span>
                      <span className="wizard-option__sub">{b.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 5 && (
              <>
                <h3 className="wizard-pane__title">
                  Last bit — and we're done.
                </h3>
                <div className="wizard-summary">
                  <div className="wizard-summary__row">
                    <span>Stage</span><span>{stageTitle}</span>
                  </div>
                  <div className="wizard-summary__row">
                    <span>Goal</span><span>{goalTitle}</span>
                  </div>
                  <div className="wizard-summary__row">
                    <span>Services</span><span>{servicesSummary}</span>
                  </div>
                  <div className="wizard-summary__row">
                    <span>Budget</span><span>{budgetTitle}</span>
                  </div>
                </div>
                <form className="wizard-form" onSubmit={(e) => e.preventDefault()} noValidate>
                  {/* Honeypot — see Newsletter for context. Visually hidden,
                      tab-disabled, screen-reader hidden. Bots fill it; humans
                      don't. */}
                  <input
                    type="text"
                    name="company_url"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <label className="booking-field">
                    <span className="booking-field__label">Your name</span>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Cooper"
                    />
                  </label>
                  <label className="booking-field">
                    <span className="booking-field__label">Email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                    />
                  </label>
                  <label className="booking-field booking-field--full">
                    <span className="booking-field__label">
                      Anything else we should know?{" "}
                      <span className="booking-field__opt">Optional</span>
                    </span>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="A few sentences about timeline, team, or context."
                    />
                  </label>
                  <div className="wizard-form__captcha">
                    <Turnstile
                      onVerify={setTurnstileToken}
                      onExpire={() => setTurnstileToken("")}
                      onError={() => setTurnstileToken("")}
                    />
                  </div>
                  {submitError && (
                    <p
                      className="wizard-form__error"
                      role="alert"
                      aria-live="polite"
                    >
                      {submitError}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {!submitted && (
        <footer className="modal__foot wizard-foot">
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={back}
            disabled={step === 1}
          >
            <span aria-hidden="true">←</span><span>Back</span>
          </button>
          <span className="wizard-progress">Step {step} of 5</span>
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={next}
            disabled={!canAdvance() || submitting}
          >
            <span>
              {step === 5
                ? submitting
                  ? "Sending…"
                  : "Send to MapleGrowth"
                : "Next"}
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      )}
    </Modal>
  );
}
