"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { BookRow } from "@/components/library-panels";
import { EmptyState, Metric, PageHeader, SkeletonRows, StatusNote } from "@/components/ui";
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

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="panel p-6 md:p-8">
          <p className="eyebrow">Library desk</p>
          <h1 className="mt-3 max-w-[13ch] text-[clamp(2.25rem,9vw,3rem)] font-semibold leading-[0.98] tracking-tight md:text-7xl md:leading-[0.96]">Books move when wallets agree.</h1>
          <p className="mt-6 max-w-[65ch] text-base leading-7 text-[var(--muted)]">
            Register a profile, list books with copy counts, borrow available titles, and return loans for points. No indexer in this pass; the app reads contract state directly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/browse">Browse books</Link>
            <Link className="btn-secondary" href="/list">List a book</Link>
          </div>
        </div>
        <aside className="panel-solid p-5">
          <p className="eyebrow">Wallet state</p>
          <div className="mt-5 grid gap-4">
            <Metric label="Connected account" value={isConnected ? shortAddress(address) : "No wallet"} detail={isConnected ? "Ready for reads and writes" : "Connect to borrow or list"} />
            <Metric label="Profile" value={profile.data?.registered ? "Registered" : "Not registered"} detail={profile.data?.fullName || "Profile controls live under Profile"} />
            <Metric label="Points balance" value={profile.data ? Number(profile.data.pointsBalance).toString() : "0"} detail="Borrowing and returns update this" />
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr]">
        <Metric label="Books listed" value={count} detail="Contract inventory records" />
        <Metric label="Active titles" value={activeBooks.length} detail="Borrowing enabled" />
        <Metric label="Copies available" value={availableCopies} detail="Ready to loan" />
        <Metric label="Copies listed" value={listedCopies} detail="Across all listers" />
      </section>

      <section>
        <PageHeader eyebrow="Catalog sample" title="Latest inventory">
          A quick read on the first records currently available from the contract.
        </PageHeader>
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
