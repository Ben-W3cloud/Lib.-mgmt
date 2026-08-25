"use client";

import { Reveal, RevealItem } from "@/components/landing/motion-primitives";

const items = [
  {
    q: "Do I need a wallet?",
    a: "Yes. Your wallet is your library card — it signs the registration, the loans, the returns. Any Ethereum browser wallet works; Folio runs on Sepolia.",
  },
  {
    q: "What does borrowing cost?",
    a: "Gas. That's it. No fees, no deposits, no token. Money never touches the contract — points are the whole economy.",
  },
  {
    q: "Can my points go negative?",
    a: "Yes. Late returns debit daily penalties and the ledger will happily dip below zero. Nothing is owed to anyone — reputation is simply the scoreboard.",
  },
  {
    q: "What if I can't return on time?",
    a: "Extend. Loans can be extended by a few days when they're close to expiry, up to the contract's maximum. The extension is its own transaction and earns its own points.",
  },
  {
    q: "Who can list a book, and who sees my data?",
    a: "Anyone with a wallet can list — you keep control of your copies and can pause or restock anytime. And everything is public: profiles, loans, reviews, balances. On-chain means on the record.",
  },
  {
    q: "Who controls the rules?",
    a: "The contract owner tunes point rewards, penalties, and borrow limits on-chain — every change is a visible transaction, not a silent settings flip. Ownership itself is transferable and equally public.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="landing-section">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:px-10">
        <header className="self-start md:sticky md:top-32">
          <Reveal>
            <RevealItem>
              <p className="eyebrow">FAQ</p>
            </RevealItem>
            <RevealItem>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-[var(--display)] md:text-5xl">
                Asked, answered.
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-5 max-w-[46ch] text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">
                Six questions cover ninety percent of it. Everything else lives in the
                contract source — read it before you sign anything.
              </p>
            </RevealItem>
          </Reveal>
        </header>

        <Reveal className="max-w-none" amount={0.15}>
          {items.map((item) => (
            <RevealItem key={item.q}>
              <details className="faq-item group">
                <summary className="faq-summary">
                  <span>{item.q}</span>
                  <span aria-hidden="true" className="faq-glyph">
                    <span className="faq-glyph-open">[+]</span>
                    <span className="faq-glyph-close">[-]</span>
                  </span>
                </summary>
                <p className="faq-body">{item.a}</p>
              </details>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
