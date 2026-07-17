import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 grid gap-4 border-b border-[var(--line)] pb-6 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">{title}</h1>
      </div>
      <div className="max-w-[65ch] self-end text-sm leading-6 text-[var(--muted)] md:text-base">{children}</div>
    </header>
  );
}

export function StatusNote({ tone = "info", children }: { tone?: "info" | "success" | "warning" | "error"; children: ReactNode }) {
  return <div className={`status-note status-${tone}`}>{children}</div>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <section className="empty-state">
      <p className="text-lg font-semibold tracking-tight">{title}</p>
      <p className="mt-2 max-w-[56ch] text-sm leading-6 text-[var(--muted)]">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}

export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="panel divide-y divide-[var(--line)]" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid gap-3 p-5 md:grid-cols-[1fr_120px_120px]">
          <span className="skeleton h-5 w-2/3" />
          <span className="skeleton h-5 w-24" />
          <span className="skeleton h-5 w-20" />
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

export function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="metric-tile">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <strong className="font-mono text-2xl tracking-tight">{value}</strong>
      {detail ? <span className="text-xs text-[var(--muted)]">{detail}</span> : null}
    </div>
  );
}

