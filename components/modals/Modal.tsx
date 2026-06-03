"use client";

import { useEffect, useRef } from "react";
import { useModal, useModalState, type ModalName } from "../global/ModalProvider";

interface ModalProps {
  name: ModalName;
  variant?: "wizard" | "quote" | "service";
  ariaLabelledBy?: string;
  children: React.ReactNode;
}

/**
 * Modal — thin shell shared by all three modals.
 *
 * - Reads open state from ModalProvider via useModalState
 * - Renders backdrop + panel + close button
 * - Focuses the first focusable inside on open (ModalProvider handles
 *   focus restore on close)
 * - ESC + body scroll lock handled by ModalProvider
 *
 * Children render the modal's inner markup (head / body / foot).
 */
export function Modal({
  name,
  variant,
  ariaLabelledBy,
  children,
}: ModalProps) {
  const { isOpen } = useModalState(name);
  const { close } = useModal();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => close(name);

  // Focus first focusable inside the panel when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || panel)?.focus({ preventScroll: true });
    }, 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  const variantClass = variant ? ` modal__panel--${variant}` : "";

  return (
    <div
      className={`modal${isOpen ? " is-open" : ""}`}
      data-modal={name}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-labelledby={ariaLabelledBy}
    >
      <div className="modal__backdrop" onClick={handleClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`modal__panel${variantClass}`}
        role="document"
        tabIndex={-1}
      >
        <button
          type="button"
          className="modal__close"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
