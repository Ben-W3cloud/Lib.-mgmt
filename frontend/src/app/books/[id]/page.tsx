/**
 * =============================================================================
 * Book Detail Page — Single book view with borrow action
 * =============================================================================
 *
 * Displays:
 * - Full book details (title, author, ISBN, copies, status)
 * - Borrow button (with registration and availability checks)
 * - Borrower history
 * - Borrow modal for duration selection
 */

"use client";

import { use, useState } from "react";
import { useBook, useBookBorrowerHistory } from "@/hooks/useBooks";
import { useMyProfile } from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { BorrowModal } from "@/components/books/BorrowModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  BookOpen,
  Calendar,
  Hash,
  Layers,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { formatDate, truncateAddress, availabilityPercentage, cn } from "@/lib/utils";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Book spine colors for the large detail display
const SPINE_COLORS = [
  "from-leather-brown to-dark-walnut",
  "from-forest-green to-dark-walnut",
  "from-dusty-rose to-dark-walnut",
  "from-gold-accent to-leather-brown",
];

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

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-6">
          <Skeleton className="w-40 h-56 rounded-xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (isError || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-leather-brown/20 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-dark-walnut mb-2">
          Book Not Found
        </h2>
        <p className="text-slate mb-6">
          This book does not exist in the library catalog.
        </p>
        <Link href="/books">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const availability = availabilityPercentage(book.availableCopies, book.totalCopies);
  const canBorrow = book.active && book.availableCopies > 0n && isConnected && isRegistered;
  const spineGradient = SPINE_COLORS[Number(book.id) % SPINE_COLORS.length];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-dark-walnut mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book visual — large spine/cover simulation */}
        <div className="shrink-0">
          <div
            className={cn(
              "w-44 h-60 rounded-xl bg-gradient-to-b shadow-lg flex items-end p-4",
              spineGradient
            )}
          >
            <div className="text-parchment">
              <p className="text-xs opacity-60 mb-1">{book.isbn}</p>
              <p className="font-serif font-bold text-sm leading-tight line-clamp-3">
                {book.title}
              </p>
            </div>
          </div>
        </div>

        {/* Book details */}
        <div className="flex-1 space-y-6">
          {/* Title + status */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-serif font-bold text-dark-walnut">
                {book.title}
              </h1>
              <Badge variant={book.active ? "success" : "danger"} dot className="mt-1">
                {book.active ? "Active" : "Disabled"}
              </Badge>
            </div>
            <p className="text-lg text-slate">by {book.author}</p>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-leather-brown/5">
                <Hash className="w-4 h-4 text-leather-brown" />
              </div>
              <div>
                <p className="text-xs text-slate">ISBN</p>
                <p className="font-mono text-dark-walnut">{book.isbn}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-leather-brown/5">
                <Layers className="w-4 h-4 text-leather-brown" />
              </div>
              <div>
                <p className="text-xs text-slate">Copies</p>
                <p className="text-dark-walnut">
                  {Number(book.availableCopies)} / {Number(book.totalCopies)} available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-leather-brown/5">
                <Calendar className="w-4 h-4 text-leather-brown" />
              </div>
              <div>
                <p className="text-xs text-slate">Added</p>
                <p className="text-dark-walnut">{formatDate(book.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-leather-brown/5">
                <Clock className="w-4 h-4 text-leather-brown" />
              </div>
              <div>
                <p className="text-xs text-slate">Last Updated</p>
                <p className="text-dark-walnut">{formatDate(book.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Availability bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate">Availability</span>
              <span className="font-medium text-dark-walnut">{availability}%</span>
            </div>
            <div className="h-2.5 bg-leather-brown/10 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  availability > 50 ? "bg-forest-green" : availability > 20 ? "bg-gold-accent" : "bg-dusty-rose"
                )}
                style={{ width: `${availability}%` }}
              />
            </div>
          </div>

          {/* Borrow action */}
          <div className="pt-2">
            {!isConnected ? (
              <div className="space-y-2">
                <p className="text-sm text-slate">Connect your wallet to borrow this book.</p>
                <ConnectButton />
              </div>
            ) : !isRegistered ? (
              <div className="space-y-2">
                <p className="text-sm text-slate">You need to register as a member first.</p>
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
                <BookOpen className="w-5 h-5" />
                {!book.active
                  ? "Book Disabled"
                  : book.availableCopies === 0n
                  ? "No Copies Available"
                  : "Borrow This Book"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Borrower history */}
      {borrowers.length > 0 && (
        <Card className="mt-10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-leather-brown" />
              <h2 className="text-lg font-serif font-semibold text-dark-walnut">
                Borrower History
              </h2>
              <Badge variant="neutral">{borrowers.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {borrowers.map((addr, i) => (
                <span
                  key={`${addr}-${i}`}
                  className="px-3 py-1.5 bg-leather-brown/5 rounded-lg text-xs font-mono text-slate border border-leather-brown/10"
                >
                  {truncateAddress(addr)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Borrow modal */}
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
