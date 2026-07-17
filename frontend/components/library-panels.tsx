"use client";

import { useEffect, type ReactNode } from "react";
import type { Book } from "@/lib/types";
import { asNumber } from "@/lib/types";

export function BookRow({ book, action, meta }: { book: Book; action?: ReactNode; meta?: ReactNode }) {
  const available = asNumber(book.availableCopies);
  const total = asNumber(book.totalCopies);
  return (
    <article className="book-row">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">{book.title}</h2>
          <span className={book.active ? "rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--accent)]" : "rounded-full bg-[var(--panel-strong)] px-2 py-1 text-xs font-semibold text-[var(--muted)]"}>
            {book.active ? "Active" : "Paused"}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{book.author} - ISBN {book.isbn}</p>
        {meta ? <div className="mt-3 text-xs leading-5 text-[var(--muted)]">{meta}</div> : null}
      </div>
      <div className="font-mono text-sm">
        <span className="block text-2xl font-semibold tracking-tight">{available}</span>
        <span className="text-[var(--muted)]">of {total} copies</span>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">{action}</div>
    </article>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold tracking-tight">{title}</h2>
          <button type="button" className="btn-secondary px-3" onClick={onClose} aria-label="Close modal">Close</button>
        </div>
        {children}
      </section>
    </div>
  );
}

