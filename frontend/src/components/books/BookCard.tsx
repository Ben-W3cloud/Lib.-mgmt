/**
 * =============================================================================
 * BookCard â€” Catalog card with generated cover art and archive metadata
 * =============================================================================
 */

"use client";

import Link from "next/link";
import { Book } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { BookCover } from "@/components/books/BookCover";
import { availabilityPercentage, cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const availability = availabilityPercentage(book.availableCopies, book.totalCopies);
  const isAvailable = book.availableCopies > 0n && book.active;

  return (
    <Link href={`/books/${book.id.toString()}`} className="group block h-full">
      <Card
        hover
        className={cn(
          "h-full overflow-hidden border-white/10 bg-[#0f1729]",
          !book.active && "opacity-90"
        )}
      >
        <CardContent className="flex h-full flex-col p-4">
          <div className="relative">
            <BookCover
              title={book.title}
              author={book.author}
              isbn={book.isbn}
              seed={book.id.toString()}
              size="sm"
              className="mx-auto max-w-none"
            />
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-white/10 bg-[#020617]/70 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-[#cdd5f5]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              File {Number(book.id).toString().padStart(2, "0")}
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold leading-tight text-[#edf0ff] transition-colors group-hover:text-cyan-200">
                  {book.title}
                </h3>
                <Badge variant={book.active ? "success" : "danger"} dot className="shrink-0">
                  {book.active ? "Active" : "Disabled"}
                </Badge>
              </div>

              <p className="text-sm text-[#8e9ab8]">by {book.author}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#7080a4]">
                ISBN {book.isbn}
              </p>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-[#8e9ab8]">
                  <span>{Number(book.availableCopies)} available</span>
                  <span>{Number(book.totalCopies)} copies</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      availability > 50
                        ? "bg-emerald-300"
                        : availability > 20
                          ? "bg-cyan-200"
                          : "bg-rose-300"
                    )}
                    style={{ width: `${availability}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={isAvailable ? "gold" : "neutral"}
                  dot
                  className="rounded-full"
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#cdd5f5] transition-colors group-hover:text-[#edf0ff]">
                  Open
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
