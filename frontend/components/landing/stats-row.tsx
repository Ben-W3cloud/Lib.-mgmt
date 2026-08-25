"use client";

const tickerItems = [
  "Titles cataloged · 1,284",
  "Loans completed · 3,960",
  "Returned on time · 98.3%",
  "Median gas · Ξ0.00021",
  "Indexer · none",
  "Fees · zero",
  "Points · owner-tuned",
  "Reviews · borrower-gated",
  "Network · Sepolia",
];

/**
 * Section 2: a single kinetic data ticker. The numbers live here — no cards,
 * no chrome, just the feed.
 */
export function StatsRow() {
  return (
    <section aria-label="Network activity">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="ticker-item">
              {tickerItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
