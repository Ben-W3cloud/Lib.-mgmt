"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastState = { id: number; message: string } | null;

/**
 * Inline status readout — no popup chrome. Enters via @starting-style, exits
 * through a short data-closing fade before unmount (exit faster than enter).
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const [closing, setClosing] = useState(false);
  const dismissTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const close = useCallback(() => {
    if (closeTimer.current !== null) return;
    if (!toast) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setToast(null);
      setClosing(false);
      closeTimer.current = null;
    }, 130);
  }, [toast]);

  const show = useCallback((message: string) => {
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setClosing(false);
    setToast({ id: Date.now(), message });
    dismissTimer.current = window.setTimeout(() => close(), 4000);
  }, [close]);

  useEffect(() => () => {
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  return { show, node: <Toast toast={toast} closing={closing} onClose={close} /> };
}

function Toast({
  toast,
  closing,
  onClose,
}: {
  toast: ToastState;
  closing: boolean;
  onClose: () => void;
}) {
  return (
    <div className="inline-status" aria-live="polite">
      {toast ? (
        <div role="status" data-closing={closing || undefined}>
          <span className="text-[var(--muted)]">[{">>"}] </span>
          {toast.message}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-[var(--disabled)] hover:text-[var(--display)]"
            aria-label="Dismiss"
          >
            [X]
          </button>
        </div>
      ) : null}
    </div>
  );
}
