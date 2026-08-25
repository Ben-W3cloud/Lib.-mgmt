"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { BookRow } from "@/components/library-panels";
import { EmptyState, Metric, PageHeader, SegmentedBar, SkeletonRows, StatusNote } from "@/components/ui";
import { useBooks, useProfile } from "@/lib/hooks";
import { asNumber, explainError, shortAddress } from "@/lib/types";
import { IS_CONTRACT_CONFIGURED } from "@/lib/contract";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { books, count, isLoading, isError, error } = useBooks();
  const profile = useProfile(address);
  const activeBooks = books.filter((book) => book.active);
  const availableCopies = books.reduce((sum, book) => sum + asNumber(book.availableCopies), 0);
  const listedCopies = books.reduce((sum, book) => sum + asNumber(book.totalCopies), 0);

  // Category spread: derived live from catalog state, no indexer involved.
  const categories = useMemo(() => {
    const tally = new Map<string, number>();
    for (const book of books) {
      const key = (book.category || "Uncategorized").toUpperCase();
      tally.set(key, (tally.get(key) ?? 0) + 1);
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [books]);
  const maxCategory = categories[0]?.[1] ?? 1;

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="p-2 md:p-4">
          <p className="eyebrow">Your folio</p>
          <h1 className="font-doto mt-3 text-[clamp(2.5rem,8vw,4rem)] font-semibold leading-none text-[var(--display)]">A library, kept in blocks.</h1>
          <p className="mt-6 max-w-[65ch] text-base leading-7 text-[var(--muted)]">
            Register a profile, list books with copy counts, borrow available titles, and return loans for points. No indexer in this pass; the app reads contract state directly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/browse">Browse books</Link>
            <Link className="btn-secondary" href="/list">List a book</Link>
          </div>
        </div>
        <aside className="panel-solid divide-y divide-[var(--line)] p-5">
          <p className="label-caps pb-3">Wallet state</p>
          <div className="grid gap-4 py-4">
            <Metric label="Connected account" value={isConnected ? shortAddress(address) : "No wallet"} detail={isConnected ? "Ready for reads and writes" : "Connect to borrow or list"} />
          </div>
          <div className="grid gap-4 py-4">
            <Metric label="Profile" value={profile.data?.registered ? "Registered" : "Not registered"} detail={profile.data?.fullName || "Profile controls live under Profile"} />
          </div>
          <div className="pt-4">
            <Metric label="Points balance" value={profile.data ? Number(profile.data.pointsBalance).toString() : "0"} detail="Borrowing and returns update this" />
          </div>
        </aside>
      </section>

      <section className="panel grid gap-5 p-5 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:divide-x md:divide-[var(--line)] md:p-0">
        <div className="md:px-6 md:py-7">
          <Metric label="Books listed" value={count} detail="Contract inventory records" />
        </div>
        <div className="md:px-6 md:py-7">
          <Metric label="Active titles" value={activeBooks.length} detail="Borrowing enabled" />
        </div>
        <div className="md:px-6 md:py-7">
          <Metric label="Copies available" value={availableCopies} detail="Ready to loan" />
        </div>
        <div className="md:px-6 md:py-7">
          <Metric label="Copies listed" value={listedCopies} detail="Across all listers" />
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="panel grid gap-0 p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-4 pb-4">
            <span className="label-caps">Category spread</span>
            <span className="label-caps !text-[var(--disabled)]">[ Top {categories.length} ]</span>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {categories.map(([name, tally]) => (
              <div key={name} className="grid gap-2 py-3 md:grid-cols-[200px_1fr_48px] md:items-center md:gap-5">
                <span className="label-caps">{name}</span>
                <SegmentedBar filled={tally} total={maxCategory} height="h-[6px]" />
                <span className="font-mono text-sm font-bold text-[var(--display)] md:text-right">{tally}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <PageHeader eyebrow="Catalog sample" title="Latest inventory">
          A quick read on the first records currently available from the contract.
        </PageHeader>
        {!isLoading && books.length > 0 ? (
          <p className="label-caps mb-3">[ Showing {Math.min(books.length, 5)} of {count} ]</p>
        ) : null}
        {!IS_CONTRACT_CONFIGURED ? <StatusNote tone="warning">Set the contract address before catalog reads can start.</StatusNote> : null}
        {isLoading ? <SkeletonRows /> : null}
        {isError ? <StatusNote tone="error">{explainError(error)}</StatusNote> : null}
        {!isLoading && !isError && books.length === 0 ? (
          <EmptyState title="No books listed yet." body="Create the first inventory record from the List book screen." action={<Link className="btn-primary" href="/list">List first book</Link>} />
        ) : null}
        {books.length > 0 ? (
          <div className="panel divide-y divide-[var(--line)]">
            {books.slice(0, 5).map((book) => (
              <BookRow key={book.id.toString()} book={book} action={<Link className="btn-secondary" href="/browse">Open catalog</Link>} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
