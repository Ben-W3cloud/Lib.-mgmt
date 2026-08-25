import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 grid gap-4 pb-6 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-[16ch] text-3xl font-semibold leading-tight text-[var(--display)] md:text-5xl">{title}</h1>
      </div>
      <div className="max-w-[65ch] self-end text-sm leading-6 text-[var(--muted)] md:text-base">{children}</div>
    </header>
  );
}

export function StatusNote({ tone = "info", children }: { tone?: "info" | "success" | "warning" | "error"; children: ReactNode }) {
  const prefix = { info: "[INFO]", success: "[OK]", warning: "[WARN]", error: "[ERROR]" }[tone];
  return (
    <div className={`status-note status-${tone}`}>
      <span className="font-mono text-xs font-bold tracking-wider">{prefix}</span>{" "}
      {children}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <section className="empty-state">
      <p className="text-lg font-medium text-[var(--muted)]">{title}</p>
      <p className="mx-auto mt-2 max-w-[56ch] text-sm leading-6 text-[var(--disabled)]">{body}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}

/**
 * Loading state per Nothing system: bracket text + segmented bar. No shimmering
 * skeleton placeholders. (Keeps the old export name so call sites stay stable.)
 */
export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="panel grid gap-3 p-5" aria-busy="true" aria-live="polite">
      <span className="label-caps">Loading</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid items-center gap-3 md:grid-cols-[1fr_120px_120px]">
          <span className="font-mono text-sm text-[var(--disabled)]">[LOADING]</span>
          <span className="seg-bar seg-bar-animated md:col-span-2">
            <i /><i /><i /><i /><i /><i />
          </span>
        </div>
      ))}
    </div>
  );
}

export function Field({ label, children, help }: { label: string; children: ReactNode; help?: string }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      {children}
      {help ? <small>{help}</small> : null}
    </label>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`spinner ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Stat readout: caps label, mono display value, optional caption. */
export function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="grid content-start gap-1">
      <span className="label-caps">{label}</span>
      <strong className="font-mono text-lg font-bold leading-snug text-[var(--display)] md:text-xl">{value}</strong>
      {detail ? <span className="text-xs leading-5 text-[var(--disabled)]">{detail}</span> : null}
    </div>
  );
}

/**
 * The signature data visualization: discrete rectangular segments with 2px gaps.
 * Square ends, no radius. Filled segments take `tone`; empty stay --line.
 * Bar = proportion, numeric readout lives adjacent in the caller.
 */
export function SegmentedBar({
  filled,
  total,
  tone,
  height = "h-[10px]",
}: {
  filled: number;
  total: number;
  tone?: string;
  height?: string;
}) {
  const safeFilled = Math.max(0, Math.min(filled, total));
  return (
    <div className={`seg-bar ${height}`} role="img" aria-label={`${safeFilled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <i
          key={i}
          className={i < safeFilled ? "on" : ""}
          style={tone && i < safeFilled ? { background: tone } : undefined}
        />
      ))}
    </div>
  );
}
