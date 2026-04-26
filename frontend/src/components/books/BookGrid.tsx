/**
 * =============================================================================
 * BookGrid — Responsive grid of BookCards with loading skeletons
 * =============================================================================
 */

"use client";

import { Book } from "@/types";
import { BookCard } from "./BookCard";
import { BookCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookX } from "lucide-react";

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  showInactive?: boolean; // Admin might want to see disabled books
}

export function BookGrid({ books, isLoading, showInactive = false }: BookGridProps) {
  // Filter out inactive books for regular users (admin can see all)
  const displayBooks = showInactive ? books : books.filter((b) => b.active);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayBooks.length === 0) {
    return (
      <EmptyState
        icon={BookX}
        title="No books found"
        description="The library catalog is empty. Check back soon for new arrivals!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayBooks.map((book, index) => (
        <BookCard key={book.id.toString()} book={book} index={index} />
      ))}
    </div>
  );
}
