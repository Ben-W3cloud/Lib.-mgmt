/**
 * =============================================================================
 * Book Detail Page â€” Single archive entry with borrow flow
 * =============================================================================
 */

"use client";

import { use, useState } from "react";
import { useBook, useBookBorrowerHistory } from "@/hooks/useBooks";
import { useMyProfile } from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { BorrowModal } from "@/components/books/BorrowModal";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, truncateAddress, availabilityPercentage, cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Hash,
  Layers3,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const bookId = BigInt(id);
  const { book, isLoading, isError } = useBook(bookId);
  const { borrowers } = useBookBorrowerHistory(bookId);
  const { isConnected } = useAccount();
  const { isRegistered } = useMyProfile();
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-40" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <BookOpen className="mx-auto mb-4 h-16 w-16 text-cyan-200/25" />
        <h2 className="font-serif text-2xl font-bold text-[#edf0ff]">
          Book Not Found
        </h2>
        <p className="mt-2 text-[#8e9ab8]">
          This archive entry does not exist in the catalog.
        </p>
        <Link href="/books" className="mt-6 inline-flex">
          <Button variant="primary">
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const availability = availabilityPercentage(book.availableCopies, book.totalCopies);
  const canBorrow = book.active && book.availableCopies > 0n && isConnected && isRegistered;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-[#8e9ab8] transition-colors hover:text-[#edf0ff]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <BookCover
            title={book.title}
            author={book.author}
            isbn={book.isbn}
            seed={book.id.toString()}
            size="lg"
            className="mx-auto max-w-none"
          />

          <Card className="border-white/10 bg-white/[0.04]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/70">
                    Availability
                  </p>
                  <p className="mt-2 font-serif text-2xl text-[#edf0ff]">{availability}%</p>
                </div>
                <Badge variant={book.active ? "success" : "danger"} dot>
                  {book.active ? "Active" : "Disabled"}
                </Badge>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    availability > 50
                      ? "bg-emerald-300"
                      : availability > 20
                        ? "bg-cyan-200"
                        : "bg-rose-300"
                  )}
                  style={{ width: `${availability}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.3em] text-[#cdd5f5]">
                    Archive File
                  </div>
                  <h1 className="mt-5 font-serif text-4xl font-bold text-[#edf0ff]">
                    {book.title}
                  </h1>
                  <p className="mt-2 text-lg text-[#8e9ab8]">by {book.author}</p>
                </div>

                <Badge variant={book.active ? "success" : "danger"} dot className="mt-1">
                  {book.active ? "Borrowable" : "Disabled"}
                </Badge>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#8e9ab8]">
                    <Hash className="h-4 w-4 text-cyan-200" />
                    ISBN
                  </div>
                  <p className="mt-3 font-mono text-sm text-[#edf0ff]">{book.isbn}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#8e9ab8]">
                    <Layers3 className="h-4 w-4 text-cyan-200" />
                    Copies
                  </div>
                  <p className="mt-3 text-sm text-[#edf0ff]">
                    {Number(book.availableCopies)} of {Number(book.totalCopies)} available
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#8e9ab8]">
                    <Calendar className="h-4 w-4 text-cyan-200" />
                    Added
                  </div>
                  <p className="mt-3 text-sm text-[#edf0ff]">{formatDate(book.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#8e9ab8]">
                    <Clock className="h-4 w-4 text-cyan-200" />
                    Updated
                  </div>
                  <p className="mt-3 text-sm text-[#edf0ff]">{formatDate(book.updatedAt)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {!isConnected ? (
                  <div className="space-y-3">
                    <p className="text-sm text-[#8e9ab8]">
                      Connect your wallet to borrow this book.
                    </p>
                    <ConnectButton />
                  </div>
                ) : !isRegistered ? (
                  <div className="space-y-3">
                    <p className="text-sm text-[#8e9ab8]">
                      Register your profile before borrowing.
                    </p>
                    <Link href="/profile">
                      <Button variant="gold">Register Now</Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    variant="gold"
                    onClick={() => setBorrowModalOpen(true)}
                    disabled={!canBorrow}
                  >
                    <BookOpen className="h-5 w-5" />
                    {!book.active
                      ? "Book Disabled"
                      : book.availableCopies === 0n
                        ? "No Copies Available"
                        : "Borrow This Book"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {borrowers.length > 0 && (
            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-200" />
                  <h2 className="font-serif text-xl font-semibold text-[#edf0ff]">
                    Borrower History
                  </h2>
                  <Badge variant="neutral">{borrowers.length}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {borrowers.map((addr, i) => (
                    <span
                      key={`${addr}-${i}`}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#8e9ab8]"
                    >
                      {truncateAddress(addr)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {book && (
        <BorrowModal
          book={book}
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
        />
      )}
    </div>
  );
}
