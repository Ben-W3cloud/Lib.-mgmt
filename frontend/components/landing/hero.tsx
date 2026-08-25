"use client";

import { EnterAppButton } from "@/components/landing/enter-app-button";
import { useTilt } from "@/components/use-tilt";

const lines = ["A library,", "kept in", "blocks."];

export function Hero({ onNeedsConnect }: { onNeedsConnect: () => void }) {
  const tilt = useTilt(4);

  return (
    <section className="landing-hero">
      {/* Decorative fields */}
      <div aria-hidden="true" className="landing-hero-dots dot-grid" />
      <div aria-hidden="true" className="hero-floor">
        <div />
      </div>

      {/* Centered composition, biased upward via heavier bottom padding */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[900px] flex-col items-center px-4 pb-36 pt-12 text-center md:pb-44 md:pt-16">
        <p className="eyebrow led-in" style={{ animationDelay: "0.05s" }}>
          The on-chain library · Sepolia
        </p>

        <h1 className="font-doto mt-6 text-[clamp(3rem,11vw,5.75rem)] font-semibold leading-[0.95] text-[var(--display)]">
          {lines.map((line, i) => (
            <span key={line} className="led-in block" style={{ animationDelay: `${0.12 + i * 0.12}s` }}>
              {line}
            </span>
          ))}
        </h1>

        <p className="led-in mt-8 max-w-[52ch] text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8" style={{ animationDelay: "0.5s" }}>
          List the titles you own with real copy counts, borrow whatever is on the shelf,
          return by the due date. Every loan is a transaction — visible to all, argued by no one.
        </p>

        <div className="led-in mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.62s" }}>
          <EnterAppButton variant="primary" onNeedsConnect={onNeedsConnect}>
            Open your folio
          </EnterAppButton>
          <a className="btn-secondary" href="#how-it-works">
            How it works
          </a>
        </div>

        {/* Loan record readout — one flat instrument strip, tilts subtly */}
        <aside
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          className="tilt landing-receipt led-in mt-14 w-full"
          style={{ animationDelay: "0.72s" }}
          aria-hidden="true"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-3 font-mono text-sm">
            <span className="label-caps">Loan #4127</span>
            <span className="label-caps flex items-center gap-2 !text-[var(--success)]">
              <span className="receipt-status-dot pulse-dot" />
              Confirmed
            </span>
            <span className="hidden h-4 w-px bg-[var(--line-strong)] sm:block" />
            <Readout label="TITLE" value="The Undercommons" />
            <Readout label="BORROWER" value="0x8fd2…a41c" />
            <Readout label="DUE" value="Aug 02" />
            <Readout label="POINTS" value="+12" accent />
            <span className="ml-auto hidden font-mono text-[0.7rem] tracking-wider text-[var(--disabled)] lg:inline">
              SEPOLIA · GAS Ξ0.00021 · NO MIDDLEMAN
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Readout({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="label-caps">{label}</span>
      <span className={accent ? "font-bold text-[var(--success)]" : "text-[var(--fg)]"}>{value}</span>
    </span>
  );
}
