"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { useModal, useModalState } from "../global/ModalProvider";
import { SERVICE_CATALOG } from "../../lib/services";

const formatMoney = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
    : `$${n.toLocaleString()}`;

const pluralMonth = (n: number) => `${n} month${n === 1 ? "" : "s"}`;

export function QuickQuote() {
  const { isOpen, opts } = useModalState("quote");
  const { close } = useModal();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState(3);

  // Reset / pre-select each time modal opens
  useEffect(() => {
    if (!isOpen) return;
    const preselect =
      (opts?.payload as { preselectServiceId?: string } | undefined)
        ?.preselectServiceId ?? null;
    const next = new Set<string>();
    if (preselect && SERVICE_CATALOG.some((s) => s.id === preselect)) {
      next.add(preselect);
    }
    setSelected(next);
    setDuration(3);
  }, [isOpen, opts]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const output = useMemo(() => {
    if (selected.size === 0) {
      return {
        amount: "Select at least one service",
        team: "—",
        timeline: "—",
        total: "—",
      };
    }
    const chosen = SERVICE_CATALOG.filter((s) => selected.has(s.id));
    const low = chosen.reduce((sum, s) => sum + s.band[0], 0);
    const high = chosen.reduce((sum, s) => sum + s.band[1], 0);

    // Team
    const team = chosen.reduce(
      (acc, s) => {
        acc.strategists += s.teamFactor.strategists;
        acc.designers += s.teamFactor.designers;
        acc.devs += s.teamFactor.devs;
        return acc;
      },
      { strategists: 0, designers: 0, devs: 0 }
    );
    const parts: string[] = [];
    if (team.strategists >= 0.4)
      parts.push(
        `${Math.max(1, Math.ceil(team.strategists))} strategist${
          Math.ceil(team.strategists) === 1 ? "" : "s"
        }`
      );
    if (team.designers >= 0.4)
      parts.push(
        `${Math.max(1, Math.ceil(team.designers))} designer${
          Math.ceil(team.designers) === 1 ? "" : "s"
        }`
      );
    if (team.devs >= 0.4)
      parts.push(
        `${Math.max(1, Math.ceil(team.devs))} engineer${
          Math.ceil(team.devs) === 1 ? "" : "s"
        }`
      );

    // Timeline heuristic
    const hasPaid = selected.has("ppc");
    const hasWeb = selected.has("web");
    const hasSeo = selected.has("seo");
    const timeline =
      hasPaid && !hasWeb
        ? "2–4 weeks"
        : hasSeo && !hasPaid
        ? "8–12 weeks"
        : hasWeb
        ? "6–10 weeks"
        : "3–6 weeks";

    return {
      // Headline shows the entry point only ("starting at") so multi-service
      // selections don't surface a scary top-of-range number. The full range
      // still appears in the detail row below.
      amount: `Starting at ${formatMoney(low)} / mo`,
      team: parts.join(" + ") || "Lean team",
      timeline,
      total: `${formatMoney(low * duration)} – ${formatMoney(high * duration)}`,
    };
  }, [selected, duration]);

  return (
    <Modal name="quote" variant="quote" ariaLabelledBy="quote-title">
      <header className="modal__head">
        <span className="modal__eyebrow">Quick estimate</span>
        <h2 className="modal__title" id="quote-title">
          A rough number in 30 seconds.
        </h2>
        <p className="modal__sub">
          Pick services, set a duration. We'll show a ballpark.
        </p>
      </header>

      <div className="modal__body">
        <div className="quote-section">
          <span className="quote-label">Services needed</span>
          <div className="quote-chips" role="list">
            {SERVICE_CATALOG.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`quote-chip${selected.has(s.id) ? " is-selected" : ""}`}
                onClick={() => toggle(s.id)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <div className="quote-section">
          <span className="quote-label">
            Engagement length
            <span className="quote-label__value">{pluralMonth(duration)}</span>
          </span>
          <input
            type="range"
            className="quote-slider"
            min={1}
            max={12}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            aria-label="Engagement length in months"
          />
          <div className="quote-slider__ticks" aria-hidden="true">
            <span>1mo</span>
            <span>6mo</span>
            <span>12mo</span>
          </div>
        </div>

        <div className="quote-output">
          <div className="quote-output__main">
            <span className="quote-output__label">Estimated investment</span>
            <span className="quote-output__amount">{output.amount}</span>
          </div>
          <ul className="quote-output__rows" role="list">
            <li>
              <span>Suggested team</span>
              <span>{output.team}</span>
            </li>
            <li>
              <span>Time to first results</span>
              <span>{output.timeline}</span>
            </li>
            <li>
              <span>Total range over {pluralMonth(duration)}</span>
              <span>{output.total}</span>
            </li>
          </ul>
        </div>
      </div>

      <footer className="modal__foot">
        <span className="modal__note">
          All ranges are ballpark. Final pricing on the call.
        </span>
        <Link
          href="#contact"
          className="btn btn--primary"
          data-magnetic
          onClick={() => close("quote")}
        >
          <span>Book a call</span>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </footer>
    </Modal>
  );
}
