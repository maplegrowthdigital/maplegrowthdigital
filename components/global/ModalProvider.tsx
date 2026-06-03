"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ModalName =
  | "configure"
  | "quote"
  | "service"
  | (string & {});

export interface ModalOpenOptions {
  /**
   * The element that triggered this modal open.
   * Pre-selection logic (e.g. service → quote) reads context from here.
   */
  trigger?: HTMLElement | null;
  /**
   * Arbitrary payload — e.g. the service id when opening the
   * service deep-dive modal from a service card.
   */
  payload?: unknown;
}

interface ModalState {
  name: ModalName;
  opts: ModalOpenOptions;
}

interface ModalContextValue {
  /** Stack of open modals (last = topmost). */
  stack: ModalState[];
  /** Open a modal by name; subscribers can react via `useModalState`. */
  open: (name: ModalName, opts?: ModalOpenOptions) => void;
  /** Close the topmost open modal. */
  closeTop: () => void;
  /** Close a specific modal by name. */
  close: (name: ModalName) => void;
  /** Returns the open opts for a given modal if it's currently open. */
  getOpts: (name: ModalName) => ModalOpenOptions | null;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<ModalState[]>([]);
  // Stash the element that had focus before any modal opened — restored on full close.
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback((name: ModalName, opts: ModalOpenOptions = {}) => {
    setStack((prev) => {
      if (prev.length === 0) {
        lastFocusRef.current = document.activeElement as HTMLElement | null;
      }
      return [...prev, { name, opts }];
    });
  }, []);

  const closeTop = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const close = useCallback((name: ModalName) => {
    setStack((prev) => prev.filter((m) => m.name !== name));
  }, []);

  const getOpts = useCallback(
    (name: ModalName) => {
      const found = [...stack].reverse().find((m) => m.name === name);
      return found ? found.opts : null;
    },
    [stack]
  );

  // Body scroll lock + focus restore when stack empties
  useEffect(() => {
    if (stack.length > 0) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      const last = lastFocusRef.current;
      if (last && typeof last.focus === "function") {
        last.focus({ preventScroll: true });
        lastFocusRef.current = null;
      }
    }
  }, [stack.length]);

  // ESC closes topmost
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack.length > 0) closeTop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stack.length, closeTop]);

  const value = useMemo<ModalContextValue>(
    () => ({ stack, open, closeTop, close, getOpts }),
    [stack, open, closeTop, close, getOpts]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside a <ModalProvider>");
  }
  return ctx;
}

/**
 * Convenience hook for a single modal — returns whether it's open and
 * the open opts.
 */
export function useModalState(name: ModalName) {
  const { stack, getOpts } = useModal();
  const isOpen = stack.some((m) => m.name === name);
  return { isOpen, opts: getOpts(name) };
}
