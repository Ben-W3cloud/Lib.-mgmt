/**
 * =============================================================================
 * BookCard — Card resembling a physical book with spine accent
 * =============================================================================
 *
 * Displays:
 * - Book title, author, ISBN
 * - Availability (copies available / total)
 * - Active/inactive status badge
 * - Hover lift animation
 */

"use client";

import Link from "next/link";
import { Book } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn, availabilityPercentage } from "@/lib/utils";
import { BookOpen } from "lucide-react";

// Rotating palette of spine colors for visual variety
const SPINE_COLORS = [
  "bg-leather-brown",
  "bg-forest-green",
  "bg-dusty-rose",
  "bg-gold-accent",
  "bg-dark-walnut",
  "bg-slate",
];

interface BookCardProps {
  book: Book;
  index?: number; // for varied spine colors
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];
  const availability = availabilityPercentage(book.availableCopies, book.totalCopies);
  const isAvailable = book.availableCopies > 0n && book.active;

  return (
    <Link href={`/books/${book.id.toString()}`}>
      <div
        className={cn(
          "group bg-cream rounded-xl border border-leather-brown/10",
          "shadow-sm hover:shadow-xl hover:-translate-y-1.5",
          "transition-all duration-300 overflow-hidden cursor-pointer h-full"
        )}
      >
        {/* Book spine accent — colored bar on the left */}
        <div className="flex h-full">
          <div className={cn("w-2 min-h-full shrink-0 rounded-l-xl", spineColor)} />

          <div className="flex-1 p-5 flex flex-col justify-between">
            {/* Top section: title, author, ISBN */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold text-dark-walnut group-hover:text-leather-brown transition-colors line-clamp-2">
                  {book.title}
                </h3>
                {!book.active && (
                  <Badge variant="danger" className="shrink-0">Disabled</Badge>
                )}
              </div>

              <p className="text-sm text-slate">by {book.author}</p>
              <p className="text-xs text-slate/60 font-mono">ISBN: {book.isbn}</p>
            </div>

            {/* Bottom section: availability bar + badge */}
            <div className="mt-4 space-y-3">
              {/* Availability bar */}
              <div>
                <div className="flex justify-between text-xs text-slate mb-1">
                  <span>{Number(book.availableCopies)} available</span>
                  <span>{Number(book.totalCopies)} total</span>
                </div>
                <div className="h-1.5 bg-leather-brown/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      availability > 50 ? "bg-forest-green" : availability > 20 ? "bg-gold-accent" : "bg-dusty-rose"
                    )}
                    style={{ width: `${availability}%` }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={isAvailable ? "success" : "danger"}
                  dot
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <BookOpen className="w-4 h-4 text-leather-brown/30 group-hover:text-leather-brown/60 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
