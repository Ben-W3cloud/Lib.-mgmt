"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Book } from "@/lib/types";
import { asNumber } from "@/lib/types";
import { SegmentedBar } from "@/components/ui";

export function BookRow({ book, action, meta }: { book: Book; action?: ReactNode; meta?: ReactNode }) {
  const available = asNumber(book.availableCopies);
  const total = asNumber(book.totalCopies);
  const barTotal = Math.max(total, 1);
  const tone = !book.active ? "var(--disabled)" : available === 0 ? "var(--accent)" : undefined;

  return (
    <article className="book-row">
      <div className="grid content-start gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-[var(--display)] md:text-lg">{book.title}</h2>
          {book.category ? (
            <span className="rounded-[4px] border border-[var(--line-strong)] px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
              {book.category}
            </span>
          ) : null}
          <span className={book.active ? "rounded-full border border-[var(--success)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--success)]" : "rounded-full border border-[var(--line-strong)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--muted)]"}>
            {book.active ? "Active" : "Paused"}
          </span>
        </div>
        <p className="font-mono text-xs leading-5 text-[var(--muted)]">
          {book.author} · ISBN {book.isbn}
          {book.tags.length > 0 ? ` · ${book.tags.join(" / ")}` : ""}
        </p>
        {meta ? <p className="font-mono text-xs leading-5 text-[var(--disabled)]">{meta}</p> : null}
      </div>

      {/* Copy availability readout: number = precision, bar = proportion */}
      <div className="grid content-center gap-1.5 font-mono text-sm">
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${available === 0 ? "text-[var(--accent)]" : "text-[var(--display)]"}`}>{available}</span>
          <span className="text-xs text-[var(--muted)]">of {total} copies</span>
        </div>
        <SegmentedBar filled={available} total={barTotal} tone={tone} height="h-[6px]" />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">{action}</div>
    </article>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Exit mirrors entry; input stays live while the fade plays.
  const requestClose = useCallback(() => {
    if (closeTimer.current !== null) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 150);
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      data-closing={closing || undefined}
      onMouseDown={requestClose}
    >
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Transaction</p>
            <h2 id="modal-title" className="mt-1 text-lg font-semibold text-[var(--display)] md:text-xl">{title}</h2>
          </div>
          <button type="button" className="btn-ghost font-mono" onClick={requestClose} aria-label="Close modal">[X]</button>
        </div>
        {children}
      </section>
    </div>
  );
}
