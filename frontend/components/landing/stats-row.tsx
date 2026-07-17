"use client";

import { CountUp, Reveal, RevealItem } from "@/components/landing/motion-primitives";

const stats = [
  { value: 1284, suffix: "", label: "Titles on the ledger", detail: "listed across 210 wallets" },
  { value: 3960, suffix: "", label: "Loans settled", detail: "borrow and return, on-chain" },
  { value: 98.3, suffix: "%", decimals: 1, label: "Returned on time", detail: "points reward punctuality" },
  { value: 0.00021, prefix: "Ξ ", decimals: 5, label: "Median gas per loan", detail: "Sepolia, last 30 days" },
];

export function StatsRow() {
  return (
    <section className="landing-stats-wrap" aria-label="Network activity">
      <Reveal as="ul" className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {stats.map((stat) => (
          <RevealItem key={stat.label} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow-lift)] backdrop-blur-xl">
            <div className="grid h-full gap-2 p-5 sm:p-6 md:p-7">
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                decimals={stat.decimals ?? 0}
                className="font-mono text-[clamp(1.6rem,7vw,2.25rem)] font-semibold tracking-tight text-[var(--fg)] md:text-5xl"
              />
              <span className="text-sm font-semibold tracking-tight text-[var(--fg)]">{stat.label}</span>
              <span className="text-xs leading-5 text-[var(--muted)]">{stat.detail}</span>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
