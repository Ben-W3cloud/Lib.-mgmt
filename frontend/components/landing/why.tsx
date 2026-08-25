"use client";

import { Reveal, RevealItem } from "@/components/landing/motion-primitives";

const points = [
  {
    tag: "[ TRUST ]",
    title: "No indexer",
    body: "The app reads contract state directly. What you see on screen is exactly what the chain holds — nothing cached, nothing invented.",
  },
  {
    tag: "[ ECONOMICS ]",
    title: "Points, not fees",
    body: "Borrow and return on time to earn points. Miss the due date and the ledger docks them. No money changes hands, only reputation.",
  },
  {
    tag: "[ ACCESS ]",
    title: "Anyone can list",
    body: "Own the copies you list. Set counts, pause a title, add stock later. The lister stays in control from first block to last.",
  },
  {
    tag: "[ PROVENANCE ]",
    title: "Every copy keeps receipts",
    body: "Each book carries its full borrower history and loan-gated reviews on-chain. You always know where a copy has been before it reaches you.",
  },
];

export function Why() {
  return (
    <section id="about" className="landing-section landing-section--tight-bottom">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:px-10">
        {/* Sticky editorial rail */}
        <header className="self-start md:sticky md:top-32">
          <Reveal>
            <RevealItem>
              <p className="eyebrow">Why it exists</p>
            </RevealItem>
            <RevealItem>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-[var(--display)] md:text-5xl">
                A lending record nobody has to trust.
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-5 max-w-[46ch] text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">
                Bring the library notebook on-chain and the trust question disappears. Every
                listing, loan, and return is a transaction — signed by a wallet, visible to
                all, argued by no one.
              </p>
            </RevealItem>
            <RevealItem>
              <p className="label-caps mt-8">[ Three structural facts ]</p>
            </RevealItem>
          </Reveal>
        </header>

        {/* Index rows */}
        <Reveal as="ol" amount={0.2}>
          {points.map((point, i) => (
            <RevealItem key={point.title}>
              <div className="why-row group grid content-start gap-3 border-b border-[var(--line)] py-8 first:border-t md:grid-cols-[64px_minmax(0,1fr)] md:gap-6 md:py-9">
                <span className="font-doto text-5xl font-semibold leading-none text-[var(--display)] transition-colors duration-200 group-hover:text-[var(--muted)] md:text-6xl">
                  0{i + 1}
                </span>
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="why-title text-xl font-medium text-[var(--display)] md:text-2xl">{point.title}</h3>
                    <span className="font-mono text-[0.68rem] uppercase tracking-widest text-[var(--disabled)]">{point.tag}</span>
                  </div>
                  <p className="max-w-[56ch] text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">{point.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
