"use client";

import Link from "next/link";
import { Modal } from "./Modal";
import { useModal, useModalState } from "../global/ModalProvider";
import { findServiceById, SERVICE_CATALOG } from "../../lib/services";

// Map from card title (rendered in Services.tsx) to catalog id, in case
// the trigger sends a title instead of an id.
const TITLE_TO_ID: Record<string, string> = Object.fromEntries(
  SERVICE_CATALOG.map((s) => [s.title, s.id])
);

export function ServiceDeepDive() {
  const { opts } = useModalState("service");
  const { open, close } = useModal();

  // Resolve service id from payload (preferred) or trigger context (fallback)
  const payload = opts?.payload as { serviceId?: string } | undefined;
  const idFromPayload = payload?.serviceId;

  // If trigger has a title, look up id from the title map
  const titleFromTrigger = (
    opts?.trigger?.querySelector(".service__title")?.textContent || ""
  ).trim();
  const idFromTrigger = TITLE_TO_ID[titleFromTrigger];

  const serviceId = idFromPayload || idFromTrigger || "seo";
  const service = findServiceById(serviceId) || SERVICE_CATALOG[0];

  const handleGetQuote = () => {
    close("service");
    open("quote", { payload: { preselectServiceId: service.id } });
  };

  return (
    <Modal name="service" variant="service" ariaLabelledBy="service-modal-title">
      <header className="modal__head modal__head--service">
        <span className="service-modal-tag">
          <span className="dot" />
          {service.tag}
        </span>
        <h2 className="modal__title" id="service-modal-title">
          {service.title}
        </h2>
        <p className="modal__sub">{service.lead}</p>
      </header>
      <div className="modal__body service-body">
        <div className="service-body__quote">{service.quote}</div>
        <div className="service-body__grid">
          <div>
            <h3 className="service-body__col-head">What's included</h3>
            <ul className="service-body__list">
              {service.deliverables.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="service-body__col-head">Recent results</h3>
            <ul className="service-body__list">
              {service.results.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <footer className="modal__foot">
        <Link
          href="#contact"
          className="btn btn--ghost btn--small"
          onClick={() => close("service")}
        >
          <span>Book a call</span>
        </Link>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={handleGetQuote}
        >
          <span>Get a quote</span>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </button>
      </footer>
    </Modal>
  );
}
