"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BookRow } from "@/components/library-panels";
import { EmptyState, Field, PageHeader, SkeletonRows, Spinner, StatusNote } from "@/components/ui";
import { contractConfig } from "@/lib/contract";
import { useBooks } from "@/lib/hooks";
import type { Book } from "@/lib/types";
import { explainError, sameAddress } from "@/lib/types";

export default function ListingsPage() {
  const { address, isConnected } = useAccount();
  const { books, isLoading, isError, error } = useBooks();
  const [copiesByBook, setCopiesByBook] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (receipt.isSuccess) {
      void queryClient.invalidateQueries();
    }
  }, [receipt.isSuccess, queryClient]);

  const mine = books.filter((book) => sameAddress(book.lister, address));

  async function addCopies(book: Book) {
    setLocalError(null);
    const raw = copiesByBook[book.id.toString()] ?? "1";
    const copies = Number(raw);
    if (!Number.isInteger(copies) || copies < 1) {
      setLocalError("Additional copies must be a whole number above zero.");
      return;
    }
    try {
      await write.writeContractAsync({ ...contractConfig, functionName: "addBookCopies", args: [book.id, BigInt(copies)] });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  async function setActive(book: Book, active: boolean) {
    setLocalError(null);
    try {
      await write.writeContractAsync({ ...contractConfig, functionName: "setBookActive", args: [book.id, active] });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="My listings" title="Manage the books your wallet owns.">
        Add physical copies when inventory increases, or pause borrowing while a title is unavailable.
      </PageHeader>
      {!isConnected ? <StatusNote tone="warning">Connect the lister wallet to see and manage owned listings.</StatusNote> : null}
      {localError || write.error || receipt.error ? <div className="mb-4"><StatusNote tone="error">{localError ?? explainError(write.error ?? receipt.error)}</StatusNote></div> : null}
      {receipt.isSuccess ? <div className="mb-4"><StatusNote tone="success">Listing updated. Catalog reads refreshed.</StatusNote></div> : null}
      {isLoading ? <SkeletonRows /> : null}
      {isError ? <StatusNote tone="error">{explainError(error)}</StatusNote> : null}
      {!isLoading && !isError && mine.length === 0 ? <EmptyState title="No owned listings." body="Books you list from this wallet will appear here with copy and status controls." /> : null}
      {mine.length > 0 ? (
        <div className="panel divide-y divide-[var(--line)]">
          {mine.map((book) => (
            <BookRow
              key={book.id.toString()}
              book={book}
              action={
                <div className="grid w-full gap-2 md:w-auto md:grid-cols-[120px_auto_auto]">
                  <Field label="Add copies">
                    <input type="number" min="1" step="1" value={copiesByBook[book.id.toString()] ?? "1"} onChange={(event) => setCopiesByBook({ ...copiesByBook, [book.id.toString()]: event.target.value })} />
                  </Field>
                  <button type="button" className="btn-secondary gap-2 self-end" disabled={write.isPending || receipt.isLoading} onClick={() => addCopies(book)}>
                    {write.isPending || receipt.isLoading ? <Spinner /> : null}
                    Add
                  </button>
                  <button type="button" className={`gap-2 self-end ${book.active ? "btn-danger" : "btn-primary"}`} disabled={write.isPending || receipt.isLoading} onClick={() => setActive(book, !book.active)}>
                    {write.isPending || receipt.isLoading ? <Spinner /> : null}
                    {book.active ? "Pause" : "Reactivate"}
                  </button>
                </div>
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}



