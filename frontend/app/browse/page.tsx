"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BookRow, Modal } from "@/components/library-panels";
import { EmptyState, Field, PageHeader, SkeletonRows, Spinner, StatusNote } from "@/components/ui";
import { contractConfig, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import { useBookReviews, useBooks, useProfile } from "@/lib/hooks";
import type { Book } from "@/lib/types";
import { asNumber, dateFromSeconds, explainError, sameAddress, shortAddress } from "@/lib/types";

const DURATIONS = [
  { label: "7 days", seconds: 7 * 24 * 60 * 60 },
  { label: "14 days", seconds: 14 * 24 * 60 * 60 },
];

export default function BrowsePage() {
  const { address, isConnected } = useAccount();
  const profile = useProfile(address);
  const { books, isLoading, isError, error } = useBooks();
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [selected, setSelected] = useState<Book | null>(null);
  const [duration, setDuration] = useState(DURATIONS[1].seconds);
  const [localError, setLocalError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [lastAction, setLastAction] = useState<"borrow" | "review" | null>(null);
  const queryClient = useQueryClient();

  const maxDuration = useReadContract({
    ...contractConfig,
    functionName: "maxBorrowDuration",
    query: { enabled: IS_CONTRACT_CONFIGURED },
  });
  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });
  const reviews = useBookReviews(selected?.id);
  const borrowerHistory = useReadContract({
    ...contractConfig,
    functionName: "getBookBorrowerHistory",
    args: selected ? [selected.id] : undefined,
    query: { enabled: Boolean(selected), retry: false },
  });
  const borrowers = (borrowerHistory.data as readonly string[] | undefined) ?? [];
  const hasBorrowed = borrowers.some((wallet) => sameAddress(wallet, address));
  const alreadyReviewed = reviews.reviews.some((review) => sameAddress(review.reviewer, address));

  useEffect(() => {
    if (receipt.isSuccess) {
      void queryClient.invalidateQueries();
    }
  }, [receipt.isSuccess, queryClient]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return books.filter((book) => {
      const matches = !needle || [book.title, book.author, book.isbn].some((value) => value.toLowerCase().includes(needle));
      const available = !onlyAvailable || (book.active && asNumber(book.availableCopies) > 0);
      return matches && available;
    });
  }, [books, onlyAvailable, query]);

  async function borrowBook() {
    if (!selected) return;
    setLocalError(null);
    if (!isConnected) {
      setLocalError("Connect a wallet before borrowing.");
      return;
    }
    if (!profile.data?.registered) {
      setLocalError("Register your profile before borrowing.");
      return;
    }
    const max = asNumber(maxDuration.data as bigint | undefined);
    if (max && duration > max) {
      setLocalError("Selected duration is longer than the contract allows.");
      return;
    }
    try {
      setLastAction("borrow");
      await write.writeContractAsync({ ...contractConfig, functionName: "borrowBook", args: [selected.id, BigInt(duration)] });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  async function submitReview() {
    if (!selected) return;
    setLocalError(null);
    if (!isConnected) {
      setLocalError("Connect a wallet before reviewing.");
      return;
    }
    if (!comment.trim()) {
      setLocalError("Write a short comment before publishing.");
      return;
    }
    try {
      setLastAction("review");
      await write.writeContractAsync({ ...contractConfig, functionName: "addReview", args: [selected.id, rating, comment.trim()] });
      setComment("");
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Browse" title="Find a copy worth borrowing.">
        Reads the contract directly, then filters locally by title, author, ISBN, active status, and copy count.
      </PageHeader>

      <section className="sticky top-[64px] z-20 -mx-4 mb-6 border-b border-[var(--line)] bg-[var(--bg)] px-4 py-3 md:-mx-10 md:px-10">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <Field label="Search catalog" help="Try author, title, or ISBN.">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Octavia, ledgers, 978..." />
          </Field>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-[var(--line-strong)] px-4 font-mono text-xs uppercase tracking-wider text-[var(--muted)] transition-colors has-[:checked]:border-[var(--fg)] has-[:checked]:text-[var(--display)]">
            <input type="checkbox" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            Available only
          </label>
        </div>
      </section>

      {!IS_CONTRACT_CONFIGURED ? <StatusNote tone="warning">Set <code>NEXT_PUBLIC_LIBRARY_ADDRESS</code> before browsing on-chain books.</StatusNote> : null}
      {isLoading ? <SkeletonRows rows={5} /> : null}
      {isError ? <StatusNote tone="error">{explainError(error)}</StatusNote> : null}
      {!isLoading && !isError && filtered.length === 0 ? <EmptyState title="No matching books." body="Adjust the search or include paused and unavailable listings." /> : null}
      {!isLoading && !isError && filtered.length > 0 ? (
        <p className="label-caps mb-3">[ {filtered.length} shown · {books.length} total ]</p>
      ) : null}

      {filtered.length > 0 ? (
        <div className="panel divide-y divide-[var(--line)]">
          {filtered.map((book) => (
            <BookRow
              key={book.id.toString()}
              book={book}
              meta={sameAddress(book.lister, address) ? "Listed by your wallet" : `Lister ${shortAddress(book.lister)}`}
              action={
                <button type="button" className="btn-primary" disabled={!book.active || asNumber(book.availableCopies) === 0} onClick={() => { setSelected(book); setComment(""); setRating(5); setLocalError(null); }}>
                  Borrow copy
                </button>
              }
            />
          ))}
        </div>
      ) : null}

      {selected ? (
        <Modal title={`Borrow ${selected.title}`} onClose={() => setSelected(null)}>
          <div className="grid gap-4">
            <StatusNote tone="info">Borrow reward posts immediately. Return on time to collect the return reward.</StatusNote>
            <Field label="Borrow duration">
              <select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
                {DURATIONS.map((item) => (
                  <option key={item.seconds} value={item.seconds}>{item.label}</option>
                ))}
              </select>
            </Field>
            {localError || write.error || receipt.error ? <StatusNote tone="error">{localError ?? explainError(write.error ?? receipt.error)}</StatusNote> : null}
            {receipt.isSuccess ? <StatusNote tone="success">{lastAction === "review" ? "Review published." : "Loan opened."} Catalog refreshed.</StatusNote> : null}
            <button type="button" className="btn-primary gap-2" onClick={borrowBook} disabled={write.isPending || receipt.isLoading}>
              {write.isPending || receipt.isLoading ? <Spinner /> : null}
              {write.isPending ? "Confirm in wallet" : receipt.isLoading ? "Waiting for chain" : "Borrow book"}
            </button>

            <div className="mt-2 border-t border-[var(--line)] pt-5">
              <p className="eyebrow">Reviews</p>
              {reviews.isLoading ? <div className="mt-4"><SkeletonRows rows={1} /></div> : null}
              {!reviews.isLoading && reviews.reviews.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">No reviews yet. Borrowers publish the first one.</p>
              ) : null}
              {reviews.reviews.length > 0 ? (
                <div className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {reviews.reviews.map((review) => (
                    <article key={review.id.toString()} className="grid gap-1.5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`font-mono text-sm font-bold ${review.rating >= 4 ? "text-[var(--success)]" : review.rating >= 3 ? "text-[var(--warning)]" : "text-[var(--accent)]"}`}>
                          {review.rating}/5
                        </span>
                        <span className="font-mono text-xs text-[var(--disabled)]">{dateFromSeconds(review.createdAt)} · {shortAddress(review.reviewer)}</span>
                      </div>
                      <p className="text-sm leading-6 text-[var(--fg)]">{review.comment}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {hasBorrowed && !alreadyReviewed ? (
                <form
                  className="mt-5 grid gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submitReview();
                  }}
                >
                  <Field label="Your rating" help="1 is poor, 5 is excellent.">
                    <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} / 5</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Comment">
                    <textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What stood out about this copy?" />
                  </Field>
                  <button type="submit" className="btn-secondary justify-self-start gap-2" disabled={write.isPending || receipt.isLoading}>
                    {write.isPending && lastAction === "review" ? <Spinner /> : null}
                    Publish review
                  </button>
                </form>
              ) : null}
              {hasBorrowed && alreadyReviewed ? <p className="mt-4 text-sm text-[var(--muted)]">You already reviewed this title.</p> : null}
              {!hasBorrowed ? <p className="mt-4 text-sm text-[var(--muted)]">Only wallets that borrowed this title can review it.</p> : null}
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}



